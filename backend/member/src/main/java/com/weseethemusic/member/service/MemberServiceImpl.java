package com.weseethemusic.member.service;

import static com.weseethemusic.member.common.entity.Member.Role.USER;

import com.weseethemusic.member.common.entity.Member;
import com.weseethemusic.member.common.event.MemberEvent;
import com.weseethemusic.member.common.util.InputValidateUtil;
import com.weseethemusic.member.common.util.SecurityUtil;
import com.weseethemusic.member.dto.RegisterDto;
import com.weseethemusic.member.repository.MemberRepository;
import java.time.Duration;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@Slf4j
public class MemberServiceImpl implements MemberService {

    private static final Duration TOKEN_VALIDITY_DURATION = Duration.ofMinutes(5);
    private static final Duration VERIFICATION_VALIDITY_DURATION = Duration.ofMinutes(30);
    private static final String EMAIL_TOKEN_PREFIX = "email:token:";
    private static final String EMAIL_VERIFIED_PREFIX = "email:verified:";

    private final JavaMailSender emailSender;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final RedisTemplate<String, Object> redisTemplate;

    public MemberServiceImpl(JavaMailSender emailSender, MemberRepository memberRepository,
        PasswordEncoder passwordEncoder, KafkaTemplate<String, Object> kafkaTemplate,
        RedisTemplate<String, Object> redisTemplate) {
        this.emailSender = emailSender;
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
        this.kafkaTemplate = kafkaTemplate;
        this.redisTemplate = redisTemplate;
    }

    /**
     * 회원가입
     *
     * @param registerDto 사용자 등록 정보
     * @return 등록된 사용자 엔티티
     */
    @Override
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public Member registerUser(RegisterDto registerDto) {
        log.info("member - 사용자 등록 시작: 이메일 {}", registerDto.getEmail());

        try {
            // 입력값 유효성 및 보안 검사
            validateRegisterInput(registerDto);

            // 이메일 인증 완료 여부 확인
            String verifiedKey = EMAIL_VERIFIED_PREFIX + registerDto.getEmail();
            Boolean isVerified = (Boolean) redisTemplate.opsForValue().get(verifiedKey);

            if (isVerified == null || !isVerified) {
                throw new IllegalStateException("이메일 인증이 완료되지 않았습니다.");
            }

            String hashPwd = passwordEncoder.encode(registerDto.getPassword());
            Member member = Member.builder()
                .email(registerDto.getEmail())
                .password(hashPwd)
                .nickname(registerDto.getNickname())
                .bIsDeleted(false)
                .role(USER)
                .build();

            Member saveMember = memberRepository.save(member);

            // 인증 완료 상태 삭제
            redisTemplate.delete(verifiedKey);

            try {
                kafkaTemplate.send("member-event", MemberEvent.builder()
                    .eventType("CREATED")
                    .memberId(member.getId())
                    .nickname(member.getNickname())
                    .email(member.getEmail())
                    .build()).get(5, TimeUnit.SECONDS);
            } catch (Exception e) {
                log.error("member - Kafka 이벤트 발행 실패. 회원가입은 완료됨. 회원 ID: {}", saveMember.getId(), e);
            }

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

        // 기본 유효성 검사
        InputValidateUtil.validateEmail(email);
        InputValidateUtil.validateNickname(nickname);
        InputValidateUtil.validatePassword(registerDto.getPassword());

        // XSS 및 HTML 인젝션 검사
        if (SecurityUtil.containsXSSPayload(email) || SecurityUtil.containsXSSPayload(nickname) ||
            SecurityUtil.containsHtmlTags(email) || SecurityUtil.containsHtmlTags(nickname)) {
            throw new IllegalArgumentException("유효하지 않은 문자가 포함되어 있습니다.");
        }
    }

    @Override
    @Transactional(readOnly = true, isolation = Isolation.SERIALIZABLE)
    public boolean checkUser(String email) {
        // db에 이메일 존재 하는지
        if (memberRepository.findByEmail(email).isPresent()) {
            return false;
        }
        // 이메일이 삭제된 사용자의 패턴과 일치?
        if (email.matches("deleted_\\d+@yoganavi\\.com")) {
            return false;
        }
        // 해당하지 않으면 사용 가능
        return true;
    }

    private String generateToken() {
        return Integer.toString((int) (Math.random() * 899999) + 100000);
    }

    private String getRedisKey(String email) {
        return EMAIL_TOKEN_PREFIX + email;
    }

    /**
     * 이메일 인증용 토큰을 생성하고 이메일로 전송
     *
     * @param email 사용자 이메일
     * @return 토큰 전송 결과 메시지
     */
    @Override
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public String sendEmailToken(String email) {
        log.info("이메일 인증 토큰 전송 시작: {}", email);
        if (checkUser(email)) {
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

                sendSimpleMessage(email, "모두의 음악 회원가입 인증번호",
                    "회원가입 인증번호 : " + token + "\n이 인증번호는 5분 동안 유효합니다.");

                log.info("이메일 인증 토큰 전송 완료: {}", email);

                return "인증 번호 전송";
            } catch (Exception e) {
                log.error("이메일 인증 토큰 전송 실패", e);
                return "인증 번호 전송 실패. 잠시 후 다시 시도해 주세요.";
            }
        } else {
            return "이미 존재하는 회원입니다.";
        }
    }

    /**
     * 인증번호 전송
     *
     * @param to      수신자 이메일
     * @param subject 메일 제목
     * @param text    메일 내용
     */
    @Override
    public void sendSimpleMessage(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }

    /**
     * 이메일 확인 토큰 유효성 검증
     *
     * @param email 사용자 이메일
     * @param token 검증할 토큰
     * @return 토큰 유효성 여부
     */
    @Override
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public boolean validateEmailToken(String email, String token) {
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
