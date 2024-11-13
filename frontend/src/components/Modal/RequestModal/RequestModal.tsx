import Button from '@/components/Button/Button';
import { css } from '@emotion/react';
import {
  s_cancelButtonContainer,
  s_fullScreenWithModal,
  s_modalBodyContainer,
  s_modalContainer,
  s_modalTitleContainer,
} from './style';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  handleSubmit: () => void;
  handleClose: () => void;
}

const Modal = ({ title, children, handleClose, handleSubmit }: ModalProps) => {
  return (
    <div css={s_fullScreenWithModal} onClick={handleClose}>
      <div css={s_modalContainer} onClick={(e) => e.stopPropagation()}>
        <div css={s_modalTitleContainer}>{title}</div>
        <div css={s_modalBodyContainer}>{children}</div>
        <div css={s_cancelButtonContainer}>
          <div
            css={css`
              display: flex;
              gap: 20px;
            `}
          >
            <Button variant="grad" children="전송" onClick={handleSubmit}></Button>
            <Button variant="outline" children="취소" onClick={handleClose}></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
