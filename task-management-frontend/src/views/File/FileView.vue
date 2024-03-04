<template>
  <div
    class="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header"
  >
    <!-- top nav -->
    <topNavigation />

    <div class="app-main">
      <!-- side nav -->
      <div class="sideFile">
      <sideNavigation
        :id="ProjectData.project_id"
        @SideBarToggle="ToggleOnOff"
      />
    </div>
      <div class="app-main__outer" id="boxs" v-bind:style="{'margin-left': '64px', 'transition': none}">
        <div class="app-main__inner">
          <div v-if="!loaderValue">
                <loader />
              </div>
              <div v-if="loaderValue">
          <div class="app-page-title bg-light p-1 Toptitle" id="HeaderTask">
            <div class="page-title-wrapper">
              <div class="page-title-heading">
                <router-link exact :to="'/home'">
                  <v-img src="../../assets/Images/logo.png" class="logo"></v-img
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
          </div>
          <!---------------------------------------------------file/folder creation----------------------------------------------------------------------------->

          <div>
            <h5 id="fname">Files</h5>
          </div>

          <!----------------------------------------------------------file/folder selcection----------------------------------------------------------------------------------->

          <div class="row">
            <div class="col-md-12 col-lg-9">
              <div></div>
              <div class="frame1">
                <!--------------------------------------------------------------------------------------------------------------------------------->

                <template>
                  <div v-if="projectRole != 5">
                    <v-data-table
                    :mobile-breakpoint="100"
                      :headers="headers"
                      :items="file_list.files"
                      :hide-default-footer="FooterValue"
                      :items-per-page.sync="limit"
                      :page.sync="currentPage"
                      :server-items-length="totalFiles"
                      class="elevation-1"
                      v-model="files"
                      item-key="file_id"
                      @click:row="handleClick"
                    >
                      <template v-slot:[`item.name`]="{ item }">
                        <a
                        :title="item.name"
                          style="word-break: break-all"
                          @click="openfile(item)"
                          >{{ truncate(item.name,26) }}</a
                        >
                      </template>
                      <template v-slot:[`item.action`]="{ item }">
                        <v-row>
                          <div v-if="files.length == 0">
                     
                              <template >
                                <v-btn
                                  dark
                                  icon
                                  v-bind="attrs"
                                  v-on="on"
                                  
                                  v-show="projectRole != 5"
                                  title="Rname"
                                  @click="renamemodal(item)"
                                  color="#4fa5d6"
                                >
                                  <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                              </template>

                             
                          </div>
                          <template>
                            <v-icon
                              class="mr-3"
                              color="red"
                              @click="openModal(item.id)"
                              title="Delete"
                              >mdi-delete</v-icon
                            >
                          </template>
                        </v-row>
                      </template>
                      <template v-slot:[`item.created_date`]="{ item }">
                        {{ item.created_date }}
                      </template>
                    </v-data-table>
                  </div>
                </template>

                <template>
                  <div v-if="projectRole == 5">
                    <v-data-table
                    :mobile-breakpoint="100"
                      :headers="headers1"
                      :items="file_list.files"
                      :items-per-page="5"
                      class="elevation-1"
                      :hide-default-footer="FooterValue"

                      :items-per-page.sync="limit"
                      :page.sync="currentPage"

                      :server-items-length="totalFiles"                  
                          v-model="files"
                      item-key="file_id"
                      @click:row="handleClick"
                    >
                      <template v-slot:[`item.name`]="{ item }">
                        <a @click="openfile(item)">{{ item.name }}</a>
                      </template>
                      <template v-slot:[`item.action`]="{ item }">
                        <v-row>
                          <div v-if="files.length == 0">
                            <template >
                                <v-btn
                                  dark
                                  icon
                                  v-bind="attrs"
                                  v-on="on"
                               
                                  v-show="projectRole != 5"
                                  title="Rname"
                                  @click="renamemodal(item)"
                                  color="#4fa5d6"
                                >
                                  <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                              </template>
                          </div>
                        </v-row>
                      </template>
                    </v-data-table>
                  </div>
                </template>

                <!--------------------------------------------------------------------------->

                <template>
                  <v-dialog v-model="renamedialog" persistent max-width="700">
                    <v-card>
                      <div id="title" style="background-color: #4fa5d6 ;color:white">
                        <v-card-title>
                          <span class="text-h5" >Rename File</span>
                          <v-spacer></v-spacer>

                          <v-btn icon @click="renamedialog = false" dark>
                            <v-icon> mdi-close </v-icon>
                          </v-btn>
                        </v-card-title>
                      </div>
                      <div class="rename">
                        <v-form v-model="isValid" @submit.prevent="renamefile">
                          <v-col sm="12" md="10" xs="6">
                            <v-text-field
                              autocomplete="off"
                              outlined
                              type="text"
                              id="name"
                              :rules="filenameRules"
                              height="20"
                              v-model="filedata.name"
                              label="Rename"
                            ></v-text-field>
                          </v-col>
                        </v-form>
                      </div>
                      <v-card-actions>
                    
                        <div class="renamebtn" v-if="buttonValue == true">
                          <v-btn
                            @click="renamedialog = false"
                            class="cmnbtnstyle"
                          >
                            Cancel </v-btn
                          >&nbsp;
                          <v-btn
                            class="cmnbtnstyle SaveButton"
                            color="#4fa5d6"
                            @click="renamefile"
                            :disabled="!isValid"
                          >
                            Save
                          </v-btn>
                        </div>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </template>
                <!--------------------------------------------------------------------------------------------------------------------------------------------->
              </div>
            </div>

            <!-- -------------------------------------file Filter------------------------------------------ -->
            <div class="col-md-12 col-lg-3">
              <div
                class="card-shadow-danger mb-3 widget-chart widget-chart2 text-left card cardclass"
              >
                <div class="widget-content">
                  <div class="widget-content-outer">
                    <div class="widget-content-wrapper">
                      <div class="card-header-title titleFile" id="f1">
                        Find Files
                      </div>
                      <v-spacer></v-spacer>
                      <a title="Reset filter">
                        <v-icon style="color: black" @click="clear"
                          >mdi-autorenew</v-icon
                        ></a
                      >
                    </div>
                    <p class="updated">Uploaded Date</p>
                    <div class="row dateClass">
                      <div class="col-6 uploadedDate">
                        <v-menu
                          v-model="date1"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              outlined
                              clearable
                              dense
                              v-model="filterData.from_date"
                              placeholder="From Date"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="filterData.from_date"
                            @input="date1 = false"
                          ></v-date-picker>
                        </v-menu>
                      </div>
                      <div class="col-6 uploadedDate">
                        <v-menu
                          v-model="date2"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              placeholder="To Date"
                              dense
                              outlined
                              clearable
                              v-model="filterData.to_date"
                              placeholde="Date"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            :min="filterData.from_date"
                            :disabled="filterData.from_date == null"
                            v-model="filterData.to_date"
                            @input="date2 = false"
                          ></v-date-picker>
                        </v-menu>
                      </div>
                    </div>
                  
                    <p class="updated by">By</p>
                    <v-autocomplete
                      dense
                      class="selectOption"
                      outlined
                      v-model="filterData.uploaded_by"
                      background-color="white"
                      clearable
                      placeholder="Filter by user"
                      :items="assigne"
                    ></v-autocomplete>
                    <p class="updated">Keyword</p>

                    <v-text-field
                      dense
                      clearable
                      v-model="filterData.keyword"
                      outlined
                      placeholder="File Name"
                      color="black"
                      :rules="nameRules"
                      :error-messages="nameError"
                      required
                    ></v-text-field>
                    <v-btn
                      class="cmnbtnstyle SaveButton"
                      color="#4fa5d6"
                      style="justify-content: center; left: 35%"
                      @click="searchFile"
                    >
                      <span >Search</span>
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
            <v-dialog v-model="confirmation" max-width="400">
              <v-card>
                <v-card-title class="text-h5"> </v-card-title>

                <v-card-text>
                  Are you sure you want to delete this file?
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn color="red" text @click="closeModal()"> No </v-btn>

                  <v-btn color="green darken-1" text @click="deleteFile()">
                    Yes
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-------------------------------------------------Recent update Section------------------------------------------------------------------>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
                        
                  
  
  <script scoped>
import topNavigation from "../AdminPage/adminTopNav.vue";
import ApiService from "../../service/apiservice";
import loader from "../AdminPage/Loader/loaderView.vue"

import Vue from "vue";
import sideNavigation from "../AdminPage/Notification/sideBarr.vue";
import "vue-toast-notification/dist/theme-sugar.css";
import VueToast from "vue-toast-notification";
Vue.use(VueToast);
export default {
  components: { sideNavigation, topNavigation,loader },

  data() {
    return {
      count: "",
      FooterValue:false,
      changeValue: false,
      confirmation: false,
      filterData: {
        from_date: null,
        to_date: null,
        uploaded_by: null,
        keyword: null,
      },
      minDate: "",
      maxDate: "",
      user_list: [],
      projectId: "",
      ProjectData: [],

      projectStatus: [],
      date1: false,
      date2: false,
      renamedialog: false,
      filesData: {
        from_date: null,
        to_date: null,
        uploaded_by: null,
        keyword: null,
      },
      files: [],
      projectRole: "",
      data: {
        isHidden: false,
      },
      filedata: {
        name: null,
        id: null,
      },
      filesFilter: {},
      isValid: true,
      buttonValue: true,
      fileArray: [],
      fileList: [],
      currentPage: 1,
      prePage: 1,
      PreData: "",
      lastData: "",
      limit: 10,
      totalFiles: "",
      filenameRules: [
        (v) => !!v || "File name is required",
        (v) => !/^\s/.test(v) || "Enter a valid file name",

        (v) =>
          /^(?!\s)[^\s.]*([ ]{1}[^\s.]+)*[^\s.]?(?<!\s)$/.test(v) ||
          "Enter a valid file name",
        (v) =>
          (v && v.length <= 150) ||
          "File name must be less than 150 characters",
      ],

      headers: [
        { text: "Id", value: "id", sortable: false },
        { text: "File Name", value: "name", sortable: false },
        { text: "Uploaded By", value: "uploaded_by_file", sortable: false },
        { text: "Updated Date", value: "updated_date", sortable: false },
        { text: "Uploaded Date", value: "created_date", sortable: false },
        { text: "Action", value: "action", sortable: false, width: "15%" },
      ],

      headers1: [
        { text: "Id", value: "id", sortable: false },
        { text: "File Name", value: "name", sortable: false },
        { text: "Uploaded By", value: "uploaded_by_file", sortable: false },
        { text: "Uploaded Date", value: "created_date", sortable: false },
        { text: "Updated Date", value: "updated_date", sortable: false },
      ],
      file_list: { files: [] },
    };
  },
  methods: {
    truncate(str, length) {
      if (str.length > length) {
        return str.substring(0, length) + "...";
      } else {
        return str;
      }
    },
    renamemodal(fid) {
      this.filedata = {
        name: fid.file_name.split(".")[0],
        id: fid.file_id,
      };

      this.renamedialog = true;
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

    async renamefile(e) {
      try {
        const response = await ApiService(
          "/files/filename/" + this.filedata.id,
          "PUT",
          { file_name: this.filedata.name }
        );

        if (response.statusCode == 500 && response.statusCode == 1326) {
          Vue.$toast.warning("File rename failed", {
            position: "top",
          });
          this.renamedialog = true;
        } else if (response.statusCode == 1400) {
          Vue.$toast.warning("Enter a valid rename", {
            position: "top",
          });
          this.renamedialog = true;
        } else {
          Vue.$toast.success("File renamed Successfully", {
            position: "top",
          });

          this.renamedialog = false;
          this.getfiles();
        }
        e.preventDefault();
      } catch (error) {
        console.log(error);
      }
    },
    openfile(data) {
      window.open(`${data?.file_path}`);
    },

    async getfiles() {
      this.FooterValue=false;


      try {
        this.limitss=this.limit
        if (this.limit == -1) {
         this.limitss=""
        }
        const params = {
          limit: this.limitss,
          page: this.currentPage,
        };
        
        if (this.filedata.keyword == "") {
          this.filedata.keyword = null;
        }
        const id = this.projectId;
        const response = await ApiService(
          "files/getProjectFiles/" + id,
          "POST",
          this.filterData,
          null,
          params
        );
      


        this.totalFiles = response.pagerData.total;
        if (response.statusCode == 3046) {
          Vue.$toast.warning("From date is greater than to date", {
            position: "top",
          });
        }
        if(response.subFiles.length==0){
          this.FooterValue=true;
        }
        const formatedFile = response?.subFiles?.map((data) => {
          return {
            ...data,
            name: data?.file_name,
            id: data?.file_id,
            updated_user_name: data?.updated_by_file?.user_name,
          };
        });
        this.fileArray = formatedFile;
        for (const element of this.fileArray) {
          this.fileList.push(element);
        }
        this.fileLength = formatedFile.length;
        this.prePage = this.currentPage;
        // this.PreData=formatedFile[this.fileLength-9].file_id

        // this.lastData=fom
        const formatedFolder = response?.subFolders?.map((data) => {
          return {
            ...data,
            name: data?.folder_name,
            id: data?.folder_id,
            updated_user_name: data?.updated_by_folders?.user_name,
          };
        });
        this.file_list = { files: [...formatedFile, ...formatedFolder] };
      } catch (error) {
        console.log(error);
      }
    },

    async getProjectDetails(id) {
      try {
        this.loaderValue=false;

        const response = await ApiService(
          "/project/overallProjectStatus/" + id,
          "GET"
        );
        this.loaderValue=true;

        if (response.statusCode == 50) {
          this.$router.push("/dashboard");
        }
        if (response.statusCode == 399) {
          this.$router.push("/dashboard");
        }
        this.ProjectData = response;
        this.minDate = response.start_date;
        this.maxDate = response.end_date;
      } catch (error) {
        console.log(error, "error................");
      }
    },
    async getUser() {
      try {
        const id = this.projectId;

        const response = await ApiService(
          "/project/Usersprojects/" + id,
          "POST",
          this.filesFilter
        );

        if (response.length !== 0) {
          this.user_list = response.listView;
        }
      } catch (error) {
        console.log(error, "error................");
      }
    },
    closeModal() {
      this.confirmation = false;
    },
    openModal(id) {
      this.confirmation = true;

      this.file_id = id;
    },
    async deleteFile() {
      this.confirmation = false;
      try {
        const response = await ApiService(
          "/files/deleteFile/" + this.file_id,
          "DELETE"
        );
        if (response.statusCode == 200) {
          Vue.$toast.success("File Deleted Successfully", {
            position: "top",
            queue: true,
          });
        }

        this.confirmation = false;
      } catch (error) {
        if (error.response.data.statusCode == 85) {
          Vue.$toast.warning("File not found", {
            position: "top",
          });
        }
      }
      this.getfiles();
    },
    searchFile() {
      this.currentPage = 1;
      this.page = "";
      this.getfiles();
    },
    clear() {
      this.filterData.from_date = null;
      this.filterData.to_date = null;
      this.filterData.uploaded_by = null;
      this.filterData.keyword = null;
      this.getfiles();
    },

    // side bar toggle
    ToggleOnOff(msg) {
      this.boxs = document.getElementById("boxs");

      if (msg) {
        if(this.boxs && this.boxs.style && this.boxs.style.marginLeft) this.boxs.style.marginLeft = "220px";
        if(this.boxs && this.boxs.style && this.boxs.style.transition) this.boxs.style.transition = "visibility 0s, opacity 0.5s linear";
      } else {
        if(this.boxs && this.boxs.style && this.boxs.style.marginLeft) this.boxs.style.marginLeft = "64px";
        if(this.boxs && this.boxs.style && this.boxs.style.transition) this.boxs.style.transition = "visibility 0s, opacity 0.5s linear";
      }
    },
  },
  watch: {
    currentPage: {
      handler() {
        this.getfiles();
      },
      immediate: false,
    },
    limit: {
      handler() {
        this.changeValue = true;
        this.getfiles();
      },
      immediate: false,
    },
  },
  mounted() {

     localStorage.removeItem("search")
 
    this.projectId = this.$store.state.projectId;
    if (this.projectId === "null") {
      this.$router.push("/dashboard");
    }
    localStorage.setItem("projectId", this.projectId);

    this.getProjectDetails(this.projectId);
    this.getfiles();
    this.getUser();
    this.ToggleOnOff(localStorage.getItem("is_expanded") === "true");
    this.projectRole = localStorage.getItem("projectRole");

    this.GetProjectRole();
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
};
</script>
  
  <style  scoped>
#fname {
  font-size: larger;
  font-weight: bold;
}

.rename {
  margin-top: 5%;
  width: 65%;
  margin-left: 20%;
}
.renamebtn {
  display: flex;
  justify-content: center !important;
  gap:5px;
  flex-wrap: wrap;
  margin-left: 30%;
}

.cardclass {
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
    rgb(209, 213, 219) 0px 0px 0px 1px inset;
}
.updated {
  font-weight: 500;
}
.titleFile {
  font-weight: 900;
  font-size: 15px;
}
.clearButton {
  display: flex;
  justify-content: center;
}
@media only screen and (max-width: 1600px) {
  .dateClass {
    display: block;
  }
  .uploadedDate {
    min-width: 100%;
    margin-bottom: -10%;
  }
}
@media only screen and (max-width: 1440px) {
  .dateClass {
    display: block;
  }
  .uploadedDate {
    min-width: 100%;
    margin-bottom: -5%;
  }
}
.v-date-picker {
  width: 20px;
}

.logo {
  width: 40px;
}

@media only screen and (max-width: 1450px) {
  .logo {
    width: 40px;
  }

 
  .names{
  font-size: 14px;
    white-space: nowrap;
    width: 700px; 
                      overflow: hidden;
                      text-overflow: ellipsis !important;
                      margin-top: -20px;
 
    margin-left: 34px;
  }
}
.names{
  font-size: 14px;
    white-space: nowrap;
    width: 700px; 
                      overflow: hidden;
                      text-overflow: ellipsis !important;
                      margin-top: 0px;
 
    margin-left: 0px;
  

}
.fixed-sidebar .app-main .app-main__outer {
  z-index: 9;
  margin-left: 220px;
  padding-left: 0px;
}
#HeaderTask {
  max-height: 75px;
}
.by{
  margin-top: 8px;
}
.Toptitle{
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
  background-color: #fff !important;

}
.app-page-title{
  text-align: left !important;
 

}
.SaveButton{
  color: white;
}
.cmnbtnstyle{
  border: #c2c2c2 1px solid;
  box-shadow: none;
}





@media screen and (max-width: 850px){
  .names{
  font-size: 14px;
    white-space: nowrap;
    width: 700px; 
                      overflow: hidden;
                      text-overflow: ellipsis !important;
                      margin-top: -20px;
 
    margin-left: 34px;
  }
}


@media screen and (max-width: 600px){
  .sideFile{
    display: none;
  }
  .names{
  font-size: 14px;
    white-space: nowrap;
    width: 300px; 
                      overflow: hidden;
                      text-overflow: ellipsis !important;
                      margin-top: -20px;
 
    margin-left: 34px;
  }
  
}
@media screen and (max-width: 500px){
  .renamebtn {
  display: flex;
  justify-content: center !important;
  gap:5px;
  flex-wrap: wrap;
  margin-left: 15%;
}
.names{
  font-size: 14px;
    white-space: nowrap;
    width: 300px; 
                      overflow: hidden;
                      text-overflow: ellipsis !important;
                      margin-top: -20px;
 
    margin-left: 34px;
  }
  
}

@media screen and (max-width: 280px){
  .names{
  font-size: 14px;
    white-space: nowrap;
    width: 200px; 
                      overflow: hidden;
                      text-overflow: ellipsis !important;
                      margin-top: -20px;
 
    margin-left: 25px;
  }
  .renamebtn {
  display: flex;
  justify-content: center !important;
  gap:5px;
  flex-wrap: wrap;
  margin-left: 10%;
}
}

</style>