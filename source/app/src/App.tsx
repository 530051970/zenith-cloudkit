import CommonAlert from 'pages/common-alert';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import AppRouter from 'routers';

import { Constant } from 'common/constants';
import NoAccess from 'pages/no-access';
import PageSpinner from 'pages/page-spinner';
import { RouterEnum } from 'routers/routerEnum';
import './index.scss';

// interface SignedInPageProps {
//   user: any;
//   signOut: any;
//   path:string;
// }

// const CONFIG_URL = '/aws-exports.json'

// const ERROR_TIME_KEY = 'OOPS_ERROR_TIMES';

const AppBody = ({ signOut, path }:{signOut:any, path:string}) => {
  const [user, setUser] = useState(null as any)
  const navigate = useNavigate()
  useEffect(() => {
    const pathName = window.location.href
    const lastIndex=pathName.lastIndexOf('/')
    if(Constant.EXECLUDE_PATHS.includes(pathName.substring(lastIndex)+1)){
      setUser({username:"dummy"})
    } else {
      // TODO：判断Token
      console.log(`pathName is ${pathName}`)
      const token = localStorage.getItem("idToken") || ''
      if(token==null || token===''){
        // window.location.href =
        navigate(RouterEnum.Login.path)
        setUser(null)
      }
      // validateToken(token).then(res=>{
      //   if(!res.success){
      //     navigate(RouterEnum.Login.path)
      //   } 
      // })
      setUser({userName:"dummy"})
    }
    // const loginType = localStorage.getItem("loginType")
    // const providerName = localStorage.getItem("providerName")
    // const userName = localStorage.getItem("userName")
    // if(loginType === null 
    //   || providerName === null 
    //   || userName === null  ) return
    // // if(loginType: localStorage.getItem("loginType")localStorage.getItem("userName")!==null)
    // setUser({
    //   loginType: localStorage.getItem("loginType"),
    //   provider: localStorage.getItem("providerName"),
    //   userName: localStorage.getItem("userName")
    // })
  }, []);

  return (
        <>
          <AppRouter user={user}/>
          <CommonAlert />
          <PageSpinner />
        </>
  );
};

const App: React.FC = () => {
  
  

  

  if (window.location.pathname === '/noaccess') {
    return <NoAccess />;
  } else {
      return (
        <BrowserRouter>
          <AppBody
            signOut={() => {
              localStorage.removeItem("loginType");
              localStorage.removeItem("providerName");
              localStorage.removeItem("userName");
              localStorage.removeItem("idToken");
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
            }}
            
            path={window.location.pathname}
          />
        </BrowserRouter>
      );
  }
};

export default App;
