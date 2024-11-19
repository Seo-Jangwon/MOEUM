import useClickOutside from '@/hooks/useClickOutside';
import useSearchedKeywordStore from '@/stores/searchedKeywordStore';
import useThemeStore from '@/stores/themeStore';
import { useRef, useState } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { RiCloseLargeFill } from 'react-icons/ri';
import { RxCross2 } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';
import {
  s_button,
  s_container,
  s_input,
  s_searchKeywordButtonContainer,
  s_searchKeywordContainer,
  s_searchKeywordDiv,
  s_wrapper,
} from './SearchBox.style';

interface SearchBoxProps {
  isOpen: boolean;
  handleClose: () => void;
}

const SearchBox = ({ isOpen, handleClose }: SearchBoxProps) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { searches, removeAllSearchKeyword, addSearchKeyword, removeSearchKeyword } = useSearchedKeywordStore();
  const [userInput, setUserInput] = useState<string>('');
  const [isInputFocused, setIsInputFocosed] = useState<boolean>(false);
  const lightMode = useThemeStore((state) => state.lightMode);
  const searchRef = useClickOutside<HTMLDivElement>(handleClose);

  function search() {
    const searchKeyword = userInput;
    navigate(`/search?keyword=${searchKeyword}`);
  }
  return (
    <div css={s_wrapper} ref={searchRef}>
      <div
        css={(theme) =>
          s_container(theme, lightMode, userInput === '' && isInputFocused && searches.length > 0, isOpen)
        }
      >
        <FaMagnifyingGlass size={24} />
        <input
          css={s_input}
          ref={inputRef}
          type="text"
          placeholder="보고 싶은 노래를 찾아 보세요."
          value={userInput}
          onFocus={() => setIsInputFocosed(true)}
          onBlur={() => setIsInputFocosed(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (userInput !== '') {
                addSearchKeyword(userInput);
                search();
                e.currentTarget?.blur();
              }
            }
          }}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button
          css={s_button}
          style={{ visibility: userInput ? 'visible' : 'hidden' }}
          onClick={() => setUserInput('')}
        >
          <RiCloseLargeFill size={24} />
        </button>
        {userInput === '' && isInputFocused && searches.length > 0 ? (
          <div css={s_searchKeywordContainer} onMouseDown={(e) => e.preventDefault()}>
            <div>
              {searches.slice(-10).map((item, index) => {
                return (
                  <div key={index} css={s_searchKeywordDiv}>
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setUserInput(item);
                        inputRef.current!.blur();
                        navigate(`/search?keyword=${item}`);
                      }}
                    >
                      {item}
                    </span>
                    <RxCross2
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSearchKeyword(index);
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <div css={s_searchKeywordButtonContainer}>
              <div>최근 검색어</div>
              <div style={{ cursor: 'pointer' }} onClick={removeAllSearchKeyword}>
                전체 삭제
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchBox;
