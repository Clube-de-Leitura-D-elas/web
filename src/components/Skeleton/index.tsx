import * as Styled from './styles';

export type SkeletonProps = {
  width?: string;
  height?: string;
  variant?: 'rectangular' | 'circular';
};

export const Skeleton = ({
  width = '100%',
  height = '0.75rem',
  variant = 'rectangular',
}: SkeletonProps) => {
  return <Styled.Skeleton aria-hidden="true" $width={width} $height={height} $variant={variant} />;
};
