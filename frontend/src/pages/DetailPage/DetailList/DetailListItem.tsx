import apiClient from '@/api/apiClient';
import { DARK_PALETTE } from '@/styles/tokens';
import { useNavigate } from 'react-router-dom';
import { s_anchor, s_liTime, s_liTitle } from './DetailList.style';

interface DetailListItemProps {
  index: number;
  name: string;
  duration: string;
  id: string;
}

const getIndexColor = (index: number) => {
  if (index == 1) return DARK_PALETTE.primary;
  if (index == 2) return DARK_PALETTE.secondary;
};

const DetailListItem = ({ id, index, name, duration }: DetailListItemProps) => {
  const navigate = useNavigate();
  const handleClick = () => {
    apiClient({
      method: 'POST',
      url: `/recommendations/history/${id}`,
    })
      .then((res) => {
        // console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    navigate(`/music?id=${id}`);
  };

  return (
    <li>
      <a css={s_anchor} onClick={handleClick}>
        <div css={s_liTitle}>
          <h5
            style={{
              width: '64px',
              color: getIndexColor(index),
            }}
          >
            {index}
          </h5>
          <h5>{name}</h5>
        </div>
        <h5 css={s_liTime}>{duration}</h5>
      </a>
    </li>
  );
};

export default DetailListItem;
