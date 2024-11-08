package com.weseethemusic.music.repository;

import com.weseethemusic.music.common.entity.Music;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MusicRepository extends JpaRepository<Music, Long> {

    List<Music> findAllByAlbum_Id(Long albumId);

    @Query("select distinct a from Music a join LikeMusic b on a.id = b.music.id join ArtistMusic c on a.id = c.music.id where c.artist.id = :artistId group by a.id order by count(*) desc, a.id asc")
    List<Music> getPopularByArtist(@Param("artistId") Long artistId, Pageable pageable);

    @Query("select m from Music m join Album a on m.album.id = a.id order by a.releaseDate desc limit 10")
    List<Music> getLatestMusics();

}
