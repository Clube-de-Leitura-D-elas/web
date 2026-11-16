import type { MouseEvent } from 'react';
import { LuArrowLeft } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router';
import * as Styled from './styles';

export type BreadcrumbProps = {
  ariaLabel: string;
  parentLabel: string;
  parentTo: string;
  current?: string | null;
};

export const Breadcrumb = ({ ariaLabel, parentLabel, parentTo, current }: BreadcrumbProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleBack = (event: MouseEvent<HTMLAnchorElement>) => {
    const modified = event.ctrlKey || event.metaKey || event.shiftKey || event.altKey;
    if (location.key === 'default' || modified || event.button !== 0) return;
    event.preventDefault();
    navigate(-1);
  };

  return (
    <Styled.Container aria-label={ariaLabel}>
      <Styled.ParentLink to={parentTo} onClick={handleBack}>
        <LuArrowLeft aria-hidden />
        {parentLabel}
      </Styled.ParentLink>
      {current && (
        <>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{current}</span>
        </>
      )}
    </Styled.Container>
  );
};
