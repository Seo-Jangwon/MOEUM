package com.weseethemusic.member.service.delete;

import com.weseethemusic.member.common.entity.Calibration;
import com.weseethemusic.member.common.entity.DeleteMemberSaga;
import com.weseethemusic.member.common.entity.DeleteMemberSaga.SagaState;
import com.weseethemusic.member.common.entity.Member;
import com.weseethemusic.member.common.entity.Setting;
import com.weseethemusic.member.common.service.MemberEventProducer;
import com.weseethemusic.member.repository.member.DeleteMemberSagaRepository;
import com.weseethemusic.member.repository.member.MemberRepository;
import com.weseethemusic.member.repository.setting.CalibrationRepository;
import com.weseethemusic.member.repository.setting.SettingRespository;
import java.sql.Date;
import java.time.Duration;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class DeleteServiceImpl implements DeleteService {

    private static final ZoneId KOREA_ZONE_ID = ZoneId.of("Asia/Seoul");
    private static final Duration DELETE_DELAY = Duration.ofDays(7);
    private final MemberRepository memberRepository;
    private final SettingRespository settingRespository;
    private final CalibrationRepository calibrationRepository;
    private final DeleteMemberSagaRepository sagaRepository;
    private final MemberEventProducer eventProducer;

    /**
     * 회원 삭제 요청
     *
     * @param memberId 사용자 id
     */
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void requestDeleteMember(Long memberId) {
        log.info("사용자 삭제 요청: 사용자 ID {}", memberId);
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new RuntimeException("사용자 없음"));

        ZonedDateTime nowKorea = ZonedDateTime.now(KOREA_ZONE_ID);
        ZonedDateTime deletionTimeKorea = nowKorea.plus(DELETE_DELAY);

        member.setDeletedAt(Date.from(deletionTimeKorea.toInstant()));
        memberRepository.save(member);
        log.info("사용자 {} 삭제 예정: {}", memberId, deletionTimeKorea);
    }

    @Override
    @Transactional
    @Scheduled(cron = "0 0 2 * * *")
    public void processDeletedMembers() {
        log.info("삭제 예정 사용자 처리 시작");
        ZonedDateTime nowKorea = ZonedDateTime.now(KOREA_ZONE_ID);

        List<Member> membersToDelete = memberRepository.findMembersToDelete(
            Date.from(nowKorea.toInstant()));

        for (Member member : membersToDelete) {
            try {
                this.startDeleteMember(member);
            } catch (Exception e) {
                log.error("사용자 {} 삭제 시작 실패: {}", member.getId(), e.getMessage());
            }
        }
        log.info("삭제 예정 사용자 처리 완료: 처리된 사용자 수 {}", membersToDelete.size());
    }

    /**
     * 회원 삭제 saga 시작
     */
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void startDeleteMember(Member member) {
        log.info("사용자 삭제 SAGA 시작: 사용자 ID {}", member.getId());

        // 이미 삭제된 회원인지 확인
        if (member.isBIsDeleted()) {
            throw new RuntimeException("이미 삭제된 회원입니다.");
        }

        // 상태와 무관하게 saga 존재 여부 확인
        if (sagaRepository.findFirstByMemberIdOrderByCreatedAtDesc(member.getId()).isPresent()) {
            throw new RuntimeException("이미 진행 중인 삭제 처리가 있습니다.");
        }

        // 새 saga 시작
        DeleteMemberSaga saga = DeleteMemberSaga.start(member.getId());
        saga = sagaRepository.save(saga);

        try {
            // 플레이리스트 삭제 이벤트 발행
            eventProducer.publishDeleteMemberStartedEvent(saga);
            saga.markPlaylistDeleteSent();
            sagaRepository.save(saga);

        } catch (Exception e) {
            saga.fail("이벤트 발행 실패: " + e.getMessage());
            sagaRepository.save(saga);
            throw new RuntimeException("회원 삭제 이벤트 발행 실패", e);
        }
    }

    /**
     * 플레이리스트 삭제 완료 후 회원 정보 삭제 처리
     */
    @Transactional(isolation = Isolation.SERIALIZABLE, propagation = Propagation.REQUIRES_NEW)
    public void completeDeleteMember(Long sagaId, Long memberId) {
        log.info("saga가 완료되고 Calibration 및 Setting 삭제 실행 {}", sagaId);

        DeleteMemberSaga saga = sagaRepository.findById(sagaId)
            .orElseThrow(() -> new RuntimeException("Saga 찾을 수 없음"));

        if (saga.getState() != SagaState.PLAYLIST_DELETE_SENT) {
            log.warn("예상치 못한 saga 발생: {}", saga.getState());
            return;
        }

        try {
            Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member 찾을 수 없음"));

            // Setting 삭제
            Setting setting = settingRespository.findByMemberId(memberId);
            if (setting != null) {
                settingRespository.delete(setting);
                log.info("사용자 {} Setting 삭제 완료", memberId);
            }

            // Calibration 삭제
            Calibration calibration = calibrationRepository.findByMemberId(memberId);
            if (calibration != null) {
                calibrationRepository.delete(calibration);
                log.info("사용자 {} Calibration 삭제 완료", memberId);
            }

            // 회원 정보 익명화 및 삭제 처리
            member.setBIsDeleted(true);
            anonymizeUserData(member);
            memberRepository.save(member);

            saga.complete();
            sagaRepository.save(saga);
            log.info("사용자 {} 삭제 처리 완료", memberId);
            log.info("saga {} 완료", sagaId);

        } catch (Exception e) {
            saga.fail("회원 정보 삭제 실패: " + e.getMessage());
            sagaRepository.save(saga);
            throw new RuntimeException("회원 삭제 처리 실패", e);
        }
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED, propagation = Propagation.REQUIRES_NEW)
    public void handleDeleteMemberFailed(Long sagaId, Long memberId) {
        log.info("회원 삭제 실패 처리 시작. sagaId: {}, memberId: {}", sagaId, memberId);

        DeleteMemberSaga saga = sagaRepository.findById(sagaId)
            .orElseThrow(() -> new RuntimeException("Saga not found"));

        if (saga.getState() != SagaState.PLAYLIST_DELETE_SENT) {
            log.warn("플레이리스트 삭제 실패. saga state: {}", saga.getState());
            return;
        }

        saga.fail("플레이리스트 삭제 실패");
        sagaRepository.save(saga);

        log.info("회원 삭제 실패 처리 완료. sagaId: {}", sagaId);
    }

    /**
     * 회원 정보 익명화 처리
     */
    private void anonymizeUserData(Member member) {
        member.setEmail("deleted_" + member.getId() + "@moeum.com");
        member.setNickname("삭제된 사용자" + member.getId());
        member.setProfileImage(null);
        member.setProvider(null);
    }
}