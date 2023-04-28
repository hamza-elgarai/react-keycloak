import Keycloak from "keycloak-js";

//This is the keycloak configuration file
let keycloak = new Keycloak({
    url: "http://localhost:8080",
    realm: "pfsrealm",
    clientId: "react-app",
})
export default keycloak;