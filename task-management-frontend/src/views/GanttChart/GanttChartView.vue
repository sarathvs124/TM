<template>
  <div
    class="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header"
  >
    <!-- top nav -->
    <topNavigation />

    <div class="app-main" style="height: auto;">
      <!-- side nav -->
      <div class="sideGant">
      <sideNavigation :id="ProjectData.project_id"   @SideBarToggle="ToggleOnOff" />
    </div>
      <div class="app-main__outer" id="boxs">
        <div class="app-main__inner">
          <div v-if="!loaderValue">
                <loader />
              </div>
              <div v-if="loaderValue">
          <div class="app-page-title bg-light p-1 Toptitle" id="HeaderTask">
            <div class="page-title-wrapper">
              <div class="page-title-heading">
                <router-link exact :to="'/home'">
                  <v-img src="../../assets/Images/logo.png" class="logo"></v-img
                ></router-link>
                <div class="names"
                :title="`${ProjectData.project_name} (${ProjectData.project_code})`"
                >
                  {{ ProjectData?.project_name }} ({{
                    ProjectData?.project_code
                  }})
                </div>
              </div>
            </div>
          </div>
          <!---------------------------------------------------file/folder creation----------------------------------------------------------------------------->

          <div class="ganttdiv">
            <h5 id="fname">Gantt Chart</h5>

        
              <gantt />
    
     </div>

     </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script scoped>
import Gantt from "./ganttChart.vue";
import sideNavigation from "../AdminPage/Notification/sideBarr.vue";
import loader from "../AdminPage/Loader/loaderView.vue"

import topNavigation from "../AdminPage/adminTopNav.vue";
import ApiService from "../../service/apiservice";
import Vue from "vue";
import "vue-toast-notification/dist/theme-sugar.css";
import VueToast from "vue-toast-notification";
Vue.use(VueToast);
export default {
  components: { sideNavigation, topNavigation, Gantt,loader },

  data() {
    return {
      loaderValue:false,
      projectId:"",
      ProjectData: [],
    };
  },
  mounted() {

     localStorage.removeItem("search")
 
    this.projectId= this.$store.state.projectId;
localStorage.setItem("projectId",this.projectId)
    this.getProjectDetails(this.projectId);

    this.ToggleOnOff(localStorage.getItem("is_expanded")==='true')
  },
  methods: {
    async getProjectDetails(id) {
this.loaderValue=false;
      try {
     
        const response = await ApiService(
          "/project/overallProjectStatus/" + id,
          "GET"
        );
        this.loaderValue=true;

        if (response.statusCode == 50) {
          this.$router.push("/dashboard");
        }
        if (response.statusCode == 399) {
          this.$router.push("/dashboard");
        }
        this.ProjectData = response;
        this.minDate = response.start_date;
        this.maxDate = response.end_date;
        
      } catch (error) {
        console.log(error, "error................");
      }
    },

      // side bar toggle
  ToggleOnOff(msg){

  this.boxs = document.getElementById("boxs")

if(msg){
this.boxs.style.marginLeft = "220px";
this.boxs.style.transition = "visibility 0s, opacity 0.5s linear";
}else{
this.boxs.style.marginLeft = "64px";
this.boxs.style.transition = "visibility 0s, opacity 0.5s linear";

}
},
  },

};
</script>


<style scoped>

.GantBox {
  max-width: 1400px;
  margin-right: -10%;
  height: 100px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
    rgb(209, 213, 219) 0px 0px 0px 1px inset;
}
@media only screen and (max-width: 1600px) {
  .Toggle {
    padding: 15px 44% 1px;
  }
  .toggleText {
    font-weight: 400;

  }
}

.logo{
  width: 40px;
}
 @media only screen and (max-width: 1450px) {

.logo{
  width: 40px;
}

.names{
  font-size: 14px;
}
 }

 .fixed-sidebar .app-main .app-main__outer {
  z-index: 9;
  margin-left: 220px;
    padding-left: 0px;
}

.Toptitle{
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
  background-color: #fff !important;

}
@media screen and (max-width: 1000px){
  .names {
    font-size: 14px;
    white-space: nowrap;
    width: 700px; 
                      overflow: hidden;
                      text-overflow: ellipsis ;
                      margin-top:-24px;
                      margin-left:16px;
                    
                 
}
}

@media screen and (max-width: 600px){
  .sideGant{
  display: none;
}

.ganttdiv{
  max-width: 100%;
  overflow-x: scroll; 
  

}
.names {
    font-size: 14px;
    white-space: nowrap;
    width: 300px; 
                      overflow: hidden;
                      text-overflow: ellipsis ;
                      margin-top:-24px;
                      margin-left:34px;

                    
                 
}
}
@media only screen and (max-width: 280px){
  .names {
    font-size: 14px;
    white-space: nowrap;
    width: 200px; 
                      overflow: hidden;
                      text-overflow: ellipsis ;
                     
                 
}

}
</style>