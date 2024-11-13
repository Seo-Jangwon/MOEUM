package com.weseethemusic.recommendation.service.artist;

import com.weseethemusic.common.dto.ArtistDto;
import com.weseethemusic.recommendation.common.entity.Artist;
import com.weseethemusic.recommendation.repository.ArtistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ArtistServiceImpl implements ArtistService {

    private final ArtistRepository artistRepository;

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void createArtist(ArtistDto artist) {
        Artist newArtist = new Artist();
        newArtist.setId(artist.getId());
        newArtist.setName(artist.getName());
        newArtist.setImageName(artist.getImageName());
        artistRepository.save(newArtist);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(long id) {
        return artistRepository.existsById(id);
    }
}
