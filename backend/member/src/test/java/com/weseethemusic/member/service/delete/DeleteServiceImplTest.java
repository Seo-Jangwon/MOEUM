package com.weseethemusic.member.service.delete;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.weseethemusic.member.common.entity.Member;
import com.weseethemusic.member.repository.MemberRepository;
import com.weseethemusic.member.service.delite.DeleteServiceImpl;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DeleteServiceImplTest {

    @Mock
    private MemberRepository memberRepository;

    private DeleteServiceImpl deleteService;

    @Captor
    private ArgumentCaptor<Member> memberCaptor;

    private static final ZoneId KOREA_ZONE_ID = ZoneId.of("Asia/Seoul");

    @BeforeEach
    void setUp() {
        deleteService = new DeleteServiceImpl(memberRepository);
    }

    @Test
    void requestDeleteUser_ShouldSetDeletedAtTo7DaysLater() {
        // Given
        Long userId = 1L;
        Member member = new Member();
        member.setId(userId);
        member.setEmail("test@test.com");
        when(memberRepository.findById(userId)).thenReturn(Optional.of(member));

        // When
        deleteService.requestDeleteUser(userId);

        // Then
        verify(memberRepository).save(memberCaptor.capture());
        Member savedMember = memberCaptor.getValue();

        ZonedDateTime now = ZonedDateTime.now(KOREA_ZONE_ID);
        ZonedDateTime deletionTime = now.plusDays(7);

        // deletedAt이 현재시간+7일과 비슷한 시점인지 확인 (1분 이내 차이)
        long diffInMinutes = Math.abs(
            deletionTime.toInstant().getEpochSecond() -
                savedMember.getDeletedAt().toInstant().getEpochSecond()
        ) / 60;

        assertThat(diffInMinutes).isLessThan(1);
    }

    @Test
    void requestDeleteUser_ShouldThrowException_WhenUserNotFound() {
        // Given
        Long userId = 999L;
        when(memberRepository.findById(userId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> deleteService.requestDeleteUser(userId))
            .isInstanceOf(RuntimeException.class)
            .hasMessage("사용자 없음");
    }

    @Test
    void processDeletedUsers_ShouldProcessAllMembers() {
        // Given
        Member member1 = createMember(1L, "test1@test.com");
        Member member2 = createMember(2L, "test2@test.com");

        // any(Date.class) 대신 더 유연한 방식으로 변경
        when(memberRepository.findMembersToDelete(any()))
            .thenReturn(Arrays.asList(member1, member2));

        // When
        deleteService.processDeletedUsers();

        // Then
        verify(memberRepository, times(4)).save(memberCaptor.capture());
        List<Member> savedMembers = memberCaptor.getAllValues();

        // 마지막으로 저장된 두 멤버 확인 (anonymizeUserData의 결과)
        assertThat(savedMembers).hasSize(4); // 총 4번의 저장 (각 멤버당 한번씩 + 익명화)

        Member lastSavedMember = savedMembers.get(savedMembers.size() - 1);
        assertThat(lastSavedMember.isBIsDeleted()).isTrue();
        assertThat(lastSavedMember.getEmail()).startsWith("deleted_");
        assertThat(lastSavedMember.getProfileImage()).isNull();
        assertThat(lastSavedMember.getProvider()).isNull();
    }

    @Test
    void processDeletedMember_ShouldAnonymizeAndMarkAsDeleted() {
        // Given
        Member member = createMember(1L, "test@test.com");
        member.setNickname("originalNickname");
        member.setProfileImage("profile.jpg");
        member.setProvider("google");

        // When
        deleteService.processDeletedMember(member);

        // Then
        verify(memberRepository, times(2)).save(memberCaptor.capture());
        Member savedMember = memberCaptor.getValue();

        assertThat(savedMember.isBIsDeleted()).isTrue();
        assertThat(savedMember.getEmail()).isEqualTo("deleted_1@yoganavi.com");
        assertThat(savedMember.getNickname()).isEqualTo("삭제된 사용자1");
        assertThat(savedMember.getProfileImage()).isNull();
        assertThat(savedMember.getProvider()).isNull();
    }

    private Member createMember(Long id, String email) {
        Member member = new Member();
        member.setId(id);
        member.setEmail(email);
        member.setNickname("nickname" + id);
        return member;
    }
}