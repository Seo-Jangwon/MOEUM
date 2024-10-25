/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";

interface Position {
  top: number;
  left: number;
}

const FloatingBalls = () => {
  // 최초 위치를 저장
  const initialFirstBallPosition: Position = { top: 300, left: 200 };
  const initialSecondBallPosition: Position = { top: 400, left: 1000 };

  const [firstBallPosition, setFirstBallPosition] = useState<Position>(initialFirstBallPosition);
  const [secondBallPosition, setSecondBallPosition] = useState<Position>(initialSecondBallPosition);

  const maxDistance = 50; // 공이 이동할 수 있는 최대 거리

  // 원이 원 방향으로만 50px씩 이동할 수 있게 설정하는 함수
  const moveBall = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    setBallPosition: React.Dispatch<React.SetStateAction<Position>>,
    initialPosition: Position
  ) => {
    const { clientX, clientY } = e;

    // 마우스와 원의 초기 위치 차이를 계산
    let offsetX = initialPosition.left - clientX; // 반대 방향으로 이동하도록 설정
    let offsetY = initialPosition.top - clientY;  // 반대 방향으로 이동하도록 설정

    // 최대 이동 거리를 50px로 제한
    const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
    if (distance > maxDistance) {
      const ratio = maxDistance / distance;
      offsetX *= ratio;
      offsetY *= ratio;
    }

    // 새 위치를 설정 (초기 위치에서 최대 50px만 이동)
    setBallPosition({
      left: initialPosition.left + offsetX,
      top: initialPosition.top + offsetY,
    });
  };

  // 마우스 움직임에 따라 원이 반대 방향으로 연속적으로 움직이도록 설정
  const handleMouseMoveFirstBall = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    moveBall(e, setFirstBallPosition, initialFirstBallPosition);
  };

  const handleMouseMoveSecondBall = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    moveBall(e, setSecondBallPosition, initialSecondBallPosition);
  };

  // 공 스타일 설정
  const ballStyle = (top: number, left: number, color: string) => css`
    width: 450px;
    height: 450px;
    border-radius: 50%;
    background-color: ${color};
    position: absolute;
    top: ${top}px;
    left: ${left}px;
    filter: blur(15px);
    transition: top 0.3s ease, left 0.3s ease;
  `;

  return (
    <div
      css={css`
        position: relative;
        width: 100vw;
        height: 100vh;
        background-color: #1a1a1a;
        overflow: hidden;
        filter: blur(37.5px);
      `}
    >
      {/* 첫 번째 공 */}
      <div
        css={ballStyle(firstBallPosition.top, firstBallPosition.left, "#ff00ff")}
        onMouseMove={handleMouseMoveFirstBall} // 마우스가 움직일 때마다 반응
      />
      {/* 두 번째 공 */}
      <div
        css={ballStyle(secondBallPosition.top, secondBallPosition.left, "#00ffff")}
        onMouseMove={handleMouseMoveSecondBall} // 마우스가 움직일 때마다 반응
      />
    </div>
  );
};

export default FloatingBalls;
