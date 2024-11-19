import { s_container } from './style';

interface ContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return <div css={s_container}>{children}</div>;
};

export default Container;
