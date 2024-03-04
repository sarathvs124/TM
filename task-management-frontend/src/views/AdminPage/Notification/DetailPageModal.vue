<template>
  <div>
    <div class="maintitle">
      <div class="title1">
        <div>
          <template
            ><span v-if="user.taskData && user.taskData.issue_id == 1">
  <v-btn
    outlined
    rounded
    color="white"
    width="80px"
    height="20px"
    style="
      border: none;
      font-size: 12px;
      text-transform: none;
      background-color: #eb7c48;
    "
  >
    Bug
  </v-btn>
</span>
            <span v-if="user.taskData && user.taskData.issue_id == 3">
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
                  background-color: #bf3737;
                "
              >
                Task
              </v-btn>
            </span>
            <span v-if="user.taskData && user.taskData.issue_id == 2">
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
                  background-color: #bf3737;
                "
              >
                Other
              </v-btn>
            </span>
            <span v-if="user.taskData && user.taskData.issue_id == 4">
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
                  background-color: #47b39d;
                "
              >
                Request
              </v-btn>
            </span>
            <span v-if="user.taskData && user.taskData.issue_id > 4" class="otherStatus">
              <v-btn
                outlined
                rounded
                class="statusButton"
                color="white"
               :title="user.taskData.issue_name"
              >
                {{ user.taskData.issue_name }}
              </v-btn>
            </span>
          </template>
        </div>

        <div></div>
      </div>
      <div class="subtitle">
  <h5 class="tname">{{ user.taskData && user.taskData.task_name }}</h5>
</div>

      <router-link
        :to="'/task-view'"
        class="navPage"
      >
        <p @click="TaskRedirect(projectId,user.taskData.task_id)" data-test="hai">Go to issue</p>
      </router-link>
      <div class="taskcontent">
        <!-----------------------accound section---------------------->

        <div class="taskassignee">
          <div class="acnt">
            <div>
              <div v-if="user.taskData && user.taskData.created_by_photo !== null">
                <img
                  width="40"
                  height="40"
                  class="rounded-circle responsive-img"
                  v-bind:src="user.taskData && user.taskData.created_by_photo"
                  loading="lazy"
                  alt=""
                  title="Profile"
                />
              </div>

              <div v-if="user.taskData && user.taskData.created_by_photo == null">
                <img
                  width="40"
                  height="40"
                  class="rounded-circle"
                  src="../../../assets/Images/profilePicc.jpg"
                  alt=""
                  title="Profile"
                />
              </div>
            </div>
            <v-col cols="12" sm="12" xs="12" md="12">
              <h5>{{user.taskData && user.taskData.created_by }}</h5>
            </v-col>
          </div>
        </div>
        <!-----------------description---------------------------------------->

        <div>
          <div>
            <div
              class="discription"
              v-html="user.taskData && user.taskData.task_description"
            ></div>
            <!------------------------------------------------------------------>

            <div class="tdata">
              <template>
                <v-row>
                  <v-col cols="12" >
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
                            <span v-if="user.taskData && user.taskData.priority == 3">
                              <v-icon v-bind="attrs" v-on="on" color="red"
                                >mdi-arrow-up</v-icon
                              ></span
                            >
                            <span v-if="user.taskData && user.taskData.priority == 2">
                              <v-icon v-bind="attrs" v-on="on" color="#4622bd"
                                >mdi-arrow-right</v-icon
                              ></span
                            >
                            <span v-if="user.taskData && user.taskData.priority == 1">
                              <v-icon v-bind="attrs" v-on="on" color="green"
                                >mdi-arrow-down</v-icon
                              ></span
                            >

                            {{ findpriority(user.taskData && user.taskData.priority) }}
                          </v-col>
                        </v-row>
                      </div>
                    </template>
                  </v-col>
                  <v-col cols="12 " lg="6" sm="12" xs="12">
                    <template>
                      <div class="gridright1">
                        <v-row>
                          <v-col cols="6" sm="4" xs="8">
                            <span>Assignee : </span>
                          </v-col>
                          <v-col cols="6" sm="4" xs="8">
                            {{user.taskData && user.taskData.assignee }}
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
                          <v-col cols="6" sm="4" xs="8">
                            <span>Category : </span>
                          </v-col>
                          <v-col cols="6" sm="4" xs="8">
                            {{user.taskData && user.taskData.category_name }}
                          </v-col>
                        </v-row>
                      </div>
                    </template>
                  </v-col>
                  <v-col cols="12" lg="6" sm="12" xs="12">
                    <template>
                      <div class="gridleft">
                        <v-row>
                          <v-col cols="6" sm="4" xs="8">
                            <span>Task status : </span>
                          </v-col>
                          <v-col cols="6" sm="4" xs="8">
                            {{ findStatus(user.taskData && user.taskData.task_status) }}
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
                          <v-col cols="6" sm="4" xs="8">
                            <span>Start Date : </span>
                          </v-col>

                          <v-col cols="6" sm="4" xs="8">
                            {{user.taskData && user.taskData.start_date }}
                          </v-col>
                        </v-row>
                      </div>
                    </template>
                  </v-col>
                  <v-col cols="12" lg="6" sm="12" xs="12">
                    <template>
                      <div class="gridleft">
                        <v-row>
                          <v-col cols="6" sm="4" xs="8">
                            <span>End Date : </span>
                          </v-col>
                          <v-col cols="6" sm="4" xs="8">
                            {{user.taskData && user.taskData.end_date }}
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
                          <v-col cols="6" sm="4" xs="8" md="5">
                            <span>Estimated Hours: </span>
                          </v-col>
                          <v-col cols="6" sm="4" xs="8"  md="2">
                            {{user.taskData && user.taskData.estimated_hours }}
                          </v-col>
                        </v-row>
                      </div>
                    </template>
                  </v-col>
                  <v-col cols="12" lg="6" sm="12" xs="12">
                    <template>
                      <div class="gridright">
                        <v-row>
                          <v-col cols="6" sm="4" xs="8">
                            <span>Actual Hours : </span>
                          </v-col>
                          <v-col cols="6" sm="4" xs="8">
                            {{user.taskData && user.taskData.actual_hours }}
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
export default {
  props: {
    user: Object,
    projectId: Number,
    userInfoModal: Boolean,
  },
  data() {
    return {
      
};
  },
  methods: {
    TaskRedirect(id,taskId){
      localStorage.setItem("taskId",taskId)
      localStorage.setItem("projectId",id)
      this.$store.commit("getData",id);
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
  word-break: break-all;
  font-weight: bold;
  font-size: x-large;
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
.statusButton {


  border: none;
  font-size: 12px;
  text-transform: none;
  background-color: gray;
}

.otherStatus .v-btn__content {
  overflow: hidden;
  width: 100% !important;
  text-overflow: ellipsis;

}
</style>