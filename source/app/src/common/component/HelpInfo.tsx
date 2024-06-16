import { HelpPanel } from '@cloudscape-design/components';
import React from 'react';
import { ExternalLinkGroup } from './external-link-group';
import { useTranslation } from 'react-i18next';

interface LinkItemType {
  href: string;
  text: string;
}

interface HelpInfoProps {
  title: string | null;
  description: string | null;
  linkItems: LinkItemType[];
}

const HelpInfo: React.FC<HelpInfoProps> = (props: HelpInfoProps) => {
  const { title, description, linkItems } = props;
  const { t } = useTranslation();
  return (
    <HelpPanel
      header={<h2>{title}</h2>}
      footer={
        <ExternalLinkGroup header={t('learnMore') || ''} items={linkItems} />
      }
    >
      <p>{description}</p>
    </HelpPanel>
  );
};

export default HelpInfo;
