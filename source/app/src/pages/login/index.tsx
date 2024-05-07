import React, { useState } from 'react';
import './style.scss';
import { Button, Checkbox, Container, Grid, Link, Tabs } from '@cloudscape-design/components';
import banner from 'banner.png';
import OIDC from './component/oidc';
import { useNavigate } from 'react-router-dom';
import { RouterEnum } from 'routers/routerEnum';
import { LOGIN_TYPE } from 'enum/common_types';

const Login: React.FC = () => {
  const [activeTabId, setActiveTabId] = React.useState(LOGIN_TYPE.OIDC);
  const [username, setUsername] = React.useState(null as any);
  const [password, setPassword] = React.useState(null as any);
  const [keep, setKeep] = React.useState(false);
  const navigate = useNavigate();
  const [error, setError] = React.useState(null as any);
  const [selectedProvider, setSelectedProvider] = React.useState(null as any);

  const login = () => {
    if(activeTabId === LOGIN_TYPE.OIDC && selectedProvider == null){
      setError("Kind reminder: provideId is required")
      return false;
    }
    if(username == null){
      setError("Kind reminder: username is required")
      return false;
    }
    if(password == null){
      setError("Kind reminder: password is required")
      return false;
    }

    navigate(RouterEnum.Home.path)
  }
  
  return (
    <div className="login-div">
      {error!=null && <div className='error'>{error}</div>}
      <div className='container'>
        <img src={banner} alt='banner' className='banner'/>
        <div className='sub-title'>Supported by Hubin@CSDC</div>
        <div className='tab'>
        <Tabs
          onChange={({ detail }) =>
            setActiveTabId(detail.activeTabId)
          }
          activeTabId={activeTabId}
          tabs={[
            {
              label: <div style={{width:100, textAlign: 'right', marginLeft: 75}}>Username</div>,
              id: "user",
              content: "First tab content area",
              disabled: true
            },
            {
              label: <div style={{width:120, textAlign: 'center'}}>SNS Code</div>,
              id: "sns",
              content: "Second tab content area",
              disabled: true
            },
            {
              label: <div style={{width:160, textAlign: 'left'}}>OIDC</div>,
              id: "oidc",
              content: 
              (<OIDC
                provider= {selectedProvider}
                username={username}
                password={password}
                setProvider={setSelectedProvider}
                setUsername={setUsername}
                setPassword={setPassword}
              />)
            }
          ]}
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
      <Link >
      Forgot Password
    </Link>
      </div>
    </Grid>
    </div>
    <div className='bottom-button'>
    <Button variant="primary" className='login-buttom' onClick={login}>Log in</Button>

    </div>
    <div className='register'>
       Don't have an account? <Link >
      Register
    </Link>
    </div>



    </div>
        
      </div>
    </div>
  );
};

export default Login;
