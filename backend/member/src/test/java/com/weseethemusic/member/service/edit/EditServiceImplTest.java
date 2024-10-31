package com.weseethemusic.member.service.edit;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import com.weseethemusic.member.common.entity.Member;
import com.weseethemusic.member.common.service.PresignedUrlService;
import com.weseethemusic.member.common.service.S3Service;
import com.weseethemusic.member.dto.EditResponseDto;
import com.weseethemusic.member.repository.MemberRepository;
import com.weseethemusic.member.service.eidt.EditServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.multipart.MultipartFile;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class EditServiceImplTest {

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private S3Service s3Service;

    @Mock
    private PresignedUrlService presignedUrlService;

    @InjectMocks
    private EditServiceImpl editService;

    private Member testMember;
    private static final Long USER_ID = 1L;
    private static final String EMAIL = "test@email.com";
    private static final String NICKNAME = "testUser";
    private static final String PASSWORD = "password";
    private static final String PROFILE_IMAGE = "https://bucket.s3.region.com/image.jpg";
    private static final String EXTRACTED_KEY = "image.jpg";

    @BeforeEach
    void setUp() {
        testMember = new Member();
        testMember.setId(USER_ID);
        testMember.setEmail(EMAIL);
        testMember.setNickname(NICKNAME);
        testMember.setPassword(PASSWORD);
        testMember.setProfileImage(PROFILE_IMAGE);

        // 모든 테스트에서 공통으로 사용되는 모킹
        when(s3Service.extractKeyFromUrl(anyString())).thenReturn(EXTRACTED_KEY);
        when(presignedUrlService.getPresignedUrl(anyString())).thenReturn("presigned-url");
    }

    @Test
    @DisplayName("닉네임 업데이트 성공")
    void updateNickname_Success() {
        // given
        String newNickname = "newNickname";
        testMember.setNickname(newNickname);

        when(memberRepository.findById(USER_ID)).thenReturn(Optional.of(testMember));
        when(memberRepository.save(any(Member.class))).thenReturn(testMember);

        // when
        EditResponseDto result = editService.updateNickname(USER_ID, newNickname);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getNickname()).isEqualTo(newNickname);
        assertThat(result.getProfileImage()).isEqualTo("presigned-url");
        verify(memberRepository).findById(USER_ID);
        verify(memberRepository).save(any(Member.class));
    }

    @Test
    @DisplayName("존재하지 않는 사용자의 닉네임 업데이트 실패")
    void updateNickname_UserNotFound() {
        // given
        when(memberRepository.findById(USER_ID)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> editService.updateNickname(USER_ID, "newNickname"))
            .isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    @DisplayName("비밀번호 확인 성공")
    void checkUser_Success() {
        // given
        when(memberRepository.findById(USER_ID)).thenReturn(Optional.of(testMember));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);

        // when
        boolean result = editService.checkUser(USER_ID, PASSWORD);

        // then
        assertThat(result).isTrue();
        verify(memberRepository).findById(USER_ID);
        verify(passwordEncoder).matches(PASSWORD, PASSWORD);
    }

    @Test
    @DisplayName("비밀번호 업데이트 성공")
    void updatePassword_Success() {
        // given
        String newPassword = "newPassword";
        String encodedPassword = "encodedPassword";

        when(memberRepository.findById(USER_ID)).thenReturn(Optional.of(testMember));
        when(passwordEncoder.encode(newPassword)).thenReturn(encodedPassword);
        when(memberRepository.save(any(Member.class))).thenReturn(testMember);

        // when
        EditResponseDto result = editService.updatePassword(USER_ID, newPassword);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getProfileImage()).isEqualTo("presigned-url");
        verify(memberRepository).findById(USER_ID);
        verify(passwordEncoder).encode(newPassword);
        verify(memberRepository).save(any(Member.class));
    }

    @Test
    @DisplayName("프로필 이미지 업데이트 성공")
    void updateProfileImage_Success() {
        // given
        MultipartFile file = new MockMultipartFile(
            "file",
            "test.jpg",
            "image/jpeg",
            "test image content".getBytes()
        );
        String newImageUrl = "https://new-image-url.com";

        when(memberRepository.findById(USER_ID)).thenReturn(Optional.of(testMember));
        when(s3Service.uploadFile(any(MultipartFile.class), anyString())).thenReturn(newImageUrl);
        when(memberRepository.save(any(Member.class))).thenReturn(testMember);

        // when
        EditResponseDto result = editService.updateProfileImage(USER_ID, file);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getProfileImage()).isEqualTo("presigned-url");
        verify(memberRepository).findById(USER_ID);
        verify(s3Service).deleteFile(PROFILE_IMAGE);
        verify(s3Service).uploadFile(any(MultipartFile.class), anyString());
        verify(memberRepository).save(any(Member.class));
    }

    @Test
    @DisplayName("프로필 이미지 업데이트 실패 - 사용자 없음")
    void updateProfileImage_UserNotFound() {
        // given
        MultipartFile file = new MockMultipartFile(
            "file",
            "test.jpg",
            "image/jpeg",
            "test image content".getBytes()
        );
        when(memberRepository.findById(USER_ID)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> editService.updateProfileImage(USER_ID, file))
            .isInstanceOf(EntityNotFoundException.class);
    }
}