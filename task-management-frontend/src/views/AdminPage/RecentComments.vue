<template>
  <div>
    <div>
      <div v-for="Data in Comments" :key="Data.id">
        <div
          class="card cardMsg widget-contents"
          v-if="
            Data.action == 3 ||
            Data.action == 4 ||
            Data.action == 5 ||
            Data.action == 6 ||
            Data.action == 7 ||
            Data.action == 8 ||
            Data.action == 9 ||
            Data.action == 10 ||
            Data.action == 11 ||
            Data.action == 12 ||
            Data.action == 13 ||
            Data.action == 14
          "
        >
          <div class="ContentAction">
            <div id="content">
              <div class="profileImage" v-if="Data.profile_photo !== null">
                <img
                  width="40"
                  height="40"
                  class="rounded-circle responsive-img"
                  v-bind:src="Data.profile_photo"
                  loading="lazy"
                  alt=""
                  title="Profile"
                />
              </div>

              <div class="profileImage" v-if="Data.profile_photo == null">
                <img
                  width="40"
                  height="40"
                  class="rounded-circle"
                  src="../../assets/Images/profilePicc.jpg"
                  alt=""
                  title="Profile"
                />
              </div>
              <div class="content-actions">
                <div class="actionBy">{{ Data.action_by }}</div>
                <div class="time">
                  {{ moment(Data.created_date).fromNow() }}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="cmtcntnt">
              <div v-if="Data.action == 3">
                <div class="comment-data" >Updated the task</div>
              </div>
              <div v-if="Data.action == 4">
                <div class="comment-data">Uploaded a file</div>
              </div>
              <div v-if="Data.action == 5">
                <div class="comment-data">
                  Assigne task to
                  {{ Data.assignee }}
                </div>
              </div>

              <div v-if="Data.action == 6">
                <div class="comment-data">
                  Reassigne task to
                  {{ Data.assignee }}
                </div>
              </div>
              <div v-if="Data.action == 7">
                <div class="comment-data">
                  Created a task and assigned to
                  {{ Data.assignee }}
                </div>
              </div>

              <div v-if="Data.action == 9">
                <div class="comment-data">
                  Updated task and Reassigne to
                  {{ Data.assignee }}
                </div>
              </div>
              <div v-if="Data.action == 10">
                <div class="comment-data">
                  <tr class="comment-data-show">
                    <td class="comment-title" data-test="id2">Comment :</td>
                    <td class="commentbrk" v-html="Data.comment"></td>
                  </tr>
                </div>
              </div>
              <div v-if="Data.action == 11">
                <div class="comment-data">Changed task status</div>
              </div>

              <div v-if="Data.action == 12">
                <div class="comment-data">
                  Changed assignee
                {{ Data.assignee }}
                </div>
              </div>

              <div v-if="Data.action == 13">
                <div class="comment-data">changed status and assignee</div>
              </div>
              <div v-if="Data.action == 14">
                <div class="comment-data">Renamed a File</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="div-load"
        v-if="cmtDetails.length < 1 || cmtDetails[0].action==2"
        
      >
        <p id="recentComment" data-test="id1">Be the first to comment......... </p>
      </div>
      <div v-else-if="lengthTask < cmtDetails.length - 1" class="div-load"   >
        <button
          class="btn float-right"
          @click="loadMore"
          style="color: cornflowerblue; font-size: 14px; right: 55px;"
          data-test="id3"
        
        >
          load more........
        </button>
      </div>

      <div
        v-else-if="lengthTask>2"
        class="div-load"
      >
        <button
          class="btn float-right"
          @click="loadLess"
          style="color: cornflowerblue; font-size: 14px right: 55px;"
        >
          load less........
        </button>
      </div>
    </div>
  </div>
</template>
<script>

let moment = require("moment");
export default {
  props: {
    Update_tid: Number,
    cmtDetails: Object,
    projectId: Number,
    userInfoModal: Boolean,

  },
  data() {
    return {
      projectId:"",
      taskId:"",
      lengthTask: 2,
      cmtDetails: [],
      moment: moment,
    };
  },
  methods: {
    TaskRedirect(id,taskId){
      localStorage.setItem("taskId",taskId)
      localStorage.setItem("projectId",id)
      this.$store.commit("getData",id);
      this.$store.commit("getTaskData",taskId);
      
    },
 
    loadMore() {
      if (this.lengthTask > this.cmtDetails.lengthTask) return;
      this.lengthTask = this.cmtDetails.length;
    },
    loadLess() {
      if (this.lengthTask < this.cmtDetails.lengthTask) return;
      this.lengthTask = 2;
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

    Comments() {
      return this.cmtDetails.slice(0, this.lengthTask);
    },
  },
  beforeMount() {
    this.projectId= this.$store.state.projectId;
  this.taskId= this.$store.state.taskId;
localStorage.setItem("taskId",this.taskId)
    // this.getdetails();
  },
};
</script>
<style scoped>
.widget-contents {
  padding-bottom: 10px;
  padding-left: 20px;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #33373b24;
  border-radius: 0px;
  border-bottom: 1px solid grey;
}
.content-actions {
  width: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.cmtload {
  margin-top: 10%;
  margin-left: 50%;
  justify-content: center;
}

.profileImage {
  width: fit-content;
}

#content {
  display: flex;
  gap: 10px;
  flex-direction: row;
}
.comment-data {
  padding-left: 51px !important;
  display: flex;
  flex-wrap: wrap;
  word-break: break-word;
  padding-right: 79px;
}
.comment-data-show {
  display: flex;
  flex-direction: column;
}
.comment-title {
  font-weight: 600;
  width: fit-content;
  height: fit-content;
}
.div-load {
padding-bottom: 32px;
background-color: #ced4d9ba;
}
.commentbrk {
  word-wrap: break-word;
  word-break: break-all;
}
#recentComment{
  display: flex;
  justify-content: center;
}
</style>
