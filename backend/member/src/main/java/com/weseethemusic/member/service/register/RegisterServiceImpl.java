package com.weseethemusic.member.service.register;

import static com.weseethemusic.member.common.entity.Member.Role.USER;

import com.weseethemusic.member.common.entity.Calibration;
import com.weseethemusic.member.common.entity.Member;
import com.weseethemusic.member.common.entity.Setting;
import com.weseethemusic.member.common.service.EmailService;
import com.weseethemusic.member.common.util.InputValidateUtil;
import com.weseethemusic.member.common.util.SecurityUtil;
import com.weseethemusic.member.dto.member.RegisterDto;
import com.weseethemusic.member.repository.member.MemberRepository;
import com.weseethemusic.member.repository.setting.CalibrationRepository;
import com.weseethemusic.member.repository.setting.SettingRespository;
import java.time.Duration;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class RegisterServiceImpl implements RegisterService {

    private static final Duration TOKEN_VALIDITY_DURATION = Duration.ofMinutes(5);
    private static final Duration VERIFICATION_VALIDITY_DURATION = Duration.ofMinutes(30);
    private static final String EMAIL_TOKEN_PREFIX = "email:token:";
    private static final String EMAIL_VERIFIED_PREFIX = "email:verified:";

    private final SettingRespository settingRespository;
    private final CalibrationRepository calibrationRepository;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final RedisTemplate<String, Object> redisTemplate;
    private final EmailService emailService;

    @Override
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public Member registerUser(RegisterDto registerDto) {
        log.info("member - 사용자 등록 시작: 이메일 {}", registerDto.getEmail());

        try {
            // 입력값 유효성 검사
            validateRegisterInput(registerDto);

            // 이메일 인증 완료 여부 확인
            String verifiedKey = EMAIL_VERIFIED_PREFIX + registerDto.getEmail();
            Boolean isVerified = (Boolean) redisTemplate.opsForValue().get(verifiedKey);

            if (isVerified == null || !isVerified) {
                throw new IllegalStateException("이메일 인증이 완료되지 않았습니다.");
            }

            String hashPwd = passwordEncoder.encode(registerDto.getPassword());
            Member member = new Member();
            member.setEmail(registerDto.getEmail());
            member.setPassword(hashPwd);
            member.setNickname(registerDto.getNickname());
            member.setBIsDeleted(false);
            member.setRole(USER);

            Member saveMember = memberRepository.save(member);

            // Setting 생성
            Setting setting = new Setting();
            setting.setMember(saveMember);
            settingRespository.save(setting);

            // Calibration 생성
            Calibration calibration = new Calibration();
            calibration.setMember(saveMember);
            calibration.setQ1("000000");
            calibration.setQ2("000000");
            calibration.setQ3("000000");
            calibration.setQ4("000000");
            calibration.setQ5("000000");
            calibration.setQ6("000000");
            calibration.setQ7("000000");
            calibration.setQ8("000000");
            calibrationRepository.save(calibration);

            // 인증 완료 상태 삭제
            redisTemplate.delete(verifiedKey);

            log.info("member - 사용자 등록 완료: 사용자 ID {}", saveMember.getId());
            return saveMember;

        } catch (IllegalArgumentException | IllegalStateException e) {
            log.warn("회원가입 유효성 검증 실패: {}", e.getMessage());
            throw e;
        } catch (DataIntegrityViolationException e) {
            log.error("데이터 무결성 위반: {}", e.getMessage());
            throw new IllegalStateException("회원 정보 저장 중 오류가 발생했습니다.");
        } catch (Exception e) {
            log.error("회원가입 처리 중 예기치 않은 오류 발생", e);
            throw new RuntimeException("회원가입 처리 중 오류가 발생했습니다.");
        }
    }

    private void validateRegisterInput(RegisterDto registerDto) {
        if (registerDto == null) {
            throw new IllegalArgumentException("회원가입 정보가 없습니다.");
        }

        String email = registerDto.getEmail();
        String nickname = registerDto.getNickname();
        String password = registerDto.getPassword();

        // 이메일 유효성 검사
        if (!SecurityUtil.isValidEmail(email)) {
            throw new IllegalArgumentException("유효하지 않은 이메일 형식입니다.");
        }

        // 닉네임 유효성 검사
        if (!SecurityUtil.isValidNickname(nickname)) {
            throw new IllegalArgumentException("닉네임은 2-20자의 한글, 영문, 숫자만 허용됩니다.");
        }

        // 비밀번호 유효성 검사
        if (!SecurityUtil.isValidPassword(password)) {
            throw new IllegalArgumentException("비밀번호는 8-20자이며, 영문자, 숫자, 특수문자를 포함해야 합니다.");
        }

        // XSS 위험 검사
        if (SecurityUtil.hasXSSRisk(email) || SecurityUtil.hasXSSRisk(nickname)) {
            throw new IllegalArgumentException("유효하지 않은 문자가 포함되어 있습니다.");
        }
    }

    @Override
    @Transactional(readOnly = true, isolation = Isolation.SERIALIZABLE)
    public int checkUser(String email) {
        // db에 이메일 존재 하는지
        if (memberRepository.findByEmail(email).isPresent()) {
            return 1;
        }
        // 이메일이 삭제된 사용자의 패턴과 일치?
        if (email.matches("deleted_\\d+@yoganavi\\.com")) {
            return 2;
        }
        // 해당하지 않으면 사용 가능
        return 0;
    }

    private String generateToken() {
        return String.format("%06d", (int) (Math.random() * 1000000));
    }

    private String getRedisKey(String email) {
        return EMAIL_TOKEN_PREFIX + email;
    }

    @Override
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public String sendEmailToken(String email) {
        log.info("이메일 인증 토큰 전송 시작: {}", email);

        // 이메일 유효성 검사
        if (!SecurityUtil.isValidEmail(email)) {
            throw new IllegalArgumentException("이메일 형식이 유효하지 않습니다.");
        }

        int valCase = checkUser(email);
        if (valCase == 0) {
            try {
                String token = generateToken();
                String redisKey = getRedisKey(email);

                // 기존 토큰이 있다면 삭제
                redisTemplate.delete(redisKey);

                // Redis에 토큰 저장
                redisTemplate.opsForValue().set(
                    redisKey,
                    token,
                    TOKEN_VALIDITY_DURATION
                );

                emailService.sendSimpleMessage(email, "모두의 음악 회원가입 인증번호",
                    "회원가입 인증번호 : " + token + "\n이 인증번호는 5분 동안 유효합니다.");

                log.info("이메일 인증 토큰 전송 완료: {}", email);

                return "인증 번호 전송";
            } catch (Exception e) {
                log.error("이메일 인증 토큰 전송 실패", e);
                return "인증 번호 전송 실패. 잠시 후 다시 시도해 주세요.";
            }
        } else if (valCase == 1) {
            return "이미 존재하는 회원입니다.";
        } else {
            return "가입할 수 없습니다.";
        }
    }

    @Override
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public boolean validateEmailToken(String email, String token) {
        log.info("{}의 입력 인증번호: {}", email, token);
        String redisKey = getRedisKey(email);
        Object storedToken = redisTemplate.opsForValue().get(redisKey);
        if (storedToken != null && token.equals(storedToken.toString())) {
            // 유효성 검증 성공 시 토큰 삭제
            redisTemplate.delete(redisKey);

            // 이메일 인증 완료 상태 저장
            String verifiedKey = EMAIL_VERIFIED_PREFIX + email;
            redisTemplate.opsForValue().set(
                verifiedKey,
                true,
                VERIFICATION_VALIDITY_DURATION
            );
            return true;
        }
        return false;
    }
}