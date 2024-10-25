import { Link } from 'react-router-dom';
import { s_container, s_img_container } from './OauthButton.style';

interface OauthButtonProps {
  to: string;
  Icon: string;
  title: string;
}

const OauthButton = ({ title, to, Icon }: OauthButtonProps) => {
  return (
    <Link to={to} css={s_container}>
      <figure css={s_img_container}>
        <img css={{ width: '100%', height: '100%' }} src={Icon} />
      </figure>
      <span>{title}</span>
    </Link>
  );
};

export default OauthButton;
