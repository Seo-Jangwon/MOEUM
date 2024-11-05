import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';
import { BsPip } from 'react-icons/bs';
import { FaStepBackward, FaStepForward } from 'react-icons/fa';
import { FaExpand, FaPause, FaPlay } from 'react-icons/fa6';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  s_canvas,
  s_container,
  s_infoContainer,
  s_playerBar,
  s_videoContainer,
} from './MusicPlayer.style';

const pipe =
  (...fns: Function[]) =>
  (x: any) =>
    fns.reduce((acc, fn) => fn(acc), x);
const radians = (degrees: number) => degrees * (Math.PI / 180);

let raf: number;

const Modules = {
  innerCircle: {
    meta: { name: 'Module 1' },

    draw({ canvas, context, delta }: DrawContext) {
      const { width, height } = canvas;
      context.fillStyle = `hsl(${delta / 20}, 100%, 50%)`;
      context.beginPath();
      context.arc(
        width / 2 - Math.sin(delta / 500) * 50,
        height / 2 + Math.cos(delta / 500) * 50,
        10,
        0,
        Math.PI * 2,
      );
      context.fill();
    },
  },
  outerCircle: {
    meta: { name: 'Module 2' },

    draw({ canvas, context, delta }: DrawContext) {
      const { width, height } = canvas;
      context.fillStyle = `hsl(${180 + delta / 20}, 100%, 50%)`;
      context.beginPath();
      context.arc(
        width / 2 - Math.sin(delta / 500) * 70,
        height / 2 + Math.cos(delta / 500) * 70,
        10,
        0,
        Math.PI * 2,
      );
      context.fill();
    },
  },
  fade: {
    meta: { name: 'Module 3' },

    draw({ canvas, context, delta }: DrawContext) {
      const { width, height } = canvas;
      context.fillStyle = `rgba(0, 0, 0, 0.02)`;
      context.fillRect(0, 0, width, height);
    },
  },
  stretch: {
    meta: { name: 'Module 4' },

    draw({ canvas, context, delta }: DrawContext) {
      const { width, height } = canvas;
      const newWidth = width * 1.0028;
      const newHeight = height * 1.0028;
      const dWidth = newWidth - width;
      const dHeight = newHeight - height;
      context.drawImage(canvas, -dWidth, -dHeight, newWidth + dWidth, newHeight + dHeight);
    },
  },
  squishy: {
    meta: { name: 'Squishy' },

    draw({ canvas, context, delta }: DrawContext) {
      const { width, height } = canvas;
      context.drawImage(
        canvas,
        Math.cos(delta / 900) * 5 + Math.cos(delta / 100),
        Math.sin(delta / 5000 + 5 * Math.sin(delta / 500)) * 10 - Math.cos(delta / 500),
        width + 20 * Math.sin(delta / 800),
        height + 20 * Math.cos(delta / 600 + 2 * Math.sin(delta / 500)),
      );
    },
  },
};

// Context interface to handle drawing
interface DrawContext {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  delta: number;
}
function renderer(drawContext: DrawContext, module: any) {
  drawContext.context.save();
  module.draw(drawContext);
  drawContext.context.restore();
  return drawContext;
}

// Create render functions from modules
const ModuleRenderers = Object.keys(Modules).reduce(
  (obj, name) => {
    obj[name] = (drawContext: DrawContext) => renderer(drawContext, Modules[name]);
    return obj;
  },
  {} as Record<string, Function>,
);

// Example interrupt functions
function interrupt(drawContext: DrawContext) {
  drawContext.delta = drawContext.delta / 2.1;
  return drawContext;
}

function interrupt2(drawContext: DrawContext) {
  drawContext.delta = drawContext.delta * 2.1;
  return drawContext;
}

// Compose draw function using pipe
const draw = pipe(
  ModuleRenderers.squishy,
  ModuleRenderers.fade,
  ModuleRenderers.stretch,
  ModuleRenderers.innerCircle,
  interrupt,
  ModuleRenderers.outerCircle,
  interrupt2,
);

const MusicPlayer = () => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rangeRef = useRef<HTMLInputElement | null>(null);
  const playerBarRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  function changeVideoState() {
    setIsPaused((prev) => !prev);
  }
  const navigate = useNavigate();
  const location = useLocation();
  const [playerBarVisible, setPlayerBarVisible] = useState<boolean>(false);
  let timeoutId: NodeJS.Timeout;
  useEffect(() => {
    const handleMouseMove = () => {
      setPlayerBarVisible(true);
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        setPlayerBarVisible(false);
      }, 3000); // 3초 후 playerBar 숨김
    };

    const canvas = canvasRef.current;

    if (!canvas) return;
    canvasRef.current?.addEventListener('mousemove', handleMouseMove);
    const context = canvas.getContext('2d');
    if (!context) return;

    const stream = canvas.captureStream(60);
    const video = videoRef.current;
    if (video) {
      video.srcObject = stream;
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const loop = (delta: number) => {
      raf = requestAnimationFrame(loop);
      draw({ canvas, context, delta });
    };

    if (raf) {
      cancelAnimationFrame(raf);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      canvasRef.current?.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Function to handle Picture-in-Picture
  const handlePip = () => {
    const video = videoRef.current;
    if (video) {
      video.play();
      video.addEventListener('leavepictureinpicture', onExitPip, false);
      video.requestPictureInPicture();
    }
  };

  function handleFullScreen() {
    divRef.current?.requestFullscreen({ navigationUI: 'show' });
  }

  function onExitPip() {
    console.log('asdf');
    console.log(location.pathname);
    navigate(location.pathname);
  }

  return (
    <>
      <div css={s_container}>
        <div css={s_videoContainer} ref={divRef}>
          <canvas css={s_canvas} ref={canvasRef} />
          <div
            ref={playerBarRef}
            css={css`
              display: ${playerBarVisible ? 'flex' : 'none'};
              ${s_playerBar}
            `}
          >
            <FaStepBackward />
            {isPaused ? (
              <FaPause onClick={changeVideoState} />
            ) : (
              <FaPlay onClick={changeVideoState} />
            )}
            <FaStepForward />
            <input type="range" ref={rangeRef} />
            <button>가사시각화</button>
            <BsPip onClick={handlePip} />
            <FaExpand onClick={handleFullScreen} />
          </div>
        </div>
        <div css={s_infoContainer}>
          <div>노래 제목</div>
          <div>아티스트</div>
          <div>노래 설명</div>
        </div>
      </div>
      <video ref={videoRef} style={{ display: 'none' }} />
    </>
  );
};

export default MusicPlayer;
