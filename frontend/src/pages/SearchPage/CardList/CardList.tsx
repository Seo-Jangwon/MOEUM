import { useNavigate } from 'react-router-dom';
import { dataI } from '..';
import {} from '../style';
import {
  s_container,
  s_elementContainer,
  s_elementImage,
  s_elementsContainer,
  s_textContainer,
  s_titleContainer,
} from './CardList.style';

const CardList = ({
  dataList,
  category,
  clickUrl,
  keyword,
  isBorder = false,
}: {
  dataList: dataI[];
  category: string;
  clickUrl: string;
  keyword: string;
  isBorder?: boolean;
}) => {
  const navigate = useNavigate();
  return (
    <div css={s_container}>
      <div css={s_titleContainer}>
        <span>{category}</span>{' '}
        {dataList.length > 0 ? (
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => {
              navigate(`/search/${clickUrl}?keyword=${keyword}`);
            }}
          >
            {dataList.length > 4 ? '더 보기' : null}
          </span>
        ) : null}
      </div>

      {dataList.length > 0 ? (
        <div css={s_elementsContainer}>
          {dataList.slice(0, 4).map((item, index) => {
            return (
              <div
                style={{ cursor: 'pointer' }}
                key={index}
                css={s_elementContainer}
                onClick={() => navigate(`/${clickUrl}/${item.id}`)}
              >
                <img css={() => s_elementImage(isBorder)} src={item.image} alt="아티스트 이미지" />
                <div>{item.name}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div css={s_textContainer}>검색된 목록이 없습니다.</div>
      )}
    </div>
  );
};

export default CardList;
