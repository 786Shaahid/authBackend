import environmentConfig from "../configures/environment.config.js";
let BASE_URL_FRONTEND;

if(process.env.NODE_ENV === "production"){
    BASE_URL_FRONTEND="https://connectify-website.netlify.app"
}else{
    BASE_URL_FRONTEND="http://localhost:3000"
}

export default BASE_URL_FRONTEND;