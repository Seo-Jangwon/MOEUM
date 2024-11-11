package com.weseethemusic.common.dto;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AlbumDto {

    private long id;
    private String name;
    private Date releaseDate;
    private String imageName;

}
