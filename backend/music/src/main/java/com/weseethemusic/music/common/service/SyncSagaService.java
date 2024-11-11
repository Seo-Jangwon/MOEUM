package com.weseethemusic.music.common.service;


import com.weseethemusic.common.dto.AlbumDto;
import com.weseethemusic.common.dto.ArtistDto;
import com.weseethemusic.common.dto.GenreDto;
import com.weseethemusic.common.dto.MusicDto;
import com.weseethemusic.common.event.AlbumSyncEvent;
import com.weseethemusic.common.event.ArtistSyncEvent;
import com.weseethemusic.common.event.GenreSyncEvent;
import com.weseethemusic.common.event.MusicSyncEvent;
import com.weseethemusic.music.common.entity.SyncSagaForRecommendation;
import com.weseethemusic.music.common.entity.SyncSagaForRecommendation.OperationType;
import com.weseethemusic.music.common.publisher.MusicEventPublisher;
import com.weseethemusic.music.repository.AlbumRepository;
import com.weseethemusic.music.repository.ArtistRepository;
import com.weseethemusic.music.repository.GenreRepository;
import com.weseethemusic.music.repository.MusicRepository;
import com.weseethemusic.music.repository.SyncSagaRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class SyncSagaService {

    private final SyncSagaRepository sagaRepository;
    private final MusicEventPublisher eventPublisher;
    private final MusicRepository musicRepository;
    private final GenreRepository genreRepository;
    private final AlbumRepository albumRepository;
    private final ArtistRepository artistRepository;

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public SyncSagaForRecommendation startGenreSync(int genreId,
        SyncSagaForRecommendation.OperationType operation) {
        SyncSagaForRecommendation saga = SyncSagaForRecommendation.startGenreSync(
            Integer.toUnsignedLong(genreId), operation);
        return sagaRepository.save(saga);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public SyncSagaForRecommendation startMusicSync(Long musicId,
        SyncSagaForRecommendation.OperationType operation) {
        SyncSagaForRecommendation saga = SyncSagaForRecommendation.startMusicSync(musicId,
            operation);
        return sagaRepository.save(saga);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public SyncSagaForRecommendation startArtistSync(Long artistId,
        SyncSagaForRecommendation.OperationType operation) {
        SyncSagaForRecommendation saga = SyncSagaForRecommendation.startArtistSync(artistId,
            operation);
        return sagaRepository.save(saga);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public SyncSagaForRecommendation startAlbumSync(Long albumId,
        SyncSagaForRecommendation.OperationType operation) {
        SyncSagaForRecommendation saga = SyncSagaForRecommendation.startAlbumSync(albumId,
            operation);
        return sagaRepository.save(saga);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void setSagaSent(String sagaId) {
        sagaRepository.findBySagaId(sagaId)
            .ifPresentOrElse(
                saga -> {
                    saga.markSent();
                    sagaRepository.save(saga);
                },
                () -> {
                    log.error("전송 처리할 saga를 찾을 수 없음: {}", sagaId);
                    throw new RuntimeException("전송 처리할 saga를 찾을 수 없음: " + sagaId);
                }
            );
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void completeSaga(String sagaId) {
        sagaRepository.findBySagaId(sagaId)
            .ifPresentOrElse(
                saga -> {
                    saga.complete();
                    sagaRepository.save(saga);
                },
                () -> {
                    log.error("완료처리할 saga를 찾을 수 없음: {}", sagaId);
                    throw new RuntimeException("완료처리할 saga를 찾을 수 없음: " + sagaId);
                }
            );
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void failSaga(String sagaId, String errorMessage) {
        sagaRepository.findBySagaId(sagaId)
            .ifPresentOrElse(
                saga -> {
                    saga.fail(errorMessage);
                    sagaRepository.save(saga);
                },
                () -> {
                    log.error("실패 처리할 saga를 찾을 수 없음: {}", sagaId);
                    throw new RuntimeException("실패 처리할 saga를 찾을 수 없음: " + sagaId);
                }
            );
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void handleGenreNotFound(String sagaId, int genreId, String errorMessage) {
        sagaRepository.findBySagaId(sagaId).ifPresent(saga -> {
            // 장르를 찾아서 다시 동기화 시도
            genreRepository.findById(genreId).ifPresent(genre -> {
                // 장르 동기화 이벤트 발행
                SyncSagaForRecommendation genreSaga = startGenreSync(genreId, OperationType.CREATE);
                eventPublisher.publishGenreEvent(new GenreSyncEvent(
                    GenreSyncEvent.EventType.STARTED,
                    GenreDto.fromEntity(genre),
                    genreSaga.getSagaId()
                ));

                // 장르 동기화가 완료되면 음악도 다시 동기화
                musicRepository.findById(saga.getTargetId()).ifPresent(music -> {
                    SyncSagaForRecommendation musicSaga = startMusicSync(music.getId(),
                        OperationType.CREATE);
                    eventPublisher.publishMusicEvent(new MusicSyncEvent(
                        MusicSyncEvent.EventType.STARTED,
                        MusicDto.fromEntity(music),
                        musicSaga.getSagaId(),
                        null
                    ));
                });
            });
            saga.fail(errorMessage); // 현재의 saga는 실패 처리
            sagaRepository.save(saga);
        });
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void handleAlbumNotFound(String sagaId, long albumId, String errorMessage) {
        sagaRepository.findBySagaId(sagaId).ifPresent(saga -> {
            // 앨범을 찾아서 다시 동기화 시도
            albumRepository.findById(albumId).ifPresent(album -> {
                // 앨범 동기화 이벤트 발행
                SyncSagaForRecommendation albumSaga = startAlbumSync(albumId, OperationType.CREATE);
                eventPublisher.publishAlbumEvent(new AlbumSyncEvent(
                    AlbumSyncEvent.EventType.STARTED,
                    AlbumDto.fromEntity(album),
                    albumSaga.getSagaId()
                ));

                // 앨범 동기화가 완료되면 음악도 다시 동기화
                musicRepository.findById(saga.getTargetId()).ifPresent(music -> {
                    SyncSagaForRecommendation musicSaga = startMusicSync(music.getId(),
                        OperationType.CREATE);
                    eventPublisher.publishMusicEvent(new MusicSyncEvent(
                        MusicSyncEvent.EventType.STARTED,
                        MusicDto.fromEntity(music),
                        musicSaga.getSagaId(),
                        null
                    ));
                });
            });
            saga.fail(errorMessage); // 현재의 saga는 실패 처리
            sagaRepository.save(saga);
        });
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void handleArtistNotFound(String sagaId, List<Long> artistIds, String errorMessage) {
        sagaRepository.findBySagaId(sagaId).ifPresent(saga -> {
            // 각 아티스트를 찾아서 다시 동기화 시도
            for (Long artistId : artistIds) {
                artistRepository.findById(artistId).ifPresent(artist -> {
                    // 아티스트 동기화 이벤트 발행
                    SyncSagaForRecommendation artistSaga = startArtistSync(artistId,
                        OperationType.CREATE);
                    eventPublisher.publishArtistEvent(new ArtistSyncEvent(
                        ArtistSyncEvent.EventType.STARTED,
                        ArtistDto.fromEntity(artist),
                        artistSaga.getSagaId()
                    ));
                });
            }

            // 모든 아티스트 동기화 이벤트를 발행한 후 음악도 다시 동기화
            musicRepository.findById(saga.getTargetId()).ifPresent(music -> {
                SyncSagaForRecommendation musicSaga = startMusicSync(music.getId(),
                    OperationType.CREATE);
                eventPublisher.publishMusicEvent(new MusicSyncEvent(
                    MusicSyncEvent.EventType.STARTED,
                    MusicDto.fromEntity(music),
                    musicSaga.getSagaId(), null
                ));
            });

            saga.fail(errorMessage); // 현재의 saga는 실패 처리
            sagaRepository.save(saga);
        });
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void handleError(String sagaId, String errorMessage) {
        log.error("음악 동기화 완전히 실패. saga 실패, sagaId={}. errorMessage={}", sagaId, errorMessage);
        failSaga(sagaId, errorMessage);
    }
}