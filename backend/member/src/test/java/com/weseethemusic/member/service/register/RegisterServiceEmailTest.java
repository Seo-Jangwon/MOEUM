package com.weseethemusic.member.service.register;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.weseethemusic.member.common.entity.Member;
import com.weseethemusic.member.repository.member.MemberRepository;
import java.time.Duration;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@ExtendWith(MockitoExtension.class)
class RegisterServiceEmailTest {

  @Mock
  private JavaMailSender emailSender;
  @Mock
  private MemberRepository memberRepository;
  @Mock
  private RedisTemplate<String, Object> redisTemplate;
  @Mock
  private ValueOperations<String, Object> valueOperations;

  @InjectMocks
  private RegisterServiceImpl registerService;

  @Test
  @DisplayName("이메일 인증 토큰 전송 성공")
  void sendEmailTokenSuccess() {
    // given
    String email = "test@example.com";
    when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    when(memberRepository.findByEmail(email)).thenReturn(Optional.empty());
    when(redisTemplate.delete(anyString())).thenReturn(true);
    doNothing().when(valueOperations).set(
        eq("email:token:" + email),
        any(String.class),
        eq(Duration.ofMinutes(5))
    );
    doNothing().when(emailSender).send(any(SimpleMailMessage.class));

    // when
    String result = registerService.sendEmailToken(email);

    // then
    assertEquals("인증 번호 전송", result);

    // verify
    verify(memberRepository).findByEmail(email);
    verify(redisTemplate).delete("email:token:" + email);
    verify(valueOperations).set(
        eq("email:token:" + email),
        any(String.class),
        eq(Duration.ofMinutes(5))
    );
    verify(emailSender).send(any(SimpleMailMessage.class));
  }

  @Test
  @DisplayName("이메일 인증 토큰 전송 실패 - 이미 존재하는 이메일")
  void sendEmailTokenFailExistingEmail() {
    // given
    String email = "existing@example.com";
    Member existingMember = new Member();
    when(memberRepository.findByEmail(email)).thenReturn(Optional.of(existingMember));

    // when
    String result = registerService.sendEmailToken(email);

    // then
    assertEquals("이미 존재하는 회원입니다.", result);

    // verify
    verify(memberRepository).findByEmail(email);
    verify(redisTemplate, never()).delete(anyString());
    verify(emailSender, never()).send(any(SimpleMailMessage.class));
  }

  @Test
  @DisplayName("이메일 인증 토큰 전송 실패 - 유효하지 않은 이메일 형식")
  void sendEmailTokenFailInvalidEmail() {
    // given
    String invalidEmail = "invalid.email";

    // when & then
    assertThrows(IllegalArgumentException.class, () -> {
      registerService.sendEmailToken(invalidEmail);
    });

    // verify
    verify(memberRepository, never()).findByEmail(anyString());
    verify(redisTemplate, never()).delete(anyString());
    verify(emailSender, never()).send(any(SimpleMailMessage.class));
  }

  @Test
  @DisplayName("이메일 인증 토큰 검증 성공")
  void validateEmailTokenSuccess() {
    // given
    String email = "test@example.com";
    String token = "123456";
    when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    when(valueOperations.get("email:token:" + email)).thenReturn(token);
    doNothing().when(valueOperations).set(
        eq("email:verified:" + email),
        eq(true),
        eq(Duration.ofMinutes(30))
    );
    when(redisTemplate.delete(anyString())).thenReturn(true);

    // when
    boolean result = registerService.validateEmailToken(email, token);

    // then
    assertTrue(result);

    // verify
    verify(valueOperations).get("email:token:" + email);
    verify(redisTemplate).delete("email:token:" + email);
    verify(valueOperations).set(
        eq("email:verified:" + email),
        eq(true),
        eq(Duration.ofMinutes(30))
    );
  }

  @Test
  @DisplayName("이메일 인증 토큰 검증 실패 - 잘못된 토큰")
  void validateEmailTokenFailWrongToken() {
    // given
    String email = "test@example.com";
    String token = "123456";
    String wrongToken = "654321";
    when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    when(valueOperations.get("email:token:" + email)).thenReturn(wrongToken);

    // when
    boolean result = registerService.validateEmailToken(email, token);

    // then
    assertFalse(result);

    // verify
    verify(valueOperations).get("email:token:" + email);
    verify(redisTemplate, never()).delete(anyString());
    verify(valueOperations, never()).set(any(), any(), any(Duration.class));
  }

  @Test
  @DisplayName("이메일 인증 토큰 검증 실패 - 만료된 토큰")
  void validateEmailTokenFailExpiredToken() {
    // given
    String email = "test@example.com";
    String token = "123456";
    when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    when(valueOperations.get("email:token:" + email)).thenReturn(null);

    // when
    boolean result = registerService.validateEmailToken(email, token);

    // then
    assertFalse(result);

    // verify
    verify(valueOperations).get("email:token:" + email);
    verify(redisTemplate, never()).delete(anyString());
    verify(valueOperations, never()).set(any(), any(), any(Duration.class));
  }
}