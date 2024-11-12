import apiClient from '@/api/apiClient';
import lala from '@/assets/lalaticon/lala1.png';
import Flex from '@/layouts/Wrapper/Flex';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DetailCover from '../DetailPage/DetailCover/DetailCover';
import DetailList from '../DetailPage/DetailList/DetailList';
import { s_container } from '../DetailPage/style';
import { detailArtistMock } from '@/mocks/detailPageMock';

const DetailPlayList = () => {
  const { id } = useParams();

  useEffect(() => {
    apiClient({
      method: 'GET',
      url: `musics/playlist/detail/${id}`,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return (
    <Flex>
      <main css={s_container}>
        <DetailCover title={'잠들기 좋은 곡'} background={lala} />
        <DetailList title={'플레이리스트'} data={detailArtistMock.listData} />
      </main>
    </Flex>
  );
};

export default DetailPlayList;
