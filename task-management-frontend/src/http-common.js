import axios from "axios";
import { Env } from "./environment.production";

export default axios.create({
  baseURL: Env.baseUrl,
  headers: {
    // "Content-type": "application/json",
 "x-access-token" : JSON.parse(localStorage.getItem("accessTocken"))
  }
});
