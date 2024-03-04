<template>
  <div
    class="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header"
  >
    <!-- top nav -->
    <topNavigation />

    <div class="app-main" style="background-color: #f0f0f0">
      <!-- side nav -->

      <div class="app-main__inner">
        <div class="heading">
          <span>Member of Innovature Technologies K.K</span>
        </div>

        <div class="members">
          <v-text-field
            background-color="white"
           
            @keyup="searchUser()"
            v-model="searchText"
            dense
            filled
            rounded
            clearable
            @click:clear="setItNull()"
            placeholder="Search Member "
            prepend-inner-icon="mdi-magnify"
            class=" expanding-search"
          ></v-text-field>
          <div v-if="members.length == 0 && value == true">
            <p style="margin-left: 50%">No data available</p>
          </div>
          <div class="row membersBox">
            <div v-if="value == false">
              <div class="loader"></div>
            </div>
            <div v-for="Data in members" :key="Data.id">
              <div class="col-2 box">
                <div class="boxs">
                  <div class="image">
                    <div>
                      <div v-if="Data.profile_photo == null">
                        <img
                          width="80px"
                          height="80px"
                          class="rounded-circle images"
                          src="../../../assets/dd.jpg"
                          alt=""
                          title="Profile"
                        />
                      </div>
                      <div v-if="Data.profile_photo != null">
                        <img
                          width="80px"
                          height="80px"
                          class="rounded-circle images"
                          v-bind:src="Data.profile_photo"
                          alt=""
                          title="Profile"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="content">
                  <a :title="Data.user_name"> <p>{{ Data.user_name }}</p></a>
                  </div>
                  <div class="activeTime">
                    <p v-if="Data.last_active==null">__</p>
                    <p  v-if="Data.last_active!=null">
                      {{ moment(Data.last_active).fromNow() }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="members.length!=totalCount">
         
        <button class="notiButton" @click="getUser()">
          Load More 
        </button>
    
        </div>
        </div>
      </div>
    </div>
  </div>
</template>
        
  <script scoped>
import topNavigation from "../../AdminPage/TopNav2.vue";
import ApiService from "../../../service/apiservice";
import Vue from "vue";

import "vue-toast-notification/dist/theme-sugar.css";
import VueToast from "vue-toast-notification";

let moment = require("moment");
Vue.use(VueToast);
export default {
  components: { topNavigation },

  data() {
    return {
      totalCount:"",
      value: false,
      user_name: "",
      lastData:"",
      lastId:"",
           members:[],
      searchText: "",
      moment: moment,
      data: "",
    };
  },
  mounted() {
    this.getUser();
  },
  methods: {
    setItNull() {
      this.searchText = "";
      this.searchUser();
    },
    searchUser() {
      this.lastData="";
      this.lastId="";
      this.members=[];
      this.user_name = this.searchText;
      this.getUser();
    },
    async getUser() {

      this.value = false;
      const params = {
        user_name: this.user_name,
        last_data:this.lastData,
        last_id:this.lastId,
        limit:10, 
      };
      const response = await ApiService(
        "users/getCoworkers",
        "GET",
        null,
        null,
        params
      );
      this.dataArray = response.members;
      this.value = true;
     
        for (const element of this.dataArray) {
          this.members.push(element);
      }
if(this.lastData=="" || this.lastId==""){
  this.totalCount=response.total
}
        this.lastData=this.dataArray[this.dataArray.length-1].user_name;
        this.lastId=this.dataArray[this.dataArray.length-1].user_id;

    },
  },
};
</script>
        
  
    <style scoped>
.mainDiv {
  display: flex;
  min-height: 100%;
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
.expanding-search{

position: sticky;
max-width: 20%;
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
  margin-top: -10%;
}
.boxs {
  background-color: white;
  border-radius: 4px 4px 0 0;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
      margin-right: 50%;
  width: 210px;
  height: 210px;
}
.heading {
  display: flex;
  justify-content: center;

  font-size: 22px;
}

.box :hover {
  background-color: #4cbd9b;
  color: white;
}
.members {
  padding: 55px 14%;
}

.image {
  padding-top: 30px;
  text-align: center;
}
.content {
  text-align: center;
  padding-top: 20px;
  font-weight: 500;
  font-size: 14px;


}
.content p{
  overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
}
.activeTime {
  font-weight: 400;
  text-align: center;
  margin-bottom: 1px;
}
@media only screen and (max-width: 1600px) {
  .boxs {
    width: 160px;
    height: 160px;
  }
  .images {
    width: 60px;
    height: 60px;
  }
  .content {
    text-align: center;
    padding-top: 5px;
    font-weight: 500;
    margin-bottom: -10px;
    font-size: 12px;

  }
  .activeTime {
    font-weight: 400;
    text-align: center;
  }
  .NoData {
    font-size: 20px;
    margin-left: 50%;
  }
}
.loader {
  --height-of-loader: 4px;
  --loader-color: #0071e2;
  width: 100%;
  height: var(--height-of-loader);
  border-radius: 30px;
  background-color: rgba(0, 0, 0, 0.2);
  position: relative;
}

.loader::before {
  content: "";
  position: absolute;
  background: var(--loader-color);
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  border-radius: 30px;
  animation: moving 1s ease-in-out infinite;
}

@keyframes moving {
  50% {
    width: 100%;
  }

  100% {
    width: 0;
    right: 0;
    left: unset;
  }
}
.notiButton{
 display: flex;  
justify-content: center;  
align-items: center; 
margin-left:43%;
margin-top: 2%;
margin-right:43%;
font-weight: bold;
}



@media screen and (max-width:1280px){

  .expanding-search{

    position: sticky;
    max-width: 100%;
}
  .row{

display: flex;
    flex-wrap: wrap;
 
    justify-content: center;
  }

  .notiButton {
    display: flex;
    
    margin-left: 30%;
    margin-top: 2%;
    margin-right: 30%;
    font-weight: bold;
    width: 25%;
  }
  .heading {
  display: flex;
  justify-content: center;

  font-size: 17px;
}

}

@media screen and (max-width:900px){
.heading {
  display: flex;
  justify-content: center;

  font-size: 14px;
}
.members{
  padding: 53px 9%;
}
}
</style>