package com.weseethemusic.music.common.entity;

import com.weseethemusic.music.common.listener.MusicEntityListener;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import java.util.HashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(MusicEntityListener.class)
public class Music {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "album_id", nullable = false)
    private Album album;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "genre_id", nullable = false)
    private Genre genre;

    @Column(nullable = false)
    private int duration;

    @OneToMany(mappedBy = "music", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ArtistMusic> artistMusics = new HashSet<>();

    public void addArtist(Artist artist) {
        ArtistMusic artistMusic = new ArtistMusic(artist, this);
        artistMusics.add(artistMusic);
    }

    public void removeArtist(Artist artist) {
        artistMusics.removeIf(am -> am.getArtist().equals(artist));
    }

    private double danceability;
    private double loudness;
    private boolean mode;
    private double speechiness;
    private double acousticness;
    private double valence;
    private double tempo;
    private double energy;

}
