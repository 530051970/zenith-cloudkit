import { Button, Checkbox, FormField, Grid, Input, Link, Select, SpaceBetween } from '@cloudscape-design/components';
import banner from 'banner.png';
// import * as fs from 'fs';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RouterEnum } from 'routers/routerEnum';
import yaml from 'yaml';
import './style.scss';

const Register: FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null as any);
  const [selectedThird, setSelectedThird]  = useState("" as string);
  const [loginType, setLoginType] = useState([] as any[]);
  const [thirdLogin, setThirdLogin] = useState([] as any[]);
  const [author, setAuthor] = useState("" as string)
  const [selectedLoginType, setSelectedLoginType] = useState("oidc" as string)
  const [email, setEmail] =useState("" as string)
  const [oidcProvider, setOidcProvider] =useState(null as any)
  const [oidcOptions, setOidcOptions] = useState([] as any[]);
  
  useEffect(()=>{
    let tmp_login_type: any[] =[]
    let tmp_third_login: any[] =[]
    const loadConfig = async ()=> {
      let response = await fetch('/config.yaml')
      let data = await response.text()
      return yaml.parse(data);
    }
    loadConfig().then(configData =>{
      setAuthor(configData.author)
      if(configData.login.user){
        tmp_login_type.push({
          label: configData.login.user.label,
          value: configData.login.user.value,
          disabled: configData.login.user.disabled || false
        })
      }
      if(configData.login.sns){
        tmp_login_type.push({
          label: configData.login.sns.label,
          value: configData.login.sns.value,
          disabled: configData.login.sns.disabled || false
        })
      }
      if(configData.login.oidc && configData.login.oidc.providers.length > 0){
        const oidcOptions:any[] =[]
        configData.login.oidc.providers.forEach((item:any)=>{
          oidcOptions.push({
            label: item.name,
            iconUrl:`../../imgs/${item.iconUrl}.png`,
            value: item.name,
            tags: [item.description]
          })
        })
        tmp_login_type.push({
          label: configData.login.oidc.label,
          value: configData.login.oidc.value,
          disabled: configData.login.oidc.disabled || false
        })
        setOidcOptions(oidcOptions)
      }
      if(configData.login.third && configData.login.third.length > 0){
        tmp_third_login = configData.login.third
        setThirdLogin(tmp_third_login)
      }
      setLoginType(tmp_login_type)
    })
  })
   
  const toLogin =()=>{
    navigate(RouterEnum.Login.path)
  }

  const handleMouseEnter =(target: string)=>{
    setSelectedThird(target)
  }

  const handleMouseLeave =(target: string)=>{
    setSelectedThird("")
  }

  const changeLoginType = (checked:boolean,loginType: string)=>{
    if(checked){ 
      setSelectedLoginType(loginType)
    } else{
      setSelectedLoginType("")
    }
    
  }

  
  return (
    <div className="register-div">
      {error!=null && <div className='error'>{error}</div>}
      <div className='container'>
        <img src={banner} alt='banner' className='banner'/>
        <div className='sub-title'>Supported by {author}</div>
        <div className='tab' style={{paddingLeft:'10%'}}>
          <div style={{height:270,width:'90%'}}>
          <div style={{color:"#000000a6",fontSize:18, fontWeight:800, marginBottom:20}}>Create Account</div>
          <div style={{width:'100%'}}>
            <Grid gridDefinition={[{colspan:4},{colspan:4},{colspan:4}]}>
              {loginType.map(item=>(<div>
                <Checkbox
                  disabled={item.disabled}
                  checked={selectedLoginType === item.value}
                  onChange={({ detail }) => {
                      changeLoginType(detail.checked,item.value);
                  }}
                >
                  {item.label}
                </Checkbox>
              </div>))}
            </Grid>
            {(selectedLoginType==='username')?(
              <div style={{marginTop:35}}>
                <FormField
                  description="Please enter a valid email address. If it exists and is associated with an existing user, we will send a password reset email to this address..."
                  label="Email"
                >
                  <Input
                    value={email}
                    placeholder='eg: developer@cloud.com'
                    onChange={event =>
                      setEmail(event.detail.value)
                    }
                  />
                </FormField>
              </div>):((selectedLoginType==='oidc')?(<div style={{marginTop:15}}>
                <FormField
                  description="Please choose one OIDC provider..."
                  label="OIDC Provider"
                >
                  <div className='item'>
                    <Select
                      placeholder='Please choose one OIDC provider'
                      selectedOption={oidcProvider}
                      onChange={({ detail }:{detail: any}) =>
                        setOidcProvider(detail.selectedOption)
                      }
                      options={oidcOptions}
                    />
                  </div>
                </FormField>
    <FormField
      description="Please enter a email, we will send a password reset email to this address..."
      label="Email"
    >
      <Input
        value={email}
        placeholder='eg: developer@cloud.com'
        onChange={event =>
          setEmail(event.detail.value)
        }
      />
    </FormField>
              </div>):(<>
              </>))}
          </div>
        </div>
        <div className='bottom-button'>
          <Button variant="primary" className='login-buttom' onClick={()=>{}}>Next</Button>
        </div>
        <div style={{color: 'rgb(128, 128, 128)', fontSize: 14,marginTop: 30, width:'90%'}}>
          {(thirdLogin && thirdLogin.length>0)?(
          <Grid gridDefinition={[{colspan:4},{colspan:8}]}>
            <SpaceBetween direction='horizontal' size='s'>
              {thirdLogin.map(item=>{
                return (<div key={item.type} onMouseEnter={()=>handleMouseEnter(item.type)} onMouseLeave={()=>handleMouseLeave(item.type)}>
                          <img src={selectedThird===item.type? `../imgs/${item.iconUrlSelected}.png`:`../imgs/${item.iconUrl}.png`} alt="" style={item.iconStyle}/>
                        </div>)
                })
              }
            </SpaceBetween>
            <div style={{paddingTop:15, textAlign:'right'}}>
              <span style={{color: 'rgb(128, 128, 128)'}}>Already have an account? </span>
              <Link onFollow={toLogin}>Login</Link>
            </div>
          </Grid>):(
          <Grid gridDefinition={[{colspan:12}]}>
            <div style={{paddingTop:5, textAlign:'right'}}>
              <span style={{color: 'rgb(128, 128, 128)'}}>Already have an account? </span>
              <Link onFollow={toLogin}>Login</Link>
            </div>
          </Grid>)}
        </div>
      </div>   
    </div>
  </div>
  );
};

export default Register;
