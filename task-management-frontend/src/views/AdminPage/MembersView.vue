<template>
  <div
    class="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header" style="overflow-y:hidden"
  >
    <!-- top nav -->
    <topNavigation />

    <div class="app-main">
      <!-- side nav -->
      <sideNavigation @SideBarToggle="ToggleOnOff" />

      <div class="app-main__outer sec" style="overflow: hidden" id="boxs" v-bind:style="{'margin-left': '64px', 'transition': none}">
        <div v-if="!loaderValue">
          
                <loader />
               
              </div>
              <div v-if="loaderValue">
        <div class="app-page-title title bg-light p-1 Toptitle" id="HeaderTask">  
          
         
          <div class="page-title-wrapper" style="overflow: hidden !important">
            <div class="frame" id="settingsSide">
              <router-link exact :to="'/home/'">
                <v-img
                  class="logo"
                  alt="logo"
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
         

            <div class="addbtns" v-if="projectRole == 3 || projectRole == 4">
              <div class="mr-4">
                <v-btn
                  rounded
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                  @click="bulkusersModal()"
                  title="Allocate users"
                >
                  <v-icon left> mdi-account-multiple-plus-outline </v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </div>

        <!--------sub sidebar--------->

        <psSidebar>
          <div class="searchDiv" id="searching">
            
              <v-row no-gutters>
                <v-col>
                  <v-text-field
                    v-model="searchKey"
                    label="Search Users"
                    outlined
                    rounded
                    background-color="white"
                    clearable
                    @click:clear="issueserach()"
                    @keyup="searchUser()"
                    prepend-inner-icon="mdi-magnify"
                    dense
                    class="search"
                  ></v-text-field>
                </v-col>

                <v-col >
                  <v-autocomplete
                    clearable
                    :items="U_role"
                    v-model="role"
                    background-color="white"
                    label="Role"
                    dense
                    rounded
                    outlined
                    v-on:change="searchUser()"
                  ></v-autocomplete>
                </v-col>
              </v-row>
        
          </div>
          <div class="table">
            <div class="d-flex justify-space-between"></div>
            <!--------------------------------View Members----------------------------------------------->



            <div v-if="user_list==0">
              <v-data-table
                  :mobile-breakpoint="100"
                              :headers="headers"
                              :items="user_list"
                              hide-default-footer
                              class="elevation-1"
                ></v-data-table>
              </div>
              <div v-if=" user_list!=0">
            <div 
              v-if="projectRole == 5 || projectRole == 6 || projectRole == 7"
            >
              <div>
                <v-data-table
                  :headers="headersNew"
                  :items="user_list"
                  :mobile-breakpoint="100"
                  class="custom_table_class"
                  :page.sync="pagination"
                  
                  :group-desc="true"
                  :items-per-page.sync="limit"
                  :server-items-length="totalUsers"
                >
                  <template v-slot:[`item.profile_photo`]="{ item }">
                    <td>
                      <div v-if="item.user.profile_photo !== null">
                        <img
                          width="30"
                          height="30"
                          class="rounded-circle responsive-img"
                          v-bind:src="item.user.profile_photo"
                          loading="lazy"
                          alt=""
                          title="Profile"
                        />
                      </div>

                      <div v-if="item.user.profile_photo == null">
                        <img
                          width="30"
                          height="30"
                          class="rounded-circle"
                          src="../../assets/Images/profilePicc.jpg"
                          alt=""
                          title="Profile"
                        />
                      </div>
                    </td>
                  </template>
                  <template v-slot:[`item.roles`]="{ item }"
                    ><td>{{ findRole(item.project_role_id) }}</td></template
                  >
                  <template v-slot:[`item.joined_date`]="{ item }"
                    ><p>{{ item.joined_on }}</p>
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                    <v-row v-if="projectRole == 4 || projectRole == 3">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          class="mr-5"
                          v-bind="attrs"
                          v-on="on"
                          color="red"
                          title="Remove User"
                          @click="openModal(item.user_id)"
                          >mdi-account-minus</v-icon
                        >

                        <v-dialog v-model="dialog" max-width="400">
                          <template v-slot:activator="{ attrs, on }">
                            <v-btn
                              color="primary"
                              v-bind="attrs"
                              v-on="on"
                              @click="openDialog(item.user_id)"
                              >From the bottom</v-btn
                            >
                          </template>
                          <v-card>
                            <v-toolbar
                              color="primary"
                              title="Opening from the top"
                            ></v-toolbar>
                            <v-card-text>
                              <div class="text-h2 pa-12">Hello world!</div>
                            </v-card-text>
                            <v-card-actions class="justify-end">
                              <v-btn variant="text" @click="openDialog()"
                                >Close</v-btn
                              >
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </template>
                    </v-row>
                    <v-row> </v-row>
                  </template>
                </v-data-table>

                <!-------------------- user allocation modal ------------------>

             

                <v-dialog v-model="confirmation" max-width="400">
                  <v-card>
                    <v-card-title class="text-h5"> </v-card-title>

                    <v-card-text>
                      Are you sure you want to delete this record?
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>

                      <v-btn color="red" text @click="onClose()"> No </v-btn>

                      <v-btn color="green darken-1" text @click="deleteUser()">
                        Yes
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
            </div>

            <div v-if="projectRole == 3 || projectRole == 4 ">
              <div>
                <v-data-table
                  :headers="headers"
                  :items="user_list"
                  :mobile-breakpoint="100"
                  :page.sync="pagination"
                  :group-desc="true"
                
                  :items-per-page.sync="limit"
                  :server-items-length="totalUsers"
                  class="custom_table_class"
                >
                  <template v-slot:[`item.profile_photo`]="{ item }">
                    <td>
                      <div v-if="item.user.profile_photo !== null">
                        <img
                          width="30"
                          height="30"
                          class="rounded-circle responsive-img"
                          v-bind:src="item.user.profile_photo"
                          loading="lazy"
                          alt=""
                          title="Profile"
                        />
                      </div>

                      <div v-if="item.user.profile_photo == null">
                        <img
                          width="30"
                          height="30"
                          class="rounded-circle"
                          src="../../assets/Images/profilePicc.jpg"
                          alt=""
                          title="Profile"
                        />
                      </div>
                    </td>
                  </template>
                  <template v-slot:[`item.roles`]="{ item }"
                    ><td>{{ findRole(item.project_role_id) }}</td></template
                  >
                  <template v-slot:[`item.joined_date`]="{ item }"
                    ><p class="JoinedDate">{{ item.joined_on }}</p>
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                    <v-row v-if="projectRole == 4 || projectRole == 3">
                      <v-col>
                        <v-icon
                          class="mr-5"
                          title="Remove User"
                          color="red"
                          v-show="item.main_role != 1"
                          @click="openModal(item.user_id)"
                          >mdi-account-minus</v-icon
                        >

                        <v-icon
                          class="mr-5"
                          title="Edit Allocation"
                          color="primary"
                          v-show="item.main_role != 1"
                          @click="openDialog(item)"
                          >mdi-pencil</v-icon
                        >
                      </v-col>
                    </v-row>
                  </template>
                </v-data-table>

                <!-------------------- user allocation modal ------------------>

                <v-dialog
                  v-model="UserAllocationModal"
                  persistent
                  max-width="710"
                >
                  <v-card v-if="UserAllocationModal">
                    <div id="title" style="background-color: #4fa5d6">
                      <v-card-title>
                        <span class="text-h5" style="color: aliceblue"
                          >Allocate User</span
                        >
                        <v-spacer></v-spacer>

                        <v-btn icon @click="CloseUserAllocationModal()" dark>
                          <v-icon> mdi-close </v-icon>
                        </v-btn>
                      </v-card-title>
                    </div>
                    <br />
                    <v-card-text>
                      <v-container>
                        <v-form ref="form" v-model="isValid" lazy-validation>
                          <v-row>
                            <v-col>
                              <v-row >
                                <v-col cols="12" sm="2" md="2" xs="6">
                                  <label class="label" for="project"
                                    >Name<span id="imp">*</span>
                                  </label>
                                </v-col>
                                <v-col cols="12" sm="10" md="10" xs="12">
                                  <v-autocomplete
                                    v-on:change="keyCheck()"
                                    :items="options"
                                    outlined
                                    attach
                                    auto-select-first
                                    chips
                                    clearable
                                    deletable-chips
                                    small-chips
                                    @input="searchInput = null"
                                    :search-input.sync="searchInput"
                                    multiple
                                    :rules="nameRules"
                                    v-model="users.users"
                                    placeholder="Name"
                                  ></v-autocomplete>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col  cols="12" sm="2" md="2" xs="12">
                                  <label class="label" for="startdate"
                                    >Start Date<span id="imp">*</span>
                                  </label>
                                </v-col>
                                <v-col  cols="12" sm="10" md="10" xs="12">
                                  <v-menu
                                    v-model="menu2"
                                    min-width="auto"
                                    :close-on-content-click="false"
                        
                                  
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-text-field
                                        v-model="users.from_date"
                                        :rules="projectDateRule"
                                        placeholder="Start Date"
                                        icon="mdi-calendar"
                                        readonly
                                        outlined
                                        v-bind="attrs"
                                        v-on="on"
                                      ></v-text-field>
                                    </template>
                                    <v-date-picker
                                      v-model="users.from_date"
                                      :min="minDate"
                                      v-on:change="keyCheck()"
                                      :max="maxDate"
                                      @input="(menu2 = false), (value = 2)"
                                      
                                    ></v-date-picker>
                                  </v-menu>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col  cols="12" sm="2" md="2" xs="12">
                                  <label class="label" for="startdate"
                                    >End Date<span id="imp">*</span>
                                  </label>
                                </v-col>
                                <v-col  cols="12" sm="10" md="10" xs="12">
                                  <v-menu
                                    v-model="menu1"
                                    min-width="auto"
                                    :close-on-content-click="false"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-text-field
                                        v-model="users.to_date"
                                        placeholder="Start Date"
                                        icon="mdi-calendar"
                                        :rules="projectDateRule"
                                        readonly
                                        outlined
                                        v-bind="attrs"
                                        v-on="on"
                                      ></v-text-field>
                                    </template>
                                    <v-date-picker
                                      v-on:change="keyCheck()"
                                      v-model="users.to_date"
                                      :min="users.from_date"
                                      :max="maxDate"
                                      @input="(menu1 = false), (value = 2)"
                                    ></v-date-picker>
                                  </v-menu>
                                </v-col>
                              </v-row>

                              <v-row>
                                <v-col  cols="12" sm="2" md="2" xs="4">
                                  <label class="label" for="Role"
                                    >Role<span id="imp">*</span>
                                  </label>
                                </v-col>
                                <v-col sm="10" md="10" xs="8">
                                  <v-autocomplete
                                    attach
                                    :rules="RoleRule"
                                    :items="ProjectRoleLists"
                                    outlined
                                    v-model="users.role"
                                    v-on:change="keyCheck()"
                                    placeholder="Role"
                                  ></v-autocomplete>
                                </v-col>
                              </v-row>

                              <v-card-actions class="justify-center">
                              </v-card-actions>
                            </v-col>
                          </v-row>
                        </v-form>
                      </v-container>
                    </v-card-text>
                    <v-card-actions class="justify-center">
                      <v-btn
                      class="cmnbtnstyle"
                  color="#4fa5d6" 
                      
                        :disabled="isallocateForm"
                        @click="AddAssignee"
                        id="btnshadow"
                      >
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <!-- delete modal -->

                <v-dialog v-model="confirmation" max-width="400">
                  <v-card>
                    <v-card-title class="text-h5"> </v-card-title>

                    <v-card-text>
                      Are you sure you want to unallocate this user from
                      project?
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>

                      <v-btn color="red" text @click="onClose()"> No </v-btn>

                      <v-btn color="green darken-1" text @click="deleteUser()">
                        Yes
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <!--------------------------------Edit Allocated User--------------------------------------->
                <v-dialog v-model="dialog" max-width="700" max-height="500">
                  <v-card>
                    <v-toolbar color="#4fa5d6" title="Opening from the top"
                      ><v-toolbar-title style="color: white"
                        >Edit Allocated User</v-toolbar-title
                      ><v-spacer></v-spacer>

                      <v-btn icon @click="closeDialog()" dark>
                        <v-icon title="close"> mdi-close </v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-card-text>
                      <div class="cardText">
                        <v-row class="rowBy">
                          <v-col cols="12"   md="2" sm="2" xs="6">
                            <label class="label" for="Role"
                              >Role<span id="imp">*</span>
                            </label>
                          </v-col>
                          <v-col cols="12"  md="8" sm="8" xs="12">
                            <v-autocomplete
                              label="Role"
                              :items="ProjectRoleLists"
                              @input="check()"
                              v-model="valueData.role"
                              outlined
                            ></v-autocomplete>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col  cols="12" md="2" sm="2" xs="6">
                            <label class="label" for="Role"
                              >End Date<span id="imp">*</span>
                            </label>
                          </v-col>
                          <v-col cols="12"  md="8" sm="8" xs="12">
                            <v-menu
                              ref="menu1"
                              v-model="menu1"
                              :close-on-content-click="false"
                              :v-bind="dataProject.start_date"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="valueData.end_date"
                                  @input="check()"
                                  :rules="enddateRules"
                                  :error="enddateError"
                                  outlined
                                  prepend-inner-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="valueData.end_date"
                                no-title
                                scrollable
                                @input="(menu1 = false), check()"
                                :min="new Date().toISOString().substr(0, 10)"
                                :max="ProjectData.end_date"
                              ></v-date-picker
                            ></v-menu>
                          </v-col>
                        </v-row>
                      </div>
                    </v-card-text>
                    <v-card-actions class="justify-center">
                      <v-btn
                        style="background-color: #4fa5d6; color: #ffffff"
                        variant="text"
                        @click="editRole()"
                        :disabled="!editbutton"
                        id="btnshadow"
                        >Save</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <!------------------------------------------------------------------------------------------>
              </div>
            </div>
          </div>
          </div>
        </psSidebar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApiService from "../../service/apiservice.js";
import psSidebar from "./psSidebar.vue";
import sideNavigation from "../AdminPage/Notification/sideBarr.vue";
import topNavigation from "./adminTopNav.vue";
import Vue from "vue";
import loader from "../AdminPage/Loader/loaderView.vue"
import "vue-toast-notification/dist/theme-sugar.css";
import VueToast from "vue-toast-notification";

Vue.use(VueToast);

let moment = require("moment");
export default {
  components: { sideNavigation, topNavigation, psSidebar,loader },

  data() {
    return {
      AddValue:false,
      editbutton: false,
      searchInput: null,
      confirmation: false,
      type: [
        { value: "1", text: "Admin" },
        { value: "2", text: "Member" },
        { value: "3", text: "Guest" },
      ],
      role: null,
      menu2: false,
      menu1: false,
      limitData:"",
      footerHide:false,
      moment: moment,
      allocateData: [],
      allocatedUser: "",
      pagination: 1,
      limit:10,
      totalUsers:"",
      unAllocatedUser: "",
      EditAllocationModal: false,
      dialog: false,
      RoleList: [],
      DataCheck: [],
      UserAllocationModal: false,
      loaderValue: false,
      valueData: {
        user_id: null,
        role: null,
        end_date: null,
      },
      users: {
        from_date: "",
        to_date: "",
        users: [],
        role: null,
      },

      searchKey: "",
      isallocateForm: false,
      status: "",
      isValid: false,
      dataProject: {
        end_date: "",
      },

      ProjectData: [],
      valid: true,
      nameRules: [(v) => v.length > 0 || "Names required"],
      projectDateRule: [(v) => !!v || "Date is required"],
      RoleRule: [(v) => !!v || "Role is required"],
      headersNew: [
        { text: "", sortable: false, value: "profile_photo", class: "info" },
        { text: "NAME", sortable: false, value: "user_name", class: "info" },
        {
          text: "ROLE",
          value: "roles",
          sortable: false,
          class: "info",
        },
        {
          text: "JOINED ON",
          value: "joined_date",
          sortable: false,
          class: "info",
        },

        {
          text: "ACTION",
          value: "action",
          sortable: false,
          class: "info",
          align: " d-none",
        },
      ],
      headers: [
        { text: "", sortable: false, value: "profile_photo" },
        { text: "NAME", sortable: false, value: "user_name", width: "40%" },
        {
          text: "ROLE",
          value: "roles",
          sortable: false,
        },
        {
          text: "JOINED ON",
          value: "joined_date",
          sortable: false,
        },

        { text: "ACTION", value: "action", sortable: false, width: "20%" },
      ],
      ProjectRoleList: [],
      UserList: [],
      projectRole: "",

      user_list: [],
      uprofile: [],

      U_role: [
        { value: 3, text: "Project Admin" },
        { value: 4, text: "Project Manager" },
        { value: 5, text: "Developer" },
        { value: 6, text: "Reporter" },
        { value: 7, text: "Guest" },
      ],
    };
  },
  methods: {
    issueserach() {
      this.searchKey = "";
      this.searchUser();
      

    },
    async getUsers() {
      this.loaderValue=false;
      const id = this.projectId;
      const response = await ApiService(
        "project/overallProjectStatus/" + id,
        "GET"
      );
      this.loaderValue=true;
      this.projectData = response;
      this.dataProject = this.projectData;
    },
    async getProjectDetails() {
      try {
        this.loaderValue=false;
        const id = this.projectId;
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
        this.users.from_date = response.start_date;
        this.users.to_date = response.end_date;
        this.minDate = response.start_date;
        this.maxDate = response.end_date;
        this.ProjectData = response;
      } catch (error) {
        console.log(error);
      }
    },
    async getUser() {
      try {
        const id = this.projectId;

        const response = await ApiService(
          "/project/getUnallocatedUsers/" + id,
          "GET"
        );
        this.UserList = response;
      } catch (error) {
        console.log(error, "error................");
        this.isFetching = false;
      }
    },
    bulkusersModal() {
      this.getUser();
      this.getProjectRole();
      this.getProjectDetails();
      this.UserAllocationModal = true;
    },

    async searchUser() {
      this.footerHide=false;
      try {
        const id = this.projectId;
        if (this.searchKey == "" || this.searchKey == null) {
         
          this.limitData=this.limit
        if(this.limit==-1){
          this.limitData=""
        }
          const params = {
            page:this.pagination,
            limit:this.limitData
          };
          
            const data = {
            roleFilter: this.role,
          };
          const response = await ApiService(
            "/project/Usersprojects/" + id,
            "POST",
            data,
            null,
            params
          );
          this.totalUsers=response.total;
        
          this.user_list = response?.listView;
          
          if(this.user_list.length==0){
            this.footerHide=true;
          }
         
        } else {
        
          this.limitData=this.limit
        if(this.limit==-1){
          this.limitData=""
        }
          const params = { searchKey: this.searchKey,
            page:this.pagination,
            limit:this.limitData
          };
          const data = {
            roleFilter: this.role,
          };
          const response = await ApiService(
            "/project/Usersprojects/" + id,
            "POST",
            data,
            null,
            params
          );

          this.user_list = response?.listView;
          if(this.user_list.length==0){
            this.footerHide=true;
          }
          this.totalUsers=response.total;
        
          
        }
      } catch (error) {
        console.log(error);
      }
    },

   
    async AddAssignee() {
      if (this.$refs.form.validate()) {
         this.allocate()
      }
     
    },
 async allocate(){
  this.AddValue=true
      this.isallocateForm = true;
      
      const id = this.projectId;
      try {
        const response = await ApiService(
          "project/allocateUser/" + id,
          "POST",
          this.users
        );

        let allocated = 0;
        let failedAllocation = 0;
        for (const element of response) {
          if (element.code == 2) {
            this.success = 1;
            if (allocated < 1) {
              this.allocatedUser = this.allocatedUser + " " + element.user_name;
            } else {
              this.allocatedUser =
                this.allocatedUser + " , " + element.user_name;
            }
            allocated = allocated + 1;
          }
          if (element.code == 1) {
            this.Error = 1;
            if (failedAllocation < 1) {
              this.unAllocatedUser =
                this.unAllocatedUser + " " + element.user_name;
            } else {
              this.unAllocatedUser =
                this.unAllocatedUser + " , " + element.user_name;
            }
            failedAllocation = failedAllocation + 1;
          }
        }

        this.AlloctaionSuccessMsg(this.Error, this.success);
      } catch (error) {
        const response = error.response.data;
        this.AllocateMsg(response);
      }
 },
    AlloctaionSuccessMsg(Error, success) {
      this.AddValue=false;
      if (success == 1) {
        Vue.$toast.success(this.allocatedUser + "  allocated Successfully", {
          position: "top",
        });
      }
      if (Error == 1) {
        Vue.$toast.warning(this.unAllocatedUser + "  already allocated", {
          position: "top",
        });
      }
      this.Error = 0;
      this.success = 0;
      this.isallocateForm = false;
      this.$refs.form.reset();

      this.users.users = [];
      this.searchUser();
      this.UserAllocationModal = false;
    },
    AllocateMsg(response) {
      this.AddValue=false;

      if (response.statusCode == 75) {
        Vue.$toast.warning("End Date  must be greater than start date", {
          position: "top",
        });
      } else if (response.statusCode == 1012) {
        Vue.$toast.warning("Start date must be valid date", {
          position: "top",
        });
      } else if (response.statusCode == 1013) {
        Vue.$toast.warning("End date must be valid date", {
          position: "top",
        });
      }
    },
    //-------------------------------------------------user type convertion----------------------------------------------------------
    findUsertype(value) {
      if (value === 0) {
        return "Admin";
      }
      const role = this.type.find((data) => data?.value == value);
      return role?.text;
    },
    openModal(user_id) {
      this.uid = user_id;
      this.confirmation = true;
    },
    openDialog(item) {
      this.DataCheck = item;
      this.valueData.user_id = item.user_id;
      this.valueData.role = item.project_role_id;
      this.valueData.end_date = item.allocation_to_date;
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    async deleteUser() {
      const params = {
        project_id: this.projectId,
      };

      try {
        const response = await ApiService(
          "project/unallocated/" + this.uid,
          "DELETE",
          null,
          null,
          params
        );

        if (response.statusCode == 200) {
          Vue.$toast.success("User Unallocated Successfully", {
            position: "top",
          });
        }
        if (response.statusCode == 400) {
          Vue.$toast.error("Error", {
            position: "top",
          });
        }
        this.Re_confirmation = false;
        this.user_list = null;
      } catch (error) {
        console.log(error);
      }

      setTimeout(() =>    this.$router.go("/project-settings/members"), 500);
   
      this.confirmation = false;
    },
    onClose() {
      this.confirmation = false;
    },
    CloseUserAllocationModal() {
      this.menu1 = false;
      this.menu2 = false;
      this.$refs.form.reset();
      this.getProjectDetails();

      this.UserAllocationModal = false;
    },
    findRole(id) {
      if (id === 3) {
        return "Project Admin";
      } else if (id === 4) {
        return "Project Manager";
      } else if (id === 5) {
        return "Developer";
      } else if (id === 6) {
        return "Reporter";
      } else if (id === 7) {
        return "Guest";
      }
    },
    async getProjectRole() {
      try {
        const response = await ApiService("/users/projectrolelist", "GET");
        this.ProjectRoleList = response;
       
      } catch (error) {
        console.log(error, "error................");
      }
    },
    async editRole() {
     
      const id = this.projectId;
      try {
        const response = await ApiService(
          "project/editallocated/" + id,
          "POST",
          this.valueData
        );
        if (response.statusCode == 200) {
          Vue.$toast.success("Allocation edited Successfully", {
            position: "top",
          });
          this.dialog = false;
          this.searchUser();
        }

        this.roleList = response;
      } catch (error) {
        const response = error.response.data;
        if (response.statusCode == 1110) {
          this.editbutton = false;
          Vue.$toast.error("There is no change ", {
            position: "top",
          });
        } else if (response.statusCode == 3520) {
          this.editbutton = false;
          Vue.$toast.error(
            "End date must not be greater than project end date ",
            {
              position: "top",
            }
          );
        } else if (response.statusCode == 3674) {
          this.editbutton = false;
          Vue.$toast.error("user-id is must be number ", {
            position: "top",
          });
        } else if (response.statusCode == 3574) {
          this.editbutton = false;
          Vue.$toast.error(
            "End date must not be lesser than project start date ",
            {
              position: "top",
            }
          );
        } else if (response.statusCode == 49) {
          this.editbutton = false;
          Vue.$toast.error("End date must be a valid date ", {
            position: "top",
          });
        } else if (response.statusCode == 93) {
          this.editbutton = false;
          Vue.$toast.error("role must be number ", {
            position: "top",
          });
        }
      }
    },
    keyCheck() {
      if(!this.AddValue){
      this.isallocateForm = false;
      }
    },
    check() {
      this.editbutton = true;
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

  mounted() {
 
     localStorage.removeItem("search")
  
    this.projectId= this.$store.state.projectId;
    if(this.projectId==='null'){
      this.$router.push("/dashboard" );
    }
localStorage.setItem("projectId",this.projectId)
    this.searchUser();
    this.getProjectDetails();
    this.getProjectRole();
  
 
    this.ToggleOnOff(localStorage.getItem("is_expanded") === "true");
    setTimeout(() => {
      this.projectRole = localStorage.getItem("projectRole");
     
    }, 500);
  },

  watch: {
    select() {
      this.search = "";
    },
    pagination: {
      handler() {
        this.searchUser();
      },
      immediate: false,
    },
    limit: {
      handler() {
        this.searchUser();
      },
      immediate: false,

    },
  },
  computed: {
    options() {
      let opts = [];
      for (let i = 0; i <= this.UserList.length - 1; i++) {
        opts.push({
          text: this.UserList[i].user_name,
          value: this.UserList[i].user_id,
        });
      }
      return opts;
    },
    ProjectRoleLists() {
      let opts = [];
      for (let i = 0; i <= this.ProjectRoleList?.length - 1; i++) {
        if (this.ProjectRoleList[i]?.role_id >= this.projectRole) {
          opts.push({
            text: this.ProjectRoleList[i]?.role_name,
            value: this.ProjectRoleList[i]?.role_id,
          });
        }
      }

      return opts;
    },
  },
};
</script>

<style scoped>
#imp {
  color: red;
}
.v-text-field {
  height: 20%;
}
.label {
  font-size: medium;
}
.frame {
  display: -webkit-inline-box;
  height: 100%;
  width: 100%;
}
.title {
  padding: 15px 0px 15px 0;
  margin: 0 !important;
  position: relative;
  min-height: 65px;
  padding-top: 16px;
}
.table {
  width: 78%;
  height: 100%;
  padding: 43px;
  margin-left: -75%;
  margin-top: 4%;
}
.app-main {
  width: 100%;
}
.sec {
  width: 100% !important;
}


.searchDiv {
  margin-left: 60%;
  margin-top: 2%;
  max-height: 10%;
  width: 34%;
}
.rowBy {
  margin-top: 2%;
}

.search {
  margin-left: -3%;
}
.JoinedDate {
  margin-top: revert;
}
.v-sheet.v-card:not(.v-sheet--outlined) {
  box-shadow: none;
}
.names{
  font-size: 14px;
    white-space: nowrap;
    width: 700px; 
                      overflow: hidden;
                      text-overflow: ellipsis !important;
                      margin-top: 3px;
 
    margin-left: 25px;
  }
.row.no-gutters {
    margin: 0;
    margin-left: -50% ;
    margin-top: 5%;
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
                      margin-top: 7px;
    margin-left: -28px;
  }
}
.searching{
  display: flex;
  flex-direction: row;
  justify-content: end;
  gap:5px;
}

.fixed-sidebar .app-main .app-main__outer {
  z-index: 9;
 
  padding-left: 0px;
}
#HeaderTask {
  min-height: 47px !important;
}
.Toptitle{
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
  background-color: #fff !important;

}


@media screen and (max-width:920px){
  .table{
    width:100%;
    height: 100%;
    padding: 56px;
    margin-top: 8%;
    margin-left: -82%;
}
.addbtns{
  margin-top: -32px;
    margin-left: 700px;
}

.row.no-gutters {
    margin: 0;
    margin-left: -120%  ;
    margin-top: 5%;
}

}
@media screen and (max-width:820px){
  .table{
    width:100%;
    height: 100%;
    padding: 56px;
    margin-top: 8%;
    margin-left: -82%;
}
.addbtns{
  margin-top: -32px;
    margin-left: 700px;
}

.row.no-gutters {
    margin: 0;
    margin-left: 21%  ;
    margin-top: 5%;
}
.searchDiv {
    margin-left: 10%;
    margin-top: 2%;
    max-height: 10%;
    width: 85%;
}
.names{
  font-size: 14px;
    white-space: nowrap;
    width: 700px; 
                      overflow: hidden;
                      text-overflow: ellipsis !important;
                   
    margin-top: 8px;
    margin-left: -29px;

  }

}

@media screen and (max-width:770px){

.table{
    width:100%;
    height: 100%;
    padding: 56px;
    margin-top: 8%;
    margin-left: -64%;
}
.addbtns{
  margin-top: -32px;
    margin-left: 552px;
}

.row.no-gutters {
    margin: 0;
    margin-left: 18% ;
    margin-top: 5%;
}

.searching{
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: end;
  gap:5px;
}
.searchDiv {
  margin-left: 0%;
  margin-top: 2%;
  max-height: 10%;
  width:100%;
  display: inline;
}


.names{
  font-size: 14px;
    white-space: nowrap;
    width: 400px; 
                      overflow: hidden;
                      text-overflow: ellipsis !important;
                   
    margin-top: 8px;
    margin-left: -7px;

  }

}
@media screen and (max-width:550px){

  .row.no-gutters {
    margin: 0;
    margin-left: 6% ;
    margin-top: 5%;
}
.table {
    width: 100%;
    height: 100%;
    padding: 4px;
    margin-top: 20%;
    margin-left: -100%;
}
.addbtns{
  margin-top: -32px;
    margin-left: 285px;
}
.names{
  font-size: 14px;
    white-space: nowrap;
    width: 200px; 
                      overflow: hidden;
                      text-overflow: ellipsis !important;
                   
    margin-top: 8px;
    margin-left: -7px;

  }


}


@media screen and (max-width: 280px)
{
.table {
    width: 100%;
    height: 100%;
    padding: 7px;
    margin-top: 25% !important;
    margin-left: -100%;
}


  .names{
  font-size: 14px;
    white-space: nowrap;
    width: 200px; 
                      overflow: hidden;
                      text-overflow: ellipsis !important;
                      margin-top: 8px;
    margin-left: -2px;
  }
}

</style>
