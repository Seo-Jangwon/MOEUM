package com.weseethemusic.member.service.login;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.weseethemusic.member.common.entity.Member;
import com.weseethemusic.member.common.util.JwtUtil;
import com.weseethemusic.member.dto.member.LoginRequestDto;
import com.weseethemusic.member.dto.member.LoginResponseDto;
import com.weseethemusic.member.repository.member.MemberRepository;
import java.util.Date;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class LoginServiceImplTest {

    @Mock
    private JwtUtil jwtUtil;
    @Mock
    private MemberRepository memberRepository;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private LoginServiceImpl loginService;

    private Member testMember;
    private LoginRequestDto loginRequest;

    @BeforeEach
    void setUp() {
        // 테스트용 멤버 생성
        testMember = new Member();
        testMember.setId(1L);
        testMember.setEmail("test@example.com");
        testMember.setPassword("hashedPassword123!");
        testMember.setNickname("테스트유저");
        testMember.setRole(Member.Role.USER);
        testMember.setBIsDeleted(false);
        testMember.setDeletedAt(null);

        // 로그인 요청 DTO 생성
        loginRequest = new LoginRequestDto();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("Test123!@#");
    }

    @Test
    @DisplayName("정상 로그인 성공")
    void loginSuccess() {
        // given
        when(memberRepository.findByEmail(anyString())).thenReturn(Optional.of(testMember));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtUtil.generateAccessToken(anyString(), anyString(), anyLong(), anyBoolean()))
            .thenReturn("access.token");
        when(jwtUtil.generateRefreshToken(anyString())).thenReturn("refresh.token");

        // when
        LoginResponseDto response = loginService.login(loginRequest);

        // then
        assertNotNull(response);
        assertEquals("access.token", response.getAccessToken());
        assertEquals("refresh.token", response.getRefreshToken());

        // verify
        verify(memberRepository).findByEmail(loginRequest.getEmail());
        verify(passwordEncoder).matches(loginRequest.getPassword(), testMember.getPassword());
        verify(jwtUtil).generateAccessToken(testMember.getEmail(), testMember.getRole(),
            testMember.getId(), false);
        verify(jwtUtil).generateRefreshToken(testMember.getEmail());
    }

    @Test
    @DisplayName("존재하지 않는 사용자 로그인 실패")
    void loginFailUserNotFound() {
        // given
        when(memberRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        // when & then
        assertThrows(BadCredentialsException.class, () -> {
            loginService.login(loginRequest);
        });

        verify(memberRepository).findByEmail(loginRequest.getEmail());
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    @DisplayName("비밀번호 불일치로 로그인 실패")
    void loginFailWrongPassword() {
        // given
        when(memberRepository.findByEmail(anyString())).thenReturn(Optional.of(testMember));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        // when & then
        assertThrows(BadCredentialsException.class, () -> {
            loginService.login(loginRequest);
        });

        verify(memberRepository).findByEmail(loginRequest.getEmail());
        verify(passwordEncoder).matches(loginRequest.getPassword(), testMember.getPassword());
    }

    @Test
    @DisplayName("삭제된 계정으로 로그인 실패")
    void loginFailDeletedAccount() {
        // given
        testMember.setBIsDeleted(true);
        when(memberRepository.findByEmail(anyString())).thenReturn(Optional.of(testMember));

        // when & then
        assertThrows(BadCredentialsException.class, () -> {
            loginService.login(loginRequest);
        });

        verify(memberRepository).findByEmail(loginRequest.getEmail());
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    @DisplayName("탈퇴 진행 중인 계정 복구 후 로그인 성공")
    void loginSuccessWithAccountRecovery() {
        // given
        testMember.setDeletedAt(new Date());
        when(memberRepository.findByEmail(anyString())).thenReturn(Optional.of(testMember));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(memberRepository.findById(anyLong())).thenReturn(Optional.of(testMember));
        when(memberRepository.save(any(Member.class))).thenReturn(testMember);
        when(jwtUtil.generateAccessToken(anyString(), anyString(), anyLong(), anyBoolean()))
            .thenReturn("access.token");
        when(jwtUtil.generateRefreshToken(anyString())).thenReturn("refresh.token");

        // when
        LoginResponseDto response = loginService.login(loginRequest);

        // then
        assertNotNull(response);
        assertEquals("access.token", response.getAccessToken());
        assertEquals("refresh.token", response.getRefreshToken());
        assertNull(testMember.getDeletedAt());
        assertFalse(testMember.isBIsDeleted());

        // verify (times(2)로 수정)
        verify(memberRepository).findByEmail(loginRequest.getEmail());
        verify(passwordEncoder, times(2)).matches(loginRequest.getPassword(),
            testMember.getPassword());
        verify(memberRepository).save(testMember);
    }

    @Test
    @DisplayName("탈퇴 진행 중인 계정 복구 실패")
    void loginFailAccountRecoveryFailed() {
        // given
        testMember.setDeletedAt(new Date());
        when(memberRepository.findByEmail(anyString())).thenReturn(Optional.of(testMember));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(memberRepository.findById(anyLong())).thenReturn(Optional.empty());

        // when & then
        assertThrows(RuntimeException.class, () -> {
            loginService.login(loginRequest);
        });

        verify(memberRepository).findByEmail(loginRequest.getEmail());
        verify(passwordEncoder).matches(loginRequest.getPassword(), testMember.getPassword());
        verify(memberRepository).findById(testMember.getId());
    }
}