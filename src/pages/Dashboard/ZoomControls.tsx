import { LuZoomIn, LuZoomOut } from 'react-icons/lu';
import * as Styled from './styles';

type ZoomControlsProps = {
  zoomInLabel: string;
  zoomOutLabel: string;
  canZoomIn: boolean;
  canZoomOut: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
};

// Lupas do gráfico: aproximar (período menor) e afastar (período maior).
export const ZoomControls = ({
  zoomInLabel,
  zoomOutLabel,
  canZoomIn,
  canZoomOut,
  onZoomIn,
  onZoomOut,
}: ZoomControlsProps) => (
  <Styled.ZoomGroup>
    <Styled.ZoomButton
      type="button"
      aria-label={zoomOutLabel}
      disabled={!canZoomOut}
      onClick={onZoomOut}
    >
      <LuZoomOut aria-hidden />
    </Styled.ZoomButton>
    <Styled.ZoomButton
      type="button"
      aria-label={zoomInLabel}
      disabled={!canZoomIn}
      onClick={onZoomIn}
    >
      <LuZoomIn aria-hidden />
    </Styled.ZoomButton>
  </Styled.ZoomGroup>
);
