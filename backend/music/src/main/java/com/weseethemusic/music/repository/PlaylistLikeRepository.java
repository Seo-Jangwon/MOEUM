package com.weseethemusic.music.repository;

import com.weseethemusic.music.common.entity.Playlist;
import com.weseethemusic.music.common.entity.PlaylistLike;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaylistLikeRepository extends JpaRepository<PlaylistLike, Long> {

    Optional<PlaylistLike> findByMemberIdAndPlaylistId(Long memberId, Long playlistId);

    List<PlaylistLike> findByMemberId(Long memberId);

    @Query("select pl.playlist from PlaylistLike pl group by pl.playlist.id order by count(*) desc limit 5")
    List<Playlist> getPopularPlaylists();

    void deleteByPlaylistId(Long playlistId);

    boolean existsByMemberIdAndPlaylist_Id(Long memberId, Long playlistId);
}
