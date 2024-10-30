import { ReactNode, useEffect } from 'react';
import {
  s_button,
  s_cancelButtonContainer,
  s_fullScreenWithModal,
  s_modalBodyContainer,
  s_modalContainer,
  s_modalTitleContainer,
} from './Modal.style';

interface profileModalProps {
  title: string;
  modalBody: ReactNode;
  negativeButtonClickListener: () => void;
  positiveButtonClickListener: () => void;
}

const Modal = ({
  title,
  modalBody,
  positiveButtonClickListener,
  negativeButtonClickListener,
}: profileModalProps) => {
  return (
    <form>
      <div onClick={negativeButtonClickListener} css={s_fullScreenWithModal}></div>
      <div css={s_modalContainer}>
        <div css={s_modalTitleContainer}>{title}</div>
        <div css={s_modalBodyContainer}>{modalBody}</div>
        <div css={s_cancelButtonContainer}>
          <button
            type="submit"
            css={s_button}
            onClick={(e) => {
              e.preventDefault();
              positiveButtonClickListener();
            }}
          >
            확인
          </button>
          <button
            type="button"
            css={s_button}
            onClick={(e) => {
              e.preventDefault();
              negativeButtonClickListener();
            }}
          >
            취소
          </button>
        </div>
      </div>
    </form>
  );
};

export default Modal;
