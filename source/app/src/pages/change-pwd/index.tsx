import { Button, Flashbar, FormField, Grid, Input, Link, SpaceBetween } from '@cloudscape-design/components';
import banner from 'banner.png';
// import * as fs from 'fs';
import { ChallengeNameType, CognitoIdentityProviderClient, RespondToAuthChallengeCommand } from '@aws-sdk/client-cognito-identity-provider';
import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RouterEnum } from 'routers/routerEnum';
import yaml from 'yaml';
import './style.scss';

const ChangePWD: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedThird, setSelectedThird] = useState("" as string);
  // const [loginType, setLoginType] = useState([] as any[]);
  const [newPass, setNewPass] = useState("" as string);
  const [error, setError] = useState("" as string);
  const [confirmPass, setConfirmPass] = useState("" as string);
  const [confirmPassError, setConfirmPassError] = useState("" as string);
  // const [thirdLogin, setThirdLogin] = useState([] as any[]);
  // const [author, setAuthor] =useState("" as string)
  const [items, setItems] = useState([] as any[]);
  const [config, setConfig]=useState(null as any);
  const [isLoading, setIsloading] = useState(true)
  const [params, setParams] = useState({
    session: location.state?.session,
    username: location.state?.username,
    reason: location.state?.reason,
    loginType: location.state?.loginType,
    provider: location.state?.provider,
    author: location.state?.author,
    thirdLogin: location.state?.thirdLogin,
    region: location.state?.region,
    clientId: location.state?.clientId
  } as any)
  // let { session, username, reason, loginType, provider, author, thirdLogin, region, clientId } = location.state || {}


  useEffect(()=>{
    setIsloading(true)
    if(params.provider == undefined){
      const loadConfig = async ()=> {
        let response = await fetch('/config.yaml')
        let data = await response.text()
        return yaml.parse(data);
      }
      loadConfig().then(configData =>{
        // setConfig(configData)
        // session = localStorage.getItem("session")
        // username = localStorage.getItem("userName")
        // loginType = localStorage.getItem("loginType")
        // provider = localStorage.getItem("providerName")
        // author = configData.author
        let thirdLogin, region, clientId = null
        if(configData.login.third && configData.login.third.length > 0){
          // const tmp_login_params = new Map<string, any>();
          thirdLogin = configData.login.third
          configData.login.oidc.providers.forEach((item:any)=>{
            if(item.name === "Cognito"){
              region = item.region
              clientId = item.clientId
              return 
            }
            // tmp_login_params.set(item.name, item)
          })
        }
        setParams({
          session: localStorage.getItem("session"),
          username: localStorage.getItem("userName"),
          reason: "by user",
          loginType: localStorage.getItem("loginType"),
          provider: localStorage.getItem("loginType"),
          author:  configData.author,
          thirdLogin: configData.login.third,
          region,
          clientId
        })
        setIsloading(false)
      })
    }
  },[])
  
  // useEffect(()=>{
  //   let tmp_login_type: any[] =[]
  //   let tmp_third_login: any[] =[]
  //   const loadConfig = async ()=> {
  //     let response = await fetch('/config.yaml')
  //     let data = await response.text()
  //     return yaml.parse(data);
  //   }
  //   loadConfig().then(configData =>{
  //     setAuthor(configData.author)
  //     if(configData.login.user){
  //       tmp_login_type.push({
  //         label: configData.login.user.label,
  //         value: configData.login.user.value,
  //         disabled: configData.login.user.disabled || false
  //       })
  //     }
  //     if(configData.login.sns){
  //       tmp_login_type.push({
  //         label: configData.login.sns.label,
  //         value: configData.login.sns.value,
  //         disabled: configData.login.sns.disabled || false
  //       })
  //     }
  //     if(configData.login.oidc && configData.login.oidc.providers.length > 0){
  //       const oidcOptions:any[] =[]
  //       configData.login.oidc.providers.forEach((item:any)=>{
  //         oidcOptions.push({
  //           label: item.name,
  //           iconUrl:`../../imgs/${item.iconUrl}.png`,
  //           value: item.name,
  //           tags: [item.description]
  //         })
  //       })
  //       tmp_login_type.push({
  //         label: configData.login.oidc.label,
  //         value: configData.login.oidc.value,
  //         disabled: configData.login.oidc.disabled || false
  //       })
  //       setOidcOptions(oidcOptions)
  //     }
  //     if(configData.login.third && configData.login.third.length > 0){
  //       tmp_third_login = configData.login.third
  //       setThirdLogin(tmp_third_login)
  //     }
  //     setLoginType(tmp_login_type)
  //   })
  // })
  
  // const changeLoginType = (checked:boolean,loginType: string)=>{
  //   if(checked){ 
  //     setSelectedLoginType(loginType)
  //   } else{
  //     setSelectedLoginType("")
  //   }
    
  // }
  const toLogin =()=>{
    navigate(RouterEnum.Login.path)
  }

  const toRegister =()=>{
    navigate(RouterEnum.Register.path)
  }

  const handleMouseEnter =(target: string)=>{
    setSelectedThird(target)
  }

  const handleMouseLeave =(target: string)=>{
    setSelectedThird("")
  }

  const changeNewPass=(target:string)=>{
      if(target===null || target===""){
        setNewPass(target)
        setError("New password is required.")
        return
      }
      setError("")
      setNewPass(target)
  }

  const changeConfirmPass=(target:string)=>{
    if(target!==newPass){
      setConfirmPass(target)
      setConfirmPassError("The two entered passwords do not match.")
      return
    }
    setConfirmPassError("")
    setConfirmPass(target)
  }

  const changePWD=async()=>{
    if(error!=='' || confirmPassError!=='') return
    if(newPass===''){
      setError("New password is required.")
      return
    }
    try {
      const response = await respondToNewPasswordChallenge(params.session, params.region, params.clientId, params.username, newPass);
      console.log(response);
  } catch (error) {
      console.log(error)
  }


  }


useEffect(()=>{
  if(error!==null || error!==""){
    setItems([{
      header: error,
      type: 'error',
      content: null,
      dismissible: true,
      dismissLabel: "Dismiss message",
      onDismiss: () => setItems([]),
      id: "message_1"
    }])
  }
},[error])
  
  return (
    <div className="changepwd-div">
      {error!=null && <div className='error'><Flashbar items={items} /></div>}
      <div className='container'>
        <img src={banner} alt='banner' className='banner'/>
        <div className='sub-title'>Supported by {params.author}</div>
        <div className='tab' style={{paddingLeft:'10%'}}>
          <div style={{height:270,width:'90%'}}>
          <div style={{color:"#000000a6",fontSize:18, fontWeight:800, marginBottom:20}}>Change Password <span style={{fontSize:12, fontWeight:500}}>({params.reason})</span></div>
          <div style={{width:'100%'}}>
            <Grid gridDefinition={[{colspan:6},{colspan:6}]}>
              {/* {loginType.map(item=>(<div>
                <Checkbox
                  disabled={item.disabled}
                  checked={selectedLoginType === item.value}
                  onChange={({ detail }) => {
                      changeLoginType(detail.checked,item.value);
                  }}
                >
                  {item.label}
                </Checkbox>
              </div>))} */}
              <FormField
                  description=""
                  label="Login Type"
                >
                 {params.loginType==='oidc'?"OIDC":(params.loginType==='user'?"Username/Password":"SNS")} - {params.provider}
              </FormField>
              <FormField
                  description=""
                  label="Current User"
                >
                 {params.username}
              </FormField>
            </Grid>
            {(<div style={{marginTop:15}}>
              <SpaceBetween size={'m'} direction='vertical'>
                <FormField
                  description="Please input new password..."
                  label="New Password"
                  errorText={error}
                >
                  
                    <Input
                      value={newPass}
                      placeholder='Input new password...'
                      onChange={({ detail })=>changeNewPass(detail.value)}
                    />
                  
                </FormField>
    <FormField
      description="Please enter a email, we will send a password reset email to this address..."
      label="Confirm New Password"
      errorText={confirmPassError}

    >
      <Input
        value={confirmPass}
        placeholder='Input confirm password...'
        onChange={event =>
          changeConfirmPass(event.detail.value)
        }
      />
    </FormField></SpaceBetween>
              </div>)}
          </div>
        </div>
        <div className='bottom-button'>
          <Button variant="primary" className='login-buttom' onClick={()=>changePWD()}>Submit</Button>
        </div>
        <div style={{color: 'rgb(128, 128, 128)', fontSize: 14,marginTop: 30, width:'90%'}}>
          {(params.thirdLogin && params.thirdLogin.length>0)?(
          <Grid gridDefinition={[{colspan:4},{colspan:8}]}>
            <SpaceBetween direction='horizontal' size='s'>
              {params.thirdLogin.map((item:any)=>{
                return (<div key={item.type} onMouseEnter={()=>handleMouseEnter(item.type)} onMouseLeave={()=>handleMouseLeave(item.type)}>
                          <img src={selectedThird===item.type? `../imgs/${item.iconUrlSelected}.png`:`../imgs/${item.iconUrl}.png`} alt="" style={item.iconStyle}/>
                        </div>)
                })
              }
            </SpaceBetween>
            <div style={{paddingTop:15, textAlign:'right'}}>
              <span style={{color: 'rgb(128, 128, 128)'}}>Don't have an account? </span>
              <Link onFollow={toRegister}>Register</Link>
              <span style={{color: 'rgb(128, 128, 128)'}}> or </span>
              <Link onFollow={toLogin}>Login</Link>
            </div>
          </Grid>):(
          <Grid gridDefinition={[{colspan:12}]}>
            <div style={{paddingTop:5, textAlign:'right'}}>
              <span style={{color: 'rgb(128, 128, 128)'}}>Don't have an account? </span>
              <Link onFollow={toRegister}>Register</Link>
              <span style={{color: 'rgb(128, 128, 128)'}}> or </span>
              <Link onFollow={toLogin}>Login</Link>
            </div>
          </Grid>)}
          <div style={{marginTop:10,textAlign:'right',color:'red',fontWeight:800,height:16}}>{error}</div>
        </div>
      </div>   
    </div>
  </div>
  );
};

export default ChangePWD;
const respondToNewPasswordChallenge = async(session: any, region:string, clientId: string, username: any, newPass: string) => {
  const params = {
    ChallengeName: ChallengeNameType.NEW_PASSWORD_REQUIRED,
    ClientId: clientId,
    Session: session,
    ChallengeResponses: {
        USERNAME: username,
        NEW_PASSWORD: newPass
    }
};
const client = new CognitoIdentityProviderClient({
  region,
});
const command = new RespondToAuthChallengeCommand(params);
return await client.send(command);
}

