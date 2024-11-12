package com.weseethemusic.music.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.weseethemusic.music.dto.visualization.MusicVisualizationDto;
import com.weseethemusic.music.dto.visualization.ShapeDto;
import com.weseethemusic.music.dto.visualization.TimeDurationDto;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class MusicVisualizationServiceImpl implements MusicVisualizationService {

    @Override
    public MusicVisualizationDto getMusicVisualization(long musicId) {
        ObjectMapper mapper = new ObjectMapper();
        MusicVisualizationDto result = new MusicVisualizationDto();

        try {
            JsonNode root = mapper.readTree(new File("./data.json"));
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

}
