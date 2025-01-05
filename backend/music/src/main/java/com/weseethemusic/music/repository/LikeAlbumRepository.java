package com.weseethemusic.music.repository;

import com.weseethemusic.music.common.entity.Album;
import com.weseethemusic.music.common.entity.LikeAlbum;
import com.weseethemusic.music.common.entity.LikeAlbumId;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface LikeAlbumRepository extends JpaRepository<LikeAlbum, LikeAlbumId> {

    @Query("select la.album from LikeAlbum la where la.memberId = :memberId")
    List<Album> findAllByMemberId(long memberId);

    void deleteLikeAlbumByMemberIdAndAlbum_Id(Long memberId, Long albumId);

    boolean existsByMemberIdAndAlbum_Id(Long memberId, Long albumId);

}
