import React, { useState, useEffect } from 'react';
import TopNavigation from '@cloudscape-design/components/top-navigation';
import './style.scss';
import { AmplifyConfigType, AppSyncAuthType } from 'ts/types';
import { AMPLIFY_CONFIG_JSON, buildDocLink } from 'ts/common';
import { User } from 'oidc-client-ts';
import { RouterEnum } from 'routers/routerEnum';
import { useTranslation } from 'react-i18next';

interface LayoutHeaderProps {
  user: any;
  signOut: any;
}

const ZH_TEXT = '简体中文';
const EN_TEXT = 'English(US)';
const ZH_LANGUAGE_LIST = ['zh', 'zh-cn', 'zh_CN', 'zh-CN'];
const EN_LANGUAGE_LIST = ['en', 'en-US', 'en_UK'];
const LANGUAGE_ITEMS = [
  { id: 'en', text: EN_TEXT },
  { id: 'zh', text: ZH_TEXT },
];

const LayoutHeader: React.FC<LayoutHeaderProps> = ({
  user,
  signOut,
}: LayoutHeaderProps) => {
  const { t, i18n } = useTranslation();
  const [fullLogoutUrl, setFullLogoutUrl] = useState('');
  const [oidcStorageId, setOidcStorageId] = useState('');
  const originConfig = localStorage.getItem(AMPLIFY_CONFIG_JSON);
  const configData: AmplifyConfigType = JSON.parse(originConfig || '{}');

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    if (ZH_LANGUAGE_LIST.includes(i18n.language)) {
      changeLanguage('zh');
    }
    if (EN_LANGUAGE_LIST.includes(i18n.language)) {
      changeLanguage('en');
    }

    // const configJSONObj: AmplifyConfigType = localStorage.getItem(
    //   AMPLIFY_CONFIG_JSON
    // )
    //   ? JSON.parse(localStorage.getItem(AMPLIFY_CONFIG_JSON) || '')
    //   : {};

    // if (configJSONObj.aws_authenticationType === AppSyncAuthType.OPEN_ID) {
    //   const idToken =
    //     process.env.REACT_APP_ENV === 'local' ||
    //     process.env.REACT_APP_ENV === 'development'
    //       ? ''
    //       : User.fromStorageString(
    //           localStorage.getItem(
    //             `oidc.user:${configJSONObj.aws_oidc_issuer}:${configJSONObj.aws_oidc_client_id}`
    //           ) || ''
    //         )?.id_token;
    //   // const idToken = ''
    //   setFullLogoutUrl(
    //     `${
    //       configJSONObj.aws_oidc_logout_endpoint
    //     }?id_token_hint=${idToken}&post_logout_redirect_uri=${
    //       configJSONObj.aws_oidc_customer_domain || configJSONObj.aws_alb_url
    //     }`
    //   );
    //   setOidcStorageId(
    //     `oidc.user:${configJSONObj.aws_oidc_issuer}:${configJSONObj.aws_oidc_client_id}`
    //   );
    // }
  }, []);

  return (
    <TopNavigation
      className="top-navigation"
      identity={{
        href: RouterEnum.Home.path,
        title: t('solution.name') || '',
      }}
      utilities={[
        {
          type: 'menu-dropdown',
          text: ZH_LANGUAGE_LIST.includes(i18n.language) ? ZH_TEXT : EN_TEXT,
          title: 'Language',
          ariaLabel: 'settings',
          onItemClick: (item) => {
            changeLanguage(item.detail.id);
          },
          items:
            i18n.language === 'zh' ? LANGUAGE_ITEMS.reverse() : LANGUAGE_ITEMS,
        },
        {
          type: 'menu-dropdown',
          text: user?.profile?.email,
          description: user?.profile?.email,
          iconName: 'user-profile',
          items: [
            {
              id: 'support-group',
              // text: t('header.support') || '',
              items: [
                {
                  id: 'documentation',
                  text: t('header.doc') || '',
                  href: buildDocLink(i18n.language),
                  external: true,
                },
                {
                  id: 'version',
                  text: t('header.version')+" "+configData.version || '',
                  disabled: true,
                  // href: RouterEnum.TimeLine.path,
                },
              ],
            },
            { id: 'signout', text: t('header.signout') || '' },
          ],
          onItemClick: (item) => {
            if (item.detail.id === 'signout') {
              if (oidcStorageId && fullLogoutUrl) {
                localStorage.removeItem(oidcStorageId);
                window.location.href = fullLogoutUrl;
              }
            }
          },
        },
      ]}
      i18nStrings={{
        searchIconAriaLabel: t('menu.search') || '',
        searchDismissIconAriaLabel: t('menu.closeSearch') || '',
        overflowMenuTriggerText: t('menu.more') || '',
        overflowMenuTitleText: t('menu.all') || '',
        overflowMenuBackIconAriaLabel: t('menu.back') || '',
        overflowMenuDismissIconAriaLabel: t('menu.closeMenu') || '',
      }}
    />
  );
};

export default LayoutHeader;
