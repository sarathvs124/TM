<template>
  <div class="outOfBox">
    <div v-for="(group,i) in activity" :key="group.id">
      <div class="box" data-test="id2">
        <div class="card-header-tab card-header">
                <div class="card-header-title">
                  <em
                    class="header-icon lnr-rocket icon-gradient bg-tempting-azure"
                  >
                  </em>
                  {{ new Date(group.date).toDateString()}}              </div>
              </div>
        <div class="boxss">
          <div v-for="(Data, index) in group.data" :key="Data.id">
        <div class="card cardMsg widget-content boxActivity">
          <div style="margin-top: -3%"></div>
          <div class="widget-content-outer">
            <div class="widget-content-wrapper">
              <div class="widget-content-left" v-if="Data.action == 1">
                <div v-if="Data.profile_photo == null">
                  <v-avatar class="mr-3 ImageProfile">
                    <img src="../../../assets/dd.jpg" alt="" />
                  </v-avatar>
                </div>
                <div v-if="Data.profile_photo != null">
                  <v-avatar class="mr-3 ImageProfile">
                    <img v-bind:src="Data.profile_photo" alt="" />
                  </v-avatar>
                </div>
                <div class="widget-heading headingContent">
                  {{ Data.action_by }}
                  <v-badge
                    color="error"
                    content="Deleted"
                    left
                    inline
                  ></v-badge>
                  a task
                </div>

                <div class="Taskname newClass">
                  {{ Data.task_name }}
                </div>

                <div class="widget-subheading newClass">
                  {{ moment(Data.created_date).fromNow() }}
                </div>
              </div>
              <div class="widget-content-left" v-if="Data.action == 2">
                <div v-if="Data.profile_photo == null">
                  <v-avatar class="mr-3 ImageProfile">
                    <img src="../../../assets/dd.jpg" alt="" />
                  </v-avatar>
                </div>
                <div v-if="Data.profile_photo != null">
                  <v-avatar class="mr-3 ImageProfile">
                    <img v-bind:src="Data.profile_photo" alt="" />
                  </v-avatar>
                </div>
                <div class="widget-heading headingContent">
                  {{ Data.action_by }}
                  <v-badge
                    color="primary"
                    content="Created"
                    left
                    inline
                  ></v-badge>
                  a new task
                </div>
                <router-link :to="'/task-view'" class="navPage">
                  <div
                    class="Taskname newClass"
                    @click="TaskRedirect(Data.project_id, Data.task_id)"
                  >
                    {{ Data.task_name }}
                  </div>
                </router-link>
                <div class="widget-subheading newClass">
                  {{ moment(Data.created_date).fromNow() }}
                </div>
                <div></div>
              </div>
              <div class="widget-content-left" v-if="Data.action == 3">
                <div v-if="Data.profile_photo == null">
                  <v-avatar class="mr-3 ImageProfile">
                    <img src="../../../assets/dd.jpg" alt="" />
                  </v-avatar>
                </div>
                <div v-if="Data.profile_photo != null">
                  <v-avatar class="mr-3 ImageProfile">
                    <img v-bind:src="Data.profile_photo" alt="" />
                  </v-avatar>
                </div>
                <div class="widget-heading headingContent">
                  {{ Data.action_by }}
                  <v-badge
                    color="#4caf93"
                    content="Updated"
                    left
                    inline
                  ></v-badge>
                  a task
                </div>
                <router-link :to="'/task-view'" class="navPage">
                  <div
                    class="Taskname newClass"
                    @click="TaskRedirect(Data.project_id, Data.task_id)"
                  >
                    {{ Data.task_name }}
                  </div>
                </router-link>
                <div class="widget-subheading newClass">
                  {{ moment(Data.created_date).fromNow() }}
                </div>
              </div>

              <div class="widget-content-left" v-if="Data.action == 4">
                <div v-if="Data.profile_photo == null">
                  <v-avatar class="mr-3 ImageProfile">
                    <img src="../../../assets/dd.jpg" alt="" />
                  </v-avatar>
                </div>
                <div v-if="Data.profile_photo != null">
                  <v-avatar class="mr-3 ImageProfile">
                    <img v-bind:src="Data.profile_photo" alt="" />
                  </v-avatar>
                </div>
                <div class="widget-heading headingContent">
                  {{ Data.action_by }}
                  <v-badge
                    color="success"
                    content=" Uploaded"
                    left
                    inline
                  ></v-badge>
                  a file
                </div>
                <div class="widget-subheading"></div>

                <router-link :to="'/task-view'" class="navPage">
                  <div
                    class="Taskname newClass"
                    @click="TaskRedirect(Data.project_id, Data.task_id)"
                  >
                    {{ Data.task_name }}
                  </div>
                </router-link>

                <div class="widget-subheading newClass">
                  {{ moment(Data.created_date).fromNow() }}
                </div>
              </div>
              <div class="widget-content-left" v-if="Data.action == 5">
                <div v-if="Data.profile_photo == null">
                  <v-avatar class="mr-3 ImageProfile">
                    <img src="../../../assets/dd.jpg" alt="" />
                  </v-avatar>
                </div>
                <div v-if="Data.profile_photo != null">
                  <v-avatar class="mr-3 ImageProfile">
                    <img v-bind:src="Data.profile_photo" alt="" />
                  </v-avatar>
                </div>
                <div class="widget-heading headingContent">
                  {{ Data.action_by }}
                  <v-badge
                    color="warning"
                    content=" Assigned"
                    left
                    inline
                  ></v-badge>
                  a file
                </div>
                <router-link :to="'/task-view'" class="navPage">
                  <div
                    class="Taskname newClass"
                    @click="TaskRedirect(Data.project_id, Data.task_id)"
                  >
                    {{ Data.task_name }}
                  </div>
                </router-link>
                <div class="widget-subheading newClass">
                  {{ moment(Data.created_date).fromNow() }}
                </div>
              </div>
              <div class="widget-content-left" v-if="Data.action == 6">
                <div v-if="Data.profile_photo == null">
                  <v-avatar class="mr-3 ImageProfile">
                    <img src="../../../assets/dd.jpg" alt="" />
                  </v-avatar>
                </div>
                <div v-if="Data.profile_photo != null">
                  <v-avatar class="mr-3 ImageProfile">
                    <img v-bind:src="Data.profile_photo" alt="" />
                  </v-avatar>
                </div>
                <div class="widget-heading headingContent">
                  {{ Data.action_by }}
                  <v-badge
                    color="warning"
                    content=" Re-Assigned"
                    left
                    inline
                  ></v-badge>
                  a Task
                </div>
                <router-link :to="'/task-view'" class="navPage">
                  <div class="Taskname newClass">
                    {{ Data.task_name }}
                  </div>
                </router-link>
                <div class="widget-subheading newClass">
                  {{ moment(Data.created_date).fromNow() }}
                </div>
              </div>
              <div class="widget-content-left" v-if="Data.action == 7">
                <div v-if="Data.profile_photo == null">
                  <v-avatar class="mr-3 ImageProfile">
                    <img src="../../../assets/dd.jpg" alt="" />
                  </v-avatar>
                </div>
                <div v-if="Data.profile_photo != null">
                  <v-avatar class="mr-3 ImageProfile">
                    <img v-bind:src="Data.profile_photo" alt="" />
                  </v-avatar>
                </div>
                <div class="widget-heading headingContent">
                  {{ Data.action_by }}
                  <v-badge
                    color="primary"
                    content=" Created  "
                    left
                    inline
                  ></v-badge
                  >and
                  <v-badge
                    color="warning"
                    content="Assigned"
                    left
                    inline
                  ></v-badge>
                  a Task
                </div>
                <router-link :to="'/task-view'" class="navPage">
                  <div
                    class="Taskname newClass"
                    @click="TaskRedirect(Data.project_id, Data.task_id)"
                  >
                    {{ Data.task_name }}
                  </div>
                </router-link>
                <div class="widget-subheading newClass">
                  {{ moment(Data.created_date).fromNow() }}
                </div>
              </div>
              <div class="widget-content-left" v-if="Data.action == 8">
                <div v-if="Data.profile_photo == null">
                  <v-avatar class="mr-3 ImageProfile">
                    <img src="../../../assets/dd.jpg" alt="" />
                  </v-avatar>
                </div>
                <div v-if="Data.profile_photo != null">
                  <v-avatar class="mr-3 ImageProfile">
                    <img v-bind:src="Data.profile_photo" alt="" />
                  </v-avatar>
                </div>
                <div class="widget-heading headingContent">
                  {{ Data.action_by }}
                  <v-badge
                    color="primary"
                    content=" Changed  "
                    left
                    inline
                  ></v-badge>
                  Task status
                </div>
                <router-link :to="'/task-view'" class="navPage">
                  <div
                    class="Taskname newClass"
                    @click="TaskRedirect(Data.project_id, Data.task_id)"
                  >
                    {{ Data.task_name }}
                  </div>
                </router-link>
                <div class="widget-subheading">
                  {{ moment(Data.created_date).fromNow() }}
                </div>
              </div>
              <div class="widget-content-left" v-if="Data.action == 9">
                <div v-if="Data.profile_photo == null">
                  <v-avatar class="mr-3 ImageProfile">
                    <img src="../../../assets/dd.jpg" alt="" />
                  </v-avatar>
                </div>
                <div v-if="Data.profile_photo != null">
                  <v-avatar class="mr-3 ImageProfile">
                    <img v-bind:src="Data.profile_photo" alt="" />
                  </v-avatar>
                </div>
                <div class="widget-heading headingContent">
                  {{ Data.action_by }}
                  <v-badge
                    color="#4caf93"
                    content="Updated"
                    left
                    inline
                  ></v-badge
                  >and
                  <v-badge
                    color="warning"
                    content="Re-Assign"
                    left
                    inline
                  ></v-badge>
                  Task status
                </div>
                <router-link :to="'/task-view'" class="navPage">
                  <div
                    class="Taskname newClass"
                    @click="TaskRedirect(Data.project_id, Data.task_id)"
                  >
                    {{ Data.task_name }}
                  </div>
                </router-link>
                <div class="widget-subheading newClass">
                  {{ moment(Data.created_date).fromNow() }}
                </div>
              </div>
              <div
                class="widget-content-left"
                style="width: 100%"
                v-if="Data.action == 10"
              >
                <div v-if="Data.profile_photo == null">
                  <v-avatar class="mr-3 ImageProfile">
                    <img src="../../../assets/dd.jpg" alt="" />
                  </v-avatar>
                </div>
                <div v-if="Data.profile_photo != null">
                  <v-avatar class="mr-3 ImageProfile">
                    <img v-bind:src="Data.profile_photo" alt="" />
                  </v-avatar>
                </div>
                <div class="widget-heading headingContent">
                  {{ Data.action_by }}
                  added a
                  <v-badge
                    color="primary"
                    content="Comment"
                    left
                    inline
                  ></v-badge>
                </div>
                <router-link :to="'/task-view'" class="navPage">
                  <div
                    class="Taskname newClass"
                    @click="TaskRedirect(Data.project_id, Data.task_id)"
                  >
                    {{ Data.task_name }}
                  </div>
                </router-link>
                <div style="margin-bottom: 0px" class="newClass">
                  <tr>
                    <td data-test="id3">Comment- &nbsp;</td>
                    <td
                      id="idd"
                      class="commentBox newClass"
                      v-html="convertToBlue(Data.comment)"
                    ></td>
                  </tr>
                </div>

                <div class="widget-subheading newClass">
                  {{ moment(Data.created_date).fromNow() }}
                </div>
              </div>
              <div class="widget-content-left" v-if="Data.action == 11">
                <div v-if="Data.profile_photo == null">
                  <v-avatar class="mr-3 ImageProfile">
                    <img src="../../../assets/dd.jpg" alt="" />
                  </v-avatar>
                </div>
                <div v-if="Data.profile_photo != null">
                  <v-avatar class="mr-3 ImageProfile">
                    <img v-bind:src="Data.profile_photo" alt="" />
                  </v-avatar>
                </div>
                <div class="widget-heading headingContent">
                  {{ Data.action_by }}
                  <v-badge
                    color="#4caf93"
                    content="Changed"
                    left
                    inline
                  ></v-badge>
                  status
                </div>
                <router-link :to="'/task-view'" class="navPage">
                  <div class="Taskname newClass">
                    {{ Data.task_name }}
                  </div>
                </router-link>
                <div class="widget-subheading newClass">
                  {{ moment(Data.created_date).fromNow() }}
                </div>
              </div>

              <div class="widget-content-left" v-if="Data.action == 12">
                <div v-if="Data.profile_photo == null">
                  <v-avatar class="mr-3 ImageProfile">
                    <img src="../../../assets/dd.jpg" alt="" />
                  </v-avatar>
                </div>
                <div v-if="Data.profile_photo != null">
                  <v-avatar class="mr-3 ImageProfile">
                    <img v-bind:src="Data.profile_photo" alt="" />
                  </v-avatar>
                </div>
                <div class="widget-heading headingContent">
                  {{ Data.action_by }}
                  <v-badge
                    color="primary"
                    content="Updated"
                    left
                    inline
                  ></v-badge
                  >Changed assignee
                  <v-badge
                    color="warning"
                    content="Re-Assign"
                    left
                    inline
                  ></v-badge>
                </div>
                <router-link :to="'/task-view'" class="navPage">
                  <div
                    class="Taskname newClass"
                    @click="TaskRedirect(Data.project_id, Data.task_id)"
                  >
                    {{ Data.task_name }}
                  </div>
                </router-link>
                <div class="widget-subheading newClass">
                  {{ moment(Data.created_date).fromNow() }}
                </div>
              </div>

              <div class="widget-content-left" v-if="Data.action == 13">
                <div v-if="Data.profile_photo == null">
                  <v-avatar class="mr-3 ImageProfile">
                    <img src="../../../assets/dd.jpg" alt="" />
                  </v-avatar>
                </div>
                <div v-if="Data.profile_photo != null">
                  <v-avatar class="mr-3 ImageProfile">
                    <img v-bind:src="Data.profile_photo" alt="" />
                  </v-avatar>
                </div>
                <div class="widget-heading headingContent">
                  {{ Data.action_by }}
                  <v-badge
                    color="primary"
                    content="Changed"
                    left
                    inline
                  ></v-badge>
                  status And Assignee
                </div>
                <router-link :to="'/task-view'" class="navPage">
                  <div
                    class="Taskname newClass"
                    @click="TaskRedirect(Data.project_id, Data.task_id)"
                  >
                    {{ Data.task_name }}
                  </div>
                </router-link>
                <div class="widget-subheading newClass">
                  {{ moment(Data.created_date).fromNow() }}
                </div>
              </div>
              <div class="widget-content-left" v-if="Data.action == 14">
                <div v-if="Data.profile_photo == null">
                  <v-avatar class="mr-3 ImageProfile">
                    <img src="../../../assets/dd.jpg" alt="" />
                  </v-avatar>
                </div>
                <div v-if="Data.profile_photo != null">
                  <v-avatar class="mr-3 ImageProfile">
                    <img v-bind:src="Data.profile_photo" alt="" />
                  </v-avatar>
                </div>
                <div class="widget-heading headingContent">
                  {{ Data.action_by }}
                  <v-badge
                    color="primary"
                    content="renamed"
                    left
                    inline
                  ></v-badge
                  >a file
                </div>
                <router-link :to="'/task-view'" class="navPage">
                  <div
                    class="Taskname newClass"
                    @click="TaskRedirect(Data.project_id, Data.task_id)"
                  >
                    {{ Data.task_name }}
                  </div>
                </router-link>
                <div class="widget-subheading newClass">
                  {{ moment(Data.created_date).fromNow() }}
                </div>
              </div>

              <div class="widget-content-left" v-if="Data.action == 20">
                <div class="widget-heading">
                  <div v-if="Data.profile_photo == null">
                    <v-avatar class="mr-3 ImageProfile">
                      <img src="../../../assets/dd.jpg" alt="" />
                    </v-avatar>
                  </div>
                  <div v-if="Data.profile_photo != null">
                    <v-avatar class="mr-3 ImageProfile">
                      <img v-bind:src="Data.profile_photo" alt="" />
                    </v-avatar>
                  </div>
                  {{ Data.action_by }}
                  Edited the
                  <v-badge
                    color="pink accent-3"
                    content="Memebers"
                    left
                    inline
                  ></v-badge
                  >Of the project
                </div>
                <router-link :to="'/home'" class="navPage">
                  <div
                    class="projectName"
                    @click="redirectUrl(Data.project_id, Data.task_id)"
                  >
                    {{ Data.project_name }}({{ Data.project_code }})
                  </div>
                </router-link>
                <div class="widget-subheading">
                  {{ Data.allocated_user_name }} has been added as a
                  {{ Data.allocated_role_name }}
                </div>
                <div class="widget-subheading">
                  {{ moment(Data.created_date).fromNow() }}
                </div>
              </div>

              <div class="widget-content-left" v-if="Data.action == 21">
                <div class="widget-heading">
                  <div v-if="Data.profile_photo == null">
                    <v-avatar class="mr-3 ImageProfile">
                      <img src="../../../assets/dd.jpg" alt="" />
                    </v-avatar>
                  </div>
                  <div v-if="Data.profile_photo != null">
                    <v-avatar class="mr-3 ImageProfile">
                      <img v-bind:src="Data.profile_photo" alt="" />
                    </v-avatar>
                  </div>
                  {{ Data.action_by }}
                  Edited the
                  <v-badge
                    color="pink accent-3"
                    content="Memebers"
                    left
                    inline
                  ></v-badge
                  >Of the project
                </div>
                <div class="projectName">
                  {{ Data.project_name }}({{ Data.project_code }})
                </div>
                <div class="widget-subheading">
                  {{ Data.allocated_user_name }} has been added as a
                  {{ Data.allocated_role_name }}
                </div>
                <div class="widget-subheading">
                  {{ moment(Data.created_date).fromNow() }}
                </div>
              </div>

              <div class="widget-content-left" v-if="Data.action == 24">
                <div class="widget-heading">
                  <div v-if="Data.profile_photo == null">
                    <v-avatar class="mr-3 ImageProfile">
                      <img src="../../../assets/dd.jpg" alt="" />
                    </v-avatar>
                  </div>
                  <div v-if="Data.profile_photo != null">
                    <v-avatar class="mr-3 ImageProfile">
                      <img v-bind:src="Data.profile_photo" alt="" />
                    </v-avatar>
                  </div>
                  {{ Data.action_by }}
                  Edited the
                  <v-badge
                    color="pink accent-3"
                    content="Memebers"
                    left
                    inline
                  ></v-badge
                  >Of the project
                </div>
                <router-link :to="'/home'" class="navPage">
                  <div
                    class="projectName"
                    @click="redirectUrl(Data.project_id, Data.task_id)"
                  >
                    {{ Data.project_name }}({{ Data.project_code }})
                  </div>
                </router-link>
                <div class="widget-subheading">
                  {{ Data.allocated_user_name }} removed from the project
                </div>
                <div class="widget-subheading">
                  {{ moment(Data.created_date).fromNow() }}
                </div>
              </div>
            </div>
            <div v-if="Data.status!=0">
            <v-icon
              class="icons"
              @click="openText(Data.task_history_id, Data.project_id, index,i)"
            >
              mdi-message-processing</v-icon
            >
          </div>

            <div v-show="openStates[Data.task_history_id]">
          <div class="comment">
            <div>
              <v-form ref="form">
                <Mentionable
                  placement="bottom"
                  :keys="['@']"
                  :items="items"
                  offset="6"
                  insert-space
                  limit="10000"
                >
                  <textarea
                    color="black"
                    rows="6"
                    placeholder="Write a comment, use @mention to notify a colleague..."
                    class="input"
                    :rules="descriptionRules"
                    @input="type(index)"
                    @keydown="handleInputKeyDown($event,index,i)"
                    v-model="commentss[i][index]"
                  ></textarea>
                </Mentionable>

                <v-card-actions style="justify-content: center">
                  <v-btn
                    color="#4fa5h6"
                    class="cmnbtnstyle"
                    @click="commentClose(Data.task_history_id, index,i)"
                    id="btnshadow"
                    >Cancel
                  </v-btn>
                  <v-btn
                    class="cmnbtnstyle"
                    color="#4fa5d6"
                    :disabled="
                      commentss[i][index] == null || commentss[i][index] == ''
                    "
                    @click="
                      addComment(
                        Data.task_id,
                        Data.project_id,
                        Data.task_history_id,
                        index,
                        i
                      )
                    "
                    id="btnshadow"
                  >
                    Save
                  </v-btn>
                 
                </v-card-actions>
              </v-form>
            </div>
          </div>
        </div>
          </div>
        </div>
        
      </div>
        </div>
      </div>
<br/>

      </div>
    <div class="box">
      <div v-if="UserActivityData.length == 0 && value == true">
        <p class="NoData" data-test="noDataMsg">No Data Available</p>
      </div>
      

    </div>

    <div v-if="value == false">
      <div class="loader" data-test="id1"></div>
    </div>



    
    <div
      class="d-flex justify-space-around align-center flex-column flex-sm-row"
      v-if="UserActivityData.length > 9 && UserActivityData.length != total"
    >
      <p
        v-show="activityList.length != 0"
        @click="userActivity"
        class="loadButton"
      >
        Load More <span class="mdi mdi-chevron-down"></span>
      </p>
    </div>

    <br /><br />
    <br /><br />
  </div>
</template>


<script scoped>
import ApiService from "../../../service/apiservice";
import Vue from "vue";
import "vue-toast-notification/dist/theme-sugar.css";
import VueToast from "vue-toast-notification";

let moment = require("moment");
import { Mentionable } from "vue-mention";
Vue.use(VueToast);
export default {
  components: { Mentionable },
  data() {
    return {
      activity:[],
      idata:"",
      activityDate:"",
      loadValue: false,
      total: "",
      lastData: "",
      value: false,
      commentButton: false,
      commentModal: false,
      taskHostoryId: "",
      value1: true,
      searchProjects: null,
      notificationListLength: 10,
      commentResponse: [],
      user_list: [],
      activityList: [],
      project_id: "",
      searchKey: "",
      openStates: {},
      commentss:[[]],
      value2: false,
      inputData: {
        comment: null,
        task_id: "",
        notify: [],
      },
      descriptionRules: [
        (v) => !!v || "Post a comment",

        (v) => (v && v.length <= 500) || "Only 500 characters allowed",
      ],
      moment: moment,
      data: [],
      UserActivityData: [],
      ProjectData: [],
    };
  },
  mounted() {
    this.userActivity();
    // this.getAllocatedUser();
  },
  methods: {
   
    openText(id, pid, index,i) {
      this.CommentTaskId = id;

      this.getAllocatedUser(pid);
      if (this.openStates[id]) {
        this.commentClose(id, index,i);
      } else {
        this.$set(this.openStates, id, true);
      }
      // set the open state for the clicked card to true
    },
    redirectUrl(id) {
      localStorage.setItem("projectId", id);
      this.$store.commit("getData", id);
    },
    TaskRedirect(id, taskId) {
      localStorage.setItem("taskId", taskId);
      localStorage.setItem("projectId", id);
      this.$store.commit("getData", id);
      this.$store.commit("getTaskData", taskId);
    },
    async addComment(task_id, project_id, ids, index,i) {
      this.lastData = "";
      this.UserActivityData = [];
      this.activity=[]
      this.inputData.comment = this.commentss[i][index];
      this.commentButton = true;
      try {
        
        this.inputData.task_id = task_id;
        const id = project_id;
        const responseComment = await ApiService(
          "/task/commentTask/" + id,
          "POST",
          this.inputData
        );

        this.commentss[i][index] = "";
        this.$set(this.openStates, ids, false);


        console.log(responseComment);
          Vue.$toast.success("Comment added successfully...", {
            position: "top",
            queue: true,
          });

        this.commentModal = false;
      } catch (error) {
        Vue.$toast.warning("Failed to add comment", {
          position: "top",
        });
        this.commentss[i][index] = "";
        this.$set(this.openStates, ids, false);

            }
            this.userActivity();

      this.inputData.comment = "";
      this.inputData.task_id = "";
      this.inputData.notify = [];
    },
    handleInputKeyDown(event,index,i) {
      console.log(event);
      if (event.key === "Backspace") {
     
        let comment = this.commentss[i][index];
       
        
          let lastWord = comment;
          if (
            lastWord.startsWith("@") &&
            lastWord.includes("@") &&
            lastWord.includes(".")
          ) {
            
            comment = " ";
          }

          this.commentss = comment;
      
        } 
      
    },
   
    commentClose(id, index,i) {
      this.$set(this.openStates, id, false);
      this.commentss[i][index] = "";

      this.commentButton = false;

      this.commentButton = false;

      this.commentModal = false;
    },
    openMessageModal(id, pid) {
      this.inputData.comment = null;
      this.inputData.task_id = "";
      this.inputData.notify = [];
      this.commentModal = true;
      this.commentButton = false;
      this.taskHostoryId = id;
      this.data.project_id = pid;

      this.getAllocatedUser(pid);
    },

    async userActivity() {
      this.loadValue = false;
      this.value = false;
      const params = {
        limit: 10,
        last_data: this.lastData,
      };
      const responseData = await ApiService(
        "users/getActivity",
        "GET",
        null,
        null,
        params
      );

      this.activityList = responseData.recentUpdates;

      this.loadValue = true;
      this.value = true;
      this.step = 2;
      if(this.lastData==""){
        this.total = responseData.total;

      }

      for (const element of responseData.recentUpdates) {
        let activityIndex = this.activity.findIndex(x => x.date == element.group_date)
        if (activityIndex>=0) {
          this.activity[activityIndex].data.push(element)
        } else {

          this.activity.push({
            date: element.group_date,
            data: [element]
          })
        }
  

        this.UserActivityData.push(element);
      }
    

      for (let i = 0; i < this.activity.length; i++) {{
        for (let index = 0; index < this.activity.length; index++){
          this.commentss.push({
            i:"",
          index: "",
        });
        this.commentss[i][index] = "";
        }
      }
      
      }



      const length = this.UserActivityData.length;
      this.lastData = this.UserActivityData[length - 1].task_history_id;
      this.profile_photo = response.profile_photo;
    },
    loadMore() {
      if (this.notificationListLength > this.UserActivityData.length) return;
      this.notificationListLength = this.notificationListLength + 10;
    },
    loadLess() {
      if (this.notificationListLength > this.UserActivityData.length) return;
      this.notificationListLength = this.notificationListLength - 10;
    },
    async getAllocatedUser(pid) {
      try {
       

        const data = {};
        const response = await ApiService(
          "project/Usersprojects/" + pid,
          "POST",
          data,
          
        );
        this.user_list = response?.listView;
      } catch (error) {
        console.log(error);
      }
    },
    convertToBlue(text) {
      let words = text.split(" ");
      let result = "";
      for (let word of words) {
        if (word.includes("@") && word.includes(".")) {
          // Check if word looks like an email
          result += "<span style='color: #4fa5d6 '>" + word + "</span> ";
        } else if (word.startsWith("@")) {
          // Check if word starts with "@"
          result += "<span >" + word + "</span> ";
        } else {
          result += word + " ";
        }
      }
      return result.trim();
    },
  },

  computed: {
    activityLoaded() {
      return this.UserActivityData.slice(0, this.notificationListLength);
    },

    items() {
      let mentionlist = [];
      this.user_list?.map((data) => {
        let emails = data?.user?.email;

        mentionlist.push({
          // userid: (data?.user?.user_id).toString(),
          label: emails,
          value: emails,
        });
      });

      return mentionlist;
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
/* .CompanyName {
  margin-top: -10%;
} */
.box {
  background-color: white;
  border-radius: 4px 4px 0 0;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
}

.boxActivity {
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
}
.Toggle {
  padding: 20px 45% 1px;
}
.toggleText {
  font-weight: 400;
}
.activeTag :active {
  color: #065492;
}
.profile {
  padding: 10px 48% 1px 46%;
}
.ProfileName {
  font-size: 18px;
  padding: 0px 1px 50px 1px;
}
.icons {
  margin-left: 80%;
  margin-bottom: -2px;
  text-align: right;
  float: left;
}
.commentBox {
  word-break: break-word;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}
.Taskname {
  word-break: break-all;
  color: rgb(121, 121, 121);
  font-weight: 600;
  font-size: 14px;
}
.NoData {
  font-size: larger;
  display: flex;
  justify-content: center;
}
.outOfBox {
  padding: 1px 28%;
}

@media only screen and (max-width: 1400px) {
  .menuItems {
    color: white;
    font-size: 10px;
  }
  .listItem {
    text-align: center;
    height: 20%;
    border-radius: 15%;
    color: white;
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
.loadButton {
  margin-top: 10px;
  cursor: pointer;
  font-weight: 500;
}

svg {
  width: 3.25em;
  transform-origin: center;
  animation: rotate4 2s linear infinite;
}

circle {
  fill: none;
  stroke: hsl(214, 97%, 59%);
  stroke-width: 2;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  animation: dash4 1.5s ease-in-out infinite;
}

@keyframes rotate4 {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash4 {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -35px;
  }

  100% {
    stroke-dashoffset: -125px;
  }
}

.input {
  padding: 3px;
  width: 100%;
  max-height: 200px;
  min-height: 100px;
  border: 1px solid black;
}

.mention-item {
  padding: 4px 10px;
  border-radius: 4px;
}

.mention-selected {
  background: #4fa5d6;
}

.cmnbtnstyle {
  width: 110px;
  height: 40px !important;
}

.ImageProfile {
  width: 35px !important;
  height: 35px !important;
  margin-left: -5px;
}
.headingContent {
  margin-left: 40px;
  margin-top: -38px;
}
.newClass {
  margin-left: 40px;
}
.comment{
  
  margin-top: 10px;
  margin-left: 40px;
  margin-right: 40px;
}
 textarea ::placeholder{
  color: #065492 !important;
}
@media screen and (max-width:770px){
  .outOfBox{
    padding: 1px 0% !important;
    justify-content: center;
}
.comment{
  
  margin-top: 10px;
  margin-left: 0px;
  margin-right: 40px;
}
.input {
    padding: 3px;
    width: 95% !important;
    height: 90px !important;
    max-height: 155px;
    min-height: 42px;
    border: 1px solid black;
}

}




.boxss p {
  /* padding: 10px; */
  margin-left: 5px;
  margin-bottom: 2px;
  font-weight: bolder;
}
</style>