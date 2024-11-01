package com.weseethemusic.member.service.edit;

import com.weseethemusic.member.common.entity.Member;
import com.weseethemusic.member.common.service.PresignedUrlService;
import com.weseethemusic.member.common.service.S3Service;
import com.weseethemusic.member.common.util.InputValidateUtil;
import com.weseethemusic.member.common.util.SecurityUtil;
import com.weseethemusic.member.dto.member.EditResponseDto;
import com.weseethemusic.member.repository.member.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@AllArgsConstructor
@Service
public class EditServiceImpl implements EditService {

    private final PasswordEncoder passwordEncoder;
    private final MemberRepository memberRepository;
    private final S3Service s3Service;
    private final PresignedUrlService presignedUrlService;

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public EditResponseDto updateNickname(Long memberId, String nickname) {
        log.info("사용자 id: {} 닉네임 변경", memberId);

        try {
            // 닉네임 기본 유효성 검사
            InputValidateUtil.validateNickname(nickname);

            // 보안 검사
            if (SecurityUtil.containsXSSPayload(nickname) ||
                SecurityUtil.containsHtmlTags(nickname) ||
                SecurityUtil.containsSQLInjection(nickname)) {
                throw new IllegalArgumentException("닉네임에 유효하지 않은 문자열 발견");
            }

            Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없음. id: " + memberId));

            member.setNickname(nickname);
            Member updatedMember = memberRepository.save(member);

            return convertToResponseDto(updatedMember);
        } catch (IllegalArgumentException e) {
            log.error("닉네임 유효성 검사 실패: {}", e.getMessage());
            throw e;
        } catch (EntityNotFoundException e) {
            log.error("사용자를 찾을 수 없음: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("닉네임 업데이트 중 오류 발생: {}", e.getMessage());
            throw new RuntimeException("닉네임 업데이트 실패", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean checkUser(Long memberId, String password) {
        log.info("사용자 id: {} 비밀번호 확인", memberId);

        try {

            // 닉네임 기본 유효성 검사
            InputValidateUtil.validatePassword(password);

            Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없음. id: " + memberId));

            return passwordEncoder.matches(password, member.getPassword());
        } catch (IllegalArgumentException e) {
            log.error("비밀번호 유효성 검사 실패: {}", e.getMessage());
            throw e;
        } catch (EntityNotFoundException e) {
            log.error("사용자를 찾을 수 없음: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("비밀번호 확인 중 오류 발생: {}", e.getMessage());
            throw new RuntimeException("비밀번호 확인 중 오류 발생", e);
        }
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public EditResponseDto updatePassword(Long memberId, String password) {
        log.info("사용자 id: {} 비밀번호 변경", memberId);

        try {

            // 닉네임 기본 유효성 검사
            InputValidateUtil.validatePassword(password);

            Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없음. id: " + memberId));

            String encodedPassword = passwordEncoder.encode(password);
            member.setPassword(encodedPassword);

            Member updatedMember = memberRepository.save(member);

            return convertToResponseDto(updatedMember);
        } catch (IllegalArgumentException e) {
            log.error("비밀번호 유효성 검사 실패: {}", e.getMessage());
            throw e;
        } catch (EntityNotFoundException e) {
            log.error("사용자를 찾을 수 없음: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("비밀번호 업데이트 중 오류 발생: {}", e.getMessage());
            throw new RuntimeException("비밀번호 업데이트 실패", e);
        }
    }

    private EditResponseDto convertToResponseDto(Member member) {
        EditResponseDto responseDto = new EditResponseDto();
        responseDto.setEmail(member.getEmail());
        responseDto.setNickname(member.getNickname());

        // 프로필 이미지가 있는 경우만 presigned URL 생성
        if (member.getProfileImage() != null && !member.getProfileImage().isEmpty()) {
            String presignedUrl = presignedUrlService.getPresignedUrl(
                s3Service.extractKeyFromUrl(member.getProfileImage())
            );
            responseDto.setProfileImage(presignedUrl);
        } else {
            responseDto.setProfileImage(null);
        }

        return responseDto;
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public EditResponseDto updateProfileImage(Long memberId, MultipartFile file) {
        log.info("사용자 id: {} 프로필 이미지 업데이트", memberId);

        try {

            String originalFilename = file.getOriginalFilename();

            // 파일명 보안 검사
            if (SecurityUtil.containsXSSPayload(originalFilename) ||
                SecurityUtil.containsHtmlTags(originalFilename) ||
                SecurityUtil.containsSQLInjection(originalFilename)) {
                throw new IllegalArgumentException("파일 이름에 유효하지 않은 문자 포함.");
            }

            Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없음. id: " + memberId));

            // 기존 이미지가 있다면 삭제
            if (member.getProfileImage() != null && !member.getProfileImage().isEmpty()) {
                s3Service.deleteFile(member.getProfileImage());
            }

            // 새 파일명
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFileName = String.format("profile/%d_%d%s",
                memberId, System.currentTimeMillis(), extension);

            // S3에 업로드
            String fileUrl = s3Service.uploadFile(file, newFileName);
            member.setProfileImage(fileUrl);

            Member updatedMember = memberRepository.save(member);
            return convertToResponseDto(updatedMember);

        } catch (IllegalArgumentException e) {
            log.error("파일 이름 유효성 검사 실패: {}", e.getMessage());
            throw e;
        } catch (EntityNotFoundException e) {
            log.error("사용자를 찾을 수 없음: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("프로필 이미지 업데이트 중 오류 발생: {}", e.getMessage());
            throw new RuntimeException("파일 업로드 중 이상이 생겼습니다.", e);
        }
    }
}

