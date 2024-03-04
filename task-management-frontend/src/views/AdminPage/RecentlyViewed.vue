<template>
  <div>
    <div
      class="dropdown-menu dropdown-menu " @click="$event.stopPropagation()"
  
      id="scroll"
      style="max-height: 235px; overflow-y: scroll; width: 600px; margin-left: 2%"
    >
      <v-toolbar id="header" style="height: 44px" flat color="#1d9c70" scrollable>
        <v-toolbar-title id="heading" style="color: white; z-index: 99">
          Tasks
        </v-toolbar-title>
      </v-toolbar>
      <div class="styles">
        <v-text-field
          autocomplete
          @keyup="search()"
          v-model="searchText"
          dense
          filled
          clearable
          @click:clear="setItNull()"
          placeholder="Search recently viewed tasks "
          prepend-inner-icon="mdi-magnify"
          class="pt-6 shrink expanding-search searchTop"
          style="margin-bottom: -5%"
          :class="{ closed: searchBoxClosed && !searchText }"
        ></v-text-field>
        <div v-if="recentTaskList.length==0">
        <p class="center">There are no recently viewed tasks yet.</p>
        </div>
        <div v-for="items in recentTaskList" :key="items.id">
          <div >
            <div
              class="card cardMsg widget-content notifybox"
              style="color: black"
              @mouseleave="action = null"
              @mouseover="action = items.recently_viewed_id"
            >
              <div class="row">
                <div class="col-1" style="margin-left: -4%">
                  <v-avatar>
                    <img src="../../assets/Images/logo.png" alt="" />
                  </v-avatar>
                </div>
                <div class="col-10">
                  <p class="text_align routerRecent" @click="redirectionRecently(items.project_recently_viewed.project_id,items.task_recently_viewed.task_id)">
                
                      [{{ items.task_recently_viewed.task_id }}] &nbsp;
                      {{ items.task_recently_viewed.task_name }}
                  </p>
                </div>
                <div class="col-1">
                  <em
                    v-show="action == items.recently_viewed_id"
                    class="nav-link-icon mdi mdi-open-in-new"
                    @click.stop="previewModal(items.task_recently_viewed.task_id,items.project_recently_viewed.project_id)"
                    @click="previewModal(items.task_recently_viewed.task_id,items.project_recently_viewed.project_id)"
                    style="
                      color: gray;
                      float: right;
                      margin-top: -6%;
                      font-size: 25px;
                      cursor: pointer;
                    "
                  >
                  </em>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <div v-if="recentTaskList.length!=0">
         <a @click="previous()" v-show="this.page != 1">Previous</a>&nbsp;&nbsp;&nbsp;
         <a v-show="pageCount>page"
          @click="next()"
          >Next</a
        ></div>
      </div>

      <!--------------------------------preview modal------------------------------------------------------->
      <v-dialog
        v-model="previewDialog"
        persistent
        max-width="1000"
        id="previewDialogModal"
      >
        <v-card v-if="previewDialog">
          <div id="title" style="background-color: rgb(79, 165, 214)">
            <v-card-title>
              <span class="text-h5 ">Task Preview</span>
              <v-spacer></v-spacer>
              <v-btn icon @click="closeDialog" dark>
                <v-icon> mdi-close </v-icon>
              </v-btn>
            </v-card-title>
          </div>
          <br />
          <v-card-text>
            <v-container>
              <update-dialog :Update_tid="Update_tid" :project_Id="project_Id" @close="getValue" />
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>
<script>
import ApiService from "../../service/apiservice";
import UpdateDialog from "./updateDialog.vue";

export default {
  components: { UpdateDialog },

  data() {
    return {
      action: null,
      page: "",
      searchKey: "",
      pageCount:"",
      previewDialog: false,
      pageNo:1,
      limit: 10,
      searchText: null,
      searchBoxClosed: false,
      recentTaskList: [],
      project_Id:null,
    };
  },
  mounted() {
    this.getTask();
  },
  methods: {
    redirectionRecently(projectId,taskId){
    
      localStorage.setItem("TaskId",taskId)
      localStorage.setItem("projectId",projectId)
      this.$store.commit("getData",projectId);
      this.$store.commit("getTaskData",taskId);
      this.$router.push("/task-view");
      this.$router.go("/task-view" );
    },
    setItNull() {
      this.searchKey = "";
      this.getTask();
    },
    previous() {
      this.pageNo = this.pageNo - 1;
      this.getTask();
    },
    next() {
      this.pageNo = this.pageNo + 1;
      this.getTask();
    },
    search() {
      this.searchKey = this.searchText;
      this.getTask();
    },
    previewModal(id,projectid) {
      this.Update_tid = id;
      this.project_Id=projectid;
      this.previewDialog = true;
    },
    closeDialog() {
      this.previewDialog = false;
    },

    getValue(value) {
      this.previewDialog = false;
      console.log(value);
    },
    async getTask() {
     
      const params = {
        searchKey: this.searchKey,
        searchCol: "task_name",
        pageNo: this.pageNo,
        limit: this.limit,
      };
      const response = await ApiService("task/recentlyviewed", "GET", null, null, params);
      this.page = response.page;
     
      this.recentTaskList = response.data;
      this.pageCount=Math. ceil(response.total/10)
;

    },
  },
};
</script>
<style scoped>
#header {
  margin-top: -2%;
}
#heading {
  margin-bottom: 2%;
  font-size: medium;
}
.styles {
  margin-top: -4%;
}
p {
  margin-top: -4%;
}
.text_align {
  margin-top: 3%;
  margin-left: 2%;
  word-break: break-word;}
.notifybox {
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
    rgb(209, 213, 219) 0px 0px 0px 1px inset;
}
.notifybox :hover {
  background-color: #fcfade;
}
.center{
  margin-top: 1%;
  text-align: center;
}
.routerRecent{
  cursor: pointer;
}
#scroll{
  top:5px !important;
}
.dropdown-menu.show {
    animation: none !important;
}
.backColor{
  background-color: aqua;
}
.text-h5{
  color:white;
}

</style>
