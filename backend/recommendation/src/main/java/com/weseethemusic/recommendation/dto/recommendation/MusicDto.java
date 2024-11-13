package com.weseethemusic.recommendation.dto.recommendation;

import com.weseethemusic.recommendation.dto.history.ArtistDto;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
public class MusicDto {

    private long id;
    private String title;
    private String duration;
    private String albumImage;
    private List<ArtistDto> artists;

}