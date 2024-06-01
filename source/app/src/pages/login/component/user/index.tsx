import { Input } from '@cloudscape-design/components';
import './style.scss';
interface UserProps{
   username:string
   password: string
   setUsername: (username:string)=>void
   setPassword: (username:string)=>void
}
const User = (props: UserProps) => {
    const {username, password, setUsername, setPassword} = props
    return (<div className='user'>
        
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

export default User