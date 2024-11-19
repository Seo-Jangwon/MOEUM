package com.weseethemusic.recommendation.dto.history;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ArtistDto {

    private long id;
    private String name;

}
