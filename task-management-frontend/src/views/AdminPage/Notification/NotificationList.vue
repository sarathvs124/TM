<!--------- NOTIFICATION LIST ------------------->
<template>
  <div v-on:click.self="toggleNotifi">
    <v-dialog persistent v-model="userInfoModal" width="900px">
      <v-card>
        <v-toolbar flat color="#1d9c70">
          <v-toolbar-title class="modalHeading" data-test="hi">Task Details </v-toolbar-title>

          <v-spacer></v-spacer>

          <a title="Close">
            <v-btn icon @click="userInfoModal = false" dark>
              <v-icon> mdi-close </v-icon>
            </v-btn>
          </a>
        </v-toolbar>
        <v-spacer></v-spacer>
        <v-card-text>
          <v-list three-line subheader> <br /><br /> </v-list>
          <!-- box project details-->

          <p class="taskDeleteMsg">{{ msg }}</p>
          <div v-if="msg == ''">
            <taskDetail :user="user" :taskid="taskid" :projectId="projectId" />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="userInfoModal = false"> Ok </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="notifi-box notification" id="box" style="display: none;">
      <div class="topHeader">
        <div class="contentsItem">
          <p>Notification</p>

          <v-autocomplete
            style="width: 200px"
            @change="notification"
            class="selectDropDown"
            :menu-props="auto"
            attach
            flat
            v-model="notificationData.user"
            background-color="white"
            clearable
            placeholder="Filter by user"
            :items="options"
          ></v-autocomplete>

          <a title="Close">
            <em
              class="nav-link-icon fa fa-close fa-xl"
              @click="toggleNotifi"
              style="
                color: white;

                margin-left: -70%;

                cursor: pointer;
              "
            >
            </em
          ></a>
        </div>
      </div>

      <div v-for="Data in notificationList" :key="Data.id" v-show="value == false">
        <div
          class="card cardMsg widget-content notifybox"
          @mouseleave="action = null"
          @mouseover="action = Data.notification_id"
        >
          <div>
            <div v-if="Data.profile_photo == null">
              <v-avatar class="mr-3">
                <img src="../../../assets/dd.jpg" alt="" />
              </v-avatar>
            </div>
            <div v-if="Data.profile_photo != null">
              <v-avatar class="mr-3">
                <img v-bind:src="Data.profile_photo" alt="" />
              </v-avatar>
            </div>
          </div>
          <div class="widget-content-outer">
            <div class="widget-content-wrapper">
              <div class="widget-content-left">
                <div class="widget-heading">
                  {{ Data.content }}
                  <span v-show="Data.notification_type == 2">{{
                    Data.project_name
                  }}</span>
                </div>

                <router-link
                  v-show="Data.notification_type !== 2"
                  :to="'/task-view'"
                  class="navPage"
                >
                  <div
                    class="widget-subheading taskNAme"
                    @click="TaskRedirect(Data.project_id, Data.task_id)"
                  >
                    {{ Data.task_name }}
                  </div>
                </router-link>

                <router-link
                  v-show="Data.notification_type == 2"
                  :to="'/home'"
                  class="navPage"
                >
                  <div
                    class="widget-subheading"
                    @click="redirectUrl(Data.project_id, Data.task_id)"
                  >
                    {{ Data.project_name }}[{{ Data.project_code }}]
                  </div>
                </router-link>
                <div class="widget-subheading">
                  {{ moment(Data.created_date).fromNow() }}
                </div>
              </div>
            </div>
          </div>
          <a title="Open the task in the dialog">
            <em
              v-show="action === Data.notification_id && Data.notification_type !== 2"
              class="nav-link-icon mdi mdi-open-in-new"
              @click="openDetailModal(Data.task_id, Data.project_id)"
              style="
                color: gray;

                float: right;
                margin-top: -7%;
                font-size: 25px;
                cursor: pointer;
              "
            >
            </em>
          </a>
        </div>
      </div>
      <div v-for="Data in notificationLists" :key="Data.id" v-show="value == true">
        <div
          class="card cardMsg widget-content notifybox"
          @mouseleave="action = null"
          @mouseover="action = Data.notification_id"
        >
          <div>
            <div v-if="Data.profile_photo == null">
              <v-avatar class="mr-3">
                <img src="../../../assets/dd.jpg" alt="" />
              </v-avatar>
            </div>
            <div v-if="Data.profile_photo != null">
              <v-avatar class="mr-3">
                <img v-bind:src="Data.profile_photo" alt="" />
              </v-avatar>
            </div>
          </div>
          <div class="widget-content-outer">
            <div class="widget-content-wrapper">
              <div class="widget-content-left">
                <div class="widget-heading projectName WordBreak">
                  {{ Data.content }}

                  <span v-show="Data.notification_type == 2">{{
                    Data.project_name
                  }}</span>
                </div>
                <router-link
                  v-show="Data.notification_type !== 2"
                  :to="'/task-view'"
                  class="navPage"
                >
                  <div
                    class="widget-subheading"
                    @click="TaskRedirect(Data.project_id, Data.task_id)"
                  >
                    {{ Data.task_name }}
                  </div>
                </router-link>

                <router-link
                  v-show="Data.notification_type == 2"
                  :to="'/home'"
                  class="navPage"
                >
                  <div
                    class="widget-subheading WordBreak"
                    @click="redirectUrl(Data.project_id, Data.task_id)"
                  >
                    {{ Data.project_name }}
                  </div>
                </router-link>
                <div class="widget-subheading">
                  {{ moment(Data.created_date).fromNow() }}
                </div>
              </div>
            </div>
          </div>

          <em
            v-show="action === Data.notification_id && Data.notification_type !== 2"
            class="nav-link-icon mdi mdi-open-in-new"
            @click="openDetailModal(Data.task_id, Data.project_id)"
            style="
              color: gray;
              float: right;
              margin-top: -7%;
              font-size: 25px;
              cursor: pointer;
            "
          >
          </em>
        </div>
      </div>
      <div>
        <div v-if="notificationList.length != totalNotification">
          <button class="notiButton" @click="loadMore()" data-test="hai">Load More</button>
        </div>
      </div>
    </div>
  </div>
</template>

<!------ SCRIPT ------->
<script>
import taskDetail from "./DetailPageModal.vue";

import ApiService from "../../../service/apiservice";
import Vue from "vue";
import "vue-toast-notification/dist/theme-sugar.css";
import VueToast from "vue-toast-notification";
Vue.use(VueToast);
let moment = require("moment");
export default {
  components: { taskDetail },
  props: {
    notificationList: Object,
    totalNotification: Number,
  },
  data() {
    return {
      message: true,
      action: null,
      taskid: "",
      value: false,
      moment: moment,
      notificationLists: [],
      notificationListLength: 10,
      projectId: "",
      itemAction: false,
      UserList: [],
      user: {
        taskData: [],
      },
      userInfoModal: false,
      notificationData: {
        user: null,
      },
    };
  },
  mounted() {
    this.getUser();
  },
  methods: {
    TaskRedirect(id, taskId) {
      localStorage.setItem("taskId", taskId);
      localStorage.setItem("projectId", id);
      this.$store.commit("getData", id);
      this.$store.commit("getTaskData", taskId);
    },
    redirectUrl(id) {
      localStorage.setItem("projectId", id);
      this.$store.commit("getData", id);
    },
    async openDetailModal(id, projectId) {
      this.msg = "";
      this.taskid = id;
      this.projectId = projectId;
      try {
        this.itemAction = true;

        const response = await ApiService(
          "task/getTask/" + id,
          "GET",
          null,
          null,

          null
        );
        this.user.taskData = response.taskDetails;

        this.userInfoModal = true;
      } catch (error) {
        if (error.response.data.statusCode == 52) {
          this.msg = "Task does not exist";
        }
        this.userInfoModal = true;
      }
    },
    // get users who trigger those notifications
    async getUser() {
      const response = await ApiService("/notification/getUserNotification", "GET");
      this.UserList = response;
    },
    // get notifications
    async notification() {
      this.$emit("my-messages", this.notificationData.user);
    },
    //filter notification
    async loadMore() {
      this.$emit("filter-notification", this.notificationData.user);
    },

    // to open notification side bar

    toggleNotifi() {
      this.$emit("my-message", this.message);
      this.notificationData.user = null;
    },
    loadMoreNotification() {
      if (this.notificationListLength > this.notificationLists.length) return;
      this.notificationListLength = this.notificationListLength + 10;
    },
  },

  computed: {
    // to display users in drop down
    options() {
      let opts = [];
      for (let i = 0; i <= this.UserList.length - 1; i++) {
        if (this.UserList[i].user_name) {
          opts.push({
            text: this.UserList[i].user_name,
            value: this.UserList[i].user_id,
          });
        }
      }
      return opts;
    },
  },
};
</script>

<!------ STYLE -------->
<style scoped>


body {
  font-family: sans-serif;
}

nav {
  display: flex;
  align-items: center;
  background: #00a9d4;
  height: 60px;
  position: relative;
}

.icon {
  cursor: pointer;
  margin-right: 50px;
  line-height: 60px;
}

.icon span {
  background: #f00;
  padding: 5px;
  border-radius: 50%;
  color: #fff;
  vertical-align: top;
  margin-left: -25px;
}

.icon img {
  display: inline-block;
  width: 30px;
  margin-top: 20px;
}

.icon:hover {
  opacity: 0.7;
}

.logo {
  flex: 1;
  margin-left: 50px;
  color: #eee;
  font-size: 20px;
  font-family: monospace;
}

.notifi-box {
  width: 372px !important ;
  opacity: 0;
  bottom: 0!important;
  height: auto!important;
  position: fixed;
  top: 63px;
  right: 1px;
  float: right;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.notifi-box h2 {
  font-size: 16px;

  padding: 10px;
  border-bottom: 1px solid #eee;
}

.notifi-box h2 span {
  color: #f00;
}

.notifi-item {
  display: flex;
  border-bottom: 13px solid #eee;
  padding: 15px 5px;
  margin-bottom: 15px;
  cursor: pointer;
}
.notifybox {
  word-break: break-all;
}
.notifybox:hover {
  background-color: #fcfade;
}

.notifi-item img {
  display: block;
  width: 50px;
  margin-right: 10px;
  border-radius: 50%;
}

.notifi-item .text h4 {
  color: #777;
  font-size: 16px;
  margin-top: 10px;
}

.notifi-item .text p {
  color: #aaa;
  font-size: 12px;
}

.notification {
  margin-top: -3px;
  background-color: #ffffff;
}

.heading {
  background-color:  rgb(79, 165, 214);
  color: rgb(255, 255, 255);
}

.navPage {
  text-decoration: none;
  color: #000000;
}
.modalHeading {
  color: white;
}
.taskNAme {
  word-break: break-all;
}
.taskDeleteMsg {
  display: flex;
  justify-content: center;
}
.topHeader {
  height: 50px;
  background-color: rgb(79, 165, 214);
}
.topHeader p {
  color: white;
  font-weight: bold;
  margin-bottom: 0;
}
.contentsItem {
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: space-between;
  gap: 15px;
  padding-inline: 8px;
}
.topHeader .v-text-field__details {
  display:block !important;
}
.selectDropDown {
  margin-top: -10px;
  width: 42%;
  margin-left: 20px;
}
.projectName {
  word-break: break-all;
}
.WordBreak {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
}
.notiButton {
  color: rgb(16, 18, 22);
  margin-left: 45%;
  margin-top: 1%;
  margin-bottom: 1%;
  font-weight: bold;
}
@media screen and (max-width: 1000px){
  .notifi-box {
  width: 372px !important ;
  bottom: 0!important;
  height: auto!important;
  opacity: 0;
  position: fixed;
  top: 63px;
  right: 1px;
  float: right;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
}
@media screen and (max-width: 900px){
  .notifi-box {
  width: 372px !important ;
  bottom: 0!important;
  height: auto!important;
  opacity: 0;
  position: fixed;
  top: 63px;
  right: 1px;
  float: right;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
}
@media screen and (max-width: 820px){
  .notifi-box {
  width: 372px !important ;
  bottom: 0!important;
  height: auto!important;
  opacity: 0;
  position: fixed;
  top: 63px;
  right: 1px;
  float: right;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
}

@media screen and (max-width: 700px){
  .notifi-box {
  width: 372px !important ;
  bottom: 0!important;
  height: auto!important;
  opacity: 0;
  position: fixed;
  top: 63px;
  right: 1px;
  float: right;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
}
@media screen and (max-width:375px) {
  .notifi-box {
    width: 372px !important ;
    bottom: 0!important;
  height: auto!important;
  opacity: 0;
  position: fixed;
  top: 63px;
  right: 1px;
  float: right;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}


}
 
@media screen and (max-width:280px) {
  .notifi-box {
  width: 278px !important;
  bottom: 0!important;
  height: auto!important;
  opacity: 0;
  position: fixed;
  top: 63px;
  right: 1px;
  float: right;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
}
</style>
