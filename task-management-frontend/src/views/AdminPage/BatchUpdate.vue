<template>
  <div>
    <!-- top nav -->

    <div class="app-main">
      <!-- side nav -->

      <div class="app-main__inner" id="forHeadStyle">
        <div class="app-page-title bg-light p-1 Toptitle d-flex" id="header">
         
              <div class="backBtn">
                <router-link
                  :to="'/task-list'"
                  exact
                  title="Back"
            
                  ><v-icon @click="backtolist">mdi-arrow-left-bold</v-icon></router-link
                >
              </div>
         
            <div class="page-title-heading d-flex">
              <router-link exact :to="'/home'">
                <v-img
                  class="logo"
                  src="../../assets/Images/logo.png"
                  width="40"
                ></v-img
              ></router-link>
              <div class="names"
              :title="`${ProjectData.project_name} (${ProjectData.project_code})`"
              >
                {{ ProjectData.project_name }} ({{
                  ProjectData.project_code
                }})
              </div>
            </div>
       
        </div>
        <div>
          <v-btn
            @click="openEditmodal"
            v-show="batchUpdate.tasks.length > 0"
            title="Edit selected task"
            style="background-color: #4fa5d6"
            id="btnshadow"
            >Edit Selected Task</v-btn
          >
        </div>
        <div>
    
            <div class="datatable">
              <div v-if="task_list.task.length == 0">
                <v-data-table
                  :headers="headers"
                  :items="task_list.task"
                  :mobile-breakpoint="100"
                  hide-default-footer
                  class="elevation-1"
                ></v-data-table>
              </div>
              <div v-if="task_list.task.length != 0">
                <v-data-table
                :mobile-breakpoint="100"
                
                  :headers="headers"
                  :items="task_list.task"
                  class="elevation-1 batchtable1"
                >
                  <template v-slot:[`item.task_list`]="{ item }">
                    <input
                      type="checkbox"
                      v-model="batchUpdate.tasks"
                      :value="item.task_id"
                      item-key="task_id"
                    />
                  </template>

                  <template v-slot:[`item.task_name`]="{ item }">
                    <div :title="item.task_name">{{ truncate(item.task_name, 10) }}</div>
                  </template>

                  <!-- TASK TYPE COLUMN -->

                  <!--------------------Issue---------------------->
                  <template v-slot:[`item.task_issue.issue_name`]="{ item }">
                    <td v-if="item.task_issue.issue_id == 1">
                      <v-btn
                        :title="item.task_issue.issue_name"
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
                        {{ item.task_issue.issue_name }}
                      </v-btn>
                    </td>
                    <td v-if="item.task_issue.issue_id == 2">
                      <v-btn
                        :title="item.task_issue.issue_name"
                        outlined
                        rounded
                        color="white"
                        width="100px"
                        height="30px"
                        style="
                          border: none;
                          font-size: 12px;
                          text-transform: none;
                          background-color: #478af5;
                        "
                      >
                        {{ item.task_issue.issue_name }}
                      </v-btn>
                    </td>
                    <td v-if="item.task_issue.issue_id == 3">
                      <v-btn
                        :title="item.task_issue.issue_name"
                        outlined
                        rounded
                        color="white"
                        width="100px"
                        height="30px"
                        style="
                          border: none;
                          font-size: 12px;
                          text-transform: none;
                          background-color: #21c241;
                        "
                      >
                        {{ item.task_issue.issue_name }}
                      </v-btn>
                    </td>
                    <td v-if="item.task_issue.issue_id == 4">
                      <v-btn
                        :title="item.task_issue.issue_name"
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
                        {{ item.task_issue.issue_name }}
                      </v-btn>
                    </td>
                    <td
                      v-if="
                        item.task_issue.issue_id != 1 &&
                        item.task_issue.issue_id != 2 &&
                        item.task_issue.issue_id != 3 &&
                        item.task_issue.issue_id != 4
                      "
                    >
                      <label
                        class="text-truncate"
                        :title="item.task_issue.issue_name"
                        outlined
                        rounded
                        color="white"
                        width="100px"
                        height="30px"
                        style="
                          border: none;
                          font-size: 12px;
                          text-transform: none;
                        "
                      >
                        {{ item.task_issue.issue_name }}
                      </label>
                    </td>
                  </template>
                  <!-- TASK STATUS COLUMN -->
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
                  <!-- PRIORITY STATUS COLUMN -->
                  <template v-slot:[`item.priority`]="{ item }">
                    <td v-if="item.priority == 3">
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on" color="red"
                            >mdi-arrow-up</v-icon
                          >
                        </template>
                        <span>High</span>
                      </v-tooltip>
                    </td>
                    <td v-if="item.priority == 2">
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on" color="#4622bd"
                            >mdi-arrow-right</v-icon
                          >
                        </template>
                        <span>Normal</span>
                      </v-tooltip>
                    </td>
                    <td v-if="item.priority == 1">
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on" color="green"
                            >mdi-arrow-down</v-icon
                          >
                        </template>
                        <span>Low</span>
                      </v-tooltip>
                    </td>
                  </template>

                  <template v-slot:[`item.start_date`]="{ item }"
                    ><td>
                      {{ item.start_date }}
                    </td></template
                  >
                  <template v-slot:[`item.end_date`]="{ item }"
                    ><td>
                      {{ item.end_date }}
                    </td></template
                  >
                  <template v-slot:[`item.Status`]>
                    <v-chip color="error" outlined> closed </v-chip>
                  </template>

                  <!------------------------------------------------ ------------------------------------------------------------>

                  <template v-slot:[`item.preview`]="{ item }">
                    <v-row>
                      <div v-if="batchUpdate.tasks == 0">
                        <template>
                          <v-icon
                            class="mr-3"
                            title="Preview"
                            @click="
                              previewmodal(item.task_id);
                              selectRow(item);
                            "
                            >mdi-eye</v-icon
                          >
                        </template>
                      </div>
                    </v-row>
                  </template>

                  <!-------------------------------------------------------------------------------------------------------------------------------->
                </v-data-table>
              </div>
            </div>
        
          <!-------------------------------------------Preview---------------------------------------------->
          <v-dialog v-model="preview" persistent max-width="1000">
            <v-card v-if="preview">
              <div id="previewtitle">
                <v-card-title
                  ><span class="text-h5">Task Preview</span>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="closepreviewmodal">
                    <v-icon> mdi-close </v-icon>
                  </v-btn>
                </v-card-title>
              </div>

              <v-card-text>
                <v-container id="containerDiv">
                  <batch-updatepreview :Update_tid="Update_tid" />
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
        </div>
        <!--------------------------------------Batch modal------------------------------------>

        <v-dialog v-model="dialogue" persistent max-width="700">
          <v-card v-if="dialogue">
            <div id="batchUpdatetitile">
              <v-card-title>
                <span class="text-h5">Batch Update</span>
                <v-spacer></v-spacer>
                <v-btn icon @click="closeDialog">
                  <v-icon> mdi-close </v-icon>
                </v-btn>
              </v-card-title>
            </div>

            <v-card-text>
              <v-container fluid>
                <v-divider vertical></v-divider>
                <v-card>
                  <v-col>
                    <div>
                      <div class="ckeditorComment" v-show="!showText">
                        <div class="ckmainpage">
                          <div class="commentquater">
                            <div class="status">
                              <v-col cols="12" lg="12" md="12" sm="12" xs="12">
                              <v-select
                                :items="taskstatus"
                                v-model="batchUpdate.status"
                                label="Task Status"
                                outlined
                                v-on:change="ButoonCheck()"
                              ></v-select>
                            </v-col>
                            </div>
                            <div class="batchupdateform">
                              <div class="bustyledate">
                                <v-col cols="12" lg="12" md="12" sm="12" xs="12">
                                <v-select
                                  :items="assigne"
                                  v-model="batchUpdate.assigne"
                                  label="Assignee"
                                  outlined
                                  v-on:change="ButoonCheck()"
                                ></v-select></v-col>
                              </div>
                            </div>
                          </div>
                        </div>
                        <v-col cols="12" lg="12" md="12" sm="12" xs="12">
                        <ckeditor
                          :editor="editor"
                          v-model="batchUpdate.comment"
                          :config="editorConfig"
                          @input="ButoonCheck()"
                          placeholder="Write a comment,use @mention to notify a colleague..........."
                        ></ckeditor>
                        </v-col>
                        <div class="ckeditorerrors">
                          <div
                            class="maxLengthError"
                            v-if="batchUpdate && batchUpdate.comment && batchUpdate.comment.length > maxLength"

                          >
                            Maximum length exceeded
                          </div>
                        </div>
                      </div>
                      <div class="bUbtn">
                        <v-btn
                          class="cmnbtnstyle"
                          color="#4fa5d6"
                          @click="editstatus"
                          :disabled="!valid"
                          id="btnshadow"
                          >Save</v-btn
                        >
                      </div>
                    </div>
                  </v-col>
                </v-card>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import ApiService from "@/service/apiservice";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import Vue from "vue";
import "vue-toast-notification/dist/theme-sugar.css";
import VueToast from "vue-toast-notification";
import BatchUpdatepreview from "./BatchUpdatepreview.vue";

Vue.use(VueToast);
export default {
  components: { BatchUpdatepreview },
  data() {
    return {
      maxLength: 60000,
      ProjectData: [],
      dialogue: false,
      taskData: [],
      selectedRow: null,
      preview: false,
      user_list: [],
      editor: ClassicEditor,
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
      valid: false,

      taskstatus: [
        { value: 1, text: "Open" },
        { value: 2, text: "Inprogress" },
        { value: 3, text: "Resolved" },
        { value: 4, text: "Closed" },
      ],

      adv_general: {
        task_status: [],
        priority: [],
        relation: [],
        category: [],
        createdBy: [],
        assigne: [],
        issue_type: [],
        start_date_from_date: "",
        start_date_to_date: "",
        due_date_from_date: "",
        due_date_to_date: "",
        keyword: "",
      },
      batchUpdate: {
        tasks: [],
        comment: null,
        status: null,
        assigne: null,
      },
      normalSearch: {
        status: "",
        subtasking: "",
        keyWord: "",
      },
      headers: [
        {
          text: "",
          value: "task_list",
          sortable: false,
          align: "start",
          width: "2%",
        },
        {
          text: "Issue Type",
          value: "task_issue.issue_name",
          sortable: false,
          align: "start",
        },
        {
          text: "Key",

          sortable: false,
          value: "task_id",
        },
        { text: "Subject", value: "task_name", sortable: false },

        { text: "Assignee", value: "assignee.user_name", sortable: false },

        { text: "Status", value: "task_status", sortable: false },

        { text: "Priority", value: "priority", sortable: false },
        { text: "Start Date", value: "start_date", sortable: false },
        { text: "Updated Date", value: "end_date", sortable: false },
        { text: "Preview", value: "preview", sortable: false },
      ],
      task_list: { task: [], loading: false },
    };
  },
  methods: {
   
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
    async getProjectDetails() {
      try {
        const id = this.projectId;
        const response = await ApiService(
          "/project/overallProjectStatus/" + id,
          "GET"
        );
        if (response.statusCode == 50) {
          this.$router.push("/dashboard");
        }
        this.ProjectData = response;
      } catch (error) {
        console.log(error);
      }
    },
    openEditmodal() {
      this.dialogue = true;
    },
    closeDialog() {
      this.dialogue = false;
    },
    previewmodal(id) {
      this.Update_tid = id;
      this.preview = true;
    },
    closepreviewmodal() {
      this.preview = false;
    },

    async editstatus() {
      try {
        this.valid = false;
        const id = this.projectId;

        const response = await ApiService(
          "/project/batch/" + id,
          "Post",
          this.batchUpdate
        );

        if (response.task_id == this.tid) {
          this.valid = false;
          Vue.$toast.success("Updated successfully", {
            position: "top",
            queue: true,
          });
          this.$router.push("/task-list");
        }
      } catch (error) {
        console.log(error);
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
      } catch (error) {
        console.log(error, "error................");
        this.isFetching = false;
      }
    },
    async getTask() {
      this.normalSearch.status = localStorage.getItem("Status");
      this.normalSearch.subtasking = localStorage.getItem("Subtask");
      this.normalSearch.keyWord = localStorage.getItem("search");

      if (this.normalSearch.status === "null") {
        this.normalSearch.status = 1;
      }
      try {
        const id = this.projectId;
        const response = await ApiService(
          "/task/tasklist/" + id,
          "POST",
          this.normalSearch
        );

        this.task_list = { task: response?.data };

        this.handlePageChange();
      } catch (error) {
        console.log(error);
      }
    },

    async advancedSearch() {
      try {
        this.adv_general.task_status = JSON.parse(
          localStorage.getItem("advanced_status")
        );
        this.adv_general.priority = JSON.parse(
          localStorage.getItem("advanced_priority")
        ); 
        this.adv_general.category = JSON.parse(
          localStorage.getItem("advanced_category")
        ); 
        this.adv_general.issue_type = JSON.parse(
          localStorage.getItem("advanced_issue_type")
        );
         this.adv_general.assigne = JSON.parse(
          localStorage.getItem("advanced_assigne")
        );
         this.adv_general.createdBy= JSON.parse(
          localStorage.getItem("advanced_createdBy")
        );
         this.adv_general.relation = 
         JSON.parse(localStorage.getItem("advanced_relation")); 
        this.adv_general.due_date_from_date= 
          localStorage.getItem("advanced_due_date_from_date");

         this.adv_general.due_date_to_date = 
          localStorage.getItem("advanced_due_date_to_date")
          ;
        this.adv_general.start_date_from_date = 
          localStorage.getItem("advanced_start_date_from_date");
        this.adv_general.start_date_to_date = 
          localStorage.getItem("advanced_start_date_to_date");
       

        const id = this.projectId;
        const response = await ApiService(
          "/task/advancedsearch/" + id,
          "POST",
          this.adv_general
        );
        this.task_list = { task: response?.data };
        this.taskCount = { task: response?.dataCount };
      } catch (error) {
        console.log(error);
      }
    },

    async getUser() {
      try {
        const id = this.projectId;
        const data = {};
        const response = await ApiService(
          "project/Usersprojects/" + id,
          "Post",
          data
        );

        if (response?.length !== 0) {
          this.user_list = response?.listView;
        }
      } catch (error) {
        console.log(error, "error................");
      }
    },
    selectRow(selectedItem) {
      this.selectedRow = selectedItem;

      console.log(this.selectedRow, "this.selectedRow ");
      console.log(this.selectedRow.task_id, "this.selectedRow ");
      this.preview = true;
    },
    backtolist(){
     

      this.$router.push("/task-list");
     
    
    },

    truncate(str, length) {
      if (str.length > length) {
        return str.substring(0, length) + "...";
      } else {
        return str;
      }
    },

    editSelected() {
      console.log(this.batchUpdate.tasks, "selected");
    },
    ButoonCheck() {
      this.valid = true;
    },
  },
  watch: {
    comment(newValue) {
      if (newValue.length > this.maxLength) {
        return newValue
      }
    },
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
  },
  beforeMount() {
    this.projectId = this.$store.state.projectId;
    if (this.projectId === "null") {
      this.$router.push("/dashboard");
    }
    localStorage.setItem("projectId", this.projectId);
    this.getProjectDetails();
    this.getUser();
   
  },
  mounted(){

    if (localStorage.getItem("searchType")==1)
      this.advancedSearch();
      
      
    else{
      this.getTask();
    }
   
  }
  };
</script>
<style scoped>
/* .datatable {
  width: 120%;

  margin-top: 2%;
} */
.batchtable1{
  width: 100%;

margin-top: 2%;
z-index:1px;


}
.bUbtn {
  justify-content: center;
  display:flex;

  margin-top: 3%;
  /* margin-left: 45%; */
}


.previewModal {
  background-color: #fff;
  height: 100%;
  width: 40%;
  right: 0;
  position: relative;
}
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
  font-weight: bold;
  font-size: x-large;
  word-wrap: break-word;
  width: 60ch;
}
.taskcontent {
  width: 100%;
  margin-top: 2%;
  border: 1px solid gray;
  padding: 2rem;
}
.taskassignee {
  height: 20%;
  margin-top: 1%;
  display: flex;
  justify-content: space-between;
}
.acnt {
  display: flex;
  width: 36%;
}

.discription {
  margin-top: 2%;
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
  /* height: 100%; */
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
/* .attachmentdiv{
  border: 1px solid gray;
} */
.cmts {
  margin-top: 1%;
  margin-bottom: 7%;
}

.cmtdiv {
  border-bottom: 1px solid gray;
}
.footer1 {
  margin-top: 2%;
  width: 100%;

  margin-left: 2%;
  bottom: 0;
  background: white;
}
.attachmentbtn {
  box-shadow: none;
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
}
.ckmain {
  width: 75%;
}
.quater {
  width: 30% !important;
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
}

.maxLengthError {
  background-color: transparent;
  color: red;
  font-weight: 500;
}
.editbtn {
  background-color: #4fa5d6;
}

.text-truncate {
  border-radius: 15px;
  padding: 7px;
  text-align: center;
  margin-block: 6px;
  height: 30px;
  width: 100px;
  border: none;
  font-size: 12px;
  text-transform: none;
  background-color: plum;
  color: #fff;
  font-weight: 500;
  padding-left: 19px;
  padding-right: 18px;
  line-height: 16px;
}
#header {
  max-height: 57px;
  margin-top: -65px;
  top: 0%;
  /* position: sticky; */

}
.logo {
  width: 40px;
}

.names {
  font-size: 14px;
}
#previewtitle,
#batchUpdatetitile {
  background-color: #4fa5d6;
  color: #fff;
}
#forHeadStyle {
  padding: 66px 30px 0;
  flex: 1;
}
    
.backBtn{
  margin-top:1%;
}
.Toptitle {
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
    rgb(209, 213, 219) 0px 0px 0px 1px inset;
  background-color: #fff !important;
}
.page-title-heading {
    margin: 0%;
  }


@media only screen and (max-width: 700px){
  #header{
    margin-left: -6%;
    min-width: 112%;
    
  }
  .page-title-heading {
    margin: 0%;
  }
  .names {
    font-size: 14px;
    white-space: nowrap;
    width: 300px; 
                      overflow: hidden;
                      text-overflow: ellipsis ;
                   
    
  

}

  

}
@media only screen and (max-width: 500px){
  #header{
    margin-left: -9%;
min-width: 120%;
   
  }
  .page-title-heading {
    margin: 0%;
  }
  .names {
    font-size: 14px;
    white-space: nowrap;
    width: 300px; 
                      overflow: hidden;
                      text-overflow: ellipsis ;
                      
    
  

}
}
@media only screen and (max-width: 280px){
  .names {
    font-size: 14px;
    white-space: nowrap;
    width: 200px; 
                      overflow: hidden;
                      text-overflow: ellipsis ;
                 
                      margin-left: -26px;
    
  

}

}

</style>
