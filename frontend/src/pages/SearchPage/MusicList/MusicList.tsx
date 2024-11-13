import { useNavigate } from 'react-router-dom';
import { MusicI } from '..';
import {
  s_container,
  s_elementsContainer,
  s_firstElement,
  s_firstElementImage,
  s_firstElementText,
  s_otherElement,
  s_otherElementContainer,
  s_otherElementImage,
  s_otherElementLeftChild,
  s_otherElementRightChild,
  s_titleContainer,
} from './MusicList.style';

const MusicList = ({ musicList, keyword, category }: { musicList: MusicI[]; keyword: string; category: string }) => {
  const navigate = useNavigate();
  return (
    <div css={s_container}>
      <div css={s_titleContainer}>
        <div>노래</div>
        {/* 노래 상세 검색 페이지로 이동 로직 필요 */}
        <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/search/${category}?keyword=${keyword}`)}>
          {musicList.length > 4 ? '더 보기' : ''}
        </div>
      </div>
      <div css={s_elementsContainer}>
        {musicList.length > 0 ? (
          <>
            <div
              css={s_firstElement}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/music?id=${musicList[0].id}`)}
            >
              <img src={musicList[0].albumImage} alt="이미지" css={s_firstElementImage} />
              <div css={s_firstElementText}>
                <div>{musicList[0].title}</div>
                <div>
                  {' '}
                  {musicList[0].artists.map((artist, index) => {
                    return (
                      <span
                        style={{ cursor: 'pointer' }}
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/artist/${artist.id}`);
                        }}
                      >
                        {artist.name} &nbsp;
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
            <div css={s_otherElementContainer}>
              {musicList.slice(1).map((item, index) => {
                return (
                  <div css={s_otherElement} onClick={() => navigate(`/music/${item.id}`)} key={index}>
                    <div css={s_otherElementLeftChild}>
                      <img css={s_otherElementImage} src={item.albumImage} alt="" />
                      {item.title}
                    </div>
                    <div css={s_otherElementRightChild}>
                      {item.artists.map((artist, index) => {
                        return (
                          <span
                            style={{ cursor: 'pointer' }}
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/artist/${artist.id}`);
                            }}
                          >
                            {artist.name} &nbsp;
                          </span>
                        );
                      })}
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
