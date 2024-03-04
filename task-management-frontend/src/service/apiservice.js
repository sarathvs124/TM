import { Env } from "@/environment.production";
import axios from "axios";
import jwt_decode from 'jwt-decode';
const basicContentType = { "Content-Type": "application/json" };


export const baseURL = Env.baseUrl;

const config = {
  baseURL: Env.baseUrl,
  headers: {
    "Content-Type": "application/json",
    get: basicContentType,
    post: basicContentType,
    put: basicContentType,
    delete: basicContentType,
    patch: basicContentType,
  },
  //   withCredentials:true,
};

const apiservice = axios.create(config);
const onRequest = (configs) => {
  const accessTocken = JSON.parse(localStorage.getItem("accessTocken"))
  if(accessTocken){
    configs.headers[
      "x-access-token"
    ] = `${accessTocken}`;
  }
  return configs;
};

const onRequestEroor = (error) => {
  return Promise.reject(error);
};
/** Add logging here */

const onResponse = (response) => {
  let refreshToken =JSON.parse(localStorage.getItem('refreshToken'))
  const currentTimeStamp = new Date().getTime()
  if(refreshToken){
    const decodedToken = jwt_decode(refreshToken)
    if(currentTimeStamp <decodedToken?.exp){
      console.log(jwt_decode(refreshToken),"jwt_decode"); 

    }
  }
  return response;
};

const onResponseError = async (error) => {
  if (error.response) {
    if (error.response.data.statusCode == 401 || error.response.data.statusCode == 403) {
      let refreshToken =JSON.parse(localStorage.getItem('refreshToken'))
      const payload={
        "refresh_token":refreshToken 
      }
      const response = await ApiService('login/refresh', "PUT",payload)
      localStorage.setItem('accessTocken',JSON.stringify(response.accessToken));

      // unauthorised error handler to be executed here
    } else if (error.response && error.response.response === 403) {


      { /*  unauthorised error handler to be exicuted here */ }
  
    }
  }
  return Promise.reject(error);
};

/** Adding the request interceptors */
apiservice.interceptors.request.use(onRequest, onRequestEroor);
apiservice.interceptors.response.use(onResponse, onResponseError);

export default function ApiService(path, method, request, headers, params) {
  return apiservice({
    data: request,
    method: method,
    url: path,
    params: params,
    headers: headers,
  }).then((res) => {
    if (res) {
      return res.data;
    } else {
      throw Object.assign(new Error("Invalid Response"), { code: 401 });
    }
  });
}
