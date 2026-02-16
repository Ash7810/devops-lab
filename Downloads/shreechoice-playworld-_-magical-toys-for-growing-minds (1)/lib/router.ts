
import React, { useContext } from 'react';
import { RouterContext } from '../contexts/RouterContext';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  href: string;
}

export const Link: React.FC<LinkProps> = ({ href, children, ...props }) => {
  const router = useContext(RouterContext);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (props.onClick) {
        props.onClick(e);
    }
    // Allow ctrl/cmd+click to open in new tab, and for external links
    if (e.metaKey || e.ctrlKey || !href.startsWith('/')) {
        return;
    }
    e.preventDefault();
    router?.onNavigate(href);
  };

  return React.createElement('a', { href, ...props, onClick: handleClick }, children);
};
