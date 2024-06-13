import CommonAlert from 'pages/common-alert';
import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from 'routers';

import NoAccess from 'pages/no-access';
import PageSpinner from 'pages/page-spinner';
import './index.scss';

interface SignedInPageProps {
  user: any;
  signOut: any;
  path:string;
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

const AppBody = ({ signOut, user,path }:{signOut:any, user: any,path:string}) => {
  console.log("!!!!!:"+path)
  return (
    // <React.StrictMode>
    <BrowserRouter>
    {/* {useLocation().pathname} */}
        {/* {!([RouterEnum.Login.path].includes(path)) &&<LayoutHeader signOut={signOut} user={user} />} */}
          <AppRouter user={user}/>
          <CommonAlert />
          <PageSpinner />
    </BrowserRouter>
    // </React.StrictMode>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState(null as any)
  // const location = useLocation()
  // Get Amplfy Config from aws-exports.json
  useEffect(() => {
    console.log("=====app.tsx")
    const loginType = localStorage.getItem("loginType")
    const providerName = localStorage.getItem("providerName")
    const userName = localStorage.getItem("userName")
    if(loginType === null 
      || providerName === null 
      || userName === null  ) return
    // if(loginType: localStorage.getItem("loginType")localStorage.getItem("userName")!==null)
    setUser({
      loginType: localStorage.getItem("loginType"),
      provider: localStorage.getItem("providerName"),
      userName: localStorage.getItem("userName")
    })
  }, []);

  if (window.location.pathname === '/noaccess') {
    return <NoAccess />;
  } else {
      return (
          <AppBody
            signOut={() => {
              localStorage.removeItem("loginType");
              localStorage.removeItem("providerName");
              localStorage.removeItem("userName");
              localStorage.removeItem("idToken");
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
            }}
            user={user}
            path={window.location.pathname}
          />
      );
  }
};

export default App;
