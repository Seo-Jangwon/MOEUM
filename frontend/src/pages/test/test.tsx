import { Bodies, Body, Engine, Render, World } from 'matter-js';
import { useEffect, useRef } from 'react';
interface Ripple {
  radius: number;
  alpha: number;
  position: { x: number; y: number };
}
const SparkleEffect: React.FC = () => {
  const engineRef = useRef<Engine | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ripples = useRef<Ripple[]>([]);
  const balls = useRef<Body[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = Engine.create();
    engineRef.current = engine;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const render = Render.create({
      canvas,
      engine,
      options: { wireframes: false, background: '#000' },
    });

    // 여러 개의 공을 랜덤한 위치에 생성하여 추가합니다.
    for (let i = 0; i < 5; i++) {
      const ball = Bodies.circle(
        Math.random() * 800, // x 위치
        Math.random() * 600, // y 위치
        20, // 반경
        { restitution: 1.0, mass: 100, force: { x: 50, y: 50 } }, // 벽에 부딪힐 때 반발력 설정
      );

      balls.current.push(ball);
      World.add(engine.world, ball);
    }

    Render.run(render);

    // 파형 생성 및 애니메이션 함수
    const rippleEffect = () => {
      if (!canvasRef.current || !context) return;

      // 캔버스를 초기화합니다.
      context.clearRect(0, 0, canvas.width, canvas.height);

      // 각 공 주변에 새로운 파형을 추가
      balls.current.forEach((ball) => {
        if (
          ripples.current.length === 0 ||
          ripples.current[ripples.current.length - 1].radius > 30
        ) {
          ripples.current.push({
            radius: 1,
            alpha: 1.0,
            position: { x: ball.position.x, y: ball.position.y },
          });
        }
      });

      // 각 파형의 반경을 증가시키고 점차 투명해지도록 그립니다.
      ripples.current = ripples.current
        .map((ripple) => {
          const { x, y } = ripple.position;

          context.beginPath();
          context.arc(x, y, ripple.radius, 0, Math.PI * 2);
          context.strokeStyle = `rgba(0, 150, 255, ${ripple.alpha})`;
          context.lineWidth = 2;
          context.stroke();

          // 반경과 투명도 업데이트
          return {
            radius: ripple.radius + 1.5,
            alpha: ripple.alpha - 0.01,
            position: ripple.position,
          };
        })
        .filter((ripple) => ripple.alpha > 0); // alpha가 0보다 큰 것만 유지

      // 다음 프레임 요청
      requestAnimationFrame(rippleEffect);
    };

    requestAnimationFrame(rippleEffect);

    return () => {
      Render.stop(render);
      Engine.clear(engine);
      World.clear(engine.world, false);
    };
  }, []);

  return <canvas ref={canvasRef} width={800} height={600} />;
};

export default SparkleEffect;
