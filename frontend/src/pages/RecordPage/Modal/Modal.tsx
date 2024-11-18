import apiClient from '@/api/apiClient';
import lala from '@/assets/lalaticon/lala6.png';
import Button from '@/components/Button/Button';
import { css } from '@emotion/react';
import React, { useEffect, useRef, useState } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';
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
  musicId: number;
}

interface Playlist {
  id: number;
  name: string;
  image: string;
  totalDuration: string;
  totalMusicCount: number;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, musicId }) => {
  const isPlayList = useRef<boolean>(true);
  // const [isExist, setIsExist] = useState<boolean>(false)
  const [myPlayList, setMyPlayList] = useState<Playlist[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [playlistTitle, setPlaylistTitle] = useState<string>('');

  const handleAddButtonClick = () => {
    setIsAdding(true);
  };

  const handleCreatePlayList = () => {
    if (playlistTitle.trim()) {
      apiClient({
        method: 'POST',
        url: '/musics/playlist/create',
        data: { title: playlistTitle, musics: [] },
      })
        .then((res) => {
          if (res.data.code === 200) {
            console.log(res);
            setIsAdding(false);
            setPlaylistTitle('');
            fetchPlaylists();
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

  const fetchPlaylists = () => {
    apiClient({
      method: 'GET',
      url: '/musics/playlist/create',
    })
      .then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          console.log(res);
          setMyPlayList(res.data.data.musics);
          console.log(myPlayList);
        } else if (res.data.code === 500) {
          alert('내부 서버 오류입니다.');
        } else {
          alert('알 수 없는 오류입니다.');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleDeletePlayList = (id: number) => {
    apiClient({
      method: 'DELETE',
      url: `/musics/playlist/delete/${id}`,
    })
      .then((res) => {
        console.log(res);
        setMyPlayList((prevPlaylists) => prevPlaylists.filter((playlist) => playlist.id !== id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddPlayList = (id: number) => {
    apiClient({
      method: 'POST',
      url: `/musics/playlist/${id}/add/${musicId}`,
    })
      .then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          alert('플레이리스트에 추가되었습니다.');
          fetchPlaylists();
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
                {myPlayList.map((item, index) => (
                  <div
                    key={index}
                    css={s_div_playlist_item_container}
                    onClick={() => {
                      handleAddPlayList(item.id);
                    }}
                  >
                    <div css={s_div_img}>
                      <img src={item.image} alt="라라" css={s_img} />
                    </div>
                    <div
                      css={css`
                        display: flex;
                        align-items: center;
                        gap: 5px;
                      `}
                    >
                      <div css={s_playlist_data}>
                        <h5>{item.name}</h5>
                        <p>{item.totalDuration}</p>
                        <p>{item.totalMusicCount} 곡</p>
                      </div>
                      <div
                        css={css`
                          margin-left: 5px;
                          :hover {
                            color: red;
                          }
                        `}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePlayList(item.id);
                        }}
                      >
                        <RiDeleteBin6Line />
                      </div>
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
                <div css={s_plus_button}>
                  <Button variant="grad" onClick={handleAddButtonClick}>
                    추가
                  </Button>
                </div>
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
