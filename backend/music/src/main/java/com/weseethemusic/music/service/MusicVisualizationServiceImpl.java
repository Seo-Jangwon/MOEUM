package com.weseethemusic.music.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.weseethemusic.music.dto.visualization.LyricDto;
import com.weseethemusic.music.dto.visualization.LyricListDto;
import com.weseethemusic.music.dto.visualization.MusicVisualizationDto;
import com.weseethemusic.music.dto.visualization.ShapeDto;
import com.weseethemusic.music.dto.visualization.TimeDurationDto;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class MusicVisualizationServiceImpl implements MusicVisualizationService {

    // 음악 시각화 데이터 불러오기
    @Override
    public MusicVisualizationDto getMusicVisualization(long musicId) {
        ObjectMapper mapper = new ObjectMapper();
        MusicVisualizationDto result = new MusicVisualizationDto();

        try {
            InputStream inputStream = getClass().getClassLoader().getResourceAsStream("data.json");

            if (inputStream == null) {
                throw new IllegalArgumentException("File not found: data.json");
            }

            JsonNode root = mapper.readTree(inputStream);
            JsonNode dataNode = root.path("data");

            List<TimeDurationDto> vibrations = new ArrayList<>();

            for (JsonNode vibrationNode : dataNode.path("vibrations")) {
                TimeDurationDto timeDurationDto = mapper.treeToValue(vibrationNode,
                    TimeDurationDto.class);
                vibrations.add(timeDurationDto);
            }

            result.setVibrations(vibrations);

            List<ShapeDto> notes = new ArrayList<>();

            for (JsonNode noteNode : dataNode.path("notes")) {
                ShapeDto shapeDto = mapper.treeToValue(noteNode, ShapeDto.class);
                notes.add(shapeDto);
            }

            result.setNotes(notes);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return result;
    }

    // 가사 시각화 데이터 불러오기
    public LyricListDto getMusicLyrics(long musicId) {
        ObjectMapper mapper = new ObjectMapper();
        LyricListDto result = new LyricListDto();

        try {
            InputStream inputStream = getClass().getClassLoader()
                .getResourceAsStream("lyrics.json");

            if (inputStream == null) {
                throw new IllegalArgumentException("File not found: lyrics.json");
            }

            JsonNode root = mapper.readTree(inputStream);
            JsonNode dataNode = root.path("data");

            List<LyricDto> lyrics = new ArrayList<>();

            for (JsonNode lyricNode : dataNode.path("lyrics")) {
                LyricDto lyricDto = mapper.treeToValue(lyricNode, LyricDto.class);
                lyrics.add(lyricDto);
            }

            result.setLyrics(lyrics);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return result;
    }
}
