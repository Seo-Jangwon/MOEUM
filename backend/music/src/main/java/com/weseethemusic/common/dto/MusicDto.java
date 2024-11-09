package com.weseethemusic.common.dto;

import com.weseethemusic.music.common.entity.Music;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
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

    public static MusicDto fromEntity(Music music) {
        return MusicDto.builder()
            .id(music.getId())
            .name(music.getName())
            .albumId(music.getAlbum().getId())
            .genreId(music.getGenre().getId())
            .duration(music.getDuration())
            .danceability(music.getDanceability())
            .loudness(music.getLoudness())
            .mode(music.isMode())
            .speechiness(music.getSpeechiness())
            .acousticness(music.getAcousticness())
            .valence(music.getValence())
            .tempo(music.getTempo())
            .energy(music.getEnergy())
            .build();
    }
}