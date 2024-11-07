import { css } from '@emotion/react';
import React, { useRef } from 'react';
import { s_modal_container } from './style';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const isPlayList = useRef<boolean>(true);
  if (!isOpen) return null;

  return (
    <div css={s_modal_container} onClick={onClose}>
      <div
        css={css`
          background-color: #444;
          color: white;
          padding: 20px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          width: 20vw;
          height: 15vw;
          gap: 20px;
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h3>내 플레이리스트</h3>
        </div>
        <div>
          {isPlayList ? (
            <div>음악 데이터가 있습니다.</div>
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
