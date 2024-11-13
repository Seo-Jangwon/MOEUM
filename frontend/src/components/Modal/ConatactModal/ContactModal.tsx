import apiClient from '@/api/apiClient';
import Modal from '@/components/Modal/RequestModal/RequestModal';
import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ContactModalProps {
  handleClose: () => void;
}

const ContactModal = ({ handleClose }: ContactModalProps) => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const navigate = useNavigate();

  const closeModal = () => {
    handleClose();
    setTitle(''); // 제목 초기화
    setContent(''); // 내용 초기화
  };
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
  return (
    <Modal title="1:1 문의" handleSubmit={sendRequest} handleClose={closeModal}>
      <input
        type="text"
        placeholder="제목을 적어주세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        css={css`
          width: 250%;
          padding: 8px;
          margin-bottom: 16px;
        `}
      />
      <textarea
        value={content}
        placeholder="내용을 적어주세요"
        onChange={(e) => setContent(e.target.value)}
        css={css`
          width: 250%;
          padding: 8px;
          border-radius: 6px;
          resize: none;
        `}
      />
    </Modal>
  );
};

export default ContactModal;
