import { MusicI } from '..';
import testImage from '../i15949156695.png';
import {
  s_container,
  s_elementsContainer,
  s_firstElement,
  s_firstElementImage,
  s_otherElement,
  s_otherElementContainer,
  s_otherElementImage,
  s_otherElementLeftChild,
  s_otherElementRightChild,
  s_titleContainer,
} from './MusicList.style';

const MusicList = ({ musicList }: { musicList: MusicI[] }) => {
  return (
    <div css={s_container}>
      <div css={s_titleContainer}>
        <div>노래</div>
        <div>더 보기</div>
      </div>
      <div css={s_elementsContainer}>
        {musicList.length > 0 ? (
          <>
            <div css={s_firstElement}>
              <img src={testImage} alt="이미지" css={s_firstElementImage} />
              <div>
                <div>{musicList[0].title}</div>
                <div>{musicList[0].artists.map((item) => item.name).join(', ')}</div>
              </div>
            </div>
            <div css={s_otherElementContainer}>
              {musicList.slice(1).map((item, index) => {
                return (
                  <div css={s_otherElement} key={index}>
                    <div css={s_otherElementLeftChild}>
                      <img css={s_otherElementImage} src={testImage} alt="" />
                      {item.title}
                    </div>
                    <div css={s_otherElementRightChild}>
                      {item.artists.map((artist) => artist.name).join(', ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div>검색된 노래가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default MusicList;
