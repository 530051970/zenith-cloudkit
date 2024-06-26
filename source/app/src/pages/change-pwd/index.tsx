import { Button, Flashbar, FormField, Grid, Input, Link, SpaceBetween } from '@cloudscape-design/components';
import banner from 'banner.png';
// import * as fs from 'fs';
import { ChallengeNameType, CognitoIdentityProviderClient, RespondToAuthChallengeCommand } from '@aws-sdk/client-cognito-identity-provider';
import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RouterEnum } from 'routers/routerEnum';
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
  const { session, username, reason, loginType, provider, author, thirdLogin, region, clientId } = location.state || {}
  
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
      const response = await respondToNewPasswordChallenge(session, region, clientId, username, newPass);
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
        <div className='sub-title'>Supported by {author}</div>
        <div className='tab' style={{paddingLeft:'10%'}}>
          <div style={{height:270,width:'90%'}}>
          <div style={{color:"#000000a6",fontSize:18, fontWeight:800, marginBottom:20}}>Change Password <span style={{fontSize:12, fontWeight:500}}>({reason})</span></div>
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
                 {loginType==='oidc'?"OIDC":(loginType==='user'?"Username/Password":"SNS")} - {provider}
              </FormField>
              <FormField
                  description=""
                  label="Current User"
                >
                 {username}
              </FormField>
            </Grid>
            {(<div style={{marginTop:15}}>
                <FormField
                  description="Please input new password..."
                  label="Password"
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
      label="Confirm Password"
      errorText={confirmPassError}

    >
      <Input
        value={confirmPass}
        placeholder='Input confirm password...'
        onChange={event =>
          changeConfirmPass(event.detail.value)
        }
      />
    </FormField>
              </div>)}
          </div>
        </div>
        <div className='bottom-button'>
          <Button variant="primary" className='login-buttom' onClick={()=>changePWD()}>Submit</Button>
        </div>
        <div style={{color: 'rgb(128, 128, 128)', fontSize: 14,marginTop: 30, width:'90%'}}>
          {(thirdLogin && thirdLogin.length>0)?(
          <Grid gridDefinition={[{colspan:4},{colspan:8}]}>
            <SpaceBetween direction='horizontal' size='s'>
              {thirdLogin.map((item:any)=>{
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

