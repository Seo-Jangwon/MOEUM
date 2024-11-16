package com.weseethemusic.music.dto.detail;

import com.weseethemusic.music.dto.search.ArtistImageDto;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AlbumDetailDto {

    private long id;
    private String name;
    private String image;
    private String totalDuration;
    private String releaseDate;
    private List<ArtistImageDto> artists;
    private List<MusicImageDto> musics;

    @Builder
    public AlbumDetailDto(long id, String name, String image, String totalDuration,
        String releaseDate, List<ArtistImageDto> artists, List<MusicImageDto> musics) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.totalDuration = totalDuration;
        this.releaseDate = releaseDate;
        this.artists = artists;
        this.musics = musics;
    }

}
