import { css, Theme } from '@emotion/react';
import styled from '@emotion/styled';

export const s_container = (theme: Theme) => css`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  justify-self: center;
  gap: 48px;
  color: ${theme.colors.white};
  width: 30rem;
  @media screen and (max-width: 768px) {
    width: 100%;
    padding: 0 24px;
  }
`;

export const s_content = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  text-align: center;
  width: 100%;
`;

export const s_error_box = css`
  align-items: center;
  background: #ff0000;
  color: #fff;
  border-radius: 4px;
  display: flex;
  font-size: 18px;
  padding: 4px;
  padding-left: 16px;
  gap: 8px;
`;

export const s_button = css({ fontSize: 'x-large', marginTop: '24px', padding: '10px 20px' });

export const s_titlebox = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 2.2rem;
  font-weight: 700;
  @media screen and (max-width: 768px) {
    font-size: 1.6rem;
  }
`;

export const s_form = css`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

export const s_links = (theme: Theme) => css`
  display: flex;
  gap: 8px;
  font-weight: 600;
  a {
    text-decoration: none;
    color: ${theme.colors.white};
  }
`;

export const s_oauth_box = css`
  display: flex;
  width: 100%;
  gap: 28px;
  justify-content: center;
  flex-direction: column;
`;

export const Line = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.lightgray};
  height: 0.5px;
`;

export const s_line_text = (theme: Theme) => css`
  display: flex;
  gap: 12px;
  color: ${theme.colors.lightgray};
  align-items: center;
  text-wrap: nowrap;

  @media (max-width: 768px) {
    font-size: small;
  }
`;

// export const s_oauth_box_button = css({ display: 'flex', justifyContent: 'center', gap: '32px',  });
export const s_oauth_box_button = css`
  display: flex;
  justify-content: center;
  gap: 32px;
  @media (max-width: 768px) {
    gap: 24px;
  }
`;
