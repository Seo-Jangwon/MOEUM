import lylicsVisualizationButton from '@/assets/lylicsVisualizationButton.svg';
import { css } from '@emotion/react';
import { Bodies, Engine, Render, Runner, World } from 'matter-js';
import { useEffect, useRef, useState } from 'react';
import { BsPip } from 'react-icons/bs';
import { FaCirclePlay, FaExpand, FaPause } from 'react-icons/fa6';
import { LiaBackwardSolid, LiaForwardSolid } from 'react-icons/lia';
import { MdOutlineSync } from 'react-icons/md';
import { RxShuffle, RxSpeakerLoud } from 'react-icons/rx';
import { TbPlaylistAdd } from 'react-icons/tb';
import { useLocation, useNavigate } from 'react-router-dom';
import testData from '../data.json';
import lalaSong from '../lalaSong.m4a';
import {
  s_canvas,
  s_container,
  s_iconButton,
  s_infoContainer,
  s_playerBar,
  s_playerBarController,
  s_playerBarRange,
  s_playerBarTimeLineRange,
  s_videoContainer,
} from './MusicPlayer.style';
import MyHeart from './MyHeart';

const MusicPlayer = ({
  currentMusicId,
  nextMusicId,
}: {
  currentMusicId: number;
  nextMusicId: number;
}) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerBarRef = useRef<HTMLDivElement | null>(null);
  const audioSrcRef = useRef<HTMLAudioElement | null>(null);
  const prevTimeRef = useRef<number>(0);

  const engineRef = useRef<Engine | null>(null);
  const renderRef = useRef<Render | null>(null);
  const runnerRef = useRef<Runner | null>(null);

  const animationRef = useRef<number>();

  const timeIdx = useRef<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [playTime, setPlayTime] = useState<number>(0);
  const [audioVolume, setAudioVolume] = useState<number>(0);
  const data = useRef(testData.data.notes);

  function changeVideoState() {
    if (audioSrcRef.current) {
      if (audioSrcRef.current.paused) {
        audioSrcRef.current.play();
      } else {
        audioSrcRef.current.pause();
      }
      setIsPaused(audioSrcRef.current.paused);
    }
  }

  const navigate = useNavigate();
  const location = useLocation();
  const [playerBarVisible, setPlayerBarVisible] = useState<boolean>(false);
  const timeoutId = useRef<NodeJS.Timeout>();

  function onVisibiliyChanged() {
    if (document.visibilityState === 'visible') {
      if (data.current && audioSrcRef.current) {
        console.log('deleteallshape');
        deleteAllShape();
      }
    }
  }

  /** 애니메이션 실행 함수
   */
  function createObjectsAtTimes() {
    if (audioSrcRef.current === null) return;
    if (Math.abs(audioSrcRef.current.currentTime - prevTimeRef.current) > 1) {
      audioTimeChanged();
      return;
    }
    if (data.current && timeIdx.current < data.current.length) {
      if (
        audioSrcRef.current?.currentTime >= data.current[timeIdx.current].time &&
        engineRef.current !== null &&
        divRef.current
      ) {
        setPlayTime(audioSrcRef.current.currentTime);
        prevTimeRef.current = audioSrcRef.current.currentTime;
        const obj = Bodies.polygon(
          divRef.current.offsetWidth - data.current[timeIdx.current].width - 100,
          ((100 - data.current[timeIdx.current].y) * divRef.current.offsetHeight) / 100,
          data.current[timeIdx.current].sides,
          data.current[timeIdx.current].width,
          { angle: data.current[timeIdx.current].angle },
        );

        World.add(engineRef.current.world, obj);
        timeIdx.current += 1;
      }

      /**
       * 화면 밖으로 나간 물체 삭제
       */
      if (engineRef.current !== null) {
        engineRef.current.world.bodies.forEach((body) => {
          if (
            divRef.current &&
            (body.position.y > divRef.current.offsetHeight + body.circleRadius ||
              body.position.y < -body.circleRadius ||
              body.position.x < -body.circleRadius ||
              body.position.x > divRef.current.offsetWidth - body.circleRadius)
          ) {
            console.log(body);
            console.log(engineRef.current?.world.bodies.length);
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

  function muteUnMute() {
    if (audioSrcRef.current) {
      audioSrcRef.current.muted = !audioSrcRef.current.muted;
      if (audioSrcRef.current.muted) setAudioVolume(0);
      else setAudioVolume(audioSrcRef.current.volume);
    }
  }

  /** 오디오의 현재 재생 시간을 사용자가 조정 했을 경우 */
  function audioTimeChanged() {
    if (data.current && audioSrcRef.current) {
      deleteAllShape();
      prevTimeRef.current = audioSrcRef.current.currentTime;
      if (audioSrcRef.current.currentTime > data.current[timeIdx.current].time) {
        // 앞으로 이동했을 때

        while (
          timeIdx.current < data.current.length - 1 &&
          data.current[timeIdx.current].time < audioSrcRef.current.currentTime
        ) {
          timeIdx.current++;
        }
        timeIdx.current--;
      } else {
        // 뒤로 이동했을 때
        while (
          timeIdx.current > 0 &&
          data.current[timeIdx.current].time > audioSrcRef.current.currentTime
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
    if (
      document.activeElement?.tagName === 'INPUT' &&
      !(document.activeElement.getAttribute('type') === 'range')
    ) {
      return;
    } else {
      if (e.key === ' ') {
        e.preventDefault();
        changeVideoState();
      } else if (e.key === 'm') {
        e.preventDefault();
        muteUnMute();
      } else if (e.key === 'f') {
        e.preventDefault();
        handleFullScreen();
      } else if (audioSrcRef.current) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          audioSrcRef.current.volume =
            audioSrcRef.current.volume >= 0.05 ? audioSrcRef.current.volume - 0.05 : 0;
          setAudioVolume(audioSrcRef.current.volume);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          audioSrcRef.current.volume =
            audioSrcRef.current.volume <= 0.95 ? audioSrcRef.current.volume + 0.05 : 1;
          setAudioVolume(audioSrcRef.current.volume);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          audioSrcRef.current.currentTime -= 10;
        } else if (e.key == 'ArrowRight') {
          e.preventDefault();
          audioSrcRef.current.currentTime += 10;
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

    if (audioSrcRef.current) {
      audioSrcRef.current.addEventListener('ended', () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        timeIdx.current = 0;
        setIsPaused(true);
      });
      audioSrcRef.current.src = lalaSong;
      setAudioVolume(audioSrcRef.current.volume);
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
        background: '#FF00FF44',
      },
    });

    engineRef.current.gravity.x = -1;
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
        <audio ref={audioSrcRef} />
        <div css={s_videoContainer} ref={divRef}>
          <canvas css={s_canvas} ref={canvasRef} onClick={changeVideoState} />
          <div
            ref={playerBarRef}
            css={css`
              /* display: ${playerBarVisible ? 'flex' : 'none'}; */
              ${s_playerBar}
            `}
          >
            <div>
              <input
                css={css`
                  ${s_playerBarTimeLineRange}
                  ${s_playerBarRange(
                    audioSrcRef.current
                      ? (audioSrcRef.current.currentTime / audioSrcRef.current.duration) * 100
                      : 0,
                  )}
                `}
                type="range"
                max={audioSrcRef.current?.duration || 1}
                value={playTime}
                step={0.01}
                onChange={(e) => {
                  if (audioSrcRef.current) {
                    setPlayTime(parseFloat(e.target.value));
                    audioSrcRef.current.currentTime = parseFloat(e.target.value);
                  }
                  console.log(e.target.value);
                }}
              />
            </div>
            <div css={s_playerBarController}>
              <div>
                <MyHeart isLike={true} category={'music'} id={currentMusicId} size={24} />
                <TbPlaylistAdd />
              </div>
              <div>
                <RxShuffle />
                <LiaBackwardSolid
                  onClick={() => {
                    if (audioSrcRef.current) audioSrcRef.current.currentTime = 0;
                  }}
                />
                {!isPaused ? (
                  <FaPause onClick={changeVideoState} />
                ) : (
                  <FaCirclePlay onClick={changeVideoState} />
                )}
                <LiaForwardSolid onClick={() => navigate(`/music/${nextMusicId}`)} />
                <MdOutlineSync />
              </div>
              <div>
                <RxSpeakerLoud onClick={muteUnMute} />
                <input
                  css={s_playerBarRange(audioVolume * 100)}
                  type="range"
                  max={1}
                  value={audioVolume}
                  step={0.01}
                  onChange={(e) => {
                    if (audioSrcRef.current) {
                      console.log(audioSrcRef.current.muted);
                      console.log(e.target.value);
                      if (parseFloat(e.target.value) > 0) audioSrcRef.current.muted = false;
                      else audioSrcRef.current.muted = true;
                      setAudioVolume(parseFloat(e.target.value));
                      audioSrcRef.current.volume = audioVolume;
                    }
                  }}
                />
                <img src={lylicsVisualizationButton} alt="" css={s_iconButton} />
                <BsPip onClick={handlePip} css={s_iconButton} height={'25px'} width={'25px'} />
                <FaExpand onClick={handleFullScreen} css={s_iconButton} />
              </div>
            </div>
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
