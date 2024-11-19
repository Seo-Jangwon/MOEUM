import apiClient from '@/api/apiClient';
import DotDotDot from '@/components/DotDotDot/DotDotDot';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { FaRegHeart, FaRegTrashCan } from 'react-icons/fa6';
import { RiMenuAddLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal/Modal';
import {
  s_container,
  s_div_container,
  s_div_img,
  s_div_item,
  s_div_titie_img,
  s_div_title,
  s_h4,
  s_img,
  s_p,
} from './style';

interface Artist {
  id: number;
  name: string;
}

interface Record {
  id: number;
  name: string;
  albumImage: string;
  artists: Artist[];
  duration: string;
}

const RecordPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<Record[]>([]);
  const [isExist, setIsExist] = useState<boolean>(false);
  const navigate = useNavigate();
  
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

  const handleDelete = (id: number) => {
    apiClient({
      method: 'DELETE',
      url: `recommendations/history/${id}`,
    })
      .then((res) => {
        // console.log(res);
        setHistory((prevHistory) => prevHistory.filter((item) => item.id !== id));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    apiClient({
      method: 'GET',
      url: 'recommendations/history',
    })
      .then((res) => {
        if (res.data.code === 200) {
          setHistory(res.data.data);
          setIsExist(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // 모달 열기 함수
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    // 전체 레이아웃
    <div css={s_container}>
      {/* 최근 감상 기록 텍스트 */}
      <div css={s_div_title}>
        <h3>최근 감상 기록</h3>
      </div>
      {/* 최근 음악 데이터 */}
      <div css={s_div_container}>
        {!isExist ? (
          <div
            css={css`
              color: gray;
              font-size: 24px;
            `}
          >
            음악을 시청해 주세요^^
          </div>
        ) : (
          history.map((item, index) => (
            <>
              <div key={index} css={s_div_item}>
                {/* 이미지와 제목 */}
                <div css={s_div_titie_img} onClick={() => navigate(`/music?id=${item.id}`)}>
                  <div css={s_div_img}>
                    <img src={item.albumImage} alt="라라" css={s_img} />
                  </div>
                  <h4 css={s_h4}>{item.name}</h4>
                </div>
                {/* 아티스트 */}
                <p css={s_p}>{item.artists[0].name}</p>
                {/* 시간 */}
                <p css={s_p}>{item.duration}</p>
                {/* 드롭다운 */}
                <DotDotDot
                  data={[
                    {
                      iconImage: <FaRegHeart />,
                      text: '좋아요',
                      clickHandler: () => handleLike(item.id),
                      size: 20,
                    },
                    {
                      iconImage: <RiMenuAddLine />,
                      text: '플레이리스트 추가',
                      clickHandler: openModal,
                      size: 20,
                    },
                    {
                      iconImage: <FaRegTrashCan />,
                      text: '기록에서 삭제',
                      clickHandler: () => {
                        handleDelete(item.id);
                      },
                      size: 20,
                    },
                  ]}
                />
              </div>
              {/* 모달 컴포넌트 */}
              <Modal isOpen={isModalOpen} onClose={closeModal} musicId={item.musicId} />
            </>
          ))
        )}
      </div>
    </div>
  );
};

export default RecordPage;
