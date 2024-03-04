<template>
  <div class="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header">
    <topNavigation />

    <div class="app-main">
      <sideNavigation @SideBarToggle="ToggleOnOff" />

      <div class="app-main__outer" id="boxs">
        <div class="app-main__inner" >
          <div v-if="!loaderValue">
                <loader />
              </div>
              <div v-if="loaderValue">
          <div class="app-page-title bg-light p-1 Toptitle" id="HeaderTask">
            <div class="page-title-wrapper">
              <div class="page-title-heading">
                <router-link exact :to="'/home'">
                  <v-img
                    class="logo"
                    src="../../assets/Images/logo.png"
                    width="40"
                  ></v-img>
                </router-link>
                <div class="names"
                :title="`${projectStatus.project_name} (${projectStatus.project_code})`"
                >
                  {{ projectStatus.project_name }} ({{ projectStatus.project_code }})
                </div>
                <v-spacer></v-spacer>
              </div>
            </div>
          </div>
          <div>
            <h5 id="f1">
              Board
              <v-btn
                v-if="isShowing !== true"
                outlined
                rounded
                class="button"
                color="black"
                width="120px"
                height="30px"
                v-bind="attrs"
                v-on="on"
                @click="isShowing = true"
                id="chipset2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g>
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M10 14L4 5V3h16v2l-6 9v6l-4 2z" />
                  </g>
                </svg>
                Hide Filter
              </v-btn>
              <v-btn
                v-if="isShowing == true"
                outlined
                rounded
                class="button"
                color="black"
                width="120px"
                height="30px"
                v-bind="attrs"
                v-on="on"
                @click="isShowing = false"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g>
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M10 14L4 5V3h16v2l-6 9v6l-4 2z" />
                  </g>
                </svg>
                Show Filter
              </v-btn>
            </h5>
          </div>
          <br />
          <div v-show="!isShowing" id="forBoardFlex">
              
             

              <!------------------------------------------------------------------------>

              <!------------------------------------------------------------------------>
              <div class="alignmentFLex">
                <div
                  class="COlflex"
               
                 
                >
                <label class="label" for="name">Issue Type</label>
                  <v-autocomplete
                    style="overflow: hidden"
                    auto-select-first
                    freesolo="false"
                    @change="boardList"
                    :clearable="true"
                   
                    v-model="listFilter.issue_type"
                    :items="options"
                    dense
                    outlined
                  ></v-autocomplete>
                </div>

                <div
                class="COlflex"
                 
                 
                >
                  <label class="label" for="name">Category</label>

                  <v-autocomplete
                    auto-select-first
                    @change="boardList"
                    dense
                    v-model="listFilter.category"
                    :items="categorylist"
                    outlined
                    
                    clearable
                  ></v-autocomplete>
                </div>

                <div
                class="COlflex"
                 
                 
                >
                <label class="label" for="name">Assignee</label>

                  <v-autocomplete
                    style="overflow: hidden"
                    auto-select-first
                    dense
                    clearable
                    @change="boardList"
                    v-model="listFilter.assignee"
                    :items="assigne"
                    outlined
                  ></v-autocomplete>
                </div>
              </div>
          </div>

          <div class="sheet">
            <v-row id="for_Column">
              <div>
                <label class="label1" style="font-weight: bold" for="name"
                  ><span class="dot"></span>Open</label
                >&nbsp;&nbsp;<v-badge
                  v-show="itemData[4].task.open != 0"
                  color="grey"
                  :content="itemData[4].task.open"
                  id="color"
                >
                </v-badge>
                <v-card class="mx-auto" width="300" height="600" id="cardOverflow">
                  <div v-for="item in open" :key="item.task_id">
                    <v-card class="mx-auto" width="300" height="180" id="openPadding">
                      <div class="Tdots" @click="modal(item.task_id)">...</div>
                      <label
                        v-if="item.issue_type_name === 'Bug'"
                        class="red"
                        :title="item.issue_type_name"
                        >{{ item.issue_type_name }}</label
                      >
                      <label
                        v-else-if="item.issue_type_name === 'Request'"
                        class="orange"
                        :title="item.issue_type_name"
                        >{{ item.issue_type_name }}</label
                      >
                      <label
                        v-else-if="item.issue_type_name === 'Task'"
                        class="taskColor"
                        :title="item.issue_type_name"
                        >{{ item.issue_type_name }}</label
                      >
                      <label
                        v-else-if="item.issue_type_name === 'Other'"
                        class="green"
                        :title="item.issue_type_name"
                        >{{ item.issue_type_name }}</label
                      >
                      <label
                        v-if="item.issue_type_id > 4"
                        class="grey"
                        :title="item.issue_type_name"
                        >{{ item.issue_type_name }}</label
                      >
                      <br />

                      <label>Task Name: {{ item.task_name }}</label
                      ><br />
                      <label>Category: {{ item.category_name }}</label
                      ><br />
                      <label>Task Id:{{ item.task_id }}</label
                      ><br />
                      <label>Priority: {{ findpriority(item.priority) }}</label
                      ><br />
                      <label>Assignee: {{ item.assignee }}</label
                      ><br />
                    </v-card>
                  </div>
                </v-card>
              </div>
              <div>
                <label class="label1" style="font-weight: bold" for="name"
                  ><span class="dot1"></span>&nbsp;&nbsp;&nbsp;Inprogress</label
                >&nbsp;&nbsp;<v-badge
                  v-show="itemData[4].task.inprogress != 0"
                  color="grey"
                  :content="itemData[4].task.inprogress"
                  id="color"
                >
                </v-badge>
                <v-card class="mx-auto" width="300" height="600" id="cardOverflow">
                  <div v-for="items in inprogress" :key="items.id">
                    <v-card class="mx-auto" width="300" height="180" id="openPadding">
                      <div class="Tdots" @click="modal(items.task_id)">...</div>
                      <label
                        v-if="items.issue_type_name === 'Bug'"
                        class="red"
                        :title="items.issue_type_name"
                        >{{ items.issue_type_name }}</label
                      >
                      <label
                        v-else-if="items.issue_type_name === 'Request'"
                        class="orange"
                        :title="items.issue_type_name"
                        >{{ items.issue_type_name }}</label
                      >
                      <label
                        v-else-if="items.issue_type_name === 'Task'"
                        class="taskColor"
                        :title="items.issue_type_name"
                        >{{ items.issue_type_name }}</label
                      >
                      <label
                        v-else-if="items.issue_type_name === 'Other'"
                        class="green"
                        :title="items.issue_type_name"
                        >{{ items.issue_type_name }}</label
                      >
                      <label
                        v-if="items.issue_type_id > 4"
                        class="grey"
                        :title="items.issue_type_name"
                        >{{ items.issue_type_name }}</label
                      ><br />
                      <label>Task Name:{{ items.task_name }}</label
                      ><br />
                      <label>Category:{{ items.category_name }}</label
                      ><br />
                      <label>Task Id:{{ items.task_id }}</label
                      ><br />
                      <label>Priority: {{ findpriority(items.priority) }}</label
                      ><br />
                      <label>Assignee: {{ items.assignee }}</label
                      ><br />
                    </v-card>
                  </div>
                </v-card>
              </div>
              <div >
                <label class="label1" style="font-weight: bold" for="name"
                  ><span class="dot2"></span>&nbsp;&nbsp;&nbsp;Resolved</label
                >&nbsp;&nbsp;<v-badge
                  v-show="itemData[4].task.resolved != 0"
                  color="grey"
                  :content="itemData[4].task.resolved"
                  id="color"
                >
                </v-badge>
                <v-card class="mx-auto" width="300" height="600" id="cardOverflow">
                  <div v-for="resolve in resolved" :key="resolve.id">
                    <v-card class="mx-auto" width="300" height="180" id="openPadding">
                      <div class="Tdots" @click="modal(resolve.task_id)">...</div>
                      <label
                        v-if="resolve.issue_type_name === 'Bug'"
                        class="red"
                        :title="resolve.issue_type_name"
                        >{{ resolve.issue_type_name }}</label
                      >
                      <label
                        v-else-if="resolve.issue_type_name === 'Request'"
                        class="orange"
                        :title="resolve.issue_type_name"
                        >{{ resolve.issue_type_name }}</label
                      >
                      <label
                        v-else-if="resolve.issue_type_name === 'Task'"
                        class="taskColor"
                        :title="resolve.issue_type_name"
                        >{{ resolve.issue_type_name }}</label
                      >
                      <label
                        v-else-if="resolve.issue_type_name === 'Other'"
                        class="green"
                        :title="resolve.issue_type_name"
                        >{{ resolve.issue_type_name }}</label
                      >
                      <label
                        v-if="resolve.issue_type_id > 4"
                        class="grey"
                        :title="resolve.issue_type_name"
                        >{{ resolve.issue_type_name }}</label
                      ><br />
                      <label>Task Name:{{ resolve.task_name }}</label
                      ><br />
                      <label>Category:{{ resolve.category_name }}</label
                      ><br />
                      <label>Task Id:{{ resolve.task_id }}</label
                      ><br />
                      <label>Priority: {{ findpriority(resolve.priority) }}</label
                      ><br />
                      <label>Assignee: {{ resolve.assignee }}</label
                      ><br />
                    </v-card>
                  </div>
                </v-card>
              </div>
              <div>
                <label class="label1" style="font-weight: bold" for="name"
                  ><span class="dot3"></span>&nbsp;&nbsp;&nbsp;Closed</label
                >&nbsp;&nbsp;<v-badge
                  v-show="itemData[4].task.closed != 0"
                  color="grey"
                  :content="itemData[4].task.closed"
                  id="color"
                >
                </v-badge>
                <v-card class="mx-auto" width="300" height="600" id="cardOverflow">
                  <div v-for="close in closed" :key="close.id">
                    <v-card class="mx-auto" width="300" height="180" id="openPadding">
                      <div class="Tdots" @click="modal(close.task_id)">...</div>
                      <label
                        v-if="close.issue_type_name === 'Bug'"
                        class="red"
                        :title="close.issue_type_name"
                        >{{ close.issue_type_name }}</label
                      >
                      <label
                        v-else-if="close.issue_type_name === 'Request'"
                        class="orange"
                        :title="close.issue_type_name"
                        >{{ close.issue_type_name }}</label
                      >
                      <label
                        v-else-if="close.issue_type_name === 'Task'"
                        class="taskColor"
                        :title="close.issue_type_name"
                        >{{ close.issue_type_name }}</label
                      >
                      <label
                        v-else-if="close.issue_type_name === 'Other'"
                        class="green"
                        :title="close.issue_type_name"
                        >{{ close.issue_type_name }}</label
                      >
                      <label
                        v-if="close.issue_type_id > 4"
                        class="grey"
                        :title="close.issue_type_name"
                        >{{ close.issue_type_name }}</label
                      >
                      <br />
                      <label>Task Name:{{ close.task_name }}</label
                      ><br />
                      <label>Category:{{ close.category_name }}</label
                      ><br />
                      <label>Task Id:{{ close.task_id }}</label
                      ><br />
                      <label>Priority: {{ findpriority(close.priority) }}</label
                      ><br />
                      <label>Assignee: {{ close.assignee }}</label
                      ><br />
                    </v-card>
                  </div>
                </v-card>
              </div>
            </v-row>
          </div>
          <template>
            <v-row justify="center">
              <v-dialog v-model="dialog1" persistent width="800px">
                <v-card>
                  <v-card-title> </v-card-title>
                  <v-card-text>
                    <v-container>
                      <EditStatusModal />
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDialog()">
                      Close
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialog" persistent width="800px">
                <v-card>
                  <v-card-title> </v-card-title>
                  <v-card-text>
                    <v-container> 
                      <EditModal/>
                     
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDialog()">
                      Close
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-row>
          </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import EditModal from "./EditModal.vue";
import EditStatusModal from "./EditStatusModal";
import ApiService from "../../service/apiservice";
import "vue-toast-notification/dist/theme-sugar.css";
import loader from "./Loader/loaderView.vue"

import sideNavigation from "../AdminPage/Notification/sideBarr.vue";

import topNavigation from "./adminTopNav.vue";

export default {
  components: {
    loader,
    sideNavigation,
    topNavigation,
    EditModal,
    EditStatusModal,
  },
  datas: () => ({
    ProjectData: [],

    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu: false,
    menu1: false,
    menu3: false,
    modal: false,
    menu2: false,
    msg: true,
  }),
  data() {
    return {
      loaderValue:false,
      
      dialog: false,
      dialog1: false,
      issue_list: [],
      isValid: true,
      isShowing: false,
      valid: true,
      num: 0,
      value: false,
      error: null,
      user_list: [],

      formSubmitted: false,
      projectStatus: [],
      itemData: [],
      listFilter: {
        issue_type: "",
        category: "",
        assignee: "",
      },
    
      menu3: false,
      menu2: false,
      menu: false,
      menu1: false,
      issuetype: [
        { value: 1, text: "Bug" },
        { value: 2, text: "task" },
        { value: 3, text: "Request" },
        { value: 4, text: "Other" },
      ],
      category: [
        { value: 1, text: "Bug" },
        { value: 2, text: "Developer Issue" },
        { value: 3, text: "Request" },
        { value: 4, text: "Task" },
        { value: 5, text: "Other" },
      ],
      data: {
        assignee: null,
      },
    };
  },
  methods: {
    modal(task_id) {
      if (this.getRole != 5) {
        this.dialog = true;
      } else if (this.getRole == 5) {
        this.dialog1 = true;
      }
      const tid = task_id;
      localStorage.setItem("taskId", tid);
    },
    getAssignee(id) {
      if (id == null) {
        return null;
      } else {
        let assigneeSelected = this.user_list.filter((item) => {
          if (item.user_id == id) {
            return item;
          }
        });
        return assigneeSelected[0].user_name;
      }
    },
    async getUser() {
      try {
        const id = this.projectId;
        const data = {};
        const response = await ApiService("/project/Usersprojects/" + id, "POST", data);

        if (response.length !== 0) {
          this.user_list = response.listView;
        }
      } catch (error) {
        console.log(error, "error................");
      }
    },
    async ProjectStatus() {
      this.loaderValue=false;
      try {
        const id = this.projectId

        const response = await ApiService("/project/overallProjectStatus/" + id, "GET");
        this.loaderValue=true;

        this.projectStatus = response;
        if (response.statusCode == 50 || response.statusCode == 399) {
          this.$router.push("/dashboard");
        }
      } catch (error) {
        const response = error.response.data;
        if (response.statusCode == 50 || response.statusCode == 399) {
          this.$router.push("/dashboard");
        }
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
    filtr(id) {
      this.listFilter.assignee = id;
      this.boardList();
    },
    async boardList() {
      this.loaderValue=false;

      this.disableDropdownIcon = true;
      try {
        const id = this.projectId;
        const response = await ApiService("/task/board/" + id, "POST", this.listFilter);
        this.loaderValue=true;

        this.listData = response;
        this.itemData = this.listData;
        this.open = this.itemData[0];
        this.inprogress = this.itemData[1];
        this.resolved = this.itemData[2];
        this.closed = this.itemData[3];
      } catch (error) {
        console.log("error", error.errorMessage);
      }
    },
    async getIssueType() {
      this.loaderValue=false;
      try {
        const response = await ApiService("/task/getIssue", "GET", null);
        this.loaderValue=true;

        if (response.length !== 0) {
          this.issue_list = response.issueTotalList;
          this.issues();
        }
      } catch (error) {
        console.log(error, "error................");
      }
    },
    async getCategory() {
      try {
        const response = await ApiService("/task/getcategory", "GET", null);

        this.category_list = response.categoryTotalList;
      } catch (error) {
        console.log(error, "error................");
      }
    },
    closeDialog() {
      this.dialog = false;
      this.dialog1 = false;
      this.boardList();
    },

    // side bar toggle

    ToggleOnOff(msg) {
      const boxs = document.getElementById("boxs");
      boxs.style.marginLeft = msg ? "220px" : "64px";
      boxs.style.transition = "visibility 0s, opacity 0.5s linear";
    },
  },

  mounted() {
   
     localStorage.removeItem("search")
  
    this.projectId= this.$store.state.projectId;
    localStorage.setItem("projectId",this.projectId)
    this.getRole = localStorage.getItem("projectRole");
    this.ProjectStatus();
    this.getIssueType();
    this.getCategory();
    this.getUser();
    this.boardList();
    setTimeout(() => {
      this.ToggleOnOff(localStorage.getItem("is_expanded") === 'true');
    }, 200);
  },
  computed: {
    categorylist() {
      let optss = [];
      for (let i = 0; i <= this.category_list.length - 1; i++) {
        optss.push({
          text: this.category_list[i].category,
          value: this.category_list[i].category_id,
        });
      }
      return optss;
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
.button {
  margin-left: 2%;
  border: none;
  font-size: 12px;
  text-transform: none;
  background-color: #c5c6d0;
}
.button:hover {
  background-color: #4fa5d6;
  transition: 0.2s;
}
.button1 {
  margin-left: 76%;
  border: none;
  font-size: 12px;
  text-transform: none;
  background-color: #c5c6d0;
}
.button1:hover {
  background-color: #4fa5d6;
  transition: 0.2s;
}
.label {
  margin-left: 1%;
  width: 300px;
  font-size: larger;
}
.scroll {
  height: 100px;
  overflow-y: scroll;
  scrollbar-width: thin;
  width: 5px;
}
.sheet {
  padding: 2%;
  margin: 0;
  text-align: left;

  flex-wrap: wrap;
  height: 60%;
  display: flex;
  margin-top: 3%;
}

.cards {
  margin-top: 2%;
  margin-left: 7%;
}
#cardOverflow {
  overflow-y: scroll;
}
#openPadding {
  padding: 20px;
  margin-top: 20px;
  padding-top: 30px;
  overflow-y: scroll;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
  rgb(209, 213, 219) 0px 0px 0px 1px inset;
  word-break: break-all;
}

.red {
  background-color: red;
  border-radius: 5px;
  padding-left: 4px;
  min-width: 48px;
  height: 20px;
  color: #fff;
}

.orange {
  background-color: orange;
  border-radius: 5px;
  padding-left: 4px;
  min-width: 48px;
  height: 20px;
  color: #fff;
}
.taskColor {
  background-color: #a1af2f;
  border-radius: 5px;
  padding-left: 4px;
  min-width: 48px;
  height: 20px;
  color: #fff;
}
.grey {
  background-color: rgb(189, 189, 189);
  border-radius: 5px;
  padding-left: 4px;
  min-width: 48px;
  height: 20px;
  color: #000000;
  white-space: nowrap;
  width: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.green {
  background-color: green;
  border-radius: 5px;
  padding-left: 4px;
  min-width: 48px;
  height: 20px;
  color: #fff;
}
.Tdots {
  cursor: pointer;
  display: flex;
  font-family: "Open Sans", sans-serif;
  font-size: 36px; /* The size of the dots */
  line-height: 0; /* helps vertically position the dots */
  margin-top: -10px; /* helps "raise" the dots higher */
  letter-spacing: -2px; /* "squeezes" the dots closer together */
  justify-content: end;
  width: 100%;
}
.alignment {
  width: 1000px;
}
#for_Column{
   
    gap:5%;
   
  }
.v-select__selection--disabled .v-icon {
  opacity: 0.5;
}

.forBoardFlex{
  gap:5%;
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
                      text-overflow: ellipsis ;
                      margin-left: 0px;
                 
                  
    
  

}
}
  .names {
    font-size: 14px;
    white-space: nowrap;
  
                      overflow: hidden;
                      text-overflow: ellipsis ;
                      margin-left: 0px;
                 
    
  

}
.fixed-sidebar .app-main .app-main__outer {
  z-index: 9;
  margin-left: 220px;
  padding-left: 0px;
}
#HeaderTask{
  max-height: 75px;
}
v-badge__badge {
  
    min-width: 3px !important;
 
}
.dot {
  height: 10px;
    width: 11px;
    background-color: #da2323;
    border-radius: 50%;
 
    display: inline-block;
}
.dot1 {
  height: 10px;
    width: 11px;
    background-color: #2326da;
    border-radius: 50%;
    display: inline-block;
}
.dot2 {
  height: 10px;
    width: 11px;
    background-color: #da6023;
    border-radius: 50%;
    display: inline-block;
}
.dot3 {
  height: 10px;
    width: 11px;
    background-color: #2cda23;
    border-radius: 50%;
    display: inline-block;
}
.Toptitle{
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
  background-color: #fff !important;

}
.alignmentFLex{
  display: flex;
  gap: 50px;
  flex-wrap: wrap;
}
@media (max-width: 991.98px){
.app-page-title .page-title-heading, .app-page-title .page-title-wrapper {
    margin: 0!important;
    display: flex;
}
}


@media screen and (max-width: 900px){
  #for_Column{


    width: 100%;
    gap:5%;
    margin-top:2%;
  }
  .alignmentFLex{
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.names {
    font-size: 14px;
    white-space: nowrap;
    width: 700px; 
                      overflow: hidden;
                      text-overflow: ellipsis ;
                      margin-left: -30px;
                 
    
  

}
}
@media screen and (max-width: 600px){
  #for_Column{
    display: flex;
    flex-direction: column!important;
    width: 100%;
    gap:5%;

  }
  .names {
    font-size: 14px;
    white-space: nowrap;
    width: 300px; 
                      overflow: hidden;
                      text-overflow: ellipsis ;
                      margin-left: 0px;
                 
    
  

}
  
 
}


@media only screen and (max-width: 280px){
  .names {
    font-size: 14px;
    white-space: nowrap;
    width: 200px; 
                      overflow: hidden;
                      text-overflow: ellipsis ;
                      margin-left: 0px;
                 
}

}
</style>
