import React from 'react';
import {
  Alert,
  Header,
  SpaceBetween,
  ContentLayout,
} from '@cloudscape-design/components';
import BreadcrumbGroup, {
  BreadcrumbGroupProps,
} from '@cloudscape-design/components/breadcrumb-group';

import './style.scss';

interface PageHeaderProps {
  title?: string | undefined;
  description?: string;
  actionButtons?: React.ReactNode;
  info?: React.ReactNode;
  alertDescription?: string;
  breadcrumbGroup?: Array<BreadcrumbGroupProps.Item>;
}

/**
 * 页面公共头组件
 * @returns
 */
const PageHeader: React.FC<PageHeaderProps> = (props: PageHeaderProps) => {
  const {
    title,
    description,
    actionButtons,
    info,
    alertDescription,
    breadcrumbGroup,
  } = props;

  return (
    <div>
      <ContentLayout
        header={
          <div className="header-space">
            <SpaceBetween size="m">
              {breadcrumbGroup && (
                <BreadcrumbGroup items={breadcrumbGroup} ariaLabel={title} />
              )}
              <Header
                variant="h1"
                info={info}
                description={description}
                actions={actionButtons}
              >
                {title}
              </Header>
              {alertDescription && <Alert>{alertDescription}</Alert>}
            </SpaceBetween>
          </div>
        }
      ></ContentLayout>
    </div>
  );
};

export default PageHeader;
