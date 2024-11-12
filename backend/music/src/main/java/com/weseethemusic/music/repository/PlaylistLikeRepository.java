package com.weseethemusic.music.repository;

import com.weseethemusic.music.common.entity.Playlist;
import com.weseethemusic.music.common.entity.PlaylistLike;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PlaylistLikeRepository extends JpaRepository<PlaylistLike, Long> {

    Optional<PlaylistLike> findByMemberIdAndPlaylistId(Long memberId, Long playlistId);

    boolean existsByMemberIdAndPlaylistId(Long memberId, Long playlistId);

    List<PlaylistLike> findByMemberId(Long memberId);

    @Query("select p from PlaylistLike p group by p.playlist.id order by count(*) desc limit 4")
    List<Playlist> getPopularPlaylists();

}
