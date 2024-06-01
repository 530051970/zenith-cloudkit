import { Input, Select } from '@cloudscape-design/components';
import './style.scss';
interface OIDCProps {
    provider: any,
    username: string,
    password: string,
    oidcOptions: any[],
    setProvider: Function,
    setUsername: Function,
    setPassword: Function
}
const OIDC = (props: OIDCProps) => {
    const {provider,
           username,
           password,
           oidcOptions,
           setProvider,
           setUsername,
           setPassword
           } = props
    return (<div className='oidc'>
        <div className='item'>
          <Select
            placeholder='Please choose one OIDC provider'
            selectedOption={provider}
            onChange={({ detail }:{detail: any}) =>
               setProvider(detail.selectedOption)
            }
            options={oidcOptions}
      //     options={[
      //   {
      //     label: "Cognito",
      //     iconUrl:"../../imgs/cognito.png",
      //     value: "1",
      //     tags: ["AWS's built-in user authentication service"]
      //   },
      //   {
      //     label: "Authing",
      //     iconUrl: "../../imgs/authing.png",
      //     value: "2",
      //     tags: ["Authentication service for ensuring application security"]
      //   },
      //   {
      //     label: "Okta",
      //     iconUrl: "../../imgs/okta.png",
      //     value: "2",
      //     tags: ["A service that focuses on identity and access management"]
      //   }
      // ]}
    />
         </div>
    {/* </Grid> */}
    {/* <Grid
      gridDefinition={[{ colspan: 3 }, { colspan: 9 }]}
    >
        <div className='label'>Username</div> */}
        <div className='item'>
        <Input
      onChange={({ detail }) => setUsername(detail.value)}
      value={username}
      placeholder="Please input username"
    />
        </div>
        <div className='item'>
        <Input
        type='password'
      onChange={({ detail }) => setPassword(detail.value)}
      value={password}
      placeholder="Please input password"
    />
        </div>
    {/* </Grid>    */}
    
    
    </div>)
}

export default OIDC