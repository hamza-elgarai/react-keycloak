import Keycloak from "keycloak-js";

//This is the keycloak configuration file
let keycloak = new Keycloak({
    url: "http://localhost:8081",
    realm: "PFS",
    clientId: "react-app",
})
export default keycloak;