package com.weseethemusic.recommendation.service.album;

import com.weseethemusic.common.dto.AlbumDto;
import com.weseethemusic.recommendation.common.entity.Album;
import com.weseethemusic.recommendation.repository.AlbumRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AlbumServiceImpl implements AlbumService {

    private final AlbumRepository albumRepository;

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(long albumId) {
        return albumRepository.existsById(albumId);
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void createAlbum(AlbumDto album) {
        Album newAlbum = new Album();
        newAlbum.setId(album.getId());
        newAlbum.setName(album.getName());
        newAlbum.setReleaseDate(album.getReleaseDate());
        newAlbum.setImageName(album.getImageName());
        albumRepository.save(newAlbum);
    }
}
