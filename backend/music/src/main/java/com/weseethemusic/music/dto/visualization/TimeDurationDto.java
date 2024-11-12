package com.weseethemusic.music.dto.visualization;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class TimeDurationDto {

    private double time;
    private double duration;

}
