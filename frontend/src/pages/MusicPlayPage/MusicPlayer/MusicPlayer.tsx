import lylicsVisualizationButton from '@/assets/lylicsVisualizationButton.svg';
import Modal from '@/pages/RecordPage/Modal/Modal';
import useSettingStore from '@/stores/settingStore';
import { css } from '@emotion/react';
import { Bodies, Engine, Events, Render, Runner, Vector, World } from 'matter-js';
import { useEffect, useRef, useState } from 'react';
import { BsPip } from 'react-icons/bs';
import { FaCirclePlay, FaExpand, FaPause } from 'react-icons/fa6';
import { LiaBackwardSolid, LiaForwardSolid } from 'react-icons/lia';
import { MdOutlineSync } from 'react-icons/md';
import { RxShuffle, RxSpeakerLoud } from 'react-icons/rx';
import { TbPlaylistAdd } from 'react-icons/tb';
import { useLocation, useNavigate } from 'react-router-dom';
import { Data, LyricsI, musicDetailInfoI } from '..';
import testSong from '../All I Want for Christmas Is You-2-M....mp3';
import {
  s_canvas,
  s_container,
  s_iconButton,
  s_infoContainer,
  s_lyrics,
  s_palyerBar,
  s_playerBarContainer,
  s_playerBarController,
  s_playerBarRange,
  s_playerBarTimeLineRange,
  s_videoContainer,
} from './MusicPlayer.style';
import MyHeart from './MyHeart';

const MusicPlayer = ({
  currentMusicId,
  nextMusicId,
  musicDetailInfo,
  musicAnalyzedData,
  musicLyricsData,
}: {
  currentMusicId: number;
  nextMusicId: number;
  musicDetailInfo: musicDetailInfoI;
  musicAnalyzedData: Data;
  musicLyricsData: LyricsI;
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
  const lyricsTimeIdx = useRef<number>(0);
  const endEventIdx = useRef<number>(0);

  const { visualization, toggleVisualization } = useSettingStore();

  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [audioVolume, setAudioVolume] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentLyrics, setCurrentLyrics] = useState<string>('');
  const [isLyricsVisualized, setIsLyricsVisualized] = useState<boolean>(true);

  /** 재생중인 노래가 끝났을 때 어떻게 할지 설정하는 함수
   * idx -> 0 그냥 끝남
   * idx -> 1 반복 재생
   * idx -> 2 다음 곡 재생
   */
  function changeEndEventIdx(idx: number) {
    endEventIdx.current = idx;
  }
  const data = useRef<Data['notes']>();
  const lyricsData = useRef<LyricsI['lyrics']>();

  /** 영상의 재생 상태 변경하는 함수 */
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

  /** 백그라운드로 이동했다가 돌아왔을 떄 실행하는 함수. 딜레이로 인해 갑자기 생성되는 물체들 지움 */
  function onVisibiliyChanged() {
    if (document.visibilityState === 'visible') {
      if (data.current && audioSrcRef.current) {
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
      if (audioSrcRef.current) {
        prevTimeRef.current = audioSrcRef.current.currentTime;
        if (audioSrcRef.current.currentTime > lyricsData.current![lyricsTimeIdx.current].times) {
          setCurrentLyrics(lyricsData.current![lyricsTimeIdx.current].lyric);
          lyricsTimeIdx.current++;
        }
        if (
          audioSrcRef.current?.currentTime >= data.current[timeIdx.current].time &&
          engineRef.current !== null &&
          divRef.current
        ) {
          const x = canvasRef.current!.clientWidth / 2;
          const y = (canvasRef.current!.clientHeight * data.current[timeIdx.current].y) / 100;
          const polygon = Bodies.polygon(
            x / 2,
            y,
            data.current[timeIdx.current].sides,
            data.current[timeIdx.current].width,
            {
              angle: data.current[timeIdx.current].angle,
              mass: 100,
              force: Vector.create(
                (divRef.current.clientWidth / 500) * data.current[timeIdx.current].direction[0],
                (divRef.current.clientHeight / 300) * data.current[timeIdx.current].direction[1] * -1,
              ),
              frictionAir: 0,
              collisionFilter: { group: -1 },
              position: { x, y },
            },
          );

          World.add(engineRef.current.world, polygon);
          timeIdx.current += 1;
        }
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
    if (engineRef.current) {
      engineRef.current.world.bodies.forEach((body) => {
        if (body.label !== 'wall') World.remove(engineRef.current!.world, body);
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
        while (
          lyricsTimeIdx.current < lyricsData.current!.length - 1 &&
          lyricsData.current![lyricsTimeIdx.current].times < audioSrcRef.current.currentTime
        ) {
          lyricsTimeIdx.current++;
        }
        timeIdx.current--;
        lyricsTimeIdx.current--;
      } else {
        // 뒤로 이동했을 때
        while (timeIdx.current > 0 && data.current[timeIdx.current].time > audioSrcRef.current.currentTime) {
          timeIdx.current--;
        }
        while (
          lyricsTimeIdx.current > 0 &&
          lyricsData.current![lyricsTimeIdx.current].times > audioSrcRef.current.currentTime
        ) {
          lyricsTimeIdx.current--;
        }
      }
      if (!isPaused) {
        requestAnimationFrame(createObjectsAtTimes);
      }
    }
  }

  /** 키보드로 재생 컨트롤 할 수 있는 함수 */
  function MusicPlayPageKeyboardEvent(e: KeyboardEvent) {
    if (document.activeElement?.tagName === 'INPUT' && !(document.activeElement.getAttribute('type') === 'range')) {
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
          audioSrcRef.current.volume = audioSrcRef.current.volume >= 0.05 ? audioSrcRef.current.volume - 0.05 : 0;
          setAudioVolume(audioSrcRef.current.volume);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          audioSrcRef.current.volume = audioSrcRef.current.volume <= 0.95 ? audioSrcRef.current.volume + 0.05 : 1;
          setAudioVolume(audioSrcRef.current.volume);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          audioSrcRef.current.currentTime -= 10;
          audioTimeChanged();
        } else if (e.key == 'ArrowRight') {
          e.preventDefault();
          audioSrcRef.current.currentTime += 10;
          audioTimeChanged();
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
    data.current = musicAnalyzedData.notes;

    lyricsData.current = musicLyricsData.lyrics;

    if (audioSrcRef.current) {
      audioSrcRef.current.addEventListener('ended', () => {
        if (endEventIdx.current === 0) {
          if (animationRef.current) cancelAnimationFrame(animationRef.current);
          timeIdx.current = 0;
          setIsPaused(true);
        } else if (endEventIdx.current === 1) {
          if (audioSrcRef.current) {
            timeIdx.current = 0;
            audioSrcRef.current.currentTime = 0;
            audioSrcRef.current?.play();
          }
        } else if (endEventIdx.current === 2) {
          navigate(`/music?id=${nextMusicId}`);
        }
      });

      audioSrcRef.current.src = testSong;
      // audioSrcRef.current.src = musicDetailInfo.audioPath;
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
        background: '#ffadff',
      },
    });

    engineRef.current.gravity.x = 0;
    engineRef.current.gravity.y = 0;

    Render.run(renderRef.current);
    runnerRef.current = Runner.create();
    Runner.run(Runner.create(), engineRef.current);

    if (divRef.current === null) return;

    const windowWidth = window.screen.width;
    const windowHeight = window.screen.height;

    const wallLeft = Bodies.rectangle(-250, windowHeight / 2, 5, windowHeight + 1000, {
      label: 'wall',
      isStatic: true,
      render: {
        fillStyle: '#121212',
      },
    });

    const wallRight = Bodies.rectangle(windowWidth + 250, windowHeight / 2, 5, windowHeight + 1000, {
      label: 'wall',
      isStatic: true,
      render: {
        fillStyle: '#121212',
      },
    });

    const wallTop = Bodies.rectangle(windowWidth / 2, -250, windowWidth + 1000, 5, {
      label: 'wall',
      isStatic: true,
      render: {
        fillStyle: '#121212',
      },
    });

    const wallBottom = Bodies.rectangle(windowWidth / 2, windowHeight + 250, windowWidth + 1000, 10, {
      label: 'wall',
      isStatic: true,
      render: {
        fillStyle: '#121212',
      },
    });
    World.add(engineRef.current.world, wallLeft);
    World.add(engineRef.current.world, wallRight);
    World.add(engineRef.current.world, wallTop);
    World.add(engineRef.current.world, wallBottom);

    /**왼쪽의 벽과 충돌 시 사라지게 하는 이벤트 함수 */
    Events.on(engineRef.current, 'collisionStart', (event) => {
      console.log(engineRef.current?.world.bodies);
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        if (bodyA.label === 'wall' && bodyB.label !== 'wall') {
          if (engineRef.current) World.remove(engineRef.current?.world, bodyB);
        } else if (bodyB.label === 'wall' && bodyA.label !== 'wall') {
          if (engineRef.current) World.remove(engineRef.current?.world, bodyA);
        }
      });
    });

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
    if (engineRef.current === null || renderRef.current === null) return;

    //영상이 재생되는 상태일 경우
    if (!isPaused) requestAnimationFrame(createObjectsAtTimes);

    return () => {
      if (animationRef.current && !isPaused) {
        cancelAnimationFrame(animationRef.current);
      }
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
    console.log(location.pathname);
    if (videoRef.current) videoRef.current.removeEventListener('enterpictureinpicture', onExitPip);
    navigate(location.pathname);
  }

  return (
    <>
      <div css={s_container}>
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          id={currentMusicId}
        />
        <audio ref={audioSrcRef} />
        <div css={s_videoContainer} ref={divRef}>
          <canvas css={s_canvas} ref={canvasRef} onClick={changeVideoState} />
          <div ref={playerBarRef} css={s_playerBarContainer}>
            <div css={s_lyrics}>{isLyricsVisualized ? currentLyrics : 'test'}</div>
            <div
              css={css`
                display: ${playerBarVisible ? 'flex' : 'none'};
                ${s_palyerBar}
              `}
            >
              <div>
                <input
                  css={css`
                    ${s_playerBarTimeLineRange}
                    ${s_playerBarRange(
                      audioSrcRef.current ? (audioSrcRef.current.currentTime / audioSrcRef.current.duration) * 100 : 0,
                    )}
                  `}
                  type="range"
                  max={audioSrcRef.current?.duration || 1}
                  min={0}
                  step={1}
                  onChange={(e) => {
                    if (audioSrcRef.current) {
                      audioSrcRef.current.currentTime = parseFloat(e.target.value);
                    }
                  }}
                />
              </div>
              <div css={s_playerBarController}>
                <div>
                  <MyHeart isLike={true} category={'music'} id={currentMusicId} size={24} />
                  <TbPlaylistAdd onClick={() => setIsModalOpen(true)} />
                </div>
                <div>
                  <RxShuffle onClick={() => changeEndEventIdx(2)} />
                  <LiaBackwardSolid
                    onClick={() => {
                      if (audioSrcRef.current) {
                        timeIdx.current = 0;
                        audioSrcRef.current.currentTime = 0;
                      }
                    }}
                  />
                  {!isPaused ? <FaPause onClick={changeVideoState} /> : <FaCirclePlay onClick={changeVideoState} />}
                  <LiaForwardSolid onClick={() => navigate(`/music?id=${nextMusicId}`)} />
                  <MdOutlineSync onClick={() => changeEndEventIdx(1)} />
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
                        if (parseFloat(e.target.value) > 0) audioSrcRef.current.muted = false;
                        else audioSrcRef.current.muted = true;
                        audioSrcRef.current.volume = parseFloat(e.target.value);
                        setAudioVolume(parseFloat(e.target.value));
                      }
                    }}
                  />
                  <img
                    src={lylicsVisualizationButton}
                    alt="가사 시각화 버튼"
                    css={s_iconButton}
                    onClick={toggleVisualization}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLyricsVisualized((prev) => !prev);
                    }}
                  >
                    Sub
                  </button>
                  <BsPip onClick={handlePip} css={s_iconButton} height={'25px'} width={'25px'} />
                  <FaExpand onClick={handleFullScreen} css={s_iconButton} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div css={s_infoContainer}>
          <div>{musicDetailInfo.musicName}</div>
          <div>
            {musicDetailInfo.artists.map((item, index) => {
              return (
                <span
                  key={index}
                  css={css`
                    :hover {
                      text-decoration: underline;
                    }
                  `}
                  onClick={() => navigate(`/artist/${item.id}`)}
                >
                  {item.name}
                </span>
              );
            })}
          </div>
          <div>{musicDetailInfo.releaseDate}</div>
        </div>
      </div>
      <video ref={videoRef} style={{ display: 'none' }} />
    </>
  );
};

export default MusicPlayer;
