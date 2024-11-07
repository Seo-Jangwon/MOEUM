import Button from '@/components/Button/Button';
import { css } from '@emotion/react';
import { ReactNode } from 'react';
import {
  s_cancelButtonContainer,
  s_fullScreenWithModal,
  s_modalBodyContainer,
  s_modalContainer,
  s_modalTitleContainer,
} from './style';

interface ModalProps {
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
}: ModalProps) => {
  return (
    <div css={s_fullScreenWithModal} onClick={negativeButtonClickListener}>
      <div css={s_modalContainer} onClick={(e) => e.stopPropagation()}>
        <div css={s_modalTitleContainer}>{title}</div>
        <div css={s_modalBodyContainer}>{modalBody}</div>
        <div css={s_cancelButtonContainer}>
          <div
            css={css`
              display: flex;
              gap: 20px;
            `}
          >
            <Button
              variant="grad"
              children="전송"
              onClick={(e) => {
                e.preventDefault();
                positiveButtonClickListener();
              }}
            ></Button>
            <Button
              variant="outline"
              children="취소"
              onClick={(e) => {
                e.preventDefault();
                negativeButtonClickListener();
              }}
            ></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
