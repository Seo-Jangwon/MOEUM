package com.weseethemusic.member.service.register;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.startsWith;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.weseethemusic.member.common.entity.Calibration;
import com.weseethemusic.member.common.entity.Member;
import com.weseethemusic.member.common.entity.Setting;
import com.weseethemusic.member.dto.member.RegisterDto;
import com.weseethemusic.member.repository.member.MemberRepository;
import com.weseethemusic.member.repository.setting.CalibrationRepository;
import com.weseethemusic.member.repository.setting.SettingRespository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class RegisterServiceMemberTest {

    @Mock
    private MemberRepository memberRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private RedisTemplate<String, Object> redisTemplate;
    @Mock
    private ValueOperations<String, Object> valueOperations;
    @Mock
    private SettingRespository settingRespository;
    @Mock
    private CalibrationRepository calibrationRepository;

    @Captor
    private ArgumentCaptor<Setting> settingCaptor;
    @Captor
    private ArgumentCaptor<Calibration> calibrationCaptor;

    @InjectMocks
    private RegisterServiceImpl registerService;

    private RegisterDto validRegisterDto;

    @BeforeEach
    void setUp() {

        validRegisterDto = new RegisterDto();
        validRegisterDto.setEmail("test@example.com");
        validRegisterDto.setPassword("Test123!@#");
        validRegisterDto.setNickname("테스트유저");
    }

    @Test
    @DisplayName("정상 회원가입 성공")
    void registerUserSuccess() {
        // given
        String hashedPassword = "hashedPassword";
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(startsWith("email:verified:"))).thenReturn(true);
        when(passwordEncoder.encode(anyString())).thenReturn(hashedPassword);
        when(memberRepository.save(any(Member.class))).thenAnswer(invocation -> {
            Member savedMember = invocation.getArgument(0);
            savedMember.setId(1L);
            savedMember.setRole(Member.Role.USER);
            return savedMember;
        });

        // when
        Member result = registerService.registerUser(validRegisterDto);

        // then
        assertNotNull(result);
        assertEquals(validRegisterDto.getEmail(), result.getEmail());
        assertEquals(hashedPassword, result.getPassword());
        assertEquals(validRegisterDto.getNickname(), result.getNickname());
        assertSame(String.valueOf(Member.Role.USER), result.getRole());
        assertFalse(result.isBIsDeleted());

        // Setting 검증
        verify(settingRespository).save(settingCaptor.capture());
        Setting savedSetting = settingCaptor.getValue();
        assertNotNull(savedSetting);
        assertEquals(result.getId(), savedSetting.getMember().getId());
        assertFalse(savedSetting.isVibration());
        assertFalse(savedSetting.isVisualization());
        assertEquals(0, savedSetting.getBlindness());
        assertEquals(0, savedSetting.getEqLow());
        assertEquals(0, savedSetting.getEqMid());
        assertEquals(0, savedSetting.getEqHigh());

        // Calibration 검증
        verify(calibrationRepository).save(calibrationCaptor.capture());
        Calibration savedCalibration = calibrationCaptor.getValue();
        assertNotNull(savedCalibration);
        assertEquals(result.getId(), savedCalibration.getMember().getId());

        // Calibration의 각 필드 검증
        String[] colorFields = {
            savedCalibration.getQ1(),
            savedCalibration.getQ2(),
            savedCalibration.getQ3(),
            savedCalibration.getQ4(),
            savedCalibration.getQ5(),
            savedCalibration.getQ6(),
            savedCalibration.getQ7(),
            savedCalibration.getQ8()
        };

        for (String color : colorFields) {
            assertNotNull(color, "Calibration color should not be null");
            assertEquals("#000000", color, "Default color should be #000000");
        }
    }


    @Test
    @DisplayName("회원가입 실패 - 이메일 인증되지 않음")
    void registerUserFailNotVerifiedEmail() {
        // given
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(startsWith("email:verified:"))).thenReturn(null);

        // when & then
        RuntimeException exception = assertThrows(RuntimeException.class,
            () -> {  // IllegalState -> Runtime
                registerService.registerUser(validRegisterDto);
            });

        assertEquals("이메일 인증이 완료되지 않았습니다.", exception.getMessage());

        // verify
        verify(valueOperations).get(startsWith("email:verified:"));
        verify(passwordEncoder, never()).encode(anyString());
        verify(memberRepository, never()).save(any(Member.class));
    }

    @Test
    @DisplayName("회원가입 실패 - SQL Injection 시도")
    void registerUserFailSqlInjection() {
        // given
        validRegisterDto.setEmail("test@example.com'; DROP TABLE users;--");

        // when & then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            registerService.registerUser(validRegisterDto);
        });

        // verify
        verify(valueOperations, never()).get(anyString());
        verify(passwordEncoder, never()).encode(anyString());
        verify(memberRepository, never()).save(any(Member.class));
    }

    @Test
    @DisplayName("회원가입 실패 - XSS 시도")
    void registerUserFailXssAttempt() {
        // given
        validRegisterDto.setNickname("<script>alert('xss');</script>");

        // when & then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            registerService.registerUser(validRegisterDto);
        });

        // verify
        verify(valueOperations, never()).get(anyString());
        verify(passwordEncoder, never()).encode(anyString());
        verify(memberRepository, never()).save(any(Member.class));
    }

    @Test
    @DisplayName("회원가입 실패 - 유효하지 않은 비밀번호")
    void registerUserFailInvalidPassword() {
        // given
        validRegisterDto.setPassword("weak");

        // when & then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            registerService.registerUser(validRegisterDto);
        });

        // verify
        verify(valueOperations, never()).get(anyString());
        verify(passwordEncoder, never()).encode(anyString());
        verify(memberRepository, never()).save(any(Member.class));
    }

    @Test
    @DisplayName("회원가입 실패 - 유효하지 않은 닉네임")
    void registerUserFailInvalidNickname() {
        // given
        validRegisterDto.setNickname("a"); // 2자 미만

        // when & then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            registerService.registerUser(validRegisterDto);
        });

        // verify
        verify(valueOperations, never()).get(anyString());
        verify(passwordEncoder, never()).encode(anyString());
        verify(memberRepository, never()).save(any(Member.class));
    }

    @Test
    @DisplayName("회원가입 실패 - 데이터베이스 저장 실패")
    void registerUserFailDatabaseError() {
        // given
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(startsWith("email:verified:"))).thenReturn(true);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        when(memberRepository.save(any(Member.class))).thenThrow(
            new DataIntegrityViolationException("DB Error"));

        // when & then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            registerService.registerUser(validRegisterDto);
        });

        assertEquals("회원 정보 저장 중 오류가 발생했습니다.", exception.getMessage());  // 메시지 수정

        // verify
        verify(valueOperations).get(startsWith("email:verified:"));
        verify(passwordEncoder).encode(anyString());
        verify(memberRepository).save(any(Member.class));
    }
}