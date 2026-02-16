
import React from 'react';
import { Link } from '../lib/router';

export interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  crumbs: Crumb[];
}

export const Breadcrumbs = React.memo<BreadcrumbsProps>(({ crumbs }) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-xs font-medium text-gray-500">
        {crumbs.map((crumb, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="mx-2 select-none">/</span>}
            {crumb.href && index < crumbs.length - 1 ? (
              <Link href={crumb.href} className="hover:text-brand-primary transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-gray-700 font-semibold">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
});