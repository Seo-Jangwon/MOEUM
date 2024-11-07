package com.weseethemusic.member.service.delete;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;

import com.weseethemusic.common.dto.DeleteMemberEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.weseethemusic.member.common.entity.Calibration;
import com.weseethemusic.member.common.entity.DeleteMemberSaga;
import com.weseethemusic.member.common.entity.DeleteMemberSaga.SagaState;
import com.weseethemusic.member.common.entity.Member;
import com.weseethemusic.member.common.entity.Setting;
import com.weseethemusic.member.repository.member.DeleteMemberSagaRepository;
import com.weseethemusic.member.repository.member.MemberRepository;
import com.weseethemusic.member.repository.setting.CalibrationRepository;
import com.weseethemusic.member.repository.setting.SettingRespository;
import java.time.Duration;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;


@SpringBootTest
@ActiveProfiles({"test", "test-secret"}) // 테스트용 프로파일 사용
class DeleteServiceIntegrationTest {

    private static final Logger log = LoggerFactory.getLogger(DeleteServiceIntegrationTest.class);

    @Autowired
    private DeleteServiceImpl deleteService;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private SettingRespository settingRespository;

    @Autowired
    private CalibrationRepository calibrationRepository;

    @Autowired
    private DeleteMemberSagaRepository sagaRepository;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${rabbitmq.routing.member-delete-result}")
    private String memberDeleteResultRoutingKey;

    private Member testMember;

    @BeforeEach
    void setUp() {
        // 이전 테스트 데이터 정리
        calibrationRepository.deleteAll();
        settingRespository.deleteAll();
        sagaRepository.deleteAll();
        memberRepository.deleteAll();  // cascade로 인해 다른 엔티티들도 삭제됨

        // 테스트용 회원 생성 및 저장
        testMember = new Member();
        testMember.setEmail("test@test.com");
        testMember.setNickname("testUser");
        testMember = memberRepository.save(testMember);  // 먼저 Member를 저장하여 ID를 얻음

        // Setting 생성 및 연결
        Setting setting = new Setting();
        setting.setMember(testMember);
        setting.setVibration(false);
        setting.setVisualization(false);
        setting.setBlindness(0);
        setting.setEqLow(0);
        setting.setEqMid(0);
        setting.setEqHigh(0);
        settingRespository.save(setting);  // Setting을 따로 저장

        // Calibration 생성 및 연결
        Calibration calibration = new Calibration();
        calibration.setMember(testMember);
        calibration.setQ1("000000");
        calibration.setQ2("000000");
        calibration.setQ3("000000");
        calibration.setQ4("000000");
        calibration.setQ5("000000");
        calibration.setQ6("000000");
        calibration.setQ7("000000");
        calibration.setQ8("000000");
        calibrationRepository.save(calibration);  // Calibration을 따로 저장
    }

    @Test
    void shouldCompleteDeleteMemberSagaWhenPlaylistDeleteSucceeds() throws Exception {
        // Given
        deleteService.startDeleteMember(testMember);

        // saga가 시작되었는지 확인
        DeleteMemberSaga saga = sagaRepository.findFirstByMemberIdOrderByCreatedAtDesc(
                testMember.getId())
            .orElseThrow();
        assertThat(saga.getState()).isEqualTo(SagaState.PLAYLIST_DELETE_SENT);

        // When
        // Music 서비스로부터의 응답을 시뮬레이션
        simulatePlaylistDeleteSuccess(testMember.getId(), saga.getId());

        // Then
        // Saga가 완료될 때까지 대기 (최대 10초)
        await()
            .atMost(10, TimeUnit.SECONDS)
            .pollInterval(Duration.ofSeconds(1))
            .until(() -> {
                DeleteMemberSaga updatedSaga = sagaRepository.findById(saga.getId()).orElseThrow();
                return updatedSaga.getState() == SagaState.COMPLETED;
            });

        // 최종 상태 확인
        Member deletedMember = memberRepository.findById(testMember.getId()).orElseThrow();
        assertThat(deletedMember.isBIsDeleted()).isTrue();
        assertThat(deletedMember.getEmail()).startsWith("deleted_");
    }


    @Test
    void shouldHandlePlaylistDeleteFailure() throws Exception {
        // Given
        deleteService.startDeleteMember(testMember);

        DeleteMemberSaga saga = sagaRepository.findFirstByMemberIdOrderByCreatedAtDesc(
                testMember.getId())
            .orElseThrow();
        log.info("Created saga with id: {} for member: {}", saga.getId(), testMember.getId());

        // When
        log.info("Simulating playlist delete failure for memberId: {} and sagaId: {}",
            testMember.getId(), saga.getId());
        simulatePlaylistDeleteFailure(testMember.getId(), saga.getId());

        // Then
        await()
            .atMost(10, TimeUnit.SECONDS)
            .pollInterval(Duration.ofSeconds(1))
            .until(() -> {
                DeleteMemberSaga updatedSaga = sagaRepository.findById(saga.getId()).orElseThrow();
                log.info("Current saga state: {}", updatedSaga.getState());
                return updatedSaga.getState() == SagaState.FAILED;
            });

        Member notDeletedMember = memberRepository.findById(testMember.getId()).orElseThrow();
        assertThat(notDeletedMember.isBIsDeleted()).isFalse();
        assertThat(notDeletedMember.getEmail()).isEqualTo("test@test.com");
    }

    @Test
    void shouldPreventConcurrentSagasForSameMember() throws Exception {
        // Given
        deleteService.startDeleteMember(testMember);

        DeleteMemberSaga firstSaga = sagaRepository
            .findFirstByMemberIdOrderByCreatedAtDesc(testMember.getId())
            .orElseThrow();
        log.info("처음 saga 상태: {}", firstSaga.getState());

        // When & Then
        // 두 번째 Saga 시작 시도가 실패하는지
        await()
            .atMost(5, TimeUnit.SECONDS)
            .pollInterval(Duration.ofSeconds(1))
            .untilAsserted(() -> {
                try {
                    deleteService.startDeleteMember(testMember);
                    throw new AssertionError("Should throw exception");
                } catch (RuntimeException e) {
                    assertThat(e.getMessage()).isEqualTo("이미 진행 중인 삭제 처리가 있습니다.");
                }
            });
    }

    private void simulatePlaylistDeleteSuccess(Long memberId, Long sagaId) {
        DeleteMemberEvent resultEvent = new DeleteMemberEvent(
            memberId,
            DeleteMemberEvent.EventType.PLAYLIST_DELETE_COMPLETED.name(),
            sagaId.toString()
        );

        rabbitTemplate.convertAndSend(exchangeName, memberDeleteResultRoutingKey, resultEvent);
    }

    private void simulatePlaylistDeleteFailure(Long memberId, Long sagaId) {
        DeleteMemberEvent resultEvent = new DeleteMemberEvent(
            memberId,
            DeleteMemberEvent.EventType.PLAYLIST_DELETE_FAILED.name(),
            sagaId.toString()
        );

        rabbitTemplate.convertAndSend(exchangeName, memberDeleteResultRoutingKey, resultEvent);
    }
}