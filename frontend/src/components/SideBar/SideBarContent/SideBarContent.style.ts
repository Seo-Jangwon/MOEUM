import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

export const Container = styled.aside`
  display: flex;
  position: fixed;
  z-index: 100;
  padding: 24px;
  width: 600px;
  height: 100%;
  flex-direction: column;
  left: 0;
  bottom: 0;
  transition: 0.5s;
  transform: translate3d(-100%, 0, 0);
  background-color: ${({ theme }) => theme.colors.dark};
  box-shadow: inset 0 0 0.5px;

  @media (max-width: 768px) {
    width: 100%;
  }

  &.open {
    transform: translate3d(0%, 0, 0);
  }
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CloseButton = styled.button`
  border: 0;
  background: none;
  color: ${({ theme }) => theme.colors.white};
`;

export const Content = styled.div`
  margin-top: 60px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: space-between;
  gap: 40px;
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

export const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const s_item = css`
  display: flex;
  font-weight: 700;
  font-size: 36px;
  gap: 20px;
  align-items: center;
`;

export const RouterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.white};
  :hover {
    color: ${({ theme }) => theme.colors.gray};
    transition: 0.3s;
  }
`;
