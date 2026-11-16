import { LuMapPin, LuPencil } from 'react-icons/lu';
import { ActionMenu } from '../../components/ActionMenu';
import { Tag } from '../../components/Tag';
import { useLocale } from '../../hooks/useLocale';
import { interpolate } from '../../locales';
import type { GroupDetails } from '../../types/group';
import * as Styled from './styles';

type GroupHeaderProps = {
  group: GroupDetails;
  groupName: string;
  onEditLocation: () => void;
  onToggleStatus: () => void;
};

export const GroupHeader = ({
  group,
  groupName,
  onEditLocation,
  onToggleStatus,
}: GroupHeaderProps) => {
  const { group_details: text } = useLocale();
  const isActive = group.is_active;

  const location = !group.city
    ? text.notInformed
    : group.zone
      ? interpolate(text.header.location, { city: group.city, zone: group.zone })
      : group.city;

  return (
    <Styled.Header $enter={40}>
      <Styled.HeaderInfo>
        <Styled.TitleRow>
          <Styled.Title>{groupName}</Styled.Title>
          <Styled.StatusTag key={String(isActive)}>
            <Tag color={isActive ? 'success' : 'neutral'}>
              <Styled.StatusDot $live={isActive} aria-hidden="true" />
              {isActive ? text.header.statusActive : text.header.statusClosed}
            </Tag>
          </Styled.StatusTag>
        </Styled.TitleRow>

        <Styled.Subline>
          <LuMapPin aria-hidden />
          {location}
        </Styled.Subline>
      </Styled.HeaderInfo>

      <Styled.HeaderActions>
        <Styled.NeutralButton
          variant="secondary"
          icon={<LuPencil aria-hidden />}
          onClick={onEditLocation}
        >
          {text.header.editLocation}
        </Styled.NeutralButton>

        <ActionMenu
          ariaLabel={text.header.moreActions}
          items={[
            {
              label: isActive ? text.header.closeGroup : text.header.reopenGroup,
              variant: isActive ? 'danger' : 'default',
              onClick: onToggleStatus,
            },
          ]}
        />
      </Styled.HeaderActions>
    </Styled.Header>
  );
};
