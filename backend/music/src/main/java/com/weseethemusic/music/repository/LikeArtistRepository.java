package com.weseethemusic.music.repository;

import com.weseethemusic.music.common.entity.Artist;
import com.weseethemusic.music.common.entity.LikeArtist;
import com.weseethemusic.music.common.entity.LikeArtistId;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface LikeArtistRepository extends JpaRepository<LikeArtist, LikeArtistId> {

    @Query("select la.artist from LikeArtist la where la.memberId = :memberId")
    List<Artist> findAllByMemberId(long memberId);

    void deleteByMemberIdAndArtist_Id(Long memberId, Long artistId);
    
}
