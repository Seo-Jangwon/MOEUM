import React from 'react';
import { Link } from 'react-router-dom';
import { s_item } from '../SideBarContent/SideBarContent.style';
import { s_link_color } from './SideBarContentItem.style';

interface SideBarContentItemProps {
  Icon: React.ElementType;
  to: string;
  color: string;
  title: string;
  style?: React.CSSProperties;
}

const SideBarContentItem = ({ Icon, to, color, title, style }: SideBarContentItemProps) => (
  <Link to={to} css={s_link_color} style={style}>
    <p css={s_item}>
      <Icon color={color} />
      {title}
    </p>
  </Link>
);
export default SideBarContentItem;
