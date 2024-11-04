package com.weseethemusic.music.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@IdClass(ArtistMusicId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ArtistMusic {
    @Id
    @Column(name = "artist_id")
    private Long artistId;

    @Id
    @Column(name = "music_id")
    private Long musicId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artist_id", insertable = false, updatable = false)
    private Artist artist;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "music_id", insertable = false, updatable = false)
    private Music music;

}
