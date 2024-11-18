import apiClient from '@/api/apiClient';
import DotDotDot from '@/components/DotDotDot/DotDotDot';
import { s_container } from '@/pages/MainPage/style';
import Modal from '@/pages/RecordPage/Modal/Modal';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { FaRegHeart } from 'react-icons/fa6';
import { PiPlaylist } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';

interface ListPageProps {
  title: string;
}

interface Artist {
  id: number;
  name: string;
}

interface Music {
  id: number;
  name: string;
  image: string;
  artists: Artist[];
}

const AllNewList = ({ title }: ListPageProps) => {
  const [newList, setNewList] = useState<Music[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [musicId, setMusicId] = useState<number>(0)
  const navigate = useNavigate()


  const openModal = (id: number) => {
    setIsModalOpen(true);
    setMusicId(id)
  };
  

  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleLike = (id: number) => {
    apiClient({
      method: 'POST',
      url: '/musics/music/like',
      data: { id },
    })
      .then((res) => {
        // console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePlayClick = (index: number) => {
    navigate(`/music?id=${index}`);
  };

  useEffect(() => {
    apiClient({
      method: 'GET',
      url: '/musics/latest',
    })
      .then((res) => {
        // console.log(res);
        if (res.data.code === 200) {
          setNewList(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div css={s_container}>
      {/* 전체 박스 */}
      <div>
        {/* {이름} 모두보기 div */}
        <div
          css={css`
            font-size: 36px;
            font-weight: 700;
            color: white;
            padding: 16px;
            @media (max-width: 768px) {
              font-size: 24px;
            }
          `}
        >
          <h3>{title} 전체보기</h3>
        </div>
        {/* 음악 데이터 박스*/}
        <div
          css={css`
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 10px;
          `}
        >
          {newList.map((item, index) => (
            <div key={index}>
              <button
                css={css`
                  background: transparent;
                  border: 0;
                  position: relative;
                  :hover::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    border-radius: 20px;
                  }

                  :hover > p {
                    opacity: 1;
                    transition: opacity 0.3s;
                  }
                `}
                onClick={(e) => {
                  e.stopPropagation()
                  handlePlayClick(item.id)}}
              >
                <img
                  src={item.image}
                  alt="라라"
                  css={css`
                    width: 100%;
                    border-radius: 20px;
                  `}
                />
                <div
                onClick={(e) => {
                  e.stopPropagation()
                }}
              css={css`
                position: absolute;
                z-index: 122;
                right: 10px;
                bottom: 20px;
                :hover {
                  background-color: #888;
                  border-radius: 100%;
                }
                @media (max-width: 768px) {
                  right: 5px;
                  bottom: 50px;
                }
                
              `}
            >
              <DotDotDot
                data={[
                  {
                    iconImage: <FaRegHeart />,
                    text: '좋아요',
                    clickHandler: () => {
                      handleLike(item.id); 
                    },
                    size: 20,
                  },
                  {
                    iconImage: <PiPlaylist />,
                    text: '플레이리스트 추가',
                    clickHandler: () => {
                      openModal(item.id);
                    },
                    size: 20,
                  },
                ]}
              />
            </div>
              </button>
              <p
                css={css`
                  font-size: 18px;
                  font-weight: 700;
                  color: white;
                  text-align: center;
                `}
              >
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} musicId={musicId} />

    </div>
  );
};

export default AllNewList;
