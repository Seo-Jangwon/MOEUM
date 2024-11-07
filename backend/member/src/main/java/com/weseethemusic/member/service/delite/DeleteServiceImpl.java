package com.weseethemusic.member.service.delite;

import com.weseethemusic.member.common.entity.Calibration;
import com.weseethemusic.member.common.entity.Member;
import com.weseethemusic.member.common.entity.Setting;
import com.weseethemusic.member.repository.member.MemberRepository;
import com.weseethemusic.member.repository.setting.CalibrationRepository;
import com.weseethemusic.member.repository.setting.SettingRespository;
import java.sql.Date;
import java.time.Duration;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@AllArgsConstructor
public class DeleteServiceImpl implements DeleteService {

    private static final ZoneId KOREA_ZONE_ID = ZoneId.of("Asia/Seoul");
    private static final Duration DELETE_DELAY = Duration.ofDays(7);
    private final MemberRepository memberRepository;
    private final SettingRespository settingRespository;
    private final CalibrationRepository calibrationRepository;


    /**
     * 회원 삭제 요청
     *
     * @param userId 사용자 id
     */
    @Override
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public void requestDeleteUser(Long userId) {
        log.info("사용자 삭제 요청: 사용자 ID {}", userId);
        Member member = memberRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("사용자 없음"));

        ZonedDateTime nowKorea = ZonedDateTime.now(KOREA_ZONE_ID);
        ZonedDateTime deletionTimeKorea = nowKorea.plus(DELETE_DELAY);

        member.setDeletedAt(Date.from(deletionTimeKorea.toInstant()));
        memberRepository.save(member);
        log.info("사용자 {} 삭제 예정: {}", userId, deletionTimeKorea);
    }

    @Override
    @Transactional
    @Scheduled(cron = "0 0 2 * * *") // 매일 새벽 2시에 실행
    public void processDeletedUsers() {
        log.info("삭제 예정 사용자 처리 시작");
        ZonedDateTime nowKorea = ZonedDateTime.now(KOREA_ZONE_ID);

        List<Member> membersToDelete = memberRepository.findMembersToDelete(
            Date.from(nowKorea.toInstant()));
        for (Member member : membersToDelete) {
            try {
                processDeletedMember(member);
            } catch (Exception e) {
                log.error("사용자 {} 삭제중 에러 발생: {}", member.getId(), e.getMessage());
            }
        }
        log.info("삭제 예정 사용자 처리 완료: 처리된 사용자 수 {}", membersToDelete.size());
    }

    @Override
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public void processDeletedMember(Member member) {
        log.info("사용자 삭제 처리 시작: 사용자 ID {}", member.getId());

        // Setting 삭제
        Setting setting = settingRespository.findByMemberId(member.getId());
        if (setting != null) {
            settingRespository.delete(setting);
            log.info("사용자 {} Setting 삭제 완료", member.getId());
        }

        // Calibration 삭제
        Calibration calibration = calibrationRepository.findByMemberId(member.getId());
        if (calibration != null) {
            calibrationRepository.delete(calibration);
            log.info("사용자 {} Calibration 삭제 완료", member.getId());
        }

        member.setBIsDeleted(true);
        anonymizeUserData(member);
        memberRepository.save(member);
        log.info("사용자 삭제 처리 완료: 사용자 ID {}", member.getId());
    }

    private void anonymizeUserData(Member member) {
        log.debug("사용자 데이터 익명화 시작: 사용자 ID {}", member.getId());
        member.setEmail("deleted_" + member.getId() + "@yoganavi.com");
        member.setNickname("삭제된 사용자" + member.getId());
        member.setProfileImage(null);
        member.setProvider(null);
        memberRepository.save(member);
        log.info("사용자 {} 익명화 완료", member.getId());
    }
}
