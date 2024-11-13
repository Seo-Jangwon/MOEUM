package com.weseethemusic.member.service.info;

import com.weseethemusic.member.common.entity.Member;
import com.weseethemusic.member.common.service.PresignedUrlService;
import com.weseethemusic.member.common.service.S3Service;
import com.weseethemusic.member.dto.member.MemberInfoDto;
import com.weseethemusic.member.repository.member.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import java.text.SimpleDateFormat;
import java.util.Date;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class InfoServiceImpl implements InfoService {

    private final S3Service s3Service;
    private final PresignedUrlService presignedUrlService;
    private final MemberRepository memberRepository;

    @Override
    @Transactional(readOnly = true)
    public MemberInfoDto getInfo(Long memberId) {
        try {
            Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없음. id: " + memberId));
            return convertToResponseDto(member);
        } catch (Exception e) {
            log.error("회원 정보 조회 중 오류 발생: {}", e.getMessage());
            throw new RuntimeException("회원 정보 조회 실패", e);
        }
    }

    private MemberInfoDto convertToResponseDto(Member member) {
        MemberInfoDto responseDto = new MemberInfoDto();
        responseDto.setEmail(member.getEmail());
        responseDto.setNickname(member.getNickname());

        if (member.getProfileImage() != null && !member.getProfileImage().isEmpty()) {
            String presignedUrl = presignedUrlService.getPresignedUrl(
                s3Service.extractKeyFromUrl(member.getProfileImage())
            );
            responseDto.setProfileImage(presignedUrl);
        } else {
            responseDto.setProfileImage(null);
        }

        Date date = member.getCreatedAt();
        responseDto.setRegisteredDate(new SimpleDateFormat("yyyy년 MM월 dd일").format(date));

        return responseDto;
    }
}
