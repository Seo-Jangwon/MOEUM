package com.weseethemusic.music.service.music;

import com.weseethemusic.music.dto.general.GeneralAlbumDto;
import com.weseethemusic.music.dto.general.GeneralDiscographyDto;
import com.weseethemusic.music.dto.general.GeneralMusicDto;
import com.weseethemusic.music.dto.general.GeneralPlaylistDto;
import com.weseethemusic.music.dto.playlist.TodayGenreListDto;
import com.weseethemusic.music.dto.search.ArtistImageDto;
import java.util.List;

public interface MusicService {

    List<GeneralMusicDto> getPopularMusics(Long memberId);

    List<GeneralMusicDto> getLatestMusics(Long memberId);

    List<GeneralDiscographyDto> getAllDiscography(long artistId, Long memberId);

    List<ArtistImageDto> getArtistLikes(long memberId);

    List<GeneralAlbumDto> getAlbumLikes(long memberId);

    List<GeneralPlaylistDto> getPopularPlaylists(Long memberId);

    TodayGenreListDto getGenres();

}
