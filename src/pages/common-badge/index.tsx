import React from 'react';
import classnames from 'classnames';
import { Badge, Icon } from '@cloudscape-design/components';
import {
  BADGE_TYPE,
  PRIVARY_TYPE,
  CLSAAIFIED_TYPE,
  PRIVARY_TYPE_DATA,
} from './types/badge_type';
import { CommonBadgeProps } from '../../ts/common-badge/types';
import './style.scss';

/**
 * data list common badge
 * @param props
 * @returns
 */
const CommonBadge: React.FC<CommonBadgeProps> = (props: CommonBadgeProps) => {
  const { badgeType, badgeLabel = '', labelType, className } = props;
  if (badgeLabel === 'N/A') {
    return <>N/A</>;
  }
  if (badgeType === BADGE_TYPE.Privacy) {
    if (badgeLabel.toString() === '-1') {
      return <>N/A</>;
    }
    const badgeCls = classnames({
      'common-badge': true,
      'pii-badge':
        badgeLabel === PRIVARY_TYPE.ContainsPII ||
        badgeLabel.toString() === PRIVARY_TYPE_DATA.ContainsPII,
      'no-pii-badge':
        badgeLabel === PRIVARY_TYPE.NonPII ||
        badgeLabel.toString() === PRIVARY_TYPE_DATA.NonPII,
    });
    const showLabel =
      badgeLabel.toString() === PRIVARY_TYPE_DATA.ContainsPII
        ? PRIVARY_TYPE.ContainsPII
        : badgeLabel.toString() === PRIVARY_TYPE_DATA.NonPII
        ? PRIVARY_TYPE.NonPII
        : badgeLabel;
    return <Badge className={badgeCls + ' ' + className}>{showLabel}</Badge>;
  } else if (badgeType === BADGE_TYPE.DataIndf) {
    return <Badge className="data-indf-badge">{badgeLabel}</Badge>;
  }
  const badgeCls = classnames({
    'classified-badge': true,
    'success-badge': labelType === CLSAAIFIED_TYPE.Success,
    'system-badge':
      badgeLabel === CLSAAIFIED_TYPE.System ||
      labelType === CLSAAIFIED_TYPE.System,
    'manual-badge':
      badgeLabel === CLSAAIFIED_TYPE.Manual ||
      labelType === CLSAAIFIED_TYPE.Manual,
    'system-mark-badge':
      badgeLabel === CLSAAIFIED_TYPE.SystemMark ||
      labelType === CLSAAIFIED_TYPE.SystemMark,
    'failed-badge':
      badgeLabel === CLSAAIFIED_TYPE.Failed ||
      labelType === CLSAAIFIED_TYPE.Failed,
  });

  let iconName: any = 'status-pending';
  switch (badgeLabel) {
    case CLSAAIFIED_TYPE.SystemMark:
      iconName = 'status-pending';
      break;
    case 'CRAWLING':
      iconName = 'status-info';
      break;
    case CLSAAIFIED_TYPE.Failed:
      iconName = 'status-negative';
      break;
    case CLSAAIFIED_TYPE.Manual:
      iconName = 'status-in-progress';
      break;
    case CLSAAIFIED_TYPE.Success:
      iconName = 'status-positive';
      break;
    case 'Succeeded':
      iconName = 'status-positive';
      break;
    case 'SUCCEEDED':
      iconName = 'status-positive';
      break;
    case 'ACTIVE':
      iconName = 'status-positive';
      break;
    case CLSAAIFIED_TYPE.Completed:
      iconName = 'status-positive';
      break;
    case CLSAAIFIED_TYPE.Stopped:
      iconName = 'status-negative';
      break;
    default:
      if (labelType === CLSAAIFIED_TYPE.Failed) {
        iconName = 'status-negative';
      } else {
        iconName = 'status-stopped';
      }
      break;
  }

  return (
    <div className={badgeCls}>
      <Icon name={iconName} size="small" className="classified-icon" />
      <span className="classified-span">{badgeLabel}</span>
    </div>
  );
};

export default CommonBadge;
