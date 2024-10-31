import apiClient from '@/api/apiClient';
import { detailArtistMock } from '@/mocks/detailPageMock';
import { DetailVariants } from '@/pages/DetailPage';
import { Detail } from '@/types/detailTypes';
import { useEffect, useState } from 'react';

const TYPE_NAME = {
  album: '수록곡',
  artist: '인기곡',
};

const useFetchDetail = (variant: DetailVariants, id: string) => {
  const [detailData, setDetailData] = useState<Detail | null>(detailArtistMock);

  useEffect(() => {
    apiClient.get(`/musics/detail/${variant}/${id}`).then((res) => {
      // setDetailData({ coverTitle: res.data.data.title, listType: TYPE_NAME[variant] });
    });
  });

  return detailData;
};

export default useFetchDetail;
