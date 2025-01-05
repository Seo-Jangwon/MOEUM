package com.weseethemusic.music.dto.visualization;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class TimeDurationDto {

    private double time;
    private double duration;

}
