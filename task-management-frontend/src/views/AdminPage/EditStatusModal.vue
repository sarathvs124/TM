<template>
  <div class="app-main__outer">
    <div class="app-main__inner">
      <div class="app-page-title bg-light p-1">
        <div class="page-title-wrapper">
          <div class="page-title-heading">
            <router-link exact :to="'/home' ">
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
          <v-card elevation="3"
            ><br />

            <v-col cols="12" lg="12" md="12" sm="12">
              <v-row>
                <v-col class="d-flex" cols="2" sm="2"></v-col>
               
                <v-col class="d-flex" cols="8" sm="8">
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
                <v-col class="d-flex" cols="2" sm="2"></v-col>
               
              </v-row>

              <v-row align="center" justify="space-around">
                <div v-if="num == 1">
                  <v-btn color="#4fa5d6" v-on:click="edit" disabled id="btnshadow">Save</v-btn>
                </div>
                <div v-if="num == 0">
                  <v-btn color="#4fa5d6" v-on:click="editstatus()" :disabled="!valid" id="btnshadow"
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
      <!---------------------------------------------------------------------->
     
    </div>
  </div>
</template>
<script>
import ApiService from "../../service/apiservice";

import Vue from "vue";
import "vue-toast-notification/dist/theme-sugar.css";
import VueToast from "vue-toast-notification";
Vue.use(VueToast);

export default {
  data() {
    return {
      ProjectData: [],
      valid: true,
      value: false,
        num: 0,
        categorydata: [],
        user_list: [],
      taskData: [],

     
      userList: [],
      parentIssue: false,
      dialog: false,
      taskdata: {
        assignee: "",
        task_status: null,
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
        (v) => !v || /^'\d'{0,2}(\.'\d'{0,2})?$/.test(v) || "Invalid hour",
        (v) => !v || (0 < v && v <= 72) || "hours should be between 0 and 72",
      ],
      subjectRules: [
        (v) => !!v || "Subject is required",
        (v) => (v && v.length >= 3) || "Subject must greater than 3",
        (v) => (v && v.length <= 50) || "Subject should between 3 to 50",
        (v) =>
        /^(?! )(?!\s)(?!.* {1} )[\s\S]*(?<!\s)(?! )$/.test(
            v
          ) || "Enter a valid Subject",
      ],
      discriptionRules: [
        (v) => !!v || "Description is required",
      ],
      taskstatusRules: [(v) => !!v || "Task status is required"],
      priorityRules: [(v) => !!v || "Priority  is required"],
      categoryRules: [(v) => !!v || "Category  is required"],
    };
  },
  methods: {
    async getdetails() {
      try {
        const response = await ApiService(
          "task/getTask/" + localStorage.getItem("taskId"),
          "GET",

          null,
          null

        );
        if(response.taskDetails.assignee_id){

this.taskdata.assignee = response.taskDetails.assignee_id;
        }else{
          this.taskdata.assignee = null;

        }

        this.taskdata.task_status = response.taskDetails.task_status;
        
      } catch (error) {
        console.log(error, "error................");
        this.isFetching = false;
      }
    },

    async editstatus() {
     
      try {
        this.valid = false;
        this.tid = this.taskId;
        this.assigne = "";

         await ApiService(
          "task/changeStatus/" + localStorage.getItem("taskId"),
          "PUT",
          this.taskdata
        );

          this.valid = false;
          Vue.$toast.success("Status changed successfully", {
            position: "top",
          });

        window.location.reload();

      } catch (error) {
        console.log(error);
      }
    },
 
    closeDialog() {
      this.dialog = false;
    },
    ButoonCheck() {
      this.valid = true;
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

    async getUser() {
      try {
        const id = this.projectId;
        const data={}
        const response = await ApiService("project/Usersprojects/" + id, "POST", data);

        if (response?.length !== 0) {
          this.user_list = response;
        }
      } catch (error) {
        console.log(error, "error................");
      }
    },
  },
  beforeMount() {
    this.projectId= this.$store.state.projectId;
    this.taskId= this.$store.state.taskId;
    this.getProjectDetails();
    this.getUser();
    this.getdetails();
    this.ButoonCheck();
   
  },

  computed: {
    assigne() {
      let datavlues = [];

      this.user_list?.map((data) => {
        // index++
        datavlues.push({
          value: data?.user?.user_id,
          text: data?.user?.user_name,
        });
      });

      return datavlues;
    },

    options() {
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
</style>
