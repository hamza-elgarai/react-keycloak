import './App.css';
import { useKeycloak } from '@react-keycloak/web';
import PrivateRoute from './helpers/PrivateRoute';
import axios from 'axios';
import { useState } from 'react';


function App() {

  const {keycloak} = useKeycloak();
  const [message,setMessage] = useState('default');

  // Uncomment to show keycloak object (contains main elements like token , username, roles , etc.)
  //console.log(keycloak);

  //Method to call the express API and retrieve a message (authorized for a user with admin role only)
  //You can change the endpoint to '/user' to retrieve a message for all authenticated users
  const fetchApi = () => {
    axios.get('http://localhost:3200/admin', {
      headers: {
        'Authorization': `bearer ${keycloak.token}`
      }
    })
    .then((res) => {
      setMessage(res.data)
      console.log("message is set");
    })
    .catch((error) => {
      console.log("Could not get data");
    })
  }



  //check if keycloak user is authenticated
  if(keycloak.authenticated){
    console.log("User is authenticated, generating data from API...");
    fetchApi();
  }
  else{
    console.log("Please login to generate data");
  }

  
    return (
    <div className="App">
        <h1>{keycloak.authenticated?'logged in as '+keycloak.tokenParsed?.preferred_username:'not logged in'}</h1>
        {!keycloak.authenticated && (<button onClick={()=>keycloak.login()}>Login</button>)}
        {keycloak.authenticated && (<button onClick={()=>keycloak.logout()}>Logout</button>)}

        {/* the private component won't load if the user is not authenticated */}
        {/* Look at the helpers/PrivateRoute.jsx to understand */}
        <PrivateRoute>
          <h1> {message}</h1>
        </PrivateRoute>
        
        
    </div>
  );
}

export default App;
