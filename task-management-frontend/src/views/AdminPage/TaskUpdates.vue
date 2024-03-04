<template>
  <div
    class="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header"
  >
    <topNavigation />

    <div class="app-main">
      <sideNavigation @SideBarToggle="ToggleOnOff" />
      <div class="app-main__outer" id="boxs" v-bind:style="{'margin-left': '64px', 'transition': none}">
        <div class="app-main__inner">
          <div class="app-page-title bg-light p-1 Toptitle">
            <div class="page-title-wrapper">
              <div class="page-title-heading">
                <router-link exact :to="'/home'">
                  <v-img class="logo" src="../../assets/Images/logo.png" width="50"></v-img
                ></router-link>
                <div class="names"  :title="`${ProjectData.project_name} (${ProjectData.project_code})`" >
                  {{ ProjectData.project_name }} ({{
                    ProjectData.project_code
                  }})
                </div>
              </div>
            </div>
          </div>
          <!---------------------------------------------------section starts----------------------------------------------------------------------------------------->
          <div>
            <div class="maintitle">
              <div class="parenttask">
                
                  <h5
                    @click="
                      TaskRedirect(ProjectData.project_id,taskData.parent_id)
                    "
                    v-if="taskData.task_relation == 3"
                  >
                    Parent task- {{ taskData.parent_task_name }}[{{
                      taskData.parent_id
                    }}]
                  </h5
                >
              </div>
              <div class="title1">
                <div>
                  <template v-if="taskData.issue_id == 1">
                    <v-btn
                      outlined
                      rounded
                      color="white"
                      width="120px"
                      height="30px"
                      :title="taskData.issue_name"
                      style="
                        border: none;
                        font-size: 12px;
                        text-transform: none;
                        background-color: #e64754;
                      "
                    >
                      {{ taskData.issue_name }}
                    </v-btn>
                  </template>
                  <template v-if="taskData.issue_id == 2">
                    <v-btn
                      outlined
                      rounded
                      color="white"
                      width="120px"
                      height="30px"
                      :title="taskData.issue_name"
                      style="
                        border: none;
                        
                        font-size: 12px;
                        text-transform: none;
                        background-color: #478af5;
                      "
                    >
                      {{ taskData.issue_name }}
                    </v-btn>
                  </template>
                  <template v-if="taskData.issue_id == 3">
                    <v-btn
                      outlined
                      :title="taskData.issue_name"
                      rounded
                      color="white"
                      width="120px"
                      height="30px"
                      style="
                        border: none;
                        font-size: 12px;
                        text-transform: none;
                        background-color: #21c241;
                      "
                    >
                      {{ taskData.issue_name }}
                    </v-btn>
                  </template>
                  <template v-if="taskData.issue_id == 4">
                    <v-btn
                      :title="taskData.issue_name"
                      outlined
                      rounded
                      color="white"
                      width="120px"
                      height="30px"
                      style="
                        border: none;
                        font-size: 12px;
                        text-transform: none;
                        background-color: #d9991a;
                      "
                    >
                      {{ taskData.issue_name }}
                    </v-btn>
                  </template>

                  <template
                    v-if="
                      taskData.issue_id != 1 &&
                      taskData.issue_id != 2 &&
                      taskData.issue_id != 3 &&
                      taskData.issue_id != 4 &&
                      taskData.issue_id
                    "
                  >
                    <label
                      class="text-truncate"
                      :title="taskData.issue_name"
                      outlined
                      rounded
                  color="plum"
                      width="120px"
                      height="100px"
                      style="
                        border: none;
                        font-size: 12px;
                        text-transform: none;
                        background-color: plum !important;
                      "
                    >
                      {{ taskData.issue_name }}
                    </label>
                  </template>
                </div>

                <div></div>
              </div>
              <div class="subtitle">
                <h5 class="tname">
                  <v-icon
                    v-if="taskData.task_relation == 2"
                    style="margin-left: -1%"
                    >mdi-lan-pending</v-icon
                  >

                  TasK Name - {{ taskData.task_name }}[{{ taskData.task_id }}]
                </h5>
                <div>
                  <div class="editdelete">
                    <router-link class="text" :to="'/edit-task'">
                      <div v-show="projectRole != 5" title="Edit">
                        <v-icon color="primary">mdi-lead-pencil</v-icon>
                      </div>
                    </router-link>

                    <div
                      v-show="projectRole != 5"
                      @click="confirmdelete"
                      title="Delete"
                    >
                      <v-icon color="red">mdi-delete</v-icon>
                    </div>
                  </div>

                  <v-dialog v-model="alertDialog" persistent max-width="500">
                    <v-card>
                      <v-card-title class="text-h5">
                        <p>The task is in inprogress state...</p>
                        <p>Are you sure you want to delete this?</p>
                      </v-card-title>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="red darken-1"
                          text
                          @click="alertDialog = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          color="green darken-1"
                          text
                          @click="
                            alertDialog = false;
                            dialog = true;
                          "
                        >
                          Ok
                        </v-btn>
                      </v-card-actions>
                    </v-card>

                    <!--------------------------------------------------------------->
                  </v-dialog>
                  <v-dialog v-model="dialog" persistent max-width="290">
                    <v-card>
                      <v-card-title class="text-h5">
                        Are you sure ?
                      </v-card-title>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="red darken-1"
                          text
                          @click="dialog = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn color="green darken-1" text @click="deletetask">
                          Ok
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                    <!--------------------------------------------------------------->
                  </v-dialog>

                  <!----------------------------------------change--------------------------------->
                </div>
              </div>

              <div class="taskcontent">
                <!-----------------------accound section---------------------->

                <div class="taskassignee">
                  <div class="acnt">
                    <div>
                      <div v-if="taskData.created_by_photo !== null">
                        <img
                          width="40"
                          height="40"
                          class="rounded-circle responsive-img"
                          v-bind:src="taskData.created_by_photo"
                          loading="lazy"
                          alt=""
                          title="Profile"
                        />
                      </div>

                      <div v-if="taskData.created_by_photo == null">
                        <img
                          width="40"
                          height="40"
                          class="rounded-circle"
                          src="../../assets/Images/profilePicc.jpg"
                          alt=""
                          title="Profile"
                        />
                      </div>
                    </div>
                    <v-col cols="12" sm="6">
                      <h5>{{ taskData.created_by }}</h5>
                    </v-col>
                  </div>
                </div>
                <!-----------------description---------------------------------------->

                <div>
                  <div>
                    <div
                      class="discription"
                      v-html="taskData.task_description"
                    ></div>
                    <!------------------------------------------------------------------>

                    <div class="tdata" cols="12">
                      <template>
                        <v-row>
                          <v-col cols="6">
                            <template>
                              <div class="gridleft"></div>
                            </template>
                          </v-col>
                          <v-col cols="6">
                            <template>
                              <div class="gridleft"></div>
                            </template>
                          </v-col>
                        </v-row>
                      </template>
                      <template>
                        <v-row>
                          <v-col cols="12" lg="6" sm="12" xs="12">
                            <template>
                              <div class="gridleft1">
                                <v-row>
                                  <v-col cols="6" sm="4" xs="8">
                                    <span>Priority : </span>
                                  </v-col>

                                  <v-col cols="6" sm="4" xs="8">
                                    <span v-if="taskData.priority == 3">
                                      <v-icon
                                        v-bind="attrs"
                                        v-on="on"
                                        color="red"
                                        >mdi-arrow-up</v-icon
                                      ></span
                                    >
                                    <span v-if="taskData.priority == 2">
                                      <v-icon
                                        v-bind="attrs"
                                        v-on="on"
                                        color="#4622bd"
                                        >mdi-arrow-right</v-icon
                                      ></span
                                    >
                                    <span v-if="taskData.priority == 1">
                                      <v-icon
                                        v-bind="attrs"
                                        v-on="on"
                                        color="green"
                                        >mdi-arrow-down</v-icon
                                      ></span
                                    >

                                    {{ findpriority(taskData.priority) }}
                                  </v-col>
                                </v-row>
                              </div>
                            </template>
                          </v-col>
                          <v-col cols="12" lg="6" sm="12" xs="12">
                            <template>
                              <div class="gridright1">
                                <v-row>
                                  <v-col cols="6" sm="4">
                                    <span>Assignee : </span>
                                  </v-col>
                                  <v-col cols="6" sm="4">
                                    {{ taskData.assignee }}
                                  </v-col>
                                </v-row>
                              </div>
                            </template>
                          </v-col>
                        </v-row>
                      </template>
                      <template>
                        <v-row>
                          <v-col cols="12" lg="6" sm="12" xs="12">
                            <template>
                              <div class="gridleft">
                                <v-row>
                                  <v-col cols="6" sm="4">
                                    <span>Category : </span>
                                  </v-col>
                                  <v-col cols="6" sm="4">
                                    {{ taskData.category_name }}
                                  </v-col>
                                </v-row>
                              </div>
                            </template>
                          </v-col>
                          <v-col cols="12" lg="6" sm="12" xs="12">
                            <template>
                              <div class="gridleft">
                                <v-row>
                                  <v-col cols="6" sm="4">
                                    <span>Task status : </span>
                                  </v-col>
                                  <v-col cols="6" sm="4">
                                    {{ findStatus(taskData.task_status) }}
                                  </v-col>
                                </v-row>
                              </div>
                            </template>
                          </v-col>
                        </v-row>
                      </template>
                      <template>
                        <v-row>
                          <v-col cols="12" lg="6" sm="12" xs="12">
                            <template>
                              <div class="gridleft">
                                <v-row>
                                  <v-col cols="6" sm="4">
                                    <span>Start Date : </span>
                                  </v-col>

                                  <v-col cols="6" sm="4">
                                    {{ taskData.start_date }}
                                  </v-col>
                                </v-row>
                              </div>
                            </template>
                          </v-col>
                          <v-col cols="12" lg="6" sm="12" xs="12">
                            <template>
                              <div class="gridleft">
                                <v-row>
                                  <v-col cols="6" sm="4">
                                    <span>End Date : </span>
                                  </v-col>
                                  <v-col cols="6" sm="4">
                                    {{ taskData.end_date }}
                                  </v-col>
                                </v-row>
                              </div>
                            </template>
                          </v-col>
                        </v-row>
                      </template>
                      <template>
                        <v-row>
                          <v-col cols="12" lg="6" sm="12" xs="12">
                            <template>
                              <div class="gridright">
                                <v-row>
                                  <v-col cols="6" sm="4">
                                    <span>Estimated Hours : </span>
                                  </v-col>
                                  <v-col cols="6" sm="4">
                                    {{ taskData.estimated_hours }}
                                  </v-col>
                                </v-row>
                              </div>
                            </template>
                          </v-col>

                          <v-col cols="12" lg="6" sm="12" xs="12">
                            <template>
                              <div class="gridleft">
                                <v-row>
                                  <v-col cols="6" sm="4">
                                    <span>Actual Hours : </span>
                                  </v-col>
                                  <v-col cols="6" sm="4">
                                    {{ taskData.actual_hours }}
                                  </v-col>
                                </v-row>
                              </div>
                            </template>
                          </v-col>
                        </v-row>
                      </template>
                      <template>
                        <v-row> </v-row>
                      </template>
                    </div>
                  </div>
                  <br /><br />
                </div>
              </div>
              <div class="attachment">
                <template>
                  <template>
                    <div class="attachmentdiv">
                      <v-btn
                        @click="
                          expand = !expand;
                          getdetails();
                        "
                      >
                        <v-icon>mdi-attachment</v-icon>
                        <span>Attachment</span></v-btn
                      >

                      <v-expand-transition>
                        <v-card
                          style="overflow: scroll"
                          max-height="100"
                          v-show="expand"
                          height="100"
                          width="100%"
                          class="mx-auto"
                        >
                          <template>
                            <v-data-table
                              :headers="headers"
                              :items="file_list.files"
                              :items-per-page="20"
                              class="elevation-1"
                              :hide-default-footer="true"
                              v-model="files"
                              item-key="file_id"
                              @click:row="handleClick"
                            >
                              <template v-slot:[`item.name`]="{ item }">
                                <a @click="openfile(item)">{{
                                  item.file_name
                                }}</a>
                              </template>
                            </v-data-table>
                          </template>
                        </v-card>
                      </v-expand-transition>
                    </div>
                  </template>
                </template>
              </div>
              <div class="cmts">
                <p>Comments</p>
                <div class="cmtdiv">
                  <v-card>
                    <recent-comments
                      :cmtDetails="cmtDetails"
                      :tid="tid"
                      :projectId="projectId"
                    />
                  </v-card>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="footer1" id="boxs" v-bind:style="{'margin-left': '64px', 'transition': none}">
          <v-footer padless fixed id="footer" v-bind:style="{'margin-left': '64px', 'transition': none}">
            <div class="firstshow" v-show="showText">
              <div  @click="
                  showText = !showText;
                  disabled == true;
                " class="textdiv">
              <v-text-field
                v-model="plainText"
                outlined
                placeholder="Write a comment..........."
               
                @keydown.prevent
              ></v-text-field></div>
              <v-btn class="attachmentbtn" @click="showText = !showText"
                ><v-icon>mdi-message-draw</v-icon>Change Status</v-btn
              >
            </div>

            <div class="ckeditor" v-show="!showText">
              
              <div class="ckmain">
              
                  <v-col >
                    <ckeditor
                      :editor="editor"
                      v-model="comment.comment"
                      :config="editorConfig"
                      placeholder="Write a comment,use @mention to notify a colleague..........."
                      @input="CommentCheck()"
                    ></ckeditor>

                    <div class="ckeditorerrors">
                      <div
                        class="maxLengthError"
                        v-if="comment&&comment.comment&&comment.comment.length > maxLength"
                      >
                        Maximum length exceeded
                      </div>
                    </div>
                    <v-autocomplete
                      class="notifydiv"
                      multiple
                      outlined
                      clearable
                      deletable-chips
                      small-chips
                      chips
                      :items="Users"
                      item-text="text"
                      item-value="value"
                      v-model="comment.notify"
                      v-on:change="ButoonCheck()"
                      :disabled="comment.comment == null"
                      label="Notify comment to:"
                      style="width: 100%"
                    >
                    </v-autocomplete>
                  </v-col>
            
              </div>
              <div class="quater">
                <div class="status">
                  <v-select
                    :items="taskstatus"
                    v-model="changetask.task_status"
                    label="Task Status"
                    :rules="taskstatusRules"
                 
                    outlined
                    v-on:change="ButoonCheck()"
                  ></v-select>
                </div>
                <div class="statusform">
                  <div class="styledate">
                    <v-select
                      :items="assigne"
                      v-model="changetask.assignee"
                     
                      label="Assignee"
                      outlined
                      v-on:change="ButoonCheck()"
                    ></v-select>
                  </div>
                </div>
                <div class="csbtn">
                  <v-btn
                    id="btnshadow"
                    class="cmnbtnstyle"
                    @click="resetbtn"
                    color="#4fa5h6"
                   
                    >Cancel</v-btn
                  >

                  <v-btn
                    id="btnshadow"
                    class="cmnbtnstyle"
                    color="#4fa5d6"
                    @click="editstatus"
                    :disabled="!valid"
                  
                    >Save</v-btn
                  >
                </div>
              </div>
            </div>
          </v-footer>
        </div>
      </div>
    </div>
  </div>
</template>
                  
               

          <!--------------------------------------------------------section Ends-------------------------------------------------------------------------------------->
          


<script >
import sideNavigation from "../AdminPage/Notification/sideBarr.vue";

import topNavigation from "../AdminPage/adminTopNav.vue";
import ApiService from "@/service/apiservice";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import Vue from "vue";
import "vue-toast-notification/dist/theme-sugar.css";
import VueToast from "vue-toast-notification";
import RecentComments from "./RecentComments.vue";

Vue.use(VueToast);

export default {
  components: { sideNavigation, topNavigation, RecentComments },
  data() {
    return {
      showText: true,
      ProjectData: [],
      taskData: [],
      files: [],
      none: null ,
      maxLength: 60000,
      isRequired: true,
      tid: "",
      shown: true,
      expand: false,
      previousHash: "",
      cmtDetails: [],
      expand2: false,
      dialog: false,
      alertDialog: false,
      user_list: [],
      editor: ClassicEditor,
      editorData: "",
      plainText: "",
      projectRole: "",
      statusDialog: false,

      cmnotify: true,
      delete: {},
      user: [],
      result: "",
      comment: {
        comment: null,
        task_id: null,
        notify: [],
      },
      taskstatus: [
        { value: 1, text: "Open" },
        { value: 2, text: "Inprogress" },
        { value: 3, text: "Resolved" },
        { value: 4, text: "Closed" },
      ],

      assignielist: [],

      changetask: {
        task_status: null,
        assignee: null,
      },

      headers: [{ text: "File Name", value: "name", sortable: false }],

      file_list: { files: [] },

      editorConfig: {
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "bulletedList",
          "numberedList",
          "|",

          "undo",
          "redo",
        ],
      },

      projectId: JSON.parse(localStorage.getItem("projectId")),
      taskstatusRules: [(v) => !!v || "Task status is required"],
    };
  },
  watch: {
    plainTextComputed: function (newValue) {
      this.plainText = newValue;
    },
  //   plainTexteditor:function(newVal) {
  //   this.comment.comment = newVal;
  // },

    comment(newValue) {
      if (newValue.length > this.maxLength) {
        // If the content exceeds the maximum length, set an error message or prevent submission
      }
    },
  },
  methods: {
    CommentCheck() {
      if (this.comment.comment.length == 0) {
        this.valid = false;
      } else this.valid = true;

      this.$refs.editor.editor.setData(this.plainText);
    },

    TaskRedirect(id, taskId) {
     
      localStorage.setItem("taskId", taskId);
      localStorage.setItem("TaskId", taskId);

      localStorage.setItem("projectId", id);
      this.$store.commit("getData", id);
      this.$store.commit("getTaskData", taskId);    
        this.$router.push("/task-view");

      this.$router.go("/task-view");
    },

    async editstatus() {
      try {
        this.valid = false;
        this.tid = this.taskId;
        this.assignee = "";

        const response = await ApiService(
          "task/changeStatus/" + this.tid,
          "PUT",
          this.changetask
        );

        if (this.comment.comment) {
          this.id = this.projectId;

          this.result = await ApiService(
            "/task/commentTask/" + this.id,
            "POST",
            this.comment
          );
        }

        if (this.result) {
          if (
            response.task_id == this.tid &&
            this.result[0].statusCode == 200
          ) {
            this.valid = false;
            Vue.$toast.success("Task updated and comment added successfully", {
              position: "top",
            });
            this.$router.push("/task-list");
          } else if (
            response.statusCode == 1033 &&
            this.result[0].statusCode == 200
          ) {
            this.valid = false;
            Vue.$toast.success("Comment added successfully", {
              position: "top",
              queue: true,
            });
            this.$router.push("/task-list");
          }
        } else if (response.task_id == this.tid) {
          this.valid = false;
          Vue.$toast.success("Task updated successfully", {
            position: "top",
            queue: true,
          });
          this.$router.push("/task-list");
        } else if (this.result[0].statusCode == 200) {
          this.valid = false;
          Vue.$toast.success("Comment added successfully", {
            position: "top",
            queue: true,
          });
          this.resetbtn();
        } else {
          Vue.$toast.success("Comment Added Successfully", {
            position: "top",
            queue: true,
          });
          this.resetbtn();
        }
        if (!this.hasChanged) {
          Vue.$toast.warning("No changes were made", {
            position: "top",
          });
          return;
        }
      } catch (error) {
        console.log(error);
      }
    },

    notify(id) {
      this.comment.notify.push(id);
    },

    async GetProjectRole() {
      const response = await ApiService(
        "/project/projectRole/" + this.projectId,
        "GET"
      );

      this.ProjectRoleList = response;
      localStorage.setItem(
        "projectRole",
        JSON.stringify(response.project_role)
      );
    },
    handleClick(value) {
      console.log(value);
    },

    findCategory(value) {
      if (value === 1) {
        return "Bug";
      } else if (value === 2) {
        return "Developer issue";
      } else if (value === 3) {
        return "Request";
      } else if (value === 4) {
        return "Task";
      } else if (value === 5) {
        return "Other";
      }
    },

    findpriority(value) {
      if (value === 3) {
        return "High";
      } else if (value === 2) {
        return "Normal";
      } else if (value === 1) {
        return "Low";
      }
    },

    findStatus(value) {
      if (value === 1) {
        return "Open";
      } else if (value === 2) {
        return "Inprogress";
      } else if (value === 3) {
        return "Resolved";
      } else if (value === 4) {
        return "Closed";
      }
    },
    async getdetails() {
      try {
        const tid = this.taskId;
        const response = await ApiService(
          "task/getTask/" + tid,
          "GET",
          null,
          null,

          null
        );
        this.taskData = response.taskDetails;
        this.cmtDetails = response?.recentUpdates;

        this.changetask.task_status = response.taskDetails.task_status;
        this.changetask.assignee = response?.taskDetails.assignee_id || null;
        this.file_list = { files: response?.fileDetails.files };

        if (response.statusCode == 52) {
          this.$router.push("/dashboard");
        }
      } catch (error) {
        if (error.response && error.response.data.statusCode == 52) {
          this.$router.push("/dashboard");
        }
      }
    },

    openfile(data) {
      window.open(`${data?.file_path}`);
    },

    async getProjectDetails(id) {
      try {
        const response = await ApiService(
          "/project/overallProjectStatus/" + id,
          "GET"
        );
        this.ProjectData = response;
      } catch (error) {
        console.log(error, "error................");
      }
    },
    async confirmdelete() {
      const tid = this.taskId;
      const response = await ApiService("/task/confirmDelete/" + tid, "GET");

      if (response.statusCode === 200) {
        this.dialog = true;
      } else {
        this.alertDialog = true;
      }
    },

    async deletetask() {
      this.dialog = false;

      try {
        const tid = this.taskId;
        const response = await ApiService("/task/deleteTask/" + tid, "PUT", {});
        this.$router.push("/task-list");
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    },
    ButoonCheck() {
      this.valid = true;
    },

    async getUser() {
      try {
        const id = this.projectId;
        const data = {};
        const response = await  ApiService(
          "project/Usersprojects/" + id,
          "post",
          data,
          
        );

        if (response?.length !== 0) {
          this.user_list = response?.listView;
         
        }
      } catch (error) {
        console.log(error, "error................");
      }
    },

//     async getUser() {
//   try {
//     const id = this.projectId;
//     const data = {};
//     const response = await ApiService(
//       "project/Usersprojects/" + id,
//       "post",
//       data
//     );

//     if (response?.length !== 0) {
//       this.user_list = response?.listView;
//     }
//   } catch (error) {
//     console.log(error, "error................");
//     if (error.response && error.response.data && error.response.data.statusCode === 52) {
//       this.$router.push("/dashboard");
//     }
//   }
// },


    resetbtn() {
      this.showText = true;
      this.getdetails();
      this.$refs.form.reset();

      console.log("reset works hearrrrr");
    },
    show() {
      this.shown = !this.shown;
    },
    remove(item) {
      const index = this.user_list.indexOf(item.text);
      if (index >= 0) this.user_list.splice(index, 1);
    },

    // side bar toggle
  
    ToggleOnOff(msg) {
      this.boxs = document.getElementById("boxs");
      this.footer = document.getElementById("footer");

      if (msg) {
        if(this.boxs && this.boxs.style && this.boxs.style.marginLeft) this.boxs.style.marginLeft = "220px";
        if(this.footer&& this.footer.style&& this.footer.style.marginLeft)this.footer.style.marginLeft="220px";
        if(this.boxs && this.boxs.style && this.boxs.style.transition) this.boxs.style.transition = "visibility 0s, opacity 0.5s linear";
      } else {
        if(this.boxs && this.boxs.style && this.boxs.style.marginLeft) this.boxs.style.marginLeft = "64px";
        if(this.footer && this.footer.style&& this.footer.style.marginLeft)  this.footer.style.marginLeft="64px"
        if(this.boxs && this.boxs.style && this.boxs.style.transition) this.boxs.style.transition = "visibility 0s, opacity 0.5s linear";
      }
    },
  },
  mounted() {
    this.projectId = this.$store.state.projectId;
    this.taskId = this.$store.state.taskId;
   
    if (this.$router) {
  if (this.projectId === 'null') {
    this.$router.push('/dashboard');
  } else if (!this.taskId || this.taskId === 'null') {
    this.$router.push('/home');
  }
} else {
  console.error('VueRouter instance not found');
}

    this.ToggleOnOff(localStorage.getItem("is_expanded") === "true");
  },
  beforeMount() {
    this.projectId = this.$store.state.projectId;
    this.taskId = this.$store.state.taskId;
    this.comment.task_id = Number(this.taskId);
    const pId = this.projectId;
    this.getProjectDetails(pId);

    this.projectRole = localStorage.getItem("projectRole");
    this.getUser();
    this.GetProjectRole();

    this.getdetails();

  },
  computed: {
    dataHash() {
      return JSON.stringify({
        name: this.name,
        age: this.age,
      });
    },
    hasChanged() {
      return this.dataHash !== this.previousHash;
    },
    plainTextComputed() {
      let div = document.createElement("div");
      div.innerHTML = this.comment.comment;
      return div.innerText;
    },
    // plainTexteditor() {
    //   let div = document.createElement("div");
    //   div.innerHTML = this.plainText;
    //   return div.innerText;
    // },
    assigne() {
      let datavlues = [];
      this.user_list?.map((data) => {
        datavlues.push({
          value: data?.user?.user_id,
          text: data?.user?.user_name,
        });
      });

      return datavlues;
    },
    Users() {
      
      let users = [];
     
      this.user_list?.map((data) => {
        users.push({
          value: data?.user?.user_id,
          text: data?.user?.user_name,
        });
       
      });

      return users;
    },

    getUserId(name) {
      let id = 0;
      this.user_list?.map((data) => {
        if (name == data?.user?.user_name) {
          id = data?.user?.user_id;
        }
      });
      return id;
    },
  },
};
</script>

<style scoped>
.csbtn {

  display: flex;
  justify-content: center;
  gap:3px;

}
.textdiv{
  width:100%;
}
.maintitle {
  width: 100%;
  height: 10%;
}
.subtitle {
  margin-top: 1%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
 
}
@media only screen and (max-width: 1450px) {
  .tname {
    font-size: 12px;
  }
}
.tname {
  font-weight: 300;
  font-size: x-large;
  word-wrap: break-word;

  width: 65ch;
}
.taskcontent {
  width: 100%;

  border: 1px solid gray;
  padding: 2rem;
}
.taskassignee {
  height: 20%;

  display: flex;
  justify-content: space-between;
}
.acnt {
  display: flex;
  width: 36%;
  margin-top: -16px;
}

.discription {
  margin-top: 1%;
  width: 100%;
}
.qbtn {
  justify-content: space-between;
  margin-right: 22px;
}
.v-hidden {
  visibility: hidden;
}
.title1 {
  display: flex;
  justify-content: space-between;
}

.gridleft {
  margin-top: 3%;
  border-bottom: 1px solid rgb(124, 109, 109);
}
.gridright {
  margin-top: 3%;
  border-bottom: 1px solid rgb(124, 109, 109);
}
.gridleft1 {
  margin-top: 3%;

  border-bottom: 1px solid rgb(124, 109, 109);
}
.gridright1 {
  margin-top: 3%;

  border-bottom: 1px solid rgb(124, 109, 109);
}
.upbtn {
  width: 100%;
  margin-top: 2%;
  box-shadow: none;
}
.attachment {
  margin-top: 2%;
}

.cmts {
  margin-top: 1%;
  margin-bottom: 7%;
}
@media only screen and (max-width: 1440px) {
  .cmtdiv {
    border: 1px solid gray;
  }
}
.footer1 {
  margin-top: 2%;
  width: 100%;

  bottom: 0;
  background: white;
}
.attachmentbtn {
  box-shadow: none;
  height: 40px !important;
}
.btnattachment {
  margin-left: 92%;
  margin-top: 2.5%;
}
.btnattachment1 {
  margin-left: 90.5%;
  margin-top: 2.5%;
}

.ckeditor {
  display: flex;
  flex-direction: row;
  height: 10%;
  width: 100%;
}
.ckmain {
  width: 75%;
  min-height: 120px;
  margin-top: 1%;
}
.quater {
  width: 20% !important;
  margin-top: 2%;
}
.statusform {
  display: flex;
  flex-direction: column;
}
.estact {
  display: flex;
}
.styledate {
  display: flex;
}
.firstshow {
  width: 100%;
  display: flex;
  margin-left: 20px;
}

.sform {
  display: flex;
}

.editdelete {
  display: flex;
  padding: 0;
  border: none;
  background: none;
  height: 10%;
  width: 10%;
  position: sticky;

}

.status {
  position: relative;
}

.text {
  text-decoration: none;
}
.v-chip.v-size--small {
  border-radius: 12px;
  font-size: 12px;
  height: 21px !important;
}
.notifydiv {
  margin-top: 1%;
}

.maxLengthError {
  background-color: transparent;
  color: red;
  font-weight: 500;
}
.commentDiv {
  border: 1px solid black;
  min-width: 87%;
  min-height: 50px;
  bottom: 2%;
}
.fixed-sidebar .app-main .app-main__outer {
  z-index: 9;
  margin-left: 220px;
  padding-left: 0px;
}
#boxs {
  margin-left: 220px;
  right: 4px;
}

.text-truncate {
  border-radius: 15px;
  padding: 6px;
  padding-left: 19px;
    padding-right: 18px;
    line-height: 16px;
  text-align: center;
  margin-block: 6px;
  height: 30px;
  width: 100px;
  border: none;
  font-size: 12px;
  text-transform: none;
  background-color: plum !important;
  color: #fff;
  font-weight: 500;
}
.Toptitle {
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
    rgb(209, 213, 219) 0px 0px 0px 1px inset;
  background-color: #fff !important;
}
.parenttask :hover{
  color:#4fa5d6 ;
}



@media screen and (max-width: 870px){
.editdelete {
  display: flex;
  padding: 0;
  border: none;
  background: none;
  height: 10%;
  width: 10%;
 
}
.csbtn{
  
    display: flex;
    flex-wrap: wrap;
    gap:10px;
}
}
@media screen and (max-width: 970px){
  .names {
    font-size: 14px;
    white-space: nowrap;
    width: 700px; 
    /* margin-left: 38px; */
                      overflow: hidden;
                      text-overflow: ellipsis;
                      margin-top: -24px;
  }
}


@media screen and (max-width:600px){
#footer{


margin-left: 0px !important;
}
.names {
    font-size: 14px;
    white-space: nowrap;
    width: 300px; 
                      overflow: hidden;
                      text-overflow: ellipsis ;
                      margin-top: -26px;
    margin-left: 37px;
  }
  .quater {
  width: 31% !important;
  margin-top: 2%;
  margin-right: 34px;
  justify-content: center;
}
.ckmain {
  width: 70%;
  min-height: 120px;
  margin-top: 1%;
}

}

@media (max-width: 280px) {
  .names {
    font-size: 14px;
    white-space: nowrap;
    width: 200px; 
                      overflow: hidden;
                      text-overflow: ellipsis ;
                      margin-top: -26px;
    margin-left: 37px;
  }
}
</style>