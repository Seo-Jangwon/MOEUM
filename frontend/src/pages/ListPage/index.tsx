import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AllGenreList from './AllGenreList/AllGenreList';
import AllNewList from './AllNewList/AllNewList';
import AllPopularList from './AllPopularList/AllPopularList';
import AllPopularPlayList from './AllPopularPlayList/AllPopularPlayList';


const ListPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    if (id === 'Genre') {
      setTitle('장르');
    } else if (id === 'newList') {
      setTitle('최신곡');
    } else if (id === 'Popular') {
      setTitle('인기곡');
    } else if (id === 'playList') {
      setTitle('플레이리스트');
    } else {
      setTitle('');
    }
  }, [id]);

  if (id == 'newList') {
    //  새로운 곡 리스트 페이지
    return <AllNewList title={title} />;
  } else if (id === 'Popular') {
    // 인기차트 리스트 페이지
    return <AllPopularList title={title} />;
  } else if (id === 'playList') {
    // 인기 플레이리스트 페이지
    return <AllPopularPlayList title={title} />;
  }
  // 장르 리스트 페이지
  else {
    return <AllGenreList title={title} />;
  }
};

export default ListPage;
