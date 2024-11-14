import apiClient from '@/api/apiClient';
import lala from '@/assets/lalaticon/lala6.png';
import Button from '@/components/Button/Button';
import { css } from '@emotion/react';
import { HttpStatusCode } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
  s_button,
  s_button_input,
  s_button_position,
  s_div_img,
  s_div_playlist_item_container,
  s_img,
  s_modal_box,
  s_modal_container,
  s_playlist_data,
  s_plus_button,
} from './style';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mokData = {
  code: 200,
  data: {
    playlists: [
      {
        id: 1,
        title: '플레이리스트 1',
        image: '/apt.png',
        totalDuration: '1시간 23분',
        totalMusicCount: 20,
      },
      {
        id: 2,
        title: '플레이리스트 2',
        image: '/mantra.png',
        totalDuration: '2시간 34분',
        totalMusicCount: 40,
      },
      {
        id: 2,
        title: '플레이리스트 2',
        image: '/mantra.png',
        totalDuration: '2시간 34분',
        totalMusicCount: 40,
      },
    ],
  },
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const isPlayList = useRef<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [playlistTitle, setPlaylistTitle] = useState<string>('');

  useEffect(() => {
    apiClient({
      method: 'GET',
      url: '/musics/playlist',
    })
      .then((res) => {
        console.log(res);
        if (res.status === HttpStatusCode.Ok) {
          console.log(res);
        } else if (res.data.code === 500) {
          alert('내부 서버 오류입니다.');
        } else {
          alert('알 수 없는 오류입니다.');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleAddButtonClick = () => {
    setIsAdding(true);
  };

  const handleCreatePlayList = () => {
    if (playlistTitle.trim()) {
      apiClient({
        method: 'POST',
        url: '/musics/playlist/create',
        data: { title: playlistTitle, music: [] },
      })
        .then((res) => {
          if (res.status === HttpStatusCode.Ok) {
            console.log(res);
            setIsAdding(false);
            setPlaylistTitle('');
          } else if (res.data.code === 500) {
            alert('내부 서버 오류입니다.');
          } else {
            alert('알 수 없는 오류입니다.');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert('플레이리스트 제목을 입력해주세요.');
    }
  };

  const handleAddPlayList = (id: number) => {
    apiClient({
      method: 'GET',
      url: `/musics/playlist/detail/${id}`,
    })
      .then((res) => {
        console.log(res);
        if (res.status === HttpStatusCode.Ok) {
          console.log(res);
        } else {
          alert('테스트 중입니다.');
        }
      })
      .catch((err) => {
        console.log(err);
        alert('테스트 중입니다.');
      });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setPlaylistTitle('');
  };

  if (!isOpen) return null;

  return (
    <div css={s_modal_container} onClick={onClose}>
      <div css={s_modal_box} onClick={(e) => e.stopPropagation()}>
        <div>
          <h3
            css={css`
              font-size: 24px;
              font-weight: 800;
              color: pink;
            `}
          >
            내 플레이리스트
          </h3>
        </div>
        <div>
          {isPlayList ? (
            <>
              <div
                css={css`
                  display: flex;
                  flex-direction: column;
                  gap: 20px;
                `}
              >
                {mokData.data.playlists.map((item, index) => (
                  <div
                    key={index}
                    css={s_div_playlist_item_container}
                    onClick={() => {
                      handleAddPlayList(item.id);
                    }}
                  >
                    <div css={s_div_img}>
                      <img src={lala} alt="라라" css={s_img} />
                    </div>
                    <div css={s_playlist_data}>
                      <h5>{item.title}</h5>
                      <p>{item.totalDuration}</p>
                      <p>{item.totalMusicCount} 곡</p>
                    </div>
                  </div>
                ))}
              </div>
              {isAdding ? (
                <div css={s_button}>
                  <input
                    type="text"
                    placeholder="플레이리스트 제목을 입력하세요"
                    value={playlistTitle}
                    onChange={(e) => setPlaylistTitle(e.target.value)}
                    css={s_button_input}
                  />
                  <div css={s_button_position}>
                    <Button variant="grad" onClick={handleCreatePlayList}>
                      생성
                    </Button>
                    <Button variant="inverted" onClick={handleCancel}>
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <Button variant="grad" onClick={handleAddButtonClick} css={s_plus_button}>
                  추가
                </Button>
              )}
            </>
          ) : (
            <div>
              <p>음악리스트가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
