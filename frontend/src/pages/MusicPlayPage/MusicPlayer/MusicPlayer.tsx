import Modal from '@/pages/RecordPage/Modal/Modal';
import useSettingStore from '@/stores/settingStore';
import { css } from '@emotion/react';
import { Bodies, Engine, Events, IEventCollision, Render, Runner, Vector, World } from 'matter-js';
import { useEffect, useRef, useState } from 'react';
import { FaCirclePlay, FaExpand, FaPause } from 'react-icons/fa6';
import { LiaBackwardSolid, LiaForwardSolid } from 'react-icons/lia';
import { MdOutlineLyrics, MdOutlineSync } from 'react-icons/md';
import { RxShuffle, RxSpeakerLoud } from 'react-icons/rx';
import { TbPlaylistAdd } from 'react-icons/tb';
import { useLocation, useNavigate } from 'react-router-dom';
import { Data, LyricsI, musicDetailInfoI } from '..';
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

interface CustomBody extends Matter.Body {
  isGlow: boolean; // 반짝임 여부
  isPing: boolean;
  glowFlag?: boolean;
  pingFlag?: number;
}

const MusicPlayer = ({
  currentMusicId,
  nextMusicId,
  musicDetailInfo,
  musicAnalyzedData,
  musicLyricsData,
  playListId = undefined,
  playListIdx = undefined,
}: {
  currentMusicId: number;
  nextMusicId: number;
  musicDetailInfo: musicDetailInfoI;
  musicAnalyzedData: Data;
  musicLyricsData: LyricsI;
  playListId?: number | undefined;
  playListIdx?: number | undefined;
}) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerBarRef = useRef<HTMLDivElement | null>(null);
  const audioSrcRef = useRef<HTMLAudioElement | null>(null);
  const prevTimeRef = useRef<number>(0);

  const engineRef = useRef<Engine | null>(null);
  const renderRef = useRef<Render | null>(null);
  const runnerRef = useRef<Runner | null>(null);

  const location = useLocation();

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
  const [currentTimeLine, setCurrentTImeLine] = useState<number>(0);

  function changeCurrentTimeLine() {
    if (audioSrcRef.current) setCurrentTImeLine(audioSrcRef.current.currentTime);
    else setCurrentTImeLine(0);
  }

  /** 재생중인 노래가 끝났을 때 어떻게 할지 설정하는 함수
   * idx -> 0 그냥 끝남
   * idx -> 1 반복 재생
   * idx -> 2 다음 곡 재생
   */
  function changeEndEventIdx(idx: number) {
    endEventIdx.current = idx;
  }
  const noteDatas = useRef<Data['notes']>();
  const backgroundDatas = useRef<Data['backgrounds']>();
  const vibrationsDatas = useRef<Data['vibrations']>();

  const lyricsData = useRef<LyricsI['lyrics']>();

  /** 영상의 재생 상태 변경하는 함수 */
  function changeVideoState() {
    if (audioSrcRef.current) {
      if (audioSrcRef.current.paused) {
        engineRef.current!.timing.timeScale = 1;
        audioSrcRef.current.play();
      } else {
        engineRef.current!.timing.timeScale = 0;
        audioSrcRef.current.pause();
      }
      setIsPaused(audioSrcRef.current.paused);
    }
  }

  const navigate = useNavigate();
  const [playerBarVisible, setPlayerBarVisible] = useState<boolean>(false);
  const timeoutId = useRef<NodeJS.Timeout>();

  /** 백그라운드로 이동했다가 돌아왔을 떄 실행하는 함수. 딜레이로 인해 갑자기 생성되는 물체들 지움 */
  function onVisibiliyChanged() {
    if (document.visibilityState === 'visible') {
      if (noteDatas.current && audioSrcRef.current) {
        deleteAllShape();
      }
    }
  }
  function extractHSLAValues(hsla: string): [number, number, number, number] {
    const tempStr1 = hsla.slice(5, -1);
    const value = tempStr1.split(',');
    // 배열 형태로 반환
    return [
      parseFloat(value[0]), // Hue
      parseFloat(value[1]), // Saturation
      parseFloat(value[2]), // Lightness
      parseFloat(value[3]), // Alpha (opacity)
    ];
  }
  // 물체의 strokeStyle에 접근하여 투명도만 낮추는 함수
  function adjustStrokeOpacityAndDelete(body: Matter.Body, engine: Matter.Engine): void {
    const currentStrokeStyle = body.render.strokeStyle; // 현재 strokeStyle 값
    if (currentStrokeStyle) {
      const [h, s, l, a] = extractHSLAValues(currentStrokeStyle);

      if (a < 0.05) {
        World.remove(engine.world, body);
      }
      const newStrokeStyle = `hsla(${h}, ${s}%, ${l}%, ${a - 0.02})`;
      body.render.strokeStyle = newStrokeStyle; // 새로운 strokeStyle을 적용
      body.circleRadius! += canvasRef.current!.clientWidth / 150;
    }
  }

  /** 애니메이션 실행 함수
   */
  function createObjectsAtTimes() {
    if (audioSrcRef.current === null) return;

    if (Math.abs(audioSrcRef.current!.currentTime - prevTimeRef.current) > 1) {
      audioTimeChanged();
      return;
    }
    if (noteDatas.current && timeIdx.current < noteDatas.current.length - 1) {
      if (audioSrcRef.current) {
        prevTimeRef.current = audioSrcRef.current.currentTime;
        if (
          lyricsTimeIdx.current < lyricsData.current!.length - 1 &&
          audioSrcRef.current.currentTime > lyricsData.current![lyricsTimeIdx.current].times
        ) {
          setCurrentLyrics(lyricsData.current![lyricsTimeIdx.current].lyric);
          lyricsTimeIdx.current++;
        }
        engineRef.current?.world.bodies.forEach((item) => {
          if (item.label === 'wave') {
            adjustStrokeOpacityAndDelete(item, engineRef.current!);
          } else {
            const obj = item as CustomBody;
            if (obj.isGlow) {
              // 반짝이는 효과
              const currentColor = obj.render.fillStyle;
              const values = extractHSLAValues(currentColor!);
              const [h, s, l, a] = values;
              if (s < 40) obj.glowFlag = false;
              if (s > 99) obj.glowFlag = true;
              if (obj.glowFlag) {
                const newColor = `hsla(${h}, ${s - 2}%, ${l}%, ${a})`;
                obj.render.fillStyle = newColor;
              } else {
                const newColor = `hsla(${h}, ${s + 2}%, ${l}%, ${a})`;
                obj.render.fillStyle = newColor;
              }
            }
            if (obj.isPing) {
              // 파장이 퍼져나가는 효과
              if (obj.pingFlag === 0) {
                // pingFlag가 0일 경우 파장 생성
                const x = obj.position.x;
                const y = obj.position.y;
                const wave = Bodies.circle(x, y, 10, {
                  label: 'wave',
                  render: {
                    strokeStyle: obj.render.fillStyle,
                    lineWidth: 5,
                    fillStyle: `rgba(255, 0, 255, 0)`,
                  },
                  isSensor: true, // 물리적 상호작용 없이 설정
                  frictionAir: 0,
                  collisionFilter: { group: -1 },
                });

                // 파장 생성 후 물리 엔진에 추가
                World.add(engineRef.current!.world, wave);

                // pingFlag를 1로 리셋
                obj.pingFlag = 1;
              } else {
                // pingFlag가 0이 아닐 경우 0.05씩 감소
                obj.pingFlag! -= 0.2;
              }
            }
          }
        });
        if (
          audioSrcRef.current?.currentTime >= noteDatas.current[timeIdx.current].time &&
          engineRef.current !== null &&
          divRef.current
        ) {
          const x = canvasRef.current!.clientWidth / 2;
          const y = (canvasRef.current!.clientHeight * noteDatas.current[timeIdx.current].y) / 100;

          renderRef.current!.options.background =
            backgroundDatas.current![noteDatas.current[timeIdx.current].section - 1].color;
          const polygon = Bodies.polygon(
            x / 2,
            y,
            noteDatas.current[timeIdx.current].sides,
            noteDatas.current[timeIdx.current].width,

            {
              render: { fillStyle: noteDatas.current[timeIdx.current].color },
              angle: noteDatas.current[timeIdx.current].angle,
              mass: 100,
              label: '',
              force: Vector.create(
                (divRef.current.clientWidth / 500) * noteDatas.current[timeIdx.current].direction[0],
                (divRef.current.clientHeight / 300) * noteDatas.current[timeIdx.current].direction[1] * -1,
              ),
              frictionAir: 0,
              collisionFilter: { group: -1 },
              position: { x, y },
            },
          ) as CustomBody;

          polygon.isGlow = polygon.glowFlag = noteDatas.current[timeIdx.current].effect.some((str) => str === 'GLOW');
          if (noteDatas.current[timeIdx.current].effect.some((str) => str === 'PING')) {
            polygon.isPing = true;
            polygon.pingFlag = 0;
          }

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
      const bodies = [...engineRef.current.world.bodies];
      bodies.forEach((body) => {
        if (body.label !== 'wall') {
          World.remove(engineRef.current!.world, body);
        }
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

  /**왼쪽의 벽과 충돌 시 사라지게 하는 이벤트 함수 */
  function handleObjectCollide(event: IEventCollision<Engine>) {
    event.pairs.forEach((pair) => {
      const { bodyA, bodyB } = pair;
      if (bodyA.label === 'wall' && bodyB.label !== 'wall') {
        if (engineRef.current) {
          World.remove(engineRef.current?.world, bodyB);
        }
      } else if (bodyB.label === 'wall' && bodyA.label !== 'wall') {
        if (engineRef.current) {
          World.remove(engineRef.current?.world, bodyA);
        }
      }
    });
  }

  /** 오디오의 현재 재생 시간을 사용자가 조정 했을 경우 */
  function audioTimeChanged() {
    if (noteDatas.current && audioSrcRef.current) {
      deleteAllShape();
      prevTimeRef.current = audioSrcRef.current.currentTime;
      if (audioSrcRef.current.currentTime > noteDatas.current[timeIdx.current].time) {
        // 앞으로 이동했을 때

        while (
          timeIdx.current < noteDatas.current.length - 2 &&
          noteDatas.current[timeIdx.current].time < audioSrcRef.current.currentTime
        ) {
          timeIdx.current++;
        }
        while (
          lyricsTimeIdx.current < lyricsData.current!.length - 2 &&
          lyricsData.current![lyricsTimeIdx.current].times < audioSrcRef.current.currentTime
        ) {
          lyricsTimeIdx.current++;
        }
      } else {
        // 뒤로 이동했을 때
        while (timeIdx.current > 0 && noteDatas.current[timeIdx.current].time > audioSrcRef.current.currentTime) {
          timeIdx.current--;
        }
        while (
          lyricsTimeIdx.current === lyricsData.current?.length ||
          (lyricsTimeIdx.current > 0 &&
            lyricsData.current![lyricsTimeIdx.current].times > audioSrcRef.current.currentTime)
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

    const canvas = canvasRef.current;

    if (!canvas) return;
    canvas.addEventListener('mousemove', handleMouseMove);

    const context = canvas.getContext('2d');
    if (!context) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = (window.innerWidth / 16) * 9;

      if (engineRef.current) {
        const bodies = [...engineRef.current.world.bodies];
        bodies.forEach((body) => {
          World.remove(engineRef.current!.world, body);
        });
      }

      const windowWidth = window.screen.width;
      const windowHeight = window.screen.height;

      const wallLeft = Bodies.rectangle(-250, windowHeight / 2, 5, windowHeight + 1000, {
        label: 'wall',
        isStatic: true,
        render: {
          fillStyle: '#121212',
        },
      });

      const wallRight = Bodies.rectangle(windowWidth + 500, windowHeight / 2, 5, windowHeight + 1000, {
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
      World.add(engineRef.current!.world, wallLeft);

      World.add(engineRef.current!.world, wallRight);
      World.add(engineRef.current!.world, wallTop);
      World.add(engineRef.current!.world, wallBottom);
    };

    window.addEventListener('resize', resize);

    engineRef.current = Engine.create();
    renderRef.current = Render.create({
      element: divRef.current as HTMLElement,
      engine: engineRef.current,
      canvas: canvasRef.current as HTMLCanvasElement,

      options: {
        wireframes: false,
        background: '#141414',
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

    const wallRight = Bodies.rectangle(windowWidth + 500, windowHeight / 2, 5, windowHeight + 1000, {
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

    Events.on(engineRef.current, 'collisionStart', handleObjectCollide);

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

  function toNextSong() {
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
      if (playListId !== undefined) navigate(`/music?id=${nextMusicId}&list=${playListId}&idx=${playListIdx}`);
      else navigate(`/music?id=${nextMusicId}`);
    }
  }

  useEffect(() => {
    noteDatas.current = musicAnalyzedData.notes;
    backgroundDatas.current = musicAnalyzedData.backgrounds;
    vibrationsDatas.current = musicAnalyzedData.vibrations;

    lyricsData.current = musicLyricsData.lyrics;

    if (audioSrcRef.current) {
      audioSrcRef.current.currentTime = 0;
      audioSrcRef.current.addEventListener('ended', toNextSong);
      audioSrcRef.current.addEventListener('timeupdate', changeCurrentTimeLine);
      audioSrcRef.current.src = `https://moeum.s3.ap-northeast-2.amazonaws.com/${currentMusicId}`;
      setAudioVolume(audioSrcRef.current.volume);
    }
    return () => {
      audioSrcRef.current?.removeEventListener('ended', toNextSong);
      audioSrcRef.current?.removeEventListener('timeupdate', changeCurrentTimeLine);
    };
  }, [location.search]);

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
  return (
    <>
      <div css={s_container}>
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          musicId={currentMusicId}
        />
        <audio ref={audioSrcRef} />
        <div css={s_videoContainer} ref={divRef}>
          <canvas css={s_canvas} ref={canvasRef} onClick={changeVideoState} />
          <div ref={playerBarRef} css={s_playerBarContainer}>
            <div css={s_lyrics}>{isLyricsVisualized ? currentLyrics : ''}</div>
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
                      audioSrcRef.current ? (currentTimeLine / audioSrcRef.current.duration) * 100 : 0,
                    )}
                  `}
                  type="range"
                  max={audioSrcRef.current?.duration || 1}
                  value={currentTimeLine}
                  min={0}
                  step={1}
                  onChange={(e) => {
                    if (audioSrcRef.current) {
                      setCurrentTImeLine(parseFloat(e.target.value));
                      audioSrcRef.current.currentTime = parseFloat(e.target.value);
                    }
                  }}
                />
              </div>
              <div css={s_playerBarController}>
                <div>
                  <MyHeart isLike={true} category={'music'} id={currentMusicId} size={18} />
                  <TbPlaylistAdd
                    onClick={() => setIsModalOpen(true)}
                    style={{ marginRight: '10px' }}
                    css={s_iconButton}
                  />
                  {audioSrcRef.current ? (
                    <>
                      <span>
                        {Math.floor(currentTimeLine / 60) +
                          ':' +
                          Math.floor(currentTimeLine % 60)
                            .toString()
                            .padStart(2, '0')}
                      </span>
                      <span> / </span>{' '}
                      <span>
                        {audioSrcRef.current.duration >= 60
                          ? Math.floor(audioSrcRef.current.duration / 60) +
                            ':' +
                            Math.floor(audioSrcRef.current.duration % 60)
                              .toString()
                              .padStart(2, '0')
                          : Math.floor(audioSrcRef.current.duration % 60)
                              .toString()
                              .padStart(2, '0')}
                      </span>
                    </>
                  ) : (
                    'asdf'
                  )}
                </div>
                <div>
                  <RxShuffle onClick={() => changeEndEventIdx(2)} css={s_iconButton} />
                  <LiaBackwardSolid
                    onClick={() => {
                      if (audioSrcRef.current) {
                        timeIdx.current = 0;
                        audioSrcRef.current.currentTime = 0;
                      }
                    }}
                    css={s_iconButton}
                  />
                  {!isPaused ? (
                    <FaPause onClick={changeVideoState} css={s_iconButton} />
                  ) : (
                    <FaCirclePlay onClick={changeVideoState} css={s_iconButton} />
                  )}
                  <LiaForwardSolid onClick={() => navigate(`/music?id=${nextMusicId}`)} css={s_iconButton} />
                  <MdOutlineSync onClick={() => changeEndEventIdx(1)} css={s_iconButton} />
                </div>
                <div>
                  <RxSpeakerLoud onClick={muteUnMute} css={s_iconButton} />
                  <input
                    css={s_playerBarRange(audioVolume * 100)}
                    style={{ width: '50px' }}
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
                  {/*  <img
                    src={lylicsVisualizationButton}
                    alt="가사 시각화 버튼"
                    css={s_iconButton}
                    onClick={toggleVisualization}
                  /> */}
                  <MdOutlineLyrics
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLyricsVisualized((prev) => !prev);
                    }}
                    css={s_iconButton}
                  />

                  <FaExpand onClick={handleFullScreen} css={s_iconButton} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div css={s_infoContainer}>
          <div
            css={css`
              font-size: 3rem;
              font-weight: 700;
              margin-right: 20px;
            `}
          >
            {musicDetailInfo.musicName}
          </div>
          <div css={css`
            font-size: 1.25rem;
            line-height: 1.2;
          `}>
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
            <div>{musicDetailInfo.releaseDate}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
