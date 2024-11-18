package com.weseethemusic.music.service.musicVisualization;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jose.shaded.gson.Gson;
import com.nimbusds.jose.shaded.gson.JsonArray;
import com.nimbusds.jose.shaded.gson.JsonObject;
import com.nimbusds.jose.shaded.gson.JsonParser;
import com.weseethemusic.music.common.service.S3Service;
import com.weseethemusic.music.dto.visualization.BackgroundDto;
import com.weseethemusic.music.dto.visualization.LyricDto;
import com.weseethemusic.music.dto.visualization.LyricListDto;
import com.weseethemusic.music.dto.visualization.MusicVisualizationDto;
import com.weseethemusic.music.dto.visualization.ShapeDto;
import com.weseethemusic.music.dto.visualization.TimeDurationDto;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MusicVisualizationServiceImpl implements MusicVisualizationService {

    private final S3Service s3Service;

    // 음악 시각화 데이터 불러오기
    @Override
    public MusicVisualizationDto getMusicVisualization(long musicId) {
        MusicVisualizationDto result = new MusicVisualizationDto();

        if (musicId != 713 && musicId != 2510 && musicId != 145) {
            musicId = 713;
        }

        String jsonString = s3Service.readJsonFile(musicId + ".json");

        Gson gson = new Gson();
        JsonObject root = JsonParser.parseString(jsonString).getAsJsonObject();
        JsonObject dataNode = root.getAsJsonObject("data");

        List<BackgroundDto> backgrounds = new ArrayList<>();
        JsonArray backgroundsArray = dataNode.getAsJsonArray("backgrounds");

        for (int i = 0; i < backgroundsArray.size(); i++) {
            BackgroundDto backgroundDto = gson.fromJson(backgroundsArray.get(i),
                BackgroundDto.class);
            String[] colors = backgroundDto.getColor().split(",");

            // TODO: rabbitMQ로 Calibration 설정 불러오기

            String leftColor = "";
            String rightColor = "";

            leftColor = switch (colors[0]) {
                case "Happy" -> "hsla(56, 100%, 49%, 1)";
                case "Content" -> "hsla(133, 100%, 36%, 1)";
                case "Sad" -> "hsla(241, 100%, 18%, 1)";
                default -> "hsla(270, 100%, 24%, 1)";
            };

            rightColor = switch (colors[1]) {
                case "Silent" -> "hsla(216, 100%, 11%, 1)";
                case "Quiet" -> "hsla(192, 100%, 36%, 1)";
                case "Loud" -> "hsla(10, 100%, 37%, 1)";
                default -> "hsla(320, 100%, 37%, 1)";
            };

            String color = rightColor;
            backgroundDto.setColor(color);

            backgrounds.add(backgroundDto);
        }

        result.setBackgrounds(backgrounds);

        List<TimeDurationDto> vibrations = new ArrayList<>();
        JsonArray vibrationsArray = dataNode.getAsJsonArray("vibrations");

        for (int i = 0; i < vibrationsArray.size(); i++) {
            TimeDurationDto timeDurationDto = gson.fromJson(vibrationsArray.get(i),
                TimeDurationDto.class);

            vibrations.add(timeDurationDto);
        }

        result.setVibrations(vibrations);

        List<ShapeDto> notes = new ArrayList<>();
        JsonArray notesArray = dataNode.getAsJsonArray("notes");

        for (int i = 0; i < notesArray.size(); i++) {
            ShapeDto shapeDto = gson.fromJson(notesArray.get(i), ShapeDto.class);
            notes.add(shapeDto);
        }

        result.setNotes(notes);

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
