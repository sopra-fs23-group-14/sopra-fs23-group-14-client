import {useEffect, useState} from 'react';
import {api} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";

const Profile = () => {
  const history = useHistory();
  const {id} = useParams();
  const [isMyProfile, setIsMyProfile] = useState(null);

  const [user, setUser] = useState(null);

  const logout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  }

  useEffect(() => {
      async function fetchData() {
      try {
        const response = await api.get('/users/'+id);

        setUser(response.data);

        console.log('request to:', response.request.responseURL);
        console.log('status code:', response.status);
        console.log('status text:', response.statusText);
        console.log('requested data:', response.data);

        console.log(response.data);
            if (localStorage.getItem("token") === response.data.token) {
                setIsMyProfile(true);
            }
        
        console.log("Is my profile: " + isMyProfile);
        
        console.log(response);
      } catch (error) {
        console.log(error);
        let status = error.response.status;
      if(status === 404){
        alert('User is not found');
      }
      if(status === 500){
        alert('Internal server error');
      }
      console.log(error.response);
      history.push("/overview")
      
      }
    }

    fetchData();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let content = <Spinner/>;


  if(user){
    content = (
        <BaseContainer className="game container">
            {isMyProfile ? (<h3>Your profile</h3>) : (<h3>{user.username}'s profile</h3>)}
            <div>
                <div>Username: {user.username}</div>
                <div>Name: {user.name ?? "not set"}</div>
                <div>Status: {user.status}</div>
                <div>Birthday: {user.birthday ?? "not set"}</div>
                <div>With us since: {user.creationDate}</div>
            </div>
            { isMyProfile && (
                <div className="login button-container">
                    <Button width="100%" onClick= {() => {history.push("/edit/"+id)}}>Edit</Button>
                    <Button width="100%" onClick = {() => logout()}>Logout</Button>
                </div>
            )}
        </BaseContainer> 
    );  
  }

  return (
    <div style={{display: "flex", flexDirection: "column"}}>
            {content}
    </div>
  );
}

export default Profile;