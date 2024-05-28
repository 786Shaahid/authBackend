import environmentConfig from "./src/configures/environment.config.js";

const development = {
    name: "development",
    callback_url:process.env.CALLBACK_URL,
    facebook_callback_url:process.env.FACEBOOK_CALLBACK_URL,


  };
  
  const production = {
    name: "production",
    callback_url:process.env.CALLBACK_URL_PRO,
    facebook_callback_url:process.env.FACEBOOK_CALLBACKURL_PRO
  };
  
  console.log(process.env.NODE_ENV);
  export default eval(process.env.NODE_ENV) == undefined
    ? development
    : eval(process.env.NODE_ENV);