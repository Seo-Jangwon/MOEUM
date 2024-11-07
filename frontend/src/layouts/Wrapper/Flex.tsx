import { css } from '@emotion/react';

const s_wrapper = css`
  display: flex;
  justify-content: center;
  padding: 80px;
`;

const Flex = ({ children }: { children: React.ReactNode }) => {
  return <div css={s_wrapper}>{children}</div>;
};

export default Flex;
