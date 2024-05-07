import { BreadcrumbGroup } from '@cloudscape-design/components';
import React from 'react';
import { useTranslation } from 'react-i18next';

type BreadCrumbType = {
  text: string;
  href: string;
};

interface ICustomBreadCrumbProps {
  breadcrumbItems: BreadCrumbType[];
}

const CustomBreadCrumb: React.FC<ICustomBreadCrumbProps> = (
  props: ICustomBreadCrumbProps
) => {
  const { breadcrumbItems } = props;
  const { t } = useTranslation();
  return (
    <BreadcrumbGroup
      items={breadcrumbItems}
      expandAriaLabel={t('breadcrumb.showPath') || ''}
      ariaLabel={t('breadcrumb.breadcrumb') || ''}
    />
  );
};

export default CustomBreadCrumb;
