package com.weseethemusic.music.common.entity;

import jakarta.persistence.Id;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "playlist_music")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PlaylistMusic {

    @Id
    private String id;
    private Long playlistId;
    private Long musicId;
    private double order;
    private LocalDateTime addedAt;
}
