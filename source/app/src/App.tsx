import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import { AmplifyConfigType, AppSyncAuthType } from './ts/types';
import AppRouter from 'routers';
import LayoutHeader from 'pages/signed-in-page/LayoutHeader';
import CommonAlert from 'pages/common-alert';
import { WebStorageStateStore } from 'oidc-client-ts';
import { AuthProvider, useAuth, AuthProviderProps } from 'react-oidc-context';
import { AMPLIFY_CONFIG_JSON, BACKEND_URL_KEY } from 'ts/common';

import './index.scss';
import { Button, Spinner } from '@cloudscape-design/components';
import PageSpinner from 'pages/page-spinner';
import NoAccess from 'pages/no-access';
import { useTranslation } from 'react-i18next';

interface SignedInPageProps {
  user: any;
  signOut: any;
}

const CONFIG_URL = '/aws-exports.json'

// const CONFIG_URL =
//   process.env.REACT_APP_ENV === 'development' ||
//   process.env.REACT_APP_ENV === 'local'
//     ? '/aws-exports.json'
//     : '/config/getConfig';

// const VERSION_URL =
//   process.env.REACT_APP_ENV === 'development' ||
//   process.env.REACT_APP_ENV === 'local'
//     ? '/version/get-latest-version'
//     : '/version/get-latest-version';

const ERROR_TIME_KEY = 'OOPS_ERROR_TIMES';

const AppBody = ({ signOut, user }:{signOut:any, user: any}) => {
  return (
    // <React.StrictMode>
    <BrowserRouter>
        {user!=null &&<LayoutHeader signOut={signOut} user={user} />}
          <AppRouter user={user}/>
          <CommonAlert />
          <PageSpinner />
    </BrowserRouter>
    // </React.StrictMode>
  );
};

const OIDCAppRouter: React.FC = () => {
  const auth = useAuth();
  const { t } = useTranslation();
  // useEffect(() => {

  //   document.title=t('title')
  //   // "一站式数据安全平台";
  //   // the `return` is important - addAccessTokenExpiring() returns a cleanup function
  //   return auth?.events?.addAccessTokenExpiring((event) => {
  //     auth.signinSilent();
  //   });
  // }, [auth.events, auth.signinSilent]);

  // if (auth.isLoading) {
  //   return (
  //     <div className="page-loading">
  //       <Spinner />
  //     </div>
  //   );
  // }

  // if (auth.error) {
  //   if (auth.error.message.startsWith('No matching state')) {
  //     window.location.href = '/';
  //     return null;
  //   }
  //   let errorTimes = parseInt(localStorage.getItem(ERROR_TIME_KEY) || '0', 0);
  //   if (errorTimes >= 3) {
  //     return <div>Oops... {auth.error.message}</div>;
  //   }
  //   setTimeout(() => {
  //     localStorage.clear();
  //     errorTimes++;
  //     localStorage.setItem(ERROR_TIME_KEY, errorTimes.toString());
  //     window.location.reload();
  //   }, 1000);
  // }

  // 本地先跳过验证
  // if (
  //   auth.isAuthenticated ||
  //   process.env.REACT_APP_ENV === 'development' ||
  //   process.env.REACT_APP_ENV === 'local'
  // ) {
  //   return (
  //     <div>
  //       <AppBody
  //         signOut={() => {
  //           auth.removeUser();
  //           localStorage.removeItem(AMPLIFY_CONFIG_JSON);
  //         }}
  //         user={auth.user}
  //       />
  //     </div>
  //   );
  // }

    return (
        <AppBody
          signOut={() => {
            auth.removeUser();
            localStorage.removeItem(AMPLIFY_CONFIG_JSON);
          }}
          user={null}
        />
    );

};

const App: React.FC = () => {
  const [oidcConfig, setOidcConfig] = useState<AuthProviderProps>();
  const [loadingConfig, setLoadingConfig] = useState(true);

  const initAuthentication = (configData: AmplifyConfigType) => {
    if (configData.aws_authenticationType === AppSyncAuthType.OPEN_ID) {
      const settings = {
        userStore: new WebStorageStateStore({ store: window.localStorage }),
        authority: configData.aws_oidc_issuer,
        scope: 'openid email profile',
        automaticSilentRenew: true,
        client_id: configData.aws_oidc_client_id,
        redirect_uri: configData.aws_oidc_customer_domain
          ? configData.aws_oidc_customer_domain
          : 'https://' + configData.aws_alb_url,
      };
      setOidcConfig(settings);
    }
  };

  const getConfig = async () => {
    const timeStamp = new Date().getTime();
    setLoadingConfig(true);
    const originConfig = localStorage.getItem(AMPLIFY_CONFIG_JSON);
    let configData: AmplifyConfigType = JSON.parse(originConfig || '{}');
    if (
      !configData ||
      Object.keys(configData).length === 0 ||
      configData.expired > +new Date()
    ) {
      // Get config
      const res = await Axios.get(`${CONFIG_URL}?timestamp=${timeStamp}`);
      configData = res.data;
      configData.expired = +new Date() + configData.expired * 60 * 3600 * 1000;
    }



    if (configData.backend_url) {
      localStorage.setItem(BACKEND_URL_KEY, configData.backend_url);
    }

    // Get oidc logout url from openid configuration
    if (configData.aws_authenticationType === AppSyncAuthType.OPEN_ID) {
      Axios.get(
        `${configData.aws_oidc_issuer}/.well-known/openid-configuration`
      ).then((res) => {
        configData.aws_oidc_logout_endpoint = res.data.end_session_endpoint;
        localStorage.setItem(AMPLIFY_CONFIG_JSON, JSON.stringify(configData));
        initAuthentication(configData);
        setLoadingConfig(false);
      });
    } else {
      !originConfig &&
        localStorage.setItem(AMPLIFY_CONFIG_JSON, JSON.stringify(configData));
      setLoadingConfig(false);
    }
  };

  const setLocalStorageAfterLoad = async () => {
    if (localStorage.getItem(AMPLIFY_CONFIG_JSON)) {
      const configData = JSON.parse(
        localStorage.getItem(AMPLIFY_CONFIG_JSON) || ''
      );
      initAuthentication(configData);
      setLoadingConfig(false);
    } else {
      await getConfig();
    }
  };

  // Get Amplfy Config from aws-exports.json
  useEffect(() => {
    if (window.performance) {
      if (performance.navigation.type === 1) {
        getConfig();
      } else {
        setLocalStorageAfterLoad();
      }
    } else {
      setLocalStorageAfterLoad();
    }
  }, []);

  if (window.location.pathname === '/noaccess') {
    return <NoAccess />;
  } else {
    return (
      <>
        {loadingConfig ? (
          <div className="page-loading">
            <Spinner />
          </div>
        ) : (
          <AuthProvider {...oidcConfig}>
            <OIDCAppRouter />
          </AuthProvider>
        )}
      </>
    );
  }
};

export default App;
