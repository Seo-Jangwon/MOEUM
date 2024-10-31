package com.weseethemusic.member.common.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.Duration;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;


@Slf4j
@Service
public class S3Service {

    // S3 클라이언트
    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    // S3 버킷 이름
    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    // S3 클라이언트 주입
    public S3Service(S3Client s3Client, S3Presigner s3Presigner) {
        this.s3Client = s3Client;
        this.s3Presigner = s3Presigner;
    }

    /**
     * S3 버킷에서 파일을 삭제
     *
     * @param fileUrl 삭제할 파일의 S3 URL
     */
    public void deleteFile(String fileUrl) {
        try {
            String key = extractKeyFromUrl(fileUrl);
            if (key != null && !key.isEmpty()) {
                s3Client.deleteObject(DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build());
                log.info("Successfully deleted file with key: {}", key);
            } else {
                log.warn("Unable to delete file. Invalid URL: {}", fileUrl);
            }
        } catch (Exception e) {
            log.error("Error deleting file from S3: {}", fileUrl, e);
        }
    }

    /**
     * S3 URL에서 키를 추출
     *
     * @param fileUrl S3 URL
     * @return 추출된 키
     */
    public String extractKeyFromUrl(String fileUrl) {
        try {
            URL url = new URL(fileUrl);
            String path = url.getPath();
            return path.startsWith("/") ? path.substring(1) : path;
        } catch (MalformedURLException e) {
            log.error("Invalid S3 URL: {}", fileUrl, e);
            return fileUrl; // URL 파싱 실패시 원본 값 사용
        }
    }

    /**
     * PresignedURL 생성
     *
     * @param objectKey S3 객체 키
     * @return 생성된 presignedUrl
     */
    public String generatePresignedUrl(String objectKey) {
        try {
            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(121)) // 2시간 1분동안 유효
                .getObjectRequest(req -> req.bucket(bucketName).key(objectKey))
                .build();

            return s3Presigner.presignGetObject(presignRequest).url().toString();
        } catch (Exception e) {
            log.error("key {}에 대한 presignedUrl 생성 불가", objectKey, e);
            return null;
        }
    }

    public String uploadFile(MultipartFile file, String fileName) {
        try {
            // PutObjectRequest 생성
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .contentType(file.getContentType())
                .build();

            // RequestBody 생성
            RequestBody requestBody = RequestBody.fromInputStream(
                file.getInputStream(),
                file.getSize()
            );

            // 파일 업로드
            s3Client.putObject(putObjectRequest, requestBody);

            // S3 URL 반환
            return String.format("https://%s.s3.amazonaws.com/%s", bucketName, fileName);

        } catch (IOException e) {
            log.error("파일 업로드 실패: {}", fileName, e);
            throw new RuntimeException("파일 업로드에 실패했습니다.", e);
        }
    }

}