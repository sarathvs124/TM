<template>
  <div
    class="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header" style="overflow-y:hidden"
  >
    <!-- top nav -->
    <topNavigation />

    <div class="app-main">
      <!-- side nav -->
      <sideNavigation  @SideBarToggle="ToggleOnOff"/>

      <div class="sec" style="overflow: hidden" id="boxs"  v-bind:style="{'margin-left': '64px', 'transition': none}">
        <div class="app-page-title title bg-light p-1 Toptitle" id="HeaderTask" >
          
          <div class="page-title-wrapper" style="overflow: hidden !important">
            <div class="frame">
              <router-link exact :to="'/home'">
                <v-img class="logo" src="../../assets/Images/logo.png" width="40"></v-img
              ></router-link>
              <div class="names"  :title="`${ProjectData.project_name} (${ProjectData.project_code})`">
                {{ ProjectData.project_name }} ({{
                  ProjectData.project_code
                }})
              </div>
            </div>
          </div>
        </div>
        <psSidebar>
          <div class="issuetable">
            <template v-if="!this.isFetching">
              <v-data-table
              :mobile-breakpoint="100"
                :headers="headers"
                :items="issue_list"
                class="elevation-1"
                :items-per-page="5"
                :group-desc="true"
                :server-items-length="totalissue"
                :items-per-page.sync="limit"
                :page.sync="currentPage"
              >
                <!--------------------Issue---------------------->
                <template v-slot:[`item.issue_type`]="{ item }">
                    <td v-if="item.issue_type_id == 1">
                      <v-btn
                      outlined
                      rounded
                      color="white"
                      width="100px"
                      height="30px"
                      style="
                        border: none;
                        font-size: 12px;
                        text-transform: none;
                        background-color: #e64754;
                      "
                    >
                      {{ item.issue_type}}
                    </v-btn>
                      </td>
                      <td v-if="item.issue_type_id == 2">
                        <v-btn
                          outlined
                          rounded
                          color="white"
                          width="100px"
                          height="30px"
                          style="

                            border: none;
                            font-size: 12px;
                            text-transform: none;
                            background-color:#478af5;
                          "
                        >
                        {{ item.issue_type }}
                        </v-btn>
                      </td>
                      <td v-if="item.issue_type_id == 3">
                        <v-btn
                          outlined
                          rounded
                          color="white"
                          width="100px"
                          height="30px"
                          style="
                           border: none;
                            font-size: 12px;
                            text-transform: none;
                            background-color:#21c241;
                          "
                        >
                        {{ item.issue_type }}
                        </v-btn>
                      </td>
                      <td v-if="item.issue_type_id == 4">
                        <v-btn
                          outlined
                          rounded
                          color="white"
                          width="100px"
                          height="30px"
                          style="
                          
                            border: none;
                            font-size: 12px;
                            text-transform: none;
                            background-color: #d9991a;
                          "
                        >
                        {{ item.issue_type }}
                        </v-btn>
                      </td>
                      <td v-if="item.issue_type_id !=1 && item.issue_type_id !=2&&item.issue_type_id !=3&&item.issue_type_id !=4">
                       
                        {{ item.issue_type }}
                   
                      </td>
            </template>
              </v-data-table>
                
            </template>
          </div>
        </psSidebar>
      </div>
    </div>
  </div>
</template>
  <script>
  import sideNavigation from "../AdminPage/Notification/sideBarr.vue";

import ApiService from "../../service/apiservice";
import psSidebar from "./psSidebar.vue";

import topNavigation from "./adminTopNav.vue";
export default {
  components: { sideNavigation, topNavigation, psSidebar },
  data() {
    return {
      isFetching: false,
      ProjectData: [],
      issue_list: [],
      currentPage: 1,
      prePage: 1,
      limit: 10,
      totalissue:'',
      headers: [
        {
          text: "ID",
          color: "red",
          value: "issue_type_id",
          sortable: false,
          align: "start",
          width: "30%",
        },
        {
          text: " Issue Type",
          sortable: false,
          value: "issue_type",
          width: "30%",
        },
       
      ],
    };
  },
  methods: {
    async getIssueType() {
      try {
        this.limits=this.limit
        if(this.limit==-1){
          this.limits=""
        }
        const params = { 
          limit: this.limits,
          page: this.currentPage,
       
        last_data:null
    };
    
        const response = await ApiService("/task/getIssue", "GET", null,null ,params);
        
        this.issue_list = response.issueTotalList;
        this.totalissue = response.totalCount;
      
      } catch (error) {
        console.log(error, "error................");
      }
    },
    async getProjectDetails() {
      try {
      
        const id = this.projectId;
        const response = await ApiService(
          "/project/overallProjectStatus/" + id,
          "GET"
        );
        this.ProjectData = response;
      
        if (response.statusCode == 50) {
          this.$router.push("/dashboard");
        }
        if (response.statusCode == 399) {
          this.$router.push("/dashboard");
        }
      } catch (error) {
        console.log(error, "error................");
      }
    },
          // side bar toggle
  ToggleOnOff(msg){

this.boxs = document.getElementById("boxs")

if (msg) {
        if(this.boxs && this.boxs.style && this.boxs.style.marginLeft) this.boxs.style.marginLeft = "220px";
        if(this.boxs && this.boxs.style && this.boxs.style.transition) this.boxs.style.transition = "visibility 0s, opacity 0.5s linear";
      } else {
        if(this.boxs && this.boxs.style && this.boxs.style.marginLeft) this.boxs.style.marginLeft = "64px";
        if(this.boxs && this.boxs.style && this.boxs.style.transition) this.boxs.style.transition = "visibility 0s, opacity 0.5s linear";
      }
},
  },
  watch: {
    currentPage: {
      handler() {
        this.getIssueType();
      },
      immediate: false,
    },
    limit: {
      handler() {
        this.changeValue = true;
        this.getIssueType();
      },
      immediate: false,
    },
  },

  mounted() {
    this.projectId= this.$store.state.projectId;
localStorage.setItem("projectId",this.projectId)
    this.getProjectDetails();
    this.ToggleOnOff(localStorage.getItem("is_expanded")==='true')
    this.getIssueType();
  },
};
</script>
  <style scoped>
#imp {
  color: red;
}
.v-text-field {
  height: 20%;
}
.label {
  font-size: medium;
}
.frame {
  display: -webkit-inline-box;
  height: 100%;
  width: 100%;
  overflow: hidden !important;
}
.title {
  padding: 15px 0px 15px 0;
  margin: 0 !important;
  position: relative;
  min-height: 65px;
  padding-top: 16px;
}
.table {
  width: 78%;
  height: 100%;
  padding: 43px;
  margin-left: -75%;
  margin-top: 4%;
}
.app-main {
  width: 100%;
}
.sec {
  width: 100% !important;
}
.custom_table_class > div > table > thead {
  background-color: #4fa5d6;
  border-radius: 10px;
}

.searchDiv {
  margin-left: 44%;
  margin-top: 2%;
  max-height: 10%;
  width: 34%;
}
.rowBy {
  margin-top: 2%;
}
.cardText {
  text-align: center;
}
.issuetable {
  max-width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 5%;
    width: 100%;
   
}
.fixed-sidebar .app-main  {
  z-index: 9;

    padding-left: 0px;
}
#HeaderTask {
  min-height: 47px !important;
}
.names{
  overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
  font-weight: 400;
  font-size: 15px;
}
@media only screen and (max-width: 1450px) {
  .logo {
    width: 40px;
  }

  .names {
    
  font-size: 14px;
    white-space: nowrap;
    width: 700px; 
                      overflow: hidden;
                      text-overflow: ellipsis !important;
                      margin-top: 8px;
    margin-left: -2px;
  
  }
}
.Toptitle{
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
  background-color: #fff !important;

}


/* .app-theme-white.app-container {
    background: #f1f6f100 !important;
} */



@media screen and (max-width:1019px){
  .issuetable{
    max-width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 5%;
    width: 67%;
    margin-left: 23%;
}
.names{
  font-size: 14px;
    white-space: nowrap;
    width: 700px; 
                      overflow: hidden;
                      text-overflow: ellipsis !important;
                      margin-top: 8px;
    margin-left: -20px;
  }
}

@media screen and (max-width:619px){

.issuetable{
    max-width: 100%;
    margin-left: 0%;
    padding: 1%;
    display: flex;
    justify-content: center;
    
    margin-top: 5%;
    width: 100%;
}
.names{
  font-size: 14px;
    white-space: nowrap;
    width: 300px; 
                      overflow: hidden;
                      text-overflow: ellipsis !important;
                      margin-top: 8px;
    margin-left: -2px;
  }
}


@media screen and (max-width: 280px)
{
  .issuetable{
    max-width: 100%;
    margin-left: 0%;
    padding: 1%;
    display: flex;
    justify-content: center;
    margin-top: 2%;
    width: 100%;

}
.names{
  font-size: 14px;
    white-space: nowrap;
    width: 200px; 
                      overflow: hidden;
                      text-overflow: ellipsis !important;
                      margin-top: 8px;
    margin-left: -2px;
  }
}
</style>
  