import { Skeleton } from '../../components/Skeleton';
import * as Styled from './styles';

export const ParticipantDetailsSkeleton = () => (
  <Styled.Page aria-hidden="true">
    <Skeleton width="12rem" height="1.25rem" />

    <Styled.Columns>
      <Styled.ProfileCard>
        <Styled.SkeletonStack>
          <Skeleton width="4.5rem" height="4.5rem" variant="circular" />
          <Skeleton width="12rem" height="1.75rem" />
          <Skeleton width="9rem" height="1rem" />
          <Styled.SkeletonRow>
            <Skeleton width="4rem" height="1.5rem" />
            <Skeleton width="6rem" height="1.5rem" />
          </Styled.SkeletonRow>
        </Styled.SkeletonStack>
        <Styled.SkeletonRow>
          <Skeleton width="50%" height="2.5rem" />
          <Skeleton width="50%" height="2.5rem" />
        </Styled.SkeletonRow>
        <Styled.SkeletonStack>
          {Array.from({ length: 3 }).map((_, index) => (
            <Styled.SkeletonRow key={index}>
              <Skeleton width="2rem" height="2rem" />
              <Skeleton width="11rem" height="1rem" />
            </Styled.SkeletonRow>
          ))}
        </Styled.SkeletonStack>
        <Styled.SkeletonStack>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} width="100%" height="1rem" />
          ))}
        </Styled.SkeletonStack>
      </Styled.ProfileCard>

      <Styled.MainColumn>
        <Styled.StatsGrid as="div">
          {Array.from({ length: 3 }).map((_, index) => (
            <Styled.StatCard key={index}>
              <Skeleton width="7rem" height="1rem" />
              <Skeleton width="5rem" height="2.5rem" />
              <Skeleton width="9rem" height="0.875rem" />
            </Styled.StatCard>
          ))}
        </Styled.StatsGrid>

        <Styled.Card as="div">
          <Styled.CardHeader>
            <Skeleton width="7rem" height="1.5rem" />
          </Styled.CardHeader>
          <Styled.MeetingList as="div">
            {Array.from({ length: 4 }).map((_, index) => (
              <Styled.CardHeader key={index}>
                <Skeleton width="25%" height="1rem" />
                <Skeleton width="15%" height="1.25rem" />
                <Skeleton width="20%" height="1rem" />
              </Styled.CardHeader>
            ))}
          </Styled.MeetingList>
        </Styled.Card>
      </Styled.MainColumn>
    </Styled.Columns>
  </Styled.Page>
);
