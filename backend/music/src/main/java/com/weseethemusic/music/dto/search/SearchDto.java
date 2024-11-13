package com.weseethemusic.music.dto.search;

import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SearchDto {

    private List<MusicDto> musics = new ArrayList<>(5);
    private List<AlbumDto> albums = new ArrayList<>(5);
    private List<ArtistImageDto> artists = new ArrayList<>(5);
    private List<PlaylistDto> playlists = new ArrayList<>(5);

}
