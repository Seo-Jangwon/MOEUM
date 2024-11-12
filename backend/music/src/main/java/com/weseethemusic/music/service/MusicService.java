package com.weseethemusic.music.service;

import com.weseethemusic.music.dto.general.GeneralAlbumDto;
import com.weseethemusic.music.dto.general.GeneralDiscographyDto;
import com.weseethemusic.music.dto.general.GeneralMusicDto;
import com.weseethemusic.music.dto.search.ArtistImageDto;
import java.util.List;

public interface MusicService {

    List<GeneralMusicDto> getPopularMusics();

    List<GeneralMusicDto> getLatestMusics();

    List<GeneralDiscographyDto> getAllDiscography(long artistId);

    List<ArtistImageDto> getArtistLikes(long memberId);

    List<GeneralAlbumDto> getAlbumLikes(long memberId);
    
}
