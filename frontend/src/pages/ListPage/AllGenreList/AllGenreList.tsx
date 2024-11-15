import apiClient from "@/api/apiClient";
import { s_div_item_box, s_div_item_container, s_h5 } from "@/pages/MainPage/GenreList/style";
import { s_container } from "@/pages/MainPage/style";
import { css } from "@emotion/react";
import { useEffect, useState } from "react";

interface ListPageProps {
  title: string;
}

interface Music {
  id: number;
  name: string;
  image: string;
}

const AllGenreList = ({ title }: ListPageProps) => {
  const [genreList, setGenreList] = useState<Music[]>([]);


  // 나중에 api 나오면 수정하기
  useEffect(() => {
    apiClient({
      method: 'GET',
      url: '/musics/todaygenre',
    })
      .then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          console.log(res.data.data);
          setGenreList(res.data.data.genres);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div css={s_container}>
      <div>
        <div
          css={css`
            font-size: 36px;
            font-weight: 700;
            color: #30DDF7;
            padding: 16px;
          `}
        >
          <h3>{title} 전체보기</h3>
        </div>
        <div css={s_div_item_container}>
          {genreList.map((item, index) => (
            <button key={index} css={s_div_item_box}>
              <img src={item.image} alt="image"  css={css`
                width: 100%;
                border-radius: 10px;
              `} />
              <h5 css={s_h5}>{item.name}</h5>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllGenreList;
