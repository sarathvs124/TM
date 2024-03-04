<template>
  <div>
    <div>
      <div class="maintitle">
        <div class="parenttask">
                
                <h5
                  @click="
                    TaskRedirect(ProjectData.project_id, taskData.parent_id)
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
            TasK Name - {{ taskData.task_name }}[{{ taskData.task_id }}]
          </h5>
          <div>
            <!----------------------------------------change--------------------------------->
          </div>
        </div>

        <div class="taskcontent">
          <!-----------------------accound section---------------------->

          <div class="taskassignee">
            <div class="acnt">
              <div>
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
              </div>
              <v-col cols="12" sm="12" xs="12" md="12">
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
                                <v-icon v-bind="attrs" v-on="on" color="red"
                                  >mdi-arrow-up</v-icon
                                ></span
                              >
                              <span v-if="taskData.priority == 2">
                                <v-icon v-bind="attrs" v-on="on" color="#4622bd"
                                  >mdi-arrow-right</v-icon
                                ></span
                              >
                              <span v-if="taskData.priority == 1">
                                <v-icon v-bind="attrs" v-on="on" color="green"
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
                            <v-col cols="12" sm="4" >
                              <span>Assignee : </span>
                            </v-col>
                            <v-col cols="12" sm="4">
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
                            <v-col cols="6" sm="4" >
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
                            <v-col cols="8" sm="4" xs="12">
                              <span>Actual Hours : </span>
                            </v-col>
                            <v-col cols="4" sm="4" xs="12">
                              {{ taskData.actual_hours }}
                            </v-col>
                          </v-row>
                        </div>
                      </template>
                    </v-col>
                    <v-col cols="12" lg="6" sm="12" xs="12">
                      <template>
                        <div class="gridleft">
                          <v-row>
                            <v-col cols="8" sm="4" xs="12">
                              <span>Estimated Hours : </span>
                            </v-col>
                            <v-col cols="4" sm="4">
                              {{ taskData.estimated_hours }}
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
                          <a @click="openfile(item)">{{ item.file_name }}</a>
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
                :Update_tid="Update_tid"
                :cmtDetails="cmtDetails"
                :projectId="projectId"
              />
            </v-card>
          </div>
        </div>
      </div>
    </div>
    <div class="footer1">
          <v-footer  class="footer1"
        padless
        style="left: -3.9% !important; margin-right: -8%; margin-bottom: -3%"
      >
        <div class="firstshow" v-show="showText">
          <v-text-field
            v-model="plainText"
            outlined
            placeholder="Write a comment..........."
            @click="showText = !showText"
          ></v-text-field>
          <v-btn id="attachmentbtn" @click="showText = !showText"
            ><v-icon>mdi-message-draw</v-icon>Change Status</v-btn
          >
        </div>

        <div class="ckeditor" v-show="!showText">
          <v-col class="d-flex" cols="12" >
          <div class="ckmain">
          
          <v-col  cols="12" lg="12" sm="12" xs="12">
              <ckeditor
                :editor="editor"
                v-model="comment.comment"
                :config="editorConfig"
                @input="CommentCheck()"
                placeholder="Write a comment,use @mention to notify a colleague..........."
              ></ckeditor>
              <div class="ckeditorerrors">
                <div
                  class="maxLengthError"
                  v-if="comment.comment.length > maxLength"
                >
                  Maximum length exceeded
                </div>
              </div>
         
            
              <v-autocomplete
                class="notifydiv"
                multiple
                outlined
                chips
                clearable
                attach
                deletable-chips
                small-chips
                :items="Users"
                item-text="text"
                item-value="value"
                v-model="comment.notify"
                label="Notify comment to:"
                style="width: 100%"
                :disabled="comment.comment == null"
              >
              </v-autocomplete>
            </v-col>
   
          </div>

          <div class="quater">
            <v-col cols="12" lg="12" sm="12" xs="12">
            <div class="status">
              <v-select
                :items="taskstatus"
                attach
                v-model="taskdata.task_status"
                label="Task Status"
                :rules="taskstatusRules"
                :error-messages="taskstatusError"
                outlined
                v-on:change="ButoonCheck()"
              ></v-select>
            </div>
            <div class="statusform">
              <div class="styledate">
                <v-select
                  :items="assigne"
                  attach
                  v-model="taskdata.assignee"
                  :rules="assigneeRules"
                  :error-messages="assigneeError"
                  label="Assignee"
                  outlined
                  v-on:change="ButoonCheck()"
                  id="inputdropdown"
                ></v-select>
              </div>
            </div>
            <div class="csbtn">
              <v-btn class="cmnbtnstyle" @click="resetbtn" color="#4fa5h6"
                >Cancel</v-btn
              >

              <v-btn
                class="cmnbtnstyle"
                color="#4fa5d6"
                @click="
                  editstatus();
                  previewDialog == true;
                "
                id="btnshadow"
                :disabled="!valid"
                >Save</v-btn
              >
            </div>
          </v-col>
          </div>
        </v-col>
        </div>
        </v-footer>
      
    </div>
  </div>
</template>

<script>
import ApiService from "@/service/apiservice";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import RecentComments from "./RecentComments.vue";
import Vue from "vue";
import "vue-toast-notification/dist/theme-sugar.css";
import VueToast from "vue-toast-notification";

Vue.use(VueToast);

export default {
  components: { RecentComments },
  props: {
    Update_tid: Number,
    project_Id: Number,
  },
  data() {
    return {
      maxLength: 60000,
      showText: true,
      showMenu: false,
      taskData: [],
      files: [],
      tid: "",
      plainText: "",
      previewDialog: false,
      shown: true,
      expand: false,
      expand2: false,
      dialog: false,
      alertDialog: false,
      user_list: [],
      editor: ClassicEditor,
      editorData: "",
     
      projectRole: "",
      cmtDetails: [],
      statusDialog: false,

      delete: {},
      user: [],
      result: "",

      comment: {
        comment: "",
        task_id: this.Update_tid,
        notify: [],
      },
      taskstatus: [
        { value: 1, text: "Open" },
        { value: 2, text: "Inprogress" },
        { value: 3, text: "Resolved" },
        { value: 4, text: "Closed" },
      ],

      assignielist: [],

      taskdata: {
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

  methods: {
    dropDown(event) {
      this.showMenu = true;
    },
    hide(event) {
      this.showMenu = false;
    },
 
    TaskRedirect(id, taskId) {
      
      localStorage.setItem("taskId", taskId);
      localStorage.setItem("TaskId", taskId);

     
      this.$store.commit("getTaskData", taskId);    
        this.$router.push("/task-view");

   
    },
    async editstatus() {
      try {
        this.valid = false;

        this.assignee = "";

        const response = await ApiService(
          "task/changeStatus/" + this.Update_tid,
          "PUT",
          this.taskdata
        );
        this.valid = false;
        if (this.comment.comment) {
          const id = this.project_Id;
          this.result = await ApiService(
            "/task/commentTask/" + id,
            "POST",
            this.comment
          );
        }
        if (this.result) {
          this.valid = false;
          if (
            response.task_id == this.Update_tid &&
            this.result[0].statusCode == 200
          ) {
            this.valid = false;
            Vue.$toast.success("Task updated and comment added successfully", {
              position: "top",
            });
            this.getTask();
            this.$emit("close", true);
            this.previewDialog = true;
            this.valid = false;
            console.log("done");
            this.$router.push("/task-list");
          } else if (
            response.statusCode == 1033 &&
            this.result[0].statusCode == 200
          ) {
            this.valid = false;
            Vue.$toast.success("Comment added successfully", {
              position: "top",
            });
            this.getTask();
            this.$emit("close", true);
            this.previewDialog = false;
            this.valid = false;
            localStorage.setItem("taskId", this.Update_tid);
            localStorage.setItem("projectId", this.project_Id);
            this.$store.commit("getData", this.project_Id);
            this.$store.commit("getTaskData", this.Update_tid);
            this.$router.push("/task-list");
          }
        } else if (response.task_id == this.Update_tid) {
          this.valid = false;
          Vue.$toast.success("Task updated successfully", {
            position: "top",
          });
          this.getTask();
          this.valid = false;
          this.$emit("close", true);

          this.$router.push("/task-list");
          this.previewDialog = true;
        } else if (this.result[0].statusCode == 200) {
          this.valid = false;
          Vue.$toast.success("Comment added successfully", {
            position: "top",
          });
          this.$emit("close", true);
          this.previewDialog = false;
          this.resetbtn();
        } else {
          this.valid = false;
          Vue.$toast.success("Comment Added Successfully", {
            position: "top",
          });
          this.valid = false;
          this.$emit("close", true);
          this.previewDialog = false;
          this.resetbtn();
        }
      } catch (error) {
        console.log(error);
      }
    },
    CommentCheck() {
      if (this.comment.comment.length == 0) {
        this.valid = false;
      } else this.valid = true;
    },

    notify(id) {
      this.comment.notify.push(id);
    },

    async GetProjectRole() {
      const response = await ApiService(
        "/project/projectRole/" + this.project_Id,
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

    closeDialog() {
      this.previewDialog = false;
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
        const response = await ApiService(
          "task/getTask/" + this.Update_tid,
          "GET",
          null,
          null,

          null
        );
        this.taskData = response.taskDetails;

        this.taskdata.task_status = response.taskDetails.task_status;
        this.taskdata.assignee = response?.taskDetails.assignee_id || null;
        this.file_list = { files: response?.fileDetails.files };
        this.cmtDetails = response?.recentUpdates;
      } catch (error) {
        console.log(error);
        this.isFetching = false;
      }
    },
    async getTask() {
      this.normalSearch.status = 1;

      try {
        const response = await ApiService(
          "/task/tasklist/" + this.Update_tid,
          "POST",
          this.normalSearch
        );

        this.task_list = { task: response?.data };

        this.handlePageChange();
      } catch (error) {
        console.log(error);
      }
    },
    openfile(data) {
      window.open(`${data?.file_path}`);
    },

    ButoonCheck() {
      this.valid = true;
    },

    async getUser() {
      try {
        const id = this.project_Id;
        const data = {};
        const response = await ApiService(
          "project/Usersprojects/" + id,
          "POST",
          data
        );

        if (response?.length !== 0) {
          this.user_list = response?.listView;
        }
      } catch (error) {
        console.log(error, "error................");
      }
    },
    resetbtn() {
      this.showText = true;
      this.getdetails();
    },
    show() {
      this.shown = !this.shown;
    },
    remove(item) {
      const index = this.user_list.indexOf(item.text);
      if (index >= 0) this.user_list.splice(index, 1);
    },
  },

  beforeMount() {
    this.projectRole = localStorage.getItem("projectRole");

    this.GetProjectRole();
    this.getUser();
    this.getdetails();
    // this.gettaskfile();
  },
  watch: {
    plainTextComputed: function (newValue) {
      this.plainText = newValue;
    },

    comment(newValue) {
      if (newValue.length > this.maxLength) {
        // If the content exceeds the maximum length, set an error message or prevent submission
      }
    },
  },
  computed: {
    plainTextComputed() {
      let div = document.createElement("div");
      div.innerHTML = this.comment.comment;
      return div.innerText;
    },
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
.maintitle {
  width: 100%;
  height: 10%;
}
.subtitle {
  margin-top: 1%;
  display: flex;
  justify-content: space-between;
}
.tname {
  font-size: large;
  word-wrap: break-word;
  width: 80ch;
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
  width: 60%;
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

.cmtdiv {
  border: 1px solid gray;
}

#attachmentbtn {
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
/* ckeditor */
.ckeditor {
  display: flex;
  flex-direction: row;
  height: 10%;
  width: 100%;
  background-color: white !important;
}
.ckmain {
  width: 75%;
}
.quater{
width: 44%;
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
.csbtn {
  gap: 5px;
  display: flex;
  justify-content: space-around;
  padding-left: 0px;
  padding-right: 1px;
 
}
.editdelete {
  display: flex;
  padding: 0;
  border: none;
  background: none;
  height: 10%;
  width: 10%;
}
.status {
  position: relative;

}

.text {
  text-decoration: none;
}
.notifydiv {
  margin-top: 1%;
}

.maxLengthError {
  background-color: transparent;
  color: red;
  font-weight: 500;
}

.text-truncate {
  border-radius: 15px;
  padding: 5px;
  text-align: center;
  margin-block: 6px;
  height: 30px;
  width: 100px;
  border: none;
  font-size: 15px;
  font-weight: 500;
  text-transform: none;
  background-color: plum !important;
  padding-left: 19px;
    padding-right: 18px;
    line-height: 19px;
  color: #fff;
}
.footer1 {
  background-attachment: fixed;
}



.parenttask :hover{
  color:#4fa5d6 ;
}
@media screen and (max-width:750px){
  .csbtn[data-v-fdbe6dc8] {
    display: flex;
    flex-direction:column ;
    gap:10px;
    justify-content: space-around;
    padding-left: 0px;
    padding-right: 1px;
    margin-left: -8%;
}


.col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12, .col, .col-auto, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm, .col-sm-auto, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-md, .col-md-auto, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg, .col-lg-auto, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl, .col-xl-auto {
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 10px;
}
}

@media screen and (max-width:400px) {
  .status{
    width: 152%;
  }
  .styledate{
    width: 152%;
  }
  
}
</style>
