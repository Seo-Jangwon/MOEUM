import { useRef, useState } from 'react';
import Card from './CardInFAQ/CardInFAQ';
import {
  s_BodyContainer,
  s_FAQPage,
  s_TitleText,
  s_1vs1Container,
  s_1vs1text,
  s_1vs1textWithAnchor,
} from './style';
import Accordion from './Accordion/Accordion';
import Header from '@/components/Header/Header';

interface categoryData {
  imgUrl: string;
  text: string;
}

interface detailData {
  imgUrl: string;
  title: string;
  description: string;
}

const FAQPage = () => {
  const categoryDatas = useRef<categoryData[]>([
    { imgUrl: '/logo.svg', text: '계정' },
    { imgUrl: '/logo.svg', text: '요금/결제' },
    { imgUrl: '/logo.svg', text: '사용 방법' },
    { imgUrl: '/logo.svg', text: '기타' },
  ]);

  const detailDatas = useRef<detailData[][]>([
    [
      {
        imgUrl: '/logo.svg',
        title: '2대 이상의 모바일 기기에서 이용하고 싶어요.',
        description:
          '하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마 ',
      },
      {
        imgUrl: '/logo.svg',
        title: '회원 탈퇴를 하고 싶어요.',
        description:
          '하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마 ',
      },
      {
        imgUrl: '/logo.svg',
        title: '상위 요금제로 업그레이드하고 싶어요.',
        description:
          '하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마 ',
      },
      {
        imgUrl: '/logo.svg',
        title: '비밀번호를 잊어버렸어요.',
        description:
          '하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마하지마 ',
      },
    ],
    [],
    [],
    [],
  ]);

  const [isClicked, isClickedChanged] = useState<number>(0);

  function changeClickedIndex(idx: number): void {
    isClickedChanged(idx);
  }

  return (
    <>
      <div css={s_TitleText}>자주 묻는 질문</div>
      <div css={s_BodyContainer}>
        {categoryDatas.current.map((item, index) => {
          return (
            <Card
              key={index}
              imgUrl={item.imgUrl}
              text={item.text}
              isClicked={isClicked == index ? true : false}
              onClick={() => {
                changeClickedIndex(index);
              }}
            />
          );
        })}
      </div>
      <div>
        {detailDatas.current[isClicked].map((item, index) => {
          return (
            <Accordion
              imgUrl={item.imgUrl}
              title={item.title}
              description={item.description}
              key={index}
            />
          );
        })}
      </div>
      <div css={s_1vs1Container}>
        <div css={s_1vs1text}>찾으시는 내용이 없나요?</div>
        <a href="1vs1" css={s_1vs1textWithAnchor}>
          1:1 문의 바로가기 &gt;{' '}
        </a>
      </div>
    </>
  );
};

export default FAQPage;
