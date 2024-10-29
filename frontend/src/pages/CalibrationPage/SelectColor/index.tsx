import { css } from '@emotion/react';
import { s_button, s_h2 } from './style';

interface SelectColorProps {
  question: string;
  colors: string[][];
  onSend: (selectedIndex: number) => void;
}

const SelectColor = ({ question, colors, onSend }: SelectColorProps) => {
  return (
    <div>
      <h2 css={s_h2}>{question}</h2>
      <div>
        {colors.map((item, index) => {
          const gradient = `linear-gradient(${item.join(', ')})`;
          return (
            <button
              key={index}
              css={[
                s_button,
                css`
                  background: ${gradient};
                `,
              ]}
              onClick={() => onSend(index)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SelectColor;
