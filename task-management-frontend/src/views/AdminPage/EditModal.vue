<template>
  <div class="app-main__outer">
    <div class="app-main__inner">
    <div v-if="!loadingValue">
      <div class="loader"></div>
    </div>
    <div v-if="loadingValue">
      <div class="app-page-title bg-light p-1">
        <div class="page-title-wrapper">
          <div class="page-title-heading">
            <router-link exact :to="'/home'">
              <v-img class="logo" src="../../assets/Images/logo.png" width="50"></v-img>
            </router-link>
            <div class="names"  :title="`${ProjectData.project_name} (${ProjectData.project_code})`">{{ ProjectData.project_name }} ({{ ProjectData.project_code }})</div>
          </div>
        </div>
      </div>

      <v-form
        ref="form"
        v-model="valid"
        @submit.prevent="add"
        method="post"
        v-if="value == false"
      >
        <div class="addTask">
          <v-col class="d-flex" cols="12" sm="6">
            <v-autocomplete
              auto-select-first
              dense
              :items="options"
              background-color="white"
              v-model="taskdata.issue_type"
              label="Issue Type"
              outlined
              v-on:change="ButoonCheck()"
            ></v-autocomplete>
          </v-col>

          <v-col class="d-flex" cols="12" sm="12">
            <v-text-field
              dense
              background-color="white"
              v-model="taskdata.task_name"
              label="subject"
              :rules="subjectRules"
              :error-messages="subjectError"
              outlined
              v-on:input="ButoonCheck()"
            ></v-text-field>
          </v-col>
          <v-card elevation="3"
            ><br />
            <v-col cols="12" lg="12" md="12" sm="12">
              <ckeditor
                :editor="editor"
                :error-messages="discriptionError"
                v-model="taskdata.task_description"
                placeholder="Add a Description @ mentioned members"
                :config="editorConfig"
                :rules="discriptionRules"
                v-on:input="ButoonCheck()"
              ></ckeditor>
            </v-col>

            <v-col cols="12" >
              <v-row>
                <v-col class="d-flex" cols="12" lg="6" md="6" sm="12" xs="12">
                  <v-autocomplete
                    auto-select-first
                    dense
                    background-color="white"
                    :items="taskstatus"
                    v-model="taskdata.task_status"
                    label="Status"
                    outlined
                    v-on:change="ButoonCheck()"
                  ></v-autocomplete>
                </v-col>
                <v-col class="d-flex" cols="12" lg="6" md="6" sm="12" xs="12">
                  <v-autocomplete
                    dense
                    auto-select-first
                    background-color="white"
                    v-model="taskdata.category"
                    :items="categorylist"
                    label="Category"
                    outlined
                    v-on:change="ButoonCheck()"
                  ></v-autocomplete>
                </v-col>

                <v-col class="d-flex" cols="12" lg="6" md="6" sm="12" xs="1">
                  <v-select
                    dense
                    max-height="3%"
                    v-model="taskdata.priority"
                    :rules="priorityRules"
                    :items="priority"
                    :error-messages="priorityError"
                    label="priority"
                    outlined
                    v-on:change="ButoonCheck()"
                  ></v-select>
                </v-col>
                <v-col class="d-flex" cols="12" lg="6" md="6" sm="12" xs="10">
                  <v-select
                    dense
                    v-model="taskdata.assignee"
                    :items="assigne"
                    :rules="assigneeRules"
                    :error-messages="assigneeError"
                    label="Assignee"
                    outlined
                    v-on:change="ButoonCheck()"
                  ></v-select>
                </v-col>
                <v-col class="d-flex" cols="12" lg="6" md="6" sm="12" xs="12">
                  <v-menu v-model="menu" min-width="auto" :close-on-content-click="false">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        v-model="taskdata.start_date"
                        placeholder="Start Date"
                        icon="mdi-calendar"
                        readonly
                        outlined
                        :rules="startdateRules"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :min="new Date().toISOString().substr(0, 10)"
                      v-model="taskdata.start_date"
                      no-title
                      scrollable
                      v-on:change="ButoonCheck()"
                      @input="menu = false"
                      :max="ProjectData.end_date"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col class="d-flex" cols="12" lg="6" md="6" sm="12" xs="12">
                  <v-menu
                    min-width="auto"
                    v-model="menu1"
                    :close-on-content-click="false"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="taskdata.end_date"
                        placeholder="End Date"
                        icon="mdi-calendar"
                        readonly
                        dense
                        outlined
                        :rules="endDateRules"
                        v-bind="attrs"
                        v-on="on"
                        parentIssue
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :min="this.taskdata.start_date"
                      v-model="taskdata.end_date"
                      no-title
                      scrollable
                      :max="ProjectData.end_date"
                      v-on:change="ButoonCheck()"
                      @input="menu1 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>

                <v-col class="d-flex" cols="12" lg="6" md="6" sm="12" xs="12">
                  <v-text-field
                    type="polyfill"
                    dense
                    v-model="taskdata.estimated_hours"
                    max-height="3%"
                    min="0 "
                    max="72"
                    label="Estimated Hours"
                    :rules="hoursRules"
                    outlined
                    v-on:change="ButoonCheck()"
                  >
                  </v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" lg="6" md="6" sm="12" xs="12">
                  <v-text-field
                    type="polyfill"
                    dense
                    min="0"
                    max="72"
                    v-model="taskdata.actual_hours"
                    max-height="3%"
                    label="Actual Hours"
                    outlined
                    v-on:change="ButoonCheck()"
                    :rules="hoursRules"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="12" md="12" sm="12" xs="12">
                  <v-file-input
                    v-model="filedata.filename"
                    label="File input"
                    dense
                    multiple
                    placeholder="Select your files"
                    outlined
                    :show-size="1000"
                    accept="image/png,image/jpeg,image/jpg, application/pdf,video/mp4,text/csv"
                    v-on:change="
                      handleFileUploads($event);
                      ButoonCheck();
                    "
                  >
                    <template v-slot:selection="{ index, text }">
                      <v-chip v-if="index < 2" color="blue " dark label small>
                        {{ text }}
                      </v-chip>
                    </template>
                  </v-file-input>
                  <p class="danger" v-if="error">{{ error }}</p>
                </v-col>
              </v-row>

              <v-row align="center" justify="space-around">
                <div v-if="num == 1">
                  <v-btn
                    class="cmnbtnstyle"
                    color="#4fa5d6"
                    v-on:click="edit"
                    disabled
                    id="btnshadow"
                    >Save</v-btn
                  >
                </div>
                <div v-if="num == 0">
                  <v-btn
                    class="cmnbtnstyle"
                    color="#4fa5d6"
                    v-on:click="edit"
                    :disabled="valid"
                    id="btnshadow"
                    >Save</v-btn
                  >
                </div>
              </v-row>
            </v-col>

            <v-card-actions>
              <v-card-subtitle> </v-card-subtitle>
            </v-card-actions>
          </v-card>
        </div>
      </v-form>

      <template>
        <v-dialog v-model="dialog" persistent max-width="700px">
          <v-card>
            <div id="title">
              <v-card-title>
                <span class="text-h5">Add existing issue</span>
                <v-spacer></v-spacer>

                <v-btn icon @click="closeDialog" dark>
                  <v-icon> mdi-close </v-icon>
                </v-btn>
              </v-card-title>
            </div>
            <br />
            <v-card-text>
              <div style="display: flex">
                <v-btn @click="StatusFilter(5)" active-class="">All</v-btn>

                <v-col
                  class="d-flex searchBar"
                  style="margin-top: -3%; margin-left: 25%"
                  height="3%"
                  cols="6"
                  sm="6"
                >
                  <v-form
                    action=""
                    v-on:keyup="searchTask()"
                    @submit.prevent="searchTask()"
                  >
                    <v-text-field
                      v-model="searchKey"
                      label="Search Task"
                      outlined
                      clearable
                      prepend-inner-icon="mdi-magnify"
                      dense
                    ></v-text-field>
                  </v-form>
                </v-col>
              </div>
              <v-container>
                <v-data-table
                  :headers="headers"
                  class="elevation-1"
                  :hide-default-footer="true"
                  :hide-default-header="true"
                  @click:row="handleClick"
                >
                  <template v-slot:[`item.task_status`]="{ item }">
                    <td v-if="item.task_status == 1">
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
                          background-color: #ed8077;
                        "
                      >
                        Open
                      </v-btn>
                    </td>
                    <td v-if="item.task_status == 2">
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
                          background-color: #4488c5;
                        "
                      >
                        Inprogress
                      </v-btn>
                    </td>
                    <td v-if="item.task_status == 3">
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
                          background-color: #5eb5a6;
                        "
                      >
                        Resolved
                      </v-btn>
                    </td>
                    <td v-if="item.task_status == 4">
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
                          background-color: #a1af2f;
                        "
                      >
                        Closed
                      </v-btn>
                    </td>
                  </template>
                </v-data-table>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
      </template>
      </div>
    </div>
  </div>
</template>
<script>
import ApiService from "../../service/apiservice";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import Vue from "vue";
import "vue-toast-notification/dist/theme-sugar.css";
import VueToast from "vue-toast-notification";
import http from "../../http-common";
Vue.use(VueToast);

export default {
  data() {
    return {
      loadingValue:false,
      ProjectData: [],
      valid: true,
      value: false,
      num: 0,
      categorydata: [],
      user_list: [],
      taskData: [],
      formSubmitted: false,
      editor: ClassicEditor,
      error: null,
      issuedata: [],
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

      isValid: false,
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      menu: false,
      menu1: false,
      menu3: false,
      modal: false,
      menu2: false,
      files: [],
      file: [],
      assignee: null,
      userList: [],
      fileResponse: [],
      parentIssue: false,
      dialog: false,
      taskdata: {
        project_id: null,
        end_date: null,
        start_date: null,
        assignee: null,
        estimated_hours: null,
        actual_hours: null,
        task_name: null,
        task_description: null,
        issue_type: null,
        category: null,
      },
      filedata: {
        filename: null,
      },
      parent: {
        task_id: null,
        task_name: null,
      },
      headers: [
        {
          sortable: false,
          value: "task_id",
          align: "start",
        },
        { value: "task_name", sortable: false },
        { value: "task_status", sortable: false },
      ],
      task_list: { task: [], loading: false },
      parenttask: { task: [] },

      taskstatus: [
        { value: 1, text: "Open" },
        { value: 2, text: "Inprogress" },
        { value: 3, text: "Resolved" },
        { value: 4, text: "Closed" },
      ],

      priority: [
        { value: 1, text: "Low" },
        { value: 2, text: "Normal" },
        { value: 3, text: "High" },
      ],

      typeRules: [(v) => !!v || "Task Type is required"],

      hoursRules: [
        (v) => !/^[0-9e]{10,12}$/.test(v) || "Allow digits only",
        (v) => !v || /^[0-9]{0,2}(\.[0-9]{0,2})?$/.test(v) || "Invalid hour",
        (v) => !v || (0 < v && v <= 72) || "hours should greater than  0 and equal to 72",
      ],
      subjectRules: [
        (v) => !!v || "Subject is required",
        (v) => (v && v.length >= 3) || "Subject must greater than 3",
        (v) => (v && v.length <= 255) || "Subject should between 3 to 255",
        (v) =>
          /^(?! )(?!\s)(?!.* {1} )[\s\S]*(?<!\s)(?! )$/.test(v) ||
          "Enter a valid Subject",
      ],
      discriptionRules: [(v) => !!v || "Description is required"],
      taskstatusRules: [(v) => !!v || "Task status is required"],
      priorityRules: [(v) => !!v || "Priority  is required"],
    };
  },
  methods: {
    async getdetails() {
      this.loadingValue=false
      console.log("gets in");
      try {
        const response = await ApiService(
          "task/getTask/" + localStorage.getItem("taskId"),
          "GET",

          null,
          null
        );
        this.loadingValue=true


        this.taskData = response.taskDetails;

        const initialFile = response?.fileDetails?.files[0]?.file_name
          ? new File(
              [response?.fileDetails?.files[0]?.file_name],
              response?.fileDetails?.files[0]?.file_name,
              {
                type: "text/plain",
              }
            )
          : "";
        this.taskdata.task_status = response.taskDetails.task_status;
        if (response.taskDetails.issue_id) {
          this.taskdata.issue_type = response.taskDetails.issue_id;
        } else {
          this.taskdata.issue_type = null;
        }
        if (response.taskDetails.category_id) {
          this.taskdata.category = response.taskDetails.category_id;
        } else {
          this.taskdata.category = null;
        }

        this.taskdata.start_date = response.taskDetails.start_date;
        this.taskdata.end_date = response.taskDetails.end_date;
        this.taskdata.estimated_hours = response.taskDetails.estimated_hours;
        this.taskdata.task_name = response.taskDetails.task_name;
        this.taskdata.task_description = response.taskDetails.task_description;
        this.taskdata.priority = response.taskDetails.priority;
        this.taskdata.assignee = response.taskDetails.assignee_id;
        this.taskdata.actual_hours = response.taskDetails.actual_hours;
        this.filedata.filename = initialFile;
      } catch (error) {
        console.log(error, "error................");
        this.isFetching = false;
      }
    },

    async edit() {
      try {
        this.valid = true;
        if (this.taskdata.actual_hours && this.taskdata.actual_hours.length < 1) {
          this.taskdata.actual_hours = null;
        }

        if (this.taskdata.estimated_hours && this.taskdata.estimated_hours.length < 1) {
          this.taskdata.estimated_hours = null;
        }
        this.taskdata.project_id = Number(this.projectId);
        const response = await ApiService(
          "task/updateTask/" + localStorage.getItem("taskId"),
          "PUT",
          this.taskdata,
          null,
          null
        );
        this.taskData = response;

        if (response.task_id) {
          this.valid = true;
          Vue.$toast.success("Task updated Successfully", {
            position: "top",
            duration: 1000,
          });
          setTimeout(() => window.location.reload(), 500);
        }

        try {
          let formData = new FormData();
          const URL = "/task/upload/" + localStorage.getItem("taskId");
          formData.append("file", this.files);
          formData.append("file_name", encodeURIComponent(this.files?.name));

          await http.post(URL, formData, "POST").then((response1) => {
            this.data = response1?.data?.error;
            this.fileResponse = response1.data;
          });
        } catch (error) {
        
          const result = error.response.data;
       
          if (result.statusCode == 711) {
            this.valid = false;
            Vue.$toast.warning(
              "File size should be less than oru equal to 200 mb or 209715200 byte",
              {
                position: "top",
                duration: 1000,
              }
            );
          } else if (result.statusCode == 1038) {
            this.valid = false;
            Vue.$toast.error("Description too long", {
              position: "top",
            });
          } else if (result.statusCode == 1327) {
            this.valid = false;
            Vue.$toast.error("File name too long(max 150)", {
              position: "top",
            });
          } else if (result.statusCode == 1400) {
            this.valid = false;
            Vue.$toast.error(
              "Only alphanumeric characters, special characters such as underscore and one space are accepted in file names",
              {
                position: "top",
              }
            );
          }
        }

        if (this.fileResponse.task_id) {
          Vue.$toast.success("Task updated Successfully", {
            position: "top",
            duration: 1000,
          });
          window.location.reload();
        }
        else if (response.statusCode == 1033) {
        Vue.$toast.error("No change in data", {
          position: "top",
          duration: 1000,
        });
      }
      } catch (error) {
     
        const response = error.response.data;
        this.editTaskModal(response);
      }
    },
    editTaskModal(response) {
      this.valid = true;

      if (response.statusCode == 75) {
        Vue.$toast.warning("End date must be greater than start date .", {
          position: "top",
          duration: 1000,
        });
      }
      else if (response.statusCode == 667) {
        Vue.$toast.error("End date must be greater than or equal to projects start date ", {
          position: "top",
          duration: 1000,
        });
      }
       else if (response.statusCode == 69) {
        Vue.$toast.error("description should be in 10and 255 ", {
          position: "top",
          duration: 1000,
        });
      }
       else if (response.statusCode == 66) {
        Vue.$toast.warning("Enter a valid estimated hour", {
          position: "top",
          duration: 1000,
        });
      } else if (response.statusCode == 67) {
        Vue.$toast.warning("Enter a valid actual hour", {
          position: "top",
          duration: 1000,
        });
      } else if (response.statusCode == 82) {
        Vue.$toast.warning("Start date should not be before project's start date", {
          position: "top",
          duration: 1000,
        });
      } else if (response.statusCode == 43) {
        Vue.$toast.warning("Description is not allowed to be empty", {
          position: "top",
          duration: 1000,
        });
      } else if (response.statusCode == 710) {
        Vue.$toast.warning("Only support jpeg,jpg,png,csv,mp4,pdf", {
          position: "top",
          duration: 1000,
        });
      } else if (response.statusCode == 400) {
        Vue.$toast.error("Task updation failed", {
          position: "top",
          duration: 1000,
        });
      } else if (response.statusCode == 40) {
        Vue.$toast.error("Category is not allowed to empty", {
          position: "top",
          duration: 1000,
        });
      }
    },
    async getIssueType() {
      try {
        const response = await ApiService("/task/getIssue", "GET", null);

        if (response.length !== 0) {
          this.issue_list = response.issueTotalList;
        }
      } catch (error) {
        console.log(error, "error................");
      }
    },
    async getCategory() {
      try {
        const response = await ApiService("/task/getcategory", "GET", null);

        if (response.length !== 0) {
          this.category_list = response.categoryTotalList;
          this.categorylist();
        }
      } catch (error) {
        console.log(error, "error................");
      }
    },
    handleFileUploads($event) {
      if ($event.length == 0) {
        this.error = "";
        this.num = 0;
      }
      this.files = $event[0];
      this.file = $event;
      let fileType = $event[0].type;
      let fileName = $event[0].name;
      if (
        fileType != "image/png" &&
        fileType != "image/jpeg" &&
        fileType != "image/jpg" &&
        fileType != "application/pdf" &&
        fileType != "video/mp4" &&
        fileType != "text/csv"
      ) {
        this.num = 1;
        this.error =
          "File type not supported. Supported types are: png, jpg, jpeg, csv, pdf, mp4";
      } else if (fileName) {
        let x = "";
        let name = fileName.split(".");
        name.splice(-1);
        name.forEach(function (value) {
          x = x + "." + value;
        });
        if (x.length - 1 > 150) {
          this.error = "File name should not exceed 150 characters";
          this.num = 1;
        } else {
          this.error = "";
          this.num = 0;
        }
      } else {
        this.num = 0;
        this.error = null;
      }
    },

    handleClick(item) {
      this.parent.task_id = item.task_id;
      this.parent.task_name = item.task_name;

      this.dialog = false;
    },
    closeDialog() {
      this.dialog = false;
    },
    ButoonCheck() {
      this.valid = false;
    },

    async getProjectDetails() {
      try {
        const id = this.projectId;
        const response = await ApiService("/project/overallProjectStatus/" + id, "GET");
        this.ProjectData = response;
      } catch (error) {
        console.log(error, "error................");
      }
    },

    async getUsers() {
      try {
        const id = this.projectId;
        const data = {};
        const response = await ApiService("project/Usersprojects/" + id, "POST", data);

      
        this.user_list = response.listView;
       
      } catch (error) {
        console.log(error, "error................");
      }
    },
  },
  beforeMount() {
    this.projectId = this.$store.state.projectId;
    this.taskId = this.$store.state.taskId;
    this.getProjectDetails();
    this.getUsers();
  
    this.ButoonCheck();
    this.getIssueType();
    this.getCategory();
  },
  mounted() {
    this.getdetails();
    this.getIssueType();
  },
  computed: {
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
        console.log(users, "users");
      });

      return users;
    },
    options() {
      console.log("kiki");
      let opts = [];
      for (let i = 0; i <= this.issue_list.length - 1; i++) {
        opts.push({
          text: this.issue_list[i].issue_type,
          value: this.issue_list[i].issue_type_id,
        });
      }
      return opts;
    },
    categorylist() {
      this.category_list?.map((data) => {
        this.categorydata.push({
          value: data?.category_id,
          text: data?.category,
        });
      });

      return this.categorydata;
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
@import "https://demo.dashboardpack.com/architectui-html-free/main.css";

.cardMsg {
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
}

.hour-rem {
  float: right;
}

.project {
  height: 20px;
  background-color: black;
}

.NameAvtar {
  margin-left: 60%;
}

.bgcolorr {
  background-color: black;
}

#Add {
  font-size: x-large;
  font-weight: bold;
  margin-left: 40%;
  margin-bottom: -2%;
}

label {
  font-weight: 300;
  font-size: large;
}

.form {
  margin-left: 5%;
  margin-bottom: 3%;
}

.button {
  margin-left: 35%;
}

.box {
  box-shadow: #4fa5d6 0px 0px 0px 2px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
  border: 2px solid;
  border-color: blue;
}

.subdiv {
  margin-top: 2%;
  border: 1px solid #4fa5d6;
}
.parentissue {
  margin-top: 2%;
}
.parentIssuediv {
  width: 100%;
  height: 10%;
  margin-top: 3%;
  flex-direction: row;
}
.issuelabel {
  margin-top: 2%;
  margin-left: 2%;
}
.issuelabel1 {
  margin-top: 2%;
  margin-left: 2%;
}
.addTask {
  margin-top: 2%;
}
.loader {
  border: 4px solid rgba(0, 0, 0, .1);
  border-left-color: transparent;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  text-align: center;
    margin-left: 50%;
    margin-top: 25%;
    animation: spin89345 1s linear infinite;
}




@keyframes spin89345 {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
