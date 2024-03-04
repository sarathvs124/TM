<template>
  <div>
    <div class="maintitle">
      <div class="title1">
        <div>
          <template v-if="taskData.issue_id == 1">
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

                background-color: #e64754;
              "
            >
              {{ taskData.issue_name }}
            </v-btn>
          </template>
          <template v-if="taskData.issue_id == 2">
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

                background-color: #478af5;
              "
            >
              {{ taskData.issue_name }}
            </v-btn>
          </template>
          <template v-if="taskData.issue_id == 3">
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
              color="white"
              width="120px"
              height="100px"
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
      </div>
      <router-link
        :to="'/task-view' "
        class="navPage"
      >
        <p @click="TaskRedirect(taskData.task_id)">Go to issue</p>
      </router-link>
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
            <v-col cols="12" lg="12" md="12" sm="12" xs="12">
              <h5>{{ taskData.created_by }}</h5>
            </v-col>
          </div>
        </div>
        <!-----------------description---------------------------------------->

        <div>
          <div>
            <div class="discription" v-html="taskData.task_description"></div>
            <!------------------------------------------------------------------>

            <div class="tdata">
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
                          <v-col cols="12" sm="4">
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
                          <v-col cols="12" sm="4">
                            <span>Category : </span>
                          </v-col>
                          <v-col cols="12" sm="4">
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
                          <v-col cols="12" sm="4">
                            <span>Task status : </span>
                          </v-col>
                          <v-col cols="12" sm="4">
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
                  <v-col  cols="12" lg="6" sm="12" xs="12">
                    <template>
                      <div class="gridleft">
                        <v-row>
                          <v-col cols="12" sm="4">
                            <span>Start Date : </span>
                          </v-col>

                          <v-col cols="12" sm="4">
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
                          <v-col cols="12" sm="4">
                            <span>End Date : </span>
                          </v-col>
                          <v-col cols="12" sm="4">
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
                          <v-col cols="12" sm="4">
                            <span>Actual Hours : </span>
                          </v-col>
                          <v-col cols="12" sm="4">
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
                          <v-col cols="12" sm="4">
                            <span>Estimated Hours : </span>
                          </v-col>
                          <v-col cols="12" sm="4">
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
    </div>
  </div>
</template>

<script>
import ApiService from "@/service/apiservice";
export default {
  props: {
    Update_tid: Number,
  },
  data() {
    return {
      taskData: [],
    };
  },
  methods: {
    TaskRedirect(taskId){
      localStorage.setItem("taskId",taskId)
    
    this.$store.commit("getTaskData",taskId);
      
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
        this.taskData = response?.taskDetails;
      } catch (error) {
        console.log(error, "error................");
        this.isFetching = false;
      }
    },
  },
  beforeMount() {
    this.getdetails();
  },
};
</script>
>

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
  font-weight: bold;
  font-size: x-large;
  word-wrap: break-word;
  width: 60ch;
}
.taskcontent {
  width: 100%;
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
  width: 60%;
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
.csbtn {
  justify-content: center;
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
.text-truncate {
  border-radius: 15px;
  padding: 5px ;
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
    line-height: 18px;
}
</style>
