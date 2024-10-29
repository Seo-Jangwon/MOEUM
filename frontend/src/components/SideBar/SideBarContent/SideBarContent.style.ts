import styled from '@emotion/styled';

export const Container = styled.aside`
  display: flex;
  position: fixed;
  padding: 24px;
  width: 600px;
  height: 100%;
  flex-direction: column;
  left: 0;
  bottom: 0;
  transition: 0.5s;
  transform: translate3d(-100%, 0, 0);
  background-color: ${({ theme }) => theme.colors.dark};

  @media (max-width: 767px) {
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
