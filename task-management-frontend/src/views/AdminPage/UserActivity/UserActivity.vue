<template>
  <div
    class="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header"
  >
    <!-- top nav -->
    <topNavigation />

    <div class="app-main" style="background-color: #f0f0f0">
      <!-- side nav -->

      <div class="app-main__inner">
        <div class="app-page-title title" style="background-color: white">
          <div class="page-title-wrapper">
            <div class="page-title-heading">
              <div
                class="CompanyName"
               
              >
                Innovature Technologies K.K
              </div>
            </div>
          </div>
        </div>

        <div class="profile">
               <div class="row centerDiv" style="margin-bottom: -2px;">

                 <div  v-if="profile_photo === 'null'">
                  <img
                  width="80px"
                  height="80px"
                  class="rounded-circle profile-pic"
                  src="../../../assets/dd.jpg"
                  alt=""
                  title="Profile"
                  />
                </div>
                <div v-if="profile_photo !== 'null' ">
                  <img
                      class="rounded-circle mt-5 profile-pic"
                      width="80px"
                      height="80px"
                      alt=""
                      v-bind:src="profile_photo"
                      />
                    </div>
                    <br/>
                  </div>
                  <br/>
                  <div class="row centerDiv">

                    <span class="font-weight-bold ProfileName">{{ username }}</span
                      >
                    </div>
                
                

                  <!-------------------- image upload -->

                
                 
           
              
              </div>
        <div class="Toggle centerDiv">
            <div class="d-flex toggleText">
              <p class="activeTag mr-4">Activity</p>
              <router-link to="/user/gantt-chart" style="text-decoration: none">    <p class="inactive mr-4">Gantt Chart</p>
            
         </router-link>
        </div>
        </div>
        <userActivity />
   
      </div>
    </div>
  </div>
</template>
      
<script scoped>
import userActivity from "./ActivityPage.vue";
import topNavigation from "../../AdminPage/TopNav2.vue";
  import ApiService from "../../../service/apiservice";
import Vue from "vue";
import "vue-toast-notification/dist/theme-sugar.css";
import VueToast from "vue-toast-notification";

let moment = require("moment");
Vue.use(VueToast);
export default {
  components: { topNavigation ,userActivity},

  data() {
    return {
      picValue:false,
        value1:false,
        value2:false,
        moment: moment,
data:[],
username:"",
        UserActivityData:[],
      ProjectData: [],
    };
  },
  mounted() {

    this.getUser();
  },
  methods: {
    async getUser() {
     
      this.username=localStorage.getItem("name")
      this.previewImage = localStorage.getItem("profilePhoto");
      this.profile_photo =  localStorage.getItem("profilePhoto");
    },
    async userActivity() {
      this.step = 1;

      const response = await ApiService(
        "users/getActivity",
        "GET",
        
      );
      this.step = 2;
      this.UserActivityData = response;
     
    },
  },
};
</script>
      

  <style scoped>
.mainDiv {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  font-family: "Open Sans", sans-serif;
}
.cardStyle {
  width: 700px;

  padding: 36px 0;

  margin: 30px 0;
}

.buttonWrapper {
  margin-top: 40px;
}
.button {
  width: 30%;
  height: 40px;
  margin-left: 26%;
  display: block;
  color: #fff;
  background-color: #065492;
  border-color: #065492;
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.035);
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}
.submitButton:disabled,
button[disabled] {
  border: 1px solid #cccccc;
  background-color: #cccccc;
  color: #666666;
}

.fram {
  margin-top: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.modalbtn {
  border: none;
}

.title {
  height: 10px;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
}
.CompanyName {
  margin-top: -1%;
  font-size: 20px;
}
.box {
  background-color: white;
  border-radius: 4px 4px 0 0;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
}
.outOfBox {
  padding: 1px 28%;
}
.boxActivity{
    box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
}
.Toggle{
    padding: 20px 45% 1px;
}
.toggleText{
   font-weight: 400;
}
.activeTag {
    color:#065492;
    border-bottom: 5px solid #2c9a7a;
}

.ProfileName{

    font-size: 18px;
}

.inactive{
  color: black;
}
/* @media only screen and (max-width: 1600px) {
  .Toggle {
    padding: 20px 44% 1px 43%;
  }
  .toggleText {
    font-weight: 400;

  }
} */
/* @media only screen and (max-width: 1700px) {
  .Toggle {
    padding: 21px 42% 1px 43%;
  }
  .toggleText {
    font-weight: 400;

  }

} */
.centerDiv{
  display: flex;
  justify-content: center;
  padding: 10px;
}

@media screen and (max-width:770px){

.centerDiv {
  display: flex;
  justify-content: center;
  padding: 10px;
}
.profile-pic{
  display: flex;
  justify-content: center;
  width:80px;
  height:80px;
  
}
.profile {
  padding: 11px 44% 1px 39%;
}
.ProfileName {

    display: flex;
    justify-content: center;
    font-size: 18px;
}

.title {
  height: 46px;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
}
.CompanyName {
  /* margin-top: 2%; */
  font-size: 20px;
}

}
</style>
