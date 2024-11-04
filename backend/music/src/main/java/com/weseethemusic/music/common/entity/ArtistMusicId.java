package com.weseethemusic.music.common.entity;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class ArtistMusicId implements Serializable {

    private Long artistId;
    private Long musicId;

}
