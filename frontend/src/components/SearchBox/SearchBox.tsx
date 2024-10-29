import useThemeStore from '@/stores/themeStore';
import { s_button, s_container, s_input, s_wrapper } from './SearchBox.style';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { RiCloseLargeFill } from 'react-icons/ri';
import { useState } from 'react';

const SearchBox = () => {
  const [userInput, setUserInput] = useState<string | undefined>(undefined);
  const lightMode = useThemeStore((state) => state.lightMode);
  return (
    <div css={s_wrapper}>
      <div css={(theme) => s_container(theme, lightMode)}>
        <FaMagnifyingGlass size={24} />
        <input
          css={s_input}
          type="text"
          placeholder="보고 싶은 노래를 찾아 보세요."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button
          css={s_button}
          style={{ visibility: userInput ? 'visible' : 'hidden' }}
          onClick={() => setUserInput('')}
        >
          <RiCloseLargeFill size={24} />
        </button>
      </div>
    </div>
  );
};

export default SearchBox;
