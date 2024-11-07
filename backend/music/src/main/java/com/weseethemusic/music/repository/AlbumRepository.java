package com.weseethemusic.music.repository;

import com.weseethemusic.music.common.entity.Album;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AlbumRepository extends JpaRepository<Album, Long> {

    @Query("select a from Album a where a.id in (select distinct b.album.id from Music b where b.id in (select c.music.id from ArtistMusic c where c.artist.id = :artistId))")
    List<Album> getDiscographyByArtist(Long artistId);

}
