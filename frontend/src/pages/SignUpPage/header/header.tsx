import { css } from '@emotion/react';
import logo from '../image/logo.png';
import user from '../image/user.png';

const header = () => {
  return (
    <div>
      <div
        css={css`
          height: 85px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 80px;
        `}
      >
        <img src={logo} alt="로고" />
        <img src={user} alt="user" />
      </div>
    </div>
  );
};

export default header;
