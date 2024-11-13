package com.weseethemusic.music.repository;

import com.weseethemusic.music.common.entity.Album;
import com.weseethemusic.music.common.entity.Artist;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AlbumRepository extends JpaRepository<Album, Long> {

    @Query("select a from Album a where a.id in (select distinct b.album.id from Music b where b.id in (select c.music.id from ArtistMusic c where c.artist.id = :artistId))")
    List<Album> getDiscographyByArtist(Long artistId);

    @Query("select a.imageName from Album a where a.id = :albumId")
    String getAlbumImage(Long albumId);

    @Query("select a from Album a where a.name like concat('%', :keyword, '%') ")
    List<Album> findAllByName(String keyword, Pageable pageable);

    @Query("select distinct a.name from ArtistMusic am join Artist a on am.artist.id = a.id where am.music.id in (select m.id from Music m where m.album = :album)")
    List<Artist> getAlbumArtists(Album album);

}
