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
import com.weseethemusic.member.dto.member.EditResponseDto;
import com.weseethemusic.member.repository.member.MemberRepository;
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
    private static final String PROFILE_IMAGE = "https://bucket.s3.region.com/image.jpg";
    private static final String EXTRACTED_KEY = "image.jpg";

    @BeforeEach
    void setUp() {
        testMember = new Member();
        testMember.setId(USER_ID);
        testMember.setEmail(EMAIL);
        testMember.setNickname(NICKNAME);
        testMember.setPassword("Password123!");
        testMember.setProfileImage(PROFILE_IMAGE);

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
        final String PASSWORD = "Password123!";  // 비밀번호 정책에 맞게 수정

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
        String newPassword = "NewPassword123!";  // 비밀번호 정책에 맞게 수정
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

    @Test
    @DisplayName("XSS가 포함된 닉네임 업데이트 실패")
    void updateNickname_WithXSS_ThrowsException() {
        // given
        String maliciousNickname = "<script>alert('xss')</script>";

        // when & then
        assertThatThrownBy(() -> editService.updateNickname(USER_ID, maliciousNickname))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("2-20자의 한글, 영문, 숫자만 허용");
    }

    @Test
    @DisplayName("SQL Injection이 포함된 닉네임 업데이트 실패")
    void updateNickname_WithSQLInjection_ThrowsException() {
        // given
        String maliciousNickname = "' OR '1'='1";

        // when & then
        assertThatThrownBy(() -> editService.updateNickname(USER_ID, maliciousNickname))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("2-20자의 한글, 영문, 숫자만 허용");
    }

    @Test
    @DisplayName("HTML 태그가 포함된 닉네임 업데이트 실패")
    void updateNickname_WithHTMLTags_ThrowsException() {
        // given
        String maliciousNickname = "<div>test</div>";

        // when & then
        assertThatThrownBy(() -> editService.updateNickname(USER_ID, maliciousNickname))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("2-20자의 한글, 영문, 숫자만 허용");
    }

    @Test
    @DisplayName("짧은 닉네임 업데이트 실패")
    void updateNickname_TooShort_ThrowsException() {
        // given
        String shortNickname = "a";

        // when & then
        assertThatThrownBy(() -> editService.updateNickname(USER_ID, shortNickname))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("2-20자");
    }

    @Test
    @DisplayName("긴 닉네임 업데이트 실패")
    void updateNickname_TooLong_ThrowsException() {
        // given
        String longNickname = "a".repeat(21);

        // when & then
        assertThatThrownBy(() -> editService.updateNickname(USER_ID, longNickname))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("2-20자");
    }

    @Test
    @DisplayName("특수문자가 포함된 비밀번호 업데이트 실패")
    void updatePassword_WithSpecialCharacters_ThrowsException() {
        // given
        String invalidPassword = "<script>alert('xss')</script>";
        when(memberRepository.findById(USER_ID)).thenReturn(Optional.of(testMember));

        // when & then
        assertThatThrownBy(() -> editService.updatePassword(USER_ID, invalidPassword))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("8-20자이며, 영문자, 숫자, 특수문자를 포함");
    }

    @Test
    @DisplayName("XSS가 포함된 파일명으로 프로필 이미지 업데이트 실패")
    void updateProfileImage_WithXSSInFilename_ThrowsException() {
        // given
        MultipartFile file = new MockMultipartFile(
            "file",
            "<script>alert('xss')</script>.jpg",
            "image/jpeg",
            "test image content".getBytes()
        );
        when(memberRepository.findById(USER_ID)).thenReturn(Optional.of(testMember));

        // when & then
        assertThatThrownBy(() -> editService.updateProfileImage(USER_ID, file))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("지원하지 않는 파일 형식");
    }

    @Test
    @DisplayName("SQL Injection이 포함된 파일명으로 프로필 이미지 업데이트 실패")
    void updateProfileImage_WithSQLInjectionInFilename_ThrowsException() {
        // given
        MultipartFile file = new MockMultipartFile(
            "file",
            "'); DROP TABLE users;--.jpg",
            "image/jpeg",
            "test image content".getBytes()
        );
        when(memberRepository.findById(USER_ID)).thenReturn(Optional.of(testMember));

        // when & then
        assertThatThrownBy(() -> editService.updateProfileImage(USER_ID, file))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("지원하지 않는 파일 형식");
    }

    @Test
    @DisplayName("비밀번호 형식 검증 실패")
    void updatePassword_InvalidFormat_ThrowsException() {
        // given
        String weakPassword = "123";  // 너무 짧은 비밀번호

        // when & then
        assertThatThrownBy(() -> editService.updatePassword(USER_ID, weakPassword))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("8-20자");
    }

    @Test
    @DisplayName("특수문자가 없는 비밀번호 업데이트 실패")
    void updatePassword_NoSpecialCharacter_ThrowsException() {
        // given
        String noSpecialCharPassword = "password123";

        // when & then
        assertThatThrownBy(() -> editService.updatePassword(USER_ID, noSpecialCharPassword))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("특수문자");
    }
}