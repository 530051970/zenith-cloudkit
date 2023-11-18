import {
  SideNavigation,
  SideNavigationProps,
} from '@cloudscape-design/components';
import Badge from "@cloudscape-design/components/badge";
import React from 'react';
import { RouterEnum } from 'routers/routerEnum';
import './style.scss';
import { useTranslation } from 'react-i18next';
import { AMPLIFY_CONFIG_JSON, buildDocLink } from 'ts/common';
import { AmplifyConfigType } from 'ts/types';
import leemo_cn from '../../hello2.png';
import leemo_en from '../../hello2.png';

interface INavigationProps {
  activeHref: string;
}

const Navigation: React.FC<INavigationProps> = (props: INavigationProps) => {
  const { activeHref } = props;
  const { t, i18n } = useTranslation();
  const navHeader = { logo:{src:i18n.language=='en'?leemo_en:leemo_cn}, href: RouterEnum.Home.path };
  const originConfig = localStorage.getItem(AMPLIFY_CONFIG_JSON);
  const configData: AmplifyConfigType = JSON.parse(originConfig || '{}');
  const navItems: SideNavigationProps.Item[] = [
    { type: 'link', text: t('nav.summary'), href: RouterEnum.Home.path },
    {
      type: 'section',
      text: t('nav.tools'),
      items: [{
        type: 'link',
        text: t('nav.dataGenerator'),
        href: RouterEnum.DataGenerate.path,
      },{
        type: 'link',
        text: t('nav.batchDeleteS3'),
        href: RouterEnum.BatchDeleteS3.path,
      },{
        type: 'link',
        text: t('nav.sshAgent'),
        href: RouterEnum.SSHAgent.path,
      }],
      
    },
    {
      type: 'section',
      text: t('nav.features'),
      items: [], 
    },
    {
      type: 'section',
      text: t('nav.scaffolds'),
      items: [], 
    },
    { type: 'divider' }
    ,
        {
          type: "link",
          text: t('nav.notifications'),
          href: "#/notifications",
          info: <Badge color="red">23</Badge>
        },
    {
      type: 'link',
      text: t('nav.doc'),
      href: buildDocLink(i18n.language),
      external: true,
    },
    // {
    //   type: 'link',
    //   text: t('nav.version'),
    //   href: RouterEnum.TimeLine.path,
    //   info: <Badge>{configData.version}</Badge>
    // },
  ];
  return (
    <>
      <SideNavigation
        header={navHeader}
        items={navItems}
        activeHref={activeHref}
        className="side-nav"
      />
    </>
  );
};

export default Navigation;
