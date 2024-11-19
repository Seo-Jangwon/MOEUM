package com.weseethemusic.music.repository;

import com.weseethemusic.music.common.entity.PlaylistMusic;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaylistMusicRepository extends MongoRepository<PlaylistMusic, String> {

    List<PlaylistMusic> findByPlaylistIdOrderByOrder(Long playlistId);

    void deleteByPlaylistId(Long playlistId);

    Optional<PlaylistMusic> findTopByPlaylistIdOrderByOrderDesc(Long playlistId);

}