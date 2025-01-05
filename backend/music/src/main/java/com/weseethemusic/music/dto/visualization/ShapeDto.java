package com.weseethemusic.music.dto.visualization;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShapeDto {

    private int section;
    private double time;
    private double y;
    private int height;
    private int width;
    private String[] effect;
    private int[] direction = new int[2];
    private String color;
    private int sides;
    private double angle;

}
