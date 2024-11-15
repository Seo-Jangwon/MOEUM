package com.weseethemusic.music.dto.playlist;

import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class TodayGenreListDto {

    List<RealTodayGenreDto> genres;

}
