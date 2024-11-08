package com.weseethemusic.common.dto;

import com.weseethemusic.recommendation.common.entity.Music;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MusicDto {

    private long id;
    private String name;
    private long albumId;
    private int genreId;
    private int duration;

    private double danceability;
    private double loudness;
    private boolean mode;
    private double speechiness;
    private double acousticness;
    private double valence;
    private double tempo;
    private double energy;

}