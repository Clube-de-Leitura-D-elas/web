import { Skeleton } from '../../components/Skeleton';
import * as Styled from './styles';

export const GroupDetailsSkeleton = () => (
  <Styled.Container aria-hidden="true">
    <Skeleton width="8rem" height="1.25rem" />

    <Styled.Header>
      <Styled.SkeletonStack>
        <Styled.SkeletonRow>
          <Skeleton width="20rem" height="2.25rem" />
          <Skeleton width="4.5rem" height="1.75rem" />
        </Styled.SkeletonRow>
        <Skeleton width="12rem" height="1.25rem" />
      </Styled.SkeletonStack>
      <Styled.SkeletonRow>
        <Skeleton width="12rem" height="2.5rem" />
        <Skeleton width="2.5rem" height="2.5rem" variant="circular" />
      </Styled.SkeletonRow>
    </Styled.Header>

    <Styled.SummaryStrip as="div">
      {Array.from({ length: 4 }).map((_, index) => (
        <Styled.SummaryItem key={index}>
          <Skeleton width="2.25rem" height="2.25rem" />
          <Styled.SkeletonStack>
            <Skeleton width="5rem" height="0.75rem" />
            <Skeleton width="9rem" height="1rem" />
          </Styled.SkeletonStack>
        </Styled.SummaryItem>
      ))}
    </Styled.SummaryStrip>

    <Styled.StatsGrid as="div">
      {Array.from({ length: 4 }).map((_, index) => (
        <Styled.StatCard key={index}>
          <Skeleton width="8rem" height="1rem" />
          <Skeleton width="5rem" height="2.5rem" />
          <Skeleton width="7rem" height="0.875rem" />
        </Styled.StatCard>
      ))}
    </Styled.StatsGrid>

    <Styled.TabsCard as="div">
      <Styled.SkeletonRow>
        <Skeleton width="9rem" height="3rem" />
        <Skeleton width="13rem" height="3rem" />
      </Styled.SkeletonRow>
      <Styled.SkeletonTable>
        {Array.from({ length: 5 }).map((_, index) => (
          <Styled.SkeletonTableRow key={index}>
            <Styled.SkeletonRow>
              <Skeleton width="2.5rem" height="2.5rem" variant="circular" />
              <Styled.SkeletonStack>
                <Skeleton width="10rem" height="1rem" />
                <Skeleton width="8rem" height="0.75rem" />
              </Styled.SkeletonStack>
            </Styled.SkeletonRow>
            <Skeleton width="15%" height="1rem" />
            <Skeleton width="20%" height="1rem" />
          </Styled.SkeletonTableRow>
        ))}
      </Styled.SkeletonTable>
    </Styled.TabsCard>
  </Styled.Container>
);
