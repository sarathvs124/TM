<template>
  <div class="app-container app-theme-white body-tabs-shadow fixed-sidebar fixed-header">
    <!-- top nav -->
    <topNavigation />

    <div class="app-main">
      <div class="app-main__inner">
        <div class="app-page-title">
          <div class="page-title-heading heading2">
            <div class="mainDiv">
            
                         <router-link
                to="/dashboard"
                
    
              >
                <v-img   src="../../assets/Images/logo.png"  width="60" ></v-img
              ></router-link>
          
                <div class="companyName" >Innovature Technologies K.K</div>
              
            </div>
            
              
              <!--------------------------------------Search--------------------------------------------------------------------->
             
         
    
            <!---------------------------------------bulk users assignee to project------------------------------------------------------------------------------>
            <div class="addbtns">
             
                <div class="serachBar">
              
                   
                      <v-text-field
                        
                        v-model="searchKey"
                        dense
                        filled
                        solo
                        rounded
                        clearable
                      
                        placeholder="Search Name "
                        prepend-inner-icon="mdi-magnify"
                        class="pt-6 shrink "
                      ></v-text-field>
               
            
                </div>
                <div class="addassignebtn">
            
              <div class="mr-4" v-if="users.users.length != 0">
                <v-btn
                id="Plusicon"
                  rounded
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                  @click="bulkusersModal()"
                  title="Allocate Users"
                >
                  <v-icon left> mdi-account-multiple-plus-outline </v-icon>
                </v-btn>
              </div>

              <!-----------------------Add new user--------------------------------------------------------------->

              <v-dialog v-model="dialog" persistent max-width="700">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                  id="mediaRequire"
                    rounded
                    color="success"
                    v-bind="attrs"
                    v-on="on"
                    title="Add user"
                    style="margin-top: 12%;"
                  >
                    <v-icon> mdi-plus </v-icon>
                  </v-btn>
                </template>

                <v-card v-if="dialog">
                  <div id="title">
                    <v-card-title>
                      <span class="text-h5">Add User</span>
                      <v-spacer></v-spacer>

                      <v-btn icon @click="dialog = false" dark>
                        <v-icon> mdi-close </v-icon>
                      </v-btn>
                    </v-card-title>
                  </div>
                  <br />
                  <v-card-text>
                    <v-container>
                      <v-form
                        ref="form"
                        v-model="valid"
                        lazy-validation
                        autocomplete="off"
                      >
                        <v-row>
                          <v-col cols="12">
                            <v-row>
                              <v-col cols="12"  lg="4" md="2" sm="2" xs="12">
                                <label class="label" for="name"
                                  >Name <span id="imp">*</span>
                                </label>
                              </v-col>
                              <v-col cols="12" lg="8" sm="8" md="8" xs="12">
                                <v-text-field
                                  outlined
                                  type="text"
                                  id="name"
                                  :rules="nameRules"
                                  height="20"
                                  v-model="data.user_name"
                                  placeholder="Name"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12"  lg="4" md="2" sm="2" xs="12">
                                <label class="label" for="name"
                                  >Email<span id="imp">*</span>
                                </label>
                              </v-col>
                              <v-col cols="12" lg="8" sm="8" md="8" xs="12">
                                <v-text-field
                                  height="20px"
                                  v-on:keyup="check()"
                                  outlined
                                  type="text"
                                  id="email"
                                  :rules="emailRules"
                                  v-model="data.email"
                                  placeholder="Email"
                                ></v-text-field>
                              </v-col>
                            </v-row>

                            <v-row>
                              <v-col cols="12"  lg="4" md="2" sm="2" xs="12">
                                <label class="label" for="Role"
                                  >Role<span id="imp">*</span>
                                </label>
                              </v-col>
                              <v-col cols="12" lg="8" sm="8" md="8" xs="12">
                                <v-select
                                  :rules="rolerule"
                                  :items="roleLists"
                                  @keyup.tab="submitEmail"
                                  outlined
                                  v-model="data.role"
                                  placeholder="Role"
                                ></v-select>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                        <v-card-actions class="justify-center">
                          <v-btn
                          color="#4fa5d6" 
                            @click="submit"
                            class="cmnbtnstyle"
                            :disabled="!valid"
                            id="btnshadow"
                          >
                            Save
                          </v-btn>
                        </v-card-actions>
                      </v-form>
                    </v-container>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </div>
          </div>
          </div>
        </div>

        <template>
          <!-------------------------------View Users---------------------------------------------->
          <div class="datatable">
            <div v-if="user_list.users == 0">
                            <v-data-table
                              :mobile-breakpoint="100"
                              :headers="headers"
                              :items="user_list.users"
                              hide-default-footer
                              class="elevation-1"
                             
                            ></v-data-table>
                          </div>
                       
            <template v-if="!this.isFetching && user_list.users != 0">
              <v-data-table
              :mobile-breakpoint="100"
                :headers="headers"
                :items="user_list.users"
                class="elevation-1"
                :group-desc="true"
              >
                <template v-slot:[`item.users.users`]="{ item }">
                  <input
                    v-if="item.role.role_id != 1"
                    type="checkbox"
                    v-model="users.users"
                    :value="item.user_id"
                    number
                  />
                </template>
                <template v-slot:[`item.slNo`]="{ item }"
                  ><td>{{ user_list.users.indexOf(item) + 1 }}</td></template
                >
                <template v-slot:[`item.role`]="{ item }"
                  ><td>{{ findUsertype(item.role) }}</td></template
                >
                <template v-slot:[`item.active_projects`]="{ item }">
                  <td
                    v-if="item.active_projects !== null && item.active_projects > 0"
                    color="green"
                  >
                    <v-icon
                      v-bind="attrs"
                      v-on="on"
                      color="blue"
                      size="large"
                      @click="OpenUserInfo(item.user_id)"
                      >mdi-information-outline</v-icon
                    >Allocated
                  </td>
                  <td
                    v-if="item.active_projects === null || item.active_projects === 0"
                    color="green"
                  >
                    Free
                  </td></template
                >

                <!------------------------------------------------Delete dialogue Box------------------------------------------------------------>

                <template v-slot:[`item.action`]="{ item }">
                  <v-row>
                    <div v-if="users.users.length == 0" style="display: flex">
                      <template>
                        <v-icon
                          class="mr-3"
                          color="blue"
                          @click="editmodal(item)"
                          title="Edit"
                          >mdi-pencil</v-icon
                        >
                      </template>

                      <template>
                        <v-icon
                       v-show="item.user_id!=userId"
                          class="mr-3"
                          color="red"
                          @click="openModal(item.user_id)"
                          title="Delete"
                          >mdi-delete</v-icon
                        >
                      </template>

                      <template v-if="item.role.role_id != 1">
                        <v-icon
                          class="mr-3"
                          color="blue"
                          title="Allocate User"
                          @click="openUserAllocationModal(item.user_id)"
                          >mdi-account-plus-outline</v-icon
                        >
                      </template>
                    </div>
                  </v-row>
                  <v-row> </v-row>
                </template>

                <!---------------------------------------------------Pagination----------------------------------------------------------------------------->
              </v-data-table>
            </template>
          </div>
        </template>
      </div>
    </div>

    <v-dialog v-model="confirmation" max-width="400">
      <v-card>
        <v-card-title class="text-h5"> </v-card-title>

        <v-card-text> Are you sure you want to delete this record? </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red" text @click="onClose()"> No </v-btn>

          <v-btn color="green darken-1" text @click="dlt()"> Yes </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--------Delete  Re confirmation modal------------------ -->

    <v-dialog v-model="Re_confirmation" max-width="30%">
      <v-card>
        <v-card-title class="text-h5"> </v-card-title>

        <v-card-text>
          This user is already assigned in a project. Do you want to delete?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red" text @click="onClose()"> No </v-btn>

          <v-btn color="green darken-1" text @click="ReConfirmDelete()"> Yes </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-------------------- user allocation modal ------------------>
<div class="allocation">
    <v-dialog v-model="UserAllocationModal" persistent max-width="700">
      <v-card v-if="UserAllocationModal">
        <div id="title">
          <v-card-title>
            <span class="text-h5" style="color: aliceblue">Allocate User</span>
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
                  <v-row>
                    <v-col cols="12"  lg="4" md="2" sm="2" xs="12">
                      <label class="label" for="project"
                        >Project<span id="imp">*</span>
                      </label>
                    </v-col>
                    <v-col cols="12" lg="8" sm="8" md="8" xs="12">
                      <v-autocomplete
                        :rules="projectRule"
                        :items="options"
                        outlined
                        attach
                        @change="ProjectDetails($event)"
                        v-model="project.project_id"
                        v-on:change="keyCheck()"
                        placeholder="Project Name"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12"  lg="4" md="2" sm="2" xs="12">
                      <label class="label" for="startdate"
                        >Start Date<span id="imp">*</span>
                      </label>
                    </v-col>
                    <v-col cols="12" lg="8" sm="8" md="8" xs="12">
                      <v-menu
                        v-model="menu2"
                        min-width="auto"
                        :close-on-content-click="false"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                          
                            v-model="users.from_date"
                            placeholder="Start Date"
                            icon="mdi-calendar"
                            readonly
                            outlined
                            :rules="projectDateRule"
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                        
                          v-model="users.from_date"
                          :min="minDate"
                          :max="maxDate"
                          v-on:change="keyCheck()"
                          @input="(menu2 = false), (value = 2)"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12"  lg="4" md="2" sm="2" xs="12">
                      <label class="label" for="enddate"
                        >End Date<span id="imp">*</span>
                      </label>
                    </v-col>
                    <v-col cols="12" lg="8" sm="8" md="8" xs="12">
                      <v-menu
                        min-width="auto"
                        v-model="menu1"
                        :close-on-content-click="false"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="users.to_date"
                            placeholder="End Date"
                            icon="mdi-calendar"
                            readonly
                            outlined
                            :rules="projectDateRule"
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="users.to_date"
                          :min="users.from_date"
                          :max="maxDate"
                          @input="menu1 = false"
                          v-on:change="keyCheck()"
                          :allowed-dates="allowedDates"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12"  lg="4" md="2" sm="2" xs="12">
                      <label class="label" for="Role">Role<span id="imp">*</span> </label>
                    </v-col>
                    <v-col cols="12" lg="8" sm="8" md="8" xs="12">
                      <v-autocomplete
                        :rules="rolerule"
                        :items="ProjectRoleLists"
                        @keyup.tab="submitEmail"
                        outlined
                        attach
    
                        v-model="users.role"
                        v-on:change="keyCheck()"
                        placeholder="Role"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-card-actions class="justify-center"> </v-card-actions>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn
            :disabled="this.isallocateForm"
            color="#4fa5d6" 
            class="cmnbtnstyle"
            id="btnshadow"
            
       
            @click="AddAssignee"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

    <!-----------------------------------------------Edit user----------------------------------------------------------------->
    <v-dialog v-model="editDialog" persistent max-width="700">
      <v-card v-if="editDialog">
        <div id="title">
          <v-card-title>
            <span class="text-h5">Edit User</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="closeDialog" dark>
              <v-icon> mdi-close </v-icon>
            </v-btn>
          </v-card-title>
        </div>
        <br />
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid" lazy-validation autocomplete="off" class="editform">
              <v-row>
                <v-col>
                  <v-row>
                    <v-col cols="12"  lg="4" md="2" sm="2" xs="12">
                      <label class="label" for="name"
                        >Name <span id="imp">*</span>
                      </label>
                    </v-col>
                    <v-col cols="12" lg="8" sm="8" md="8" xs="12">
                      <v-text-field
                        outlined
                        type="text"
                        id="name"
                        :rules="nameRules"
                        height="20"
                        v-model="userdata.user_name"
                        placeholder="Name"
                        v-on:keyup="ButoonCheck()"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12"  lg="4" md="2" sm="2" xs="12">
                      <label class="label" for="name"
                        >Email<span id="imp">*</span>
                      </label>
                    </v-col>
                    <v-col  cols="12" lg="8" sm="8" md="8" xs="12">
                      <v-text-field
                        height="20px"
                        outlined
                        type="text"
                        id="email"
                        @keyup.tab="submitEmail"
                        :rules="emailRules"
                        v-model="userdata.email"
                        placeholder="Email"
                        v-on:keyup="ButoonCheck()"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12"  lg="4" md="2" sm="2" xs="12">
                      <label class="label" for="Role">Role<span id="imp">*</span> </label>
                    </v-col>
                    <v-col  cols="12" lg="8" sm="8" md="8" xs="12">
                      <v-select
                        :rules="typesRules"
                        :items="roleLists"
                        outlined
                        v-model="userdata.role"
                        placeholder="Role"
                        v-on:change="ButoonCheck()"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions class="justify-center">
          <v-btn
            v-if="buttonValue == true"
            color="#4fa5d6" 
            @click="editUser"
            class="cmnbtnstyle"
            :disabled="!btnvalid"
            id="btnshadow"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- user information modal -->

    <v-row justify="center">
      <v-dialog persistent v-model="userInfoModal" width="700px">
        <v-card>
          <v-toolbar flat color="#4FA5D6">
            <v-toolbar-title style="color: white">Allocation Details </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn icon @click="userInfoModal = false" dark>
              <v-icon> mdi-close </v-icon>
            </v-btn>
          </v-toolbar>
          <v-spacer></v-spacer>
          <v-card-text>
            <v-list three-line subheader>
              <br /><br />

              <p class="font-black text-h6">Allocated Project Details</p>
            </v-list>
            <!-- box project details-->
            <div class="card cardMsg mb-3 widget-content">
              <div class="table-responsive" style="overflow-x:scroll" > 
                <v-simple-table aria-describedby=""
                  class="align-middle mb-0 table table-borderless table-striped table-hover"
                >
                  <thead>
                    <tr>
                      <th id="" style="width: 20%;">Project Code</th>
                      <th id="" style="width: 20%;">Project Name</th>
                      <th id="" style="width: 20%;">Role</th>

                      <th id="" style="width: 20%;">Start Date</th>
                      <th id="" style="width: 20%;">End Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in UserAllocationInfo" :key="item.user_id">
                      <td class="text-center text-muted">
                        <p>{{ item.project_code }}</p>
                      </td>
                      <td class="trext-center text-muted ">
                        <a :title="item.project_name">
                        <p class="ProjectCol">{{ item.project_name }}</p> </a>
                      </td>
                      <td class="text-center text-muted">
                        <p>{{ item.role }}</p>
                      </td>
                      <td class="text-center text muted">
                        <p>{{ item.from_date }}</p>
                      </td>
                      <td class="text-center text muted">
                        <p>{{ item.to_date }}</p>
                      </td>
                    </tr>

                    <tr></tr>
                  </tbody>
                </v-simple-table>
              </div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="green darken-1" text @click="userInfoModal = false"> Ok </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import topNavigation from "./TopNav2.vue";

import ApiService from "../../service/apiservice.js";
import Vue from "vue";
import "vue-toast-notification/dist/theme-sugar.css";
import VueToast from "vue-toast-notification";
Vue.use(VueToast);

export default {
  components: { topNavigation },

  data() {
    return {
      userInfoModal: false,
      to_date: "",
      isFormValid: false,

      from_date: "",
      type: [
        { value: "2", text: "Manager" },
        { value: "3", text: "Guest" },
      ],

      id: localStorage.getItem("id"),

      role: "",
      dialog: false,
      isValid: false,
      buttonValue: true,
      valid: true,
      btnvalid: true,
      menu2: false,
      menu1: false,
      AddValue:false,
      confirmation: false,
      Re_confirmation: false,
      isSubmit: false,
      isallocateForm: false,
      editDialog: false,

      isFetching: false,
      UserAllocationInfo: [],
      UserAllocationModal: false,
      ProjectList: [],
  
      users: {
        from_date: "",
        to_date: "",
        users: [],
        role: "",
      },

      project: {
        project_id: "",
      },

      pagination: {
        pageCount: "",
        pageNumberCount: 1,

        page: null,
        limit: null,
      },
      i: 0,
      localRole: "",
      ProjectRoleList: [],
      RoleList: [],
      success: 0,
      userId:"",
      total: "",
      Error: 0,
      searchResult: "",
      searchKey: "",
      allocatedUser: "",
      unAllocatedUser: "",

      //edit
      userdata: {
        user_name: "",
        email: "",
        role: "",
        user_id: "",
      },
      headers: [
        {
          text: "",
          value: "users.users",
          sortable: false,
          align: "start",
          width: "2%",
        },
        {
          text: "ID",
          color: "red",

          value: "slNo",
          sortable: false,
          align: "start",
          width: "3%",
        },
        { text: "NAME", sortable: false, value: "user_name", width: "15%" },
        { text: "EMAIL", value: "email", sortable: false, width: "20%" },
        {
          text: "STATUS",
          value: "active_projects",
          sortable: false,
          width: "10%",
        },

        {
          text: "ROLE",
          value: "role.role_name",
          sortable: false,
          width: "10%",
        },

        { text: "Action", value: "action", sortable: false, width: "10%" },
      ],
      user_list: { users: [], loading: false },
      limit: [
        {
          type: "fromto",
          from: this.StartDate,
        },
      ],

      //view users
      data: {
        error: [],
        user_name: "",
        email: "",
        role: "",

        selected: "Select",
      },
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => !/^\s/.test(v) || "Enter a valid user name",
       
        (v)=>/^(?! )(?!\s)(?!.* {1} )[\s\S]*(?<!\s)(?! )$/.test(v)  || "Enter a valid user name",
        (v) =>
          (v && v.length >= 3 && v.length <= 30) ||
          "Name must be between 3-30 characters",
      ],
      projectRule: [(v) => !!v || "project is required"],
      projectDateRule: [(v) => !!v || "Date is required"],
      rolerule: [(v) => !!v || "Role is required"],
      emailRules: [
        (v) => !!v || "Email is required",
        (v) =>
          /^[a-zA-Z][a-zA-Z0-9.+_]+@[a-z]+(?:\.[a-z-]+)$/.test(v) ||
          "Email must be valid",

        (v) => (v && v.length >= 10 && v.length <= 55) || "Email must be less than 55",
      ],
    };
  },

  methods: {
    async ProjectDetails(id) {
      const response = await ApiService("project/overallProjectStatus/" + id, "GET");

      this.minDate = response.start_date;
      this.maxDate = response.end_date;
      this.users.from_date = response.start_date;
      this.users.to_date = response.end_date;
    },
   
    async getProjectsList() {
      try {
        const response = await ApiService("/project/getProject", "GET");
        this.ProjectList = response.listView;
      } catch (error) {
        console.log(error);
      }
    },
    async getRole() {
      try {
        const response = await ApiService("/users/rolelist", "GET");
        this.RoleList = response;
      } catch (error) {
        console.log(error);
      }
    },
    async getProjectRole() {
      try {
        const response = await ApiService("/users/projectrolelist", "GET");
        this.ProjectRoleList = response;
      } catch (error) {
        console.log(error);
      }
    },
    ButoonCheck() {
      this.btnvalid = true;
    },
    keyCheck() {
      if(!this.AddValue){
        this.isallocateForm = false;

      }
    },
    
    async AddAssignee() {
      if (this.$refs.form.validate()) {
         this.allocate()
      }
    },
    async allocate(){
      this.AddValue=true;
        this.isallocateForm = true;
        try {
          const response = await ApiService(
            "project/allocateUser/" + this.project.project_id,
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
                this.allocatedUser = this.allocatedUser + " , " + element.user_name;
              }
              allocated = allocated + 1;
            }
            if (element.code == 1) {
              this.Error = 1;
              if (failedAllocation < 1) {
                this.unAllocatedUser = this.unAllocatedUser + " " + element.user_name;
              } else {
                this.unAllocatedUser =
                  this.unAllocatedUser + " , " + element.user_name;
              }
              failedAllocation = failedAllocation + 1;
            }
          }

          this.allocateSuccesMessage(this.Error,this.success)
      
        } catch (error) {
          
          const response=error.response.data;
          this.allocateErrorMessage(response)
          
        }
      
    },
    allocateSuccesMessage(Error,success){
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

          if (success == 1 || Error == 1) {
            this.searchKey = "";

            this.Error = 0;
            this.success = 0;
            this.isallocateForm = false;
            this.confirmation = false;
            (this.allocatedUser = "");
            (this.unAllocatedUser = "");
            this.$refs.form.reset();

            this.$refs.form.reset();

            const params = {
              page: this.pagination.page,
              limit: this.pagination.limit,
              searchKey: this.data.searchKey,
              sortCol: "user_id",
              sortMethod: "desc",
            };

            this.getUser(params);
            this.UserAllocationModal = false;
            this.users.users = [];
          }
    },
    allocateErrorMessage(response){
      this.AddValue=false

      if (response.statusCode == 75) {
            Vue.$toast.warning("End Date  must be greater than start date", {
              position: "top",
            });
          }
          if (response.statusCode == 57) {
            Vue.$toast.warning("Empty field UserName", {
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
    //----------close modal ------//
    closeDialog() {
      this.editDialog = false;
     
    },

    // <!------------------------------------------get user-------------------------------------------------->
    async getUser(params) {
      console.log("haiiii");
      this.isFetching = true;
      try {
        const response = await ApiService("/users", "GET", null, null, params);
        if(typeof response=='object'){
          console.log(typeof response);
        this.total = response.total;
        this.user_list = { users: response?.data };
        this.isFetching = false;
      }
    else{
     
            this.$router.push('/dashboard')
    } 
  }
      catch (error) {
        this.isFetching = false;
      }
    },
    //-----------------------------------------------Serach User------------------------------------------------------------------------------------

    async searchUser() {
      if (this.searchKey == "" || this.searchKey == null) {
        const params = {};
        const response = await ApiService("/users", "GET", null, null, params);
        this.user_list = { users: response?.data, loading: false };
      } else {
        const params = { searchCol: "user_name", searchKey: this.searchKey };
      
        const response = await ApiService("/users", "GET", null, null, params);
    
        this.user_list = { users: response?.data, loading: false };
      }
    },
    async OpenUserInfo(uid) {
      this.userInfoModal = true;

      this.user_id = uid;
      try {
        const URL = `/users/getAllocatedProjects/${this.user_id}`;
        const response = await ApiService(URL, "GET");
        this.UserAllocationInfo = response.allocatedProject;
      } catch (error) {
        console.log(error);
      }
    },

    // <!-------------------------usertype covertion--------------------------------------->
    findUsertype(value) {
      if (value === 0) {
        return "Admin";
      }
      const role = this.type.find((data) => data?.value == value);
    
      return role?.text;
    },
    // --------------------add user button--------------------------------------------------------------
    async submit() {
      this.isSubmit = true;

      const params = {
        page: this.pagination.page,
        limit: this.pagination.limit,
        searchKey: this.data.searchKey,
        sortCol: "user_id",
        sortMethod: "desc",
      };
      if (this.$refs.form.validate()) {
        this.valid = false;
        try {
          const data = {
            user_name: this.data.user_name,
            email: this.data.email,
            role: this.data.role,
          };
           await ApiService("/users", "POST", data);
          this.isSubmit = false;
         
          
          
            Vue.$toast.success("User added Successfully", {
              position: "top",
            });
            this.searchKey = "";
            this.dialog = false;
            this.getUser(params);
          
        } catch (error) {
          console.log(error);
          const response=error.response.data
          if (response.statusCode == 33) {
            Vue.$toast.warning("email already exists", {
              position: "top",
            });
            this.valid = false;
          }

        }
      
      }
    },

    //------------------------------------------delete user-------------------------------------------------------------------
    async dlt() {
      this.confirmation=false
      try {
        const URL = `/users/${this.user_id}`;
        const response = await ApiService(URL, "DELETE");
        if (response.statusCode == 200) {
          Vue.$toast.success("User Deleted Successfully", {
            position: "top",
            queue:true,
          });
          this.searchKey = "";
        }
        

        this.confirmation = false;
      } catch (error) {
        const response=error.response.data;
        if (response.statusCode == 92) {
          this.Re_confirmation = true;
          this.confirmation = false;
        }
      }
      this.getUser();
    },
    async ReConfirmDelete() {
      try {
        this.Re_confirmation = false;

        const URL = `/users/confirmdelete/${this.user_id}`;
        const response = await ApiService(URL, "DELETE");
        if (response.statusCode == 200) {
          Vue.$toast.success("User Deleted Successfully", {
            position: "top",
            queue:true,
          });
        }

        this.searchKey = "";
        this.user_list = null;
        this.getUser();
      } catch (error) {
const response = error.response.data;
if (response.statusCode == 1011) {
          Vue.$toast.error("Cannot delete yourself", {
            position: "top",
          });
        }
}
    },

    openModal(uid) {
      this.confirmation = true;

      this.user_id = uid;
    },

    editmodal(item) {
     
      this.editDialog = true;

      this.userdata.user_id = item.user_id;
      this.userdata.user_name = item.user_name;
      this.userdata.email = item.email;
      this.userdata.role = item.role.role_id;
    },

    onClose() {
      this.confirmation = false;
      this.Re_confirmation = false;
      this.user_id = null;
    },
    openUserAllocationModal(uid) {
      this.UserAllocationModal = true;

      this.users.users.push(uid);
    },
    bulkusersModal() {
      this.UserAllocationModal = true;
    },
    CloseUserAllocationModal() {
      this.menu1=false;
      this.menu2=false;
      this.$refs.form.reset();
      this.UserAllocationModal = false;
      this.users.users = [];
      this.$refs.form.resetValidation();
      this.value = "";
    },

    check() {
      this.valid = true;
    },
    async editUser() {
     
      try {
        this.btnvalid = false;
        const udata = {
          user_name: this.userdata?.user_name,
          email: this.userdata?.email,
          role: this.userdata?.role,
        };
    
         await ApiService(
          "users/" + this.userdata.user_id,
          "PUT",
          udata,
          null,
          null
        );
     
          Vue.$toast.success("User updated Successfully", {
            position: "top",
            duration: 1000,
          });
          this.searchKey = "";
          this.getUser();
          this.editDialog = false;
      
      } catch (error) {
      console.log(error);
      const response=error.response.data
      if (response.statusCode == 113) {
          this.btnvalid = false;
          Vue.$toast.warning("Updation failed", {
            position: "top",
            duration: 1000,
          });
          this.btnvalid = false;
          this.editDialog = true;
        }
        if (response.statusCode == 1015) {
          this.btnvalid = false;
          Vue.$toast.warning("Email already exist", {
            position: "top",
            duration: 1000,
          });
          this.btnvalid = false;
          this.editDialog = true;
        }
        if (response.statusCode == 1050) {
          this.btnvalid = true;
          Vue.$toast.warning("No change in User deatils", {
            position: "top",
            duration: 1000,
          });
          this.btnvalid = false;
          this.editDialog = true;
        }
        if (response.statusCode == 95) {
          this.btnvalid = false;
          Vue.$toast.warning("Name is required", {
            position: "top",
            duration: 1000,
          });
          this.btnvalid = false;
          this.editDialog = true;
        }
        
      }
    },
  },

  //----------------------------------------------watch func for pagination----------------------------------------------------------------
  watch: {
    // whenever  the given depenedancy  changes, this function will run

    searchKey: function () {
      

      this.searchUser();
    },

    //---------------------------------remove data from the form after sumbmit----------------------------------------------------------
    dialog: function (val) {
      if (val) {
        this.data.user_name = "";
        this.data.email = "";
        this.data.role = "";
      }
    },
  },

  beforeMount() {
    const params = {
      searchKey: this.data.searchKey,
      sortCol: "user_id",
      sortMethod: "desc",
      limit: 1000,
    };
    this.userId=localStorage.getItem('userID');
    this.getUser(params);
    this.getRole();
    this.getProjectsList();
    this.getProjectRole();

    this.localRole = localStorage.getItem("role");
  },
  computed: {
    options() {
      
      let opts = [];
      for (let i = 0; i <= this.ProjectList.length - 1; i++) {
        opts.push({
          text: this.ProjectList[i].project_name,
          value: this.ProjectList[i].project_id,
        });
      }
      return opts;
    },
    roleLists() {
      let opts = [];
      for (let i = 0; i <= this.RoleList.length - 1; i++) {
        opts.push({
          text: this.RoleList[i].role_name,
          value: this.RoleList[i].role_id,
        });
      }
      return opts;
    },
    ProjectRoleLists() {
      let opts = [];
      for (let i = 0; i <= this.ProjectRoleList.length - 1; i++) {
        opts.push({
          text: this.ProjectRoleList[i].role_name,
          value: this.ProjectRoleList[i].role_id,
        });
      }
      return opts;
    },
  },
};
</script>

<style scoped>
#title {
  background-color: #4fa5d6;
  color: aliceblue;
}
#imp {
  color: red;
}
.v-text-field {
  margin-left: 5%;
  height: 20%;
}
.label {
  font-size: medium;
}

.datatable {
  width: 90%;
  margin-left: 5%;
}
.search {
  display: flex;
}
.addbtns {
  display: flex;
  justify-content: end;
  margin-right: 5%;
  gap:10px;

}

.companyName{
  margin-top:6%
}
.heading2 {
  height: 5px;
  justify-content: space-between;
  width: 100%;
}

.addassignebtn{
  display: flex;
  flex-direction: row;
  z-index: 9999!important;
}




.serachBar{
  margin-top:1.5%;
  margin-right: 100px;

  height: 45px ;
  max-width: 450px ;
}

.v-btn:not(.v-btn--round).v-size--default {
  height: 45px;
  min-width: 60px;
  padding: 0 16px;
  margin-top: 0% ;
}
.theme--light.v-icon:focus::after {
  opacity: 0 !important;
}

p {
  text-align: left;
}

 .v-sheet.v-card:not(.v-sheet--outlined) {
  box-shadow: none;
}
.cmnbtnstyle{
 width:110px;
 height: 40px !important;
}
#Plusicon{
  margin-top:27%;
}
.mainDiv{
  display: flex;

  height: 50px;
}
.editform{
  width:100%
}

@media screen and (max-width:770px){
  .mainDiv{
    display: flex;
    flex-direction: row;
    height: 85px;
}
.editform {
    width: 100%;
}
.addbtns {
  display: flex;
  justify-content: end;
  margin-right: 5%;
  gap:10px;
  margin-top:-5%;
}


  
}
.ProjectCol{
  width: 150px ;
  white-space: nowrap ; 
  overflow: hidden ;
  text-overflow: ellipsis 
}
@media screen and (max-width:990px){
  .datatable{
    margin-top: 100px;
    
}
}
@media screen and (max-width:600px){
  .datatable{
    margin-top: 200px;
    
}
.heading2 {
  height: 10px;
  justify-content: space-between;
  width: 100%;
}


.addbtns{
  flex-wrap: wrap;
  align-items: center;

}
#Plusicon{
  margin-top: 0!important;
}
#mediaRequire{
  margin-top:0!important;
}
}

</style>
