import { AuthFlowType, CognitoIdentityProviderClient, InitiateAuthCommand, NotAuthorizedException, UserNotFoundException } from '@aws-sdk/client-cognito-identity-provider';
import { Button, Checkbox, Flashbar, Grid, Link, SpaceBetween, Spinner, Tabs } from '@cloudscape-design/components';
import banner from 'banner.png';
import { LOGIN_TYPE } from 'enum/common_types';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RouterEnum } from 'routers/routerEnum';
import yaml from 'yaml';
import OIDC from './component/oidc';
import SNS from './component/sns';
import User from './component/user';
import './style.scss';

const Login: FC = () => {
  const [activeTabId, setActiveTabId] = useState(LOGIN_TYPE.OIDC);
  const [username, setUsername] = useState(null as any);
  const [password, setPassword] = useState(null as any);
  const [keep, setKeep] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("" as string);
  const [config, setConfig]=useState(null as any);
  const [selectedProvider, setSelectedProvider] = useState(null as any);
  const [selectedProviderName, setSelectedProviderName] = useState(null as any);
  const [selectedThird, setSelectedThird]  = useState("" as string);
  const [tabs, setTabs] = useState([] as any[]);
  const [thirdLogin, setThirdLogin] = useState([] as any[]);
  const [author, setAuthor] = useState("" as string)
  const [version, setVersion] = useState(0)
  const [loginParams, setLoginParams] = useState(null as any);
  const [isLoading, setIsloading] = useState(true)

  useEffect(()=>{
    console.log("=====login.tsx")
    const loadConfig = async ()=> {
      let response = await fetch('/config.yaml')
      let data = await response.text()
      return yaml.parse(data);
    }
    loadConfig().then(configData =>{
      setConfig(configData)
      setIsloading(false)
    })
  },[])

  useEffect(()=>{
      if(config!==null){
      let tmp_tabs: any[] =[]
      let tmp_third_login: any[] =[]
      setAuthor(config.author)
      if(config.login.user){
        tmp_tabs.push({
          label: <div style={{width:100, textAlign: 'right'}}>{config.login.user.label}</div>,
          id: "user",
          content: (<User 
                      username={username}
                      password={password}
                      setUsername={setUsername}
                      setPassword={setPassword}
                    />),
          disabled: config.login.user.disabled || false
        })
      }
      if(config.login.sns){
        tmp_tabs.push({
          label: <div style={{paddingLeft:20,width:120, textAlign: 'center'}}>{config.login.sns.label}</div>,
          id: "sns",
          disabled: config.login.sns.disabled || false,
          content: (<SNS 
                      username={username}
                      password={password}
                      setUsername={setUsername}
                      setPassword={setPassword}
                    />)
        })
      }
      if(config.login.oidc && config.login.oidc.providers.length > 0){
        const tmp_login_params = new Map<string, any>();
        const oidcOptions:any[] =[]
        config.login.oidc.providers.forEach((item:any)=>{
          oidcOptions.push({
            label: item.name,
            iconUrl:`../../imgs/${item.iconUrl}.png`,
            value: item.name,
            tags: [item.description]
          })
          tmp_login_params.set(item.name, item)
        })
        tmp_tabs.push({
          label: <div style={{width:120, textAlign: 'center'}}>{config.login.oidc.label}</div>,
          id: "oidc",
          disabled: config.login.oidc.disabled || false,
          content: (<OIDC
            provider= {selectedProvider}
            username={username}
            password={password}
            oidcOptions={oidcOptions}
            setSelectedProviderName={setSelectedProviderName}
            setProvider={setSelectedProvider}
            setUsername={setUsername}
            setPassword={setPassword}
          />)
        })
        setLoginParams(tmp_login_params)
      }
      if(config.login.third && config.login.third.length > 0){
        tmp_third_login = config.login.third
        setThirdLogin(tmp_third_login)
      }
      setTabs(tmp_tabs)}
  },[config, selectedProvider, username, password])
   
  const forgetPwd =()=>{
    navigate(RouterEnum.FindPWD.path)
  }

  const handleMouseEnter =(target: string)=>{
    setSelectedThird(target)
  }

  const handleMouseLeave =(target: string)=>{
    setSelectedThird("")
  }

  const toRegister =()=>{
    navigate(RouterEnum.Register.path)
  }

  const login = () => {
    const ver = version
    // console.log("selectedProvider is:"+selectedProvider.value)
    if(activeTabId === LOGIN_TYPE.OIDC && selectedProvider == null){
      setError("provideId is required")
      setVersion(ver + 1)
      return false;
    }
    if(username == null){
      setError("username is required")
      setVersion(ver + 1)
      return false;
    }
    if(password == null){
      setError("password is required")
      setVersion(ver + 1)
      return false;
    }

    const loginParam = loginParams.get(selectedProvider.value)
    switch(selectedProvider.value){
      case "Cognito":
        cognitoLogin(loginParam);
        break;
      default:
        break;
    }
    // navigate(RouterEnum.Home.path)
  }
  
  // const input = { // InitiateAuthRequest
  //   AuthFlow: "USER_SRP_AUTH" || "REFRESH_TOKEN_AUTH" || "REFRESH_TOKEN" || "CUSTOM_AUTH" || "ADMIN_NO_SRP_AUTH" || "USER_PASSWORD_AUTH" || "ADMIN_USER_PASSWORD_AUTH", // required
  //   AuthParameters: { // AuthParametersType
  //     "<keys>": "STRING_VALUE",
  //   },
  //   ClientMetadata: { // ClientMetadataType
  //     "<keys>": "STRING_VALUE",
  //   },
  //   ClientId: "STRING_VALUE", // required
  //   AnalyticsMetadata: { // AnalyticsMetadataType
  //     AnalyticsEndpointId: "STRING_VALUE",
  //   },
  //   UserContextData: { // UserContextDataType
  //     IpAddress: "STRING_VALUE",
  //     EncodedData: "STRING_VALUE",
  //   },
  // };

  const cognitoLogin = async(loginParam:any)=>{
    // const { initiateAuth } = require('../tools/auth/initiateAuth');
  //   const params = {
  //     AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
  //     // UserPoolId:loginParam.userPoolId,
  //     ClientId: loginParam.clientId,
  //     // ChallengeName:"",
  //     AuthParameters: {
  //       USERNAME: username,
  //       PASSWORD: password,
  //   },
  // };
  try {
    const authResponse = await initiateAuth(loginParam.clientId, loginParam.region, username, password);
      if(authResponse.ChallengeName==="NEW_PASSWORD_REQUIRED"){
        navigate(RouterEnum.ChangePWD.path, { 
          state: {
            session: authResponse.Session,
            reason:"First Login",
            username,
            loginType: activeTabId,
            provider: selectedProviderName,
            author,
            thirdLogin,
            region: loginParam.region,
            clientId: loginParam.clientId
          }
        });
      }
    // const command = new InitiateAuthCommand(params);  
    // const cognitoClient = new CognitoIdentityProviderClient({
    //   region: loginParam.region,
    // });
    // console.log(`cognitoClient is ${cognitoClient}`)
    // console.log(`command is ${command}`)
    // const { AuthenticationResult } = await cognitoClient.send(command);
    // console.log(`AuthenticationResult is ${AuthenticationResult}`)
    // navigate(RouterEnum.Home.path)
    if (authResponse.AuthenticationResult) {
      localStorage.setItem("loginType", activeTabId || '');
      localStorage.setItem("providerName", selectedProviderName || '');
      localStorage.setItem("userName", username || '');
      localStorage.setItem("idToken", authResponse.AuthenticationResult.IdToken || '');
      localStorage.setItem("accessToken", authResponse.AuthenticationResult.AccessToken || '');
      localStorage.setItem("refreshToken", authResponse.AuthenticationResult.RefreshToken || '');
      localStorage.setItem("session", authResponse.Session || '');
      navigate(RouterEnum.Home.path)
      // return authResponse.AuthenticationResult;
    }
    // navigate(RouterEnum.Home.path)
  } catch (error) {
    if(error instanceof UserNotFoundException || error instanceof NotAuthorizedException) {
      setError(error.message)
    } else {
      setError("Unknown error, please contact the administrator.")
    }
    // console.error("Error signing in: ", error);
    // throw error;
  }
}

// useEffect(()=>{
//   if(error!==null || error!==""){
//     setItems([{
//       header: error,
//       type: 'error',
//       content: null,
//       dismissible: true,
//       dismissLabel: "Dismiss message",
//       onDismiss: () => setItems([]),
//       id: "message_1"
//     }])
//   }
// },[error])
  
  if(isLoading){
    return (
      <Spinner/>
    )
  }
  
  return (
    <div className="login-div">
      {/* {error!=null && <div className='error'>{error}</div>} */}      
      <div className='container'>
        {/* <div style={{padding:15}}> */}
        <img src={banner} alt='banner' className='banner'/>
        <div className='sub-title'>Supported by {author}</div>
        <div className='tab' style={{paddingLeft:'10%'}}>
        <Tabs
          onChange={({ detail }) =>
            setActiveTabId(detail.activeTabId)
          }
          activeTabId={activeTabId}
          tabs={tabs}
        />
        <div className='bottom-setting'>
    <Grid
      gridDefinition={[{ colspan: 4 },{ colspan: 8 }]}
    >
      <div>
      <Checkbox
      onChange={({ detail }) =>
        setKeep(detail.checked)
      }
      checked={keep}
    >
      <span className='keep'>Keep me logged in</span>
    </Checkbox>
      </div>
      <div style={{textAlign:"right"}}>
      <Link onFollow={forgetPwd} >
      Forgot Password
    </Link>
      </div>
    </Grid>
    </div>
    <div className='bottom-button'>
    <Button variant="primary" className='login-buttom' onClick={login}>Log in</Button>
    </div>
    <div style={{display:'none'}}>{selectedProviderName}</div>
    <div style={{color: 'rgb(128, 128, 128)', fontSize: 14,marginTop: 30, width:'90%'}}>
      {(thirdLogin && thirdLogin.length>0)?(<Grid gridDefinition={[{colspan:6},{colspan:6}]}>
        <SpaceBetween direction='horizontal' size='s'>
          {thirdLogin.map(item=>{
             return (<div key={item.type} onMouseEnter={()=>handleMouseEnter(item.type)} onMouseLeave={()=>handleMouseLeave(item.type)}>
             <img src={selectedThird===item.type? `../imgs/${item.iconUrlSelected}.png`:`../imgs/${item.iconUrl}.png`} alt="" style={item.iconStyle}/>
           </div>)
          })}
        </SpaceBetween>
        <div style={{paddingTop:15, textAlign:'right'}}>
          <span style={{color: 'rgb(128, 128, 128)'}}>Don't have an account? </span>
          <Link onFollow={toRegister}>Register</Link>
        </div>
      </Grid>):(<Grid gridDefinition={[{colspan:12}]}>
        <div style={{paddingTop:5, textAlign:'center'}}>
          <span style={{color: 'rgb(128, 128, 128)'}}>Don't have an account? </span>
          <Link onFollow={toRegister}>Register</Link>
        </div>
        <div style={{display:"none"}}>{version}</div>
      </Grid>)}
      <div style={{marginTop:10,textAlign:'right',color:'red',fontWeight:800,height:16}}>{error}</div>
    </div>
    
    </div>
    
      
    {/* </div> */}
      {/* {(error!==null&&error!=='')?(
        <div style={{color:"white",height:40,backgroundColor:"#d9151561",borderBottomLeftRadius: 8,borderBottomRightRadius: 8,marginTop:15}}><Icon name="status-negative" />{error}</div>
      ):(
        <div style={{height:40,borderBottomLeftRadius: 8,borderBottomRightRadius: 8,marginTop:15}} ></div>
      )} */}
      
      </div>
    {/* <Flashbar items={items} /> */}
    </div>
  );
};

export default Login;
const initiateAuth= async(clientId: string, region: string, username:string, password:string) => {
  const params = {
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      }
  }
  const client = new CognitoIdentityProviderClient({
      region,
  });
  const command = new InitiateAuthCommand(params);
  return await client.send(command);
};

