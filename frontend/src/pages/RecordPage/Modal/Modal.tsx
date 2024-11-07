import apiClient from '@/api/apiClient';
import lala from '@/assets/lalaticon/lala6.png';
import Button from '@/components/Button/Button';
import { css } from '@emotion/react';
import { HttpStatusCode } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { s_modal_box, s_modal_container } from './style';

interface ModalProps {
  id: number;
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

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, id }) => {
  const isPlayList = useRef<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [playlistTitle, setPlaylistTitle] = useState<string>('');

  useEffect(() => {
    apiClient({
      method: 'GET',
      url: '/musics/playlist',
    })
      .then((res) => {
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
                    css={css`
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      :hover > div > img {
                        filter: brightness(50%);
                        transition: 0.3s;
                      }
                    `}
                  >
                    <div
                      css={css`
                        width: 50px;
                        overflow: hidden;
                      `}
                    >
                      <img
                        src={lala}
                        alt="라라"
                        css={css`
                          width: 100%;
                          border-radius: 10px;
                        `}
                      />
                    </div>
                    <div
                      css={css`
                        display: flex;
                        flex-direction: column;
                        align-items: flex-end;
                        font-size: 14px;
                      `}
                    >
                      <h5>{item.title}</h5>
                      <p>{item.totalDuration}</p>
                      <p>{item.totalMusicCount} 곡</p>
                    </div>
                  </div>
                ))}
              </div>
              {isAdding ? (
                // 입력 필드와 저장, 취소 버튼
                <div
                  css={css`
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-top: 20px;
                  `}
                >
                  <input
                    type="text"
                    placeholder="플레이리스트 제목을 입력하세요"
                    value={playlistTitle}
                    onChange={(e) => setPlaylistTitle(e.target.value)}
                    css={css`
                      width: 100%;
                      padding: 8px;
                      border: 1px solid #ccc;
                      border-radius: 4px;
                    `}
                  />
                  <div
                    css={css`
                      display: flex;
                      justify-content: flex-end;
                      gap: 10px;
                    `}
                  >
                    <Button variant="grad" onClick={handleCreatePlayList}>
                      생성
                    </Button>
                    <Button variant="inverted" onClick={handleCancel}>
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                // '추가' 버튼
                <Button variant="grad" onClick={handleAddButtonClick}>
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
