import styled from '@emotion/styled';
import { BallType } from './Background';

export const Container = styled.div`
  position: fixed;
  z-index: -1;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  background: ${({ theme }) => theme.colors.background};
`;

const SIZE = '20vw';

const BALL_POSITION = {
  contain: '5vw',
  clip: '-12vw',
};

export const PrimaryBall = styled.figure<{ ball: BallType }>`
  position: absolute;
  left: ${({ ball }) => BALL_POSITION[ball]};
  bottom: 5vw;
  height: ${SIZE};
  width: ${SIZE};
  transition: 0.5s ease-in-out;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 100%;
  mix-blend-mode: screen;
  filter: blur(2vw);
`;

export const SecondaryBall = styled.figure<{ ball: BallType }>`
  position: absolute;
  right: ${({ ball }) => BALL_POSITION[ball]};
  top: 10vh;
  height: ${SIZE};
  width: ${SIZE};
  transition: 0.5s ease-in-out;
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: 100%;
  mix-blend-mode: screen;
  filter: blur(2vw);
`;
