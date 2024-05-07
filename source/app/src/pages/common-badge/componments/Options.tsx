import { SelectProps } from '@cloudscape-design/components';
import CommonBadge from '..';
import {
  PRIVARY_TYPE,
  BADGE_TYPE,
  PRIVARY_TYPE_DATA,
  PRIVARY_TYPE_INT_DATA,
} from '../types/badge_type';

export const NA_OPTION = { label: 'N/A', value: PRIVARY_TYPE_INT_DATA['N/A'] };
export const CONTAINS_PII_OPTION: SelectProps.Option = {
  label: '',
  value: PRIVARY_TYPE_DATA.ContainsPII,
  labelTag: PRIVARY_TYPE.ContainsPII,
  iconSvg: (
    <CommonBadge
      badgeType={BADGE_TYPE.Privacy}
      badgeLabel={PRIVARY_TYPE.ContainsPII}
      className="contain-pii-select"
    />
  ),
};

export const NON_PII_OPTION: SelectProps.Option = {
  label: '',
  value: PRIVARY_TYPE_DATA.NonPII,
  labelTag: PRIVARY_TYPE.NonPII,
  iconSvg: (
    <CommonBadge
      badgeType={BADGE_TYPE.Privacy}
      badgeLabel={PRIVARY_TYPE.NonPII}
      className="non-pii-select"
    />
  ),
};
