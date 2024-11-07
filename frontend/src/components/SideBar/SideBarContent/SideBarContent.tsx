import LightModeToggle from '@/components/Toggle/LightModeToggle/LightModeToggle';
import useAuthStore from '@/stores/authStore';
import { FiEye, FiX } from 'react-icons/fi';
import { IoMdSettings } from 'react-icons/io';
import { IoFileTrayStackedOutline } from 'react-icons/io5';

import apiClient from '@/api/apiClient';
import Modal from '@/components/Modal/RequestModal/RequestModal'

import { css } from '@emotion/react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as S from './SideBarContent.style';
import { s_item } from './SideBarContent.style';

interface SideBarContentProps {
  isOpen: boolean;
  closeHandler: () => void;
}

const SideBarContent = ({ isOpen, closeHandler }: SideBarContentProps) => {
  const { isLoggedIn } = useAuthStore();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const navigate = useNavigate();

  const sendRequest = () => {
    apiClient({
      method: 'POST',
      url: 'members/faq',
      data: {
        title: title,
        content: content,
      },
    })
      .then((res) => {
        if (res.data.code === 200) {
          alert('전송되었습니다.');
          closeModal(); // 모달 닫기
          navigate('/');
        } else {
          alert('오류가 발생하였습니다.');
        }
      })
      .catch((err) => {
        alert('오류가 발생하였습니다. 다시 시도해 주십시오');
        console.log(err);
      });
  };

  const closeModal = () => {
    setModalOpen(false);
    setTitle(''); // 제목 초기화
    setContent(''); // 내용 초기화
  };

  const editModal = {
    title: '1:1 문의',
    modalBody: (
      <>
        <input
          type="text"
          placeholder='제목을 적어주세요'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          css={css`
            width: 250%;
            padding: 8px;
            margin-bottom: 16px;
            border-radius: 6px;
          `}
        />
          <textarea
            value={content}
            placeholder='내용을 적어주세요'
            
            onChange={(e) => setContent(e.target.value)}
            css={css`
              width: 250%;
              padding: 8px;
              border-radius: 6px;

            `}
          />
      </>
    ),
    positiveButtonClickListener: sendRequest,
    negativeButtonClickListener: closeModal,
  };
  return (
    <S.Container className={isOpen ? 'open' : ''}>
      <S.Header>
        <S.CloseButton onClick={closeHandler}>
          <FiX size={32} />
        </S.CloseButton>
        <LightModeToggle />
      </S.Header>
      <div css={S.s_sidebar_items}>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 40px;
          `}
        >
          <Link to={'/record'} css={S.s_link_color}>
            <p css={s_item}>
              <FiEye color={'#F7309D'} />
              내가 본 음악
            </p>
          </Link>
          <Link to={'/myStorage'} css={S.s_link_color}>
            <p css={s_item}>
              <IoFileTrayStackedOutline color={'#30DDF7'} />내 보관함
            </p>
          </Link>
        </div>
        <div
          css={css`
            margin-top: -100px;
          `}
        >
          <Link to={'/settings'} css={S.s_link_color}>
            <p css={s_item}>
              <IoMdSettings color={'#30F751'} />
              설정
            </p>
          </Link>
        </div>

        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 15px;
          `}
        >
          <Link to={'/faq'} css={S.s_link_color2}>
            <p>FAQ</p>
          </Link>
          <Link to="#" css={S.s_link_color2} onClick={() => setModalOpen(true)}>
            <p>1:1 문의</p>
          </Link>
          {isLoggedIn ? (
            <Link to={'/signout'} css={S.s_link_color2}>
              <p>로그아웃</p>
            </Link>
          ) : (
            <Link to={'/signin'} css={S.s_link_color2}>
              <p>로그인</p>
            </Link>
          )}
        </div>
      </div>
      {modalOpen ? <Modal {...editModal} /> : null}
    </S.Container>
  );
};

export default SideBarContent;