import { css } from '@emotion/react';
import { Bodies, Engine, Render, Runner, World } from 'matter-js';
import { useEffect, useRef, useState } from 'react';
import { BsPip } from 'react-icons/bs';
import { FaStepBackward, FaStepForward } from 'react-icons/fa';
import { FaExpand, FaPause, FaPlay } from 'react-icons/fa6';
import { useLocation, useNavigate } from 'react-router-dom';
import beatData from '../beats.json';
import lalaSong from '../lalaSong.m4a';
import {
  s_canvas,
  s_container,
  s_infoContainer,
  s_playerBar,
  s_videoContainer,
} from './MusicPlayer.style';

const MusicPlayer = () => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rangeRef = useRef<HTMLInputElement | null>(null);
  const playerBarRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevTimeRef = useRef<number>(0);

  const engineRef = useRef<Engine | null>(null);
  const renderRef = useRef<Render | null>(null);
  const runnerRef = useRef<Runner | null>(null);

  const animationRef = useRef<number>();

  const timeIdx = useRef<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const data = useRef(beatData.data.beats[0].lines);

  function changeVideoState() {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      setIsPaused(audioRef.current.paused);
    }
  }

  const navigate = useNavigate();
  const location = useLocation();
  const [playerBarVisible, setPlayerBarVisible] = useState<boolean>(false);
  const timeoutId = useRef<NodeJS.Timeout>();

  function onVisibiliyChanged() {
    if (document.visibilityState === 'visible') {
      if (data.current && audioRef.current) {
        deleteAllShape();
      }
    }
  }

  /** 애니메이션 실행 함수
   */
  function createObjectsAtTimes() {
    if (audioRef.current === null) return;
    if (Math.abs(audioRef.current.currentTime - prevTimeRef.current) > 1) {
      audioTimeChanged();
      return;
    }
    if (data.current && timeIdx.current < data.current.length) {
      if (
        audioRef.current?.currentTime >= data.current[timeIdx.current].time &&
        engineRef.current !== null
      ) {
        console.log(data.current[timeIdx.current].time);
        prevTimeRef.current = audioRef.current.currentTime;
        const circle = Bodies.circle(500, 300, 20, { restitution: 0.5, friction: 0.01 });
        const obj = Bodies.polygon(500, 100, 3, 30);
        circle.render.fillStyle = '#FFFFFF';

        World.add(engineRef.current.world, circle);
        World.add(engineRef.current.world, obj);
        timeIdx.current += 1;
      }

      /**
       * 화면 밖으로 나간 물체 삭제
       */
      if (engineRef.current !== null) {
        engineRef.current.world.bodies.forEach((body) => {
          if (
            body.position.y > window.innerHeight ||
            body.position.x < 0 ||
            body.position.x > window.innerWidth
          ) {
            World.remove(engineRef.current.world, body);
          }
        });
      }

      // 다음 호출 설정
      if (!isPaused) {
        animationRef.current = requestAnimationFrame(createObjectsAtTimes);
      } else if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
  }

  /**
   * 물체 전체 삭제
   */
  function deleteAllShape() {
    if (engineRef.current !== null) {
      engineRef.current.world.bodies.forEach((body) => {
        World.remove(engineRef.current.world, body);
      });
    }
  }

  /**
   * 전체화면이 된 element가 없을 경우 전체화면으로 변환해줌.
   * 전체화면이 된 element가 있을 경우 전체화면 상태 해제.
   */
  function handleFullScreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      divRef.current?.requestFullscreen({ navigationUI: 'show' });
    }
  }

  /** 오디오의 현재 재생 시간을 사용자가 조정 했을 경우 */
  function audioTimeChanged() {
    if (data.current && audioRef.current) {
      deleteAllShape();
      prevTimeRef.current = audioRef.current.currentTime;
      if (audioRef.current.currentTime > data.current[timeIdx.current].time) {
        // 앞으로 이동했을 때

        while (
          timeIdx.current < data.current.length - 1 &&
          data.current[timeIdx.current].time < audioRef.current.currentTime
        ) {
          timeIdx.current++;
        }
        timeIdx.current--;
      } else {
        // 뒤로 이동했을 때
        while (
          timeIdx.current > 0 &&
          data.current[timeIdx.current].time > audioRef.current.currentTime
        ) {
          timeIdx.current--;
        }
      }
      if (!isPaused) {
        requestAnimationFrame(createObjectsAtTimes);
      }
    }
  }

  /** 키보드로 재생 컨트롤 할 수 있는 함수 */
  function MusicPlayPageKeyboardEvent(e: KeyboardEvent) {
    if (document.activeElement?.tagName === 'INPUT') {
      return;
    } else {
      if (e.key === ' ') {
        changeVideoState();
      } else if (e.key === 'm') {
        console.log('qt');
        if (audioRef.current) {
          console.log('qt');
          audioRef.current.muted = !audioRef.current.muted;
        }
      } else if (e.key === 'f') {
        handleFullScreen();
      } else if (audioRef.current) {
        if (e.key === 'ArrowDown') {
          audioRef.current.volume -= 0.05;
        } else if (e.key === 'ArrowUp') {
          audioRef.current.volume += 0.05;
        } else if (e.key === 'ArrowLeft') {
          console.log(audioRef.current.currentTime);
          audioRef.current.currentTime -= 10;
        } else if (e.key == 'ArrowRight') {
          console.log(audioRef.current.currentTime);
          audioRef.current.currentTime += 100;
        }
      }
    }
  }
  /** 애니메이션 캔버스,애니메이션 렌더, 오디오 등 기초 설정 */
  useEffect(() => {
    /**
     * 비디오 내에서 마우스가 3초동안 멈춰있을 경우 재생바를 멈추는 함수
     */
    const handleMouseMove = () => {
      setPlayerBarVisible(true);
      clearTimeout(timeoutId.current);

      timeoutId.current = setTimeout(() => {
        setPlayerBarVisible(false);
      }, 3000); // 3초 후 playerBar 숨김
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('ended', () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        timeIdx.current = 0;
      });
      audioRef.current.src = lalaSong;
    }

    const canvas = canvasRef.current;

    if (!canvas) return;
    canvas.addEventListener('mousemove', handleMouseMove);

    const context = canvas.getContext('2d');
    if (!context) return;

    const stream = canvas.captureStream(60);
    const video = videoRef.current;
    if (video) {
      video.srcObject = stream;
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = (window.innerWidth / 16) * 9;
    };

    window.addEventListener('resize', resize);
    resize();

    engineRef.current = Engine.create();
    renderRef.current = Render.create({
      element: divRef.current as HTMLElement,
      engine: engineRef.current,
      canvas: canvasRef.current as HTMLCanvasElement,

      options: {
        wireframes: false,
        background: '#ffffc0',
      },
    });

    engineRef.current.gravity.x = -0.5;
    engineRef.current.gravity.y = 0;

    Render.run(renderRef.current);
    runnerRef.current = Runner.create();
    Runner.run(Runner.create(), engineRef.current);

    document.addEventListener('visibilitychange', onVisibiliyChanged);
    document.addEventListener('keydown', MusicPlayPageKeyboardEvent);

    return () => {
      if (canvasRef.current) canvasRef.current.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId.current);
      window.removeEventListener('resize', resize);
      if (renderRef.current !== null) {
        Render.stop(renderRef.current);
        renderRef.current.canvas.remove();
      }
      if (runnerRef.current !== null) Runner.stop(runnerRef.current);
      if (engineRef.current !== null) {
        World.clear(engineRef.current.world, false);
        Engine.clear(engineRef.current);
      }
      document.removeEventListener('visibilitychange', onVisibiliyChanged);
      document.removeEventListener('keydown', MusicPlayPageKeyboardEvent);
    };
  }, []);

  /** 영상의 재생 상태 변경 시 호출됨. 애니메이션 멈추거나 시작 */
  useEffect(() => {
    if (engineRef.current === null || renderRef.current === null) {
      return;
    }

    //영상이 재생되는 상태일 경우
    if (!isPaused) requestAnimationFrame(createObjectsAtTimes);

    return () => {
      if (animationRef.current && !isPaused) {
        cancelAnimationFrame(animationRef.current);
      }
      // if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  /** pip 버그 픽스 필요 */
  const handlePip = () => {
    const video = videoRef.current;
    if (video) {
      video.play();
      video.addEventListener('leavepictureinpicture', onExitPip, false);
      video.requestPictureInPicture();
      video.style.display = 'none';
    }
  };

  function onExitPip() {
    console.log('asdf');
    console.log(location.pathname);
    if (videoRef.current) videoRef.current.removeEventListener('enterpictureinpicture', onExitPip);
    navigate(location.pathname);
  }

  return (
    <>
      <div css={s_container}>
        <audio ref={audioRef} />
        <div css={s_videoContainer} ref={divRef}>
          <canvas css={s_canvas} ref={canvasRef} onClick={changeVideoState} />
          <div
            ref={playerBarRef}
            css={css`
              display: ${playerBarVisible ? 'flex' : 'none'};
              ${s_playerBar}
            `}
          >
            <FaStepBackward />
            {!isPaused ? (
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
