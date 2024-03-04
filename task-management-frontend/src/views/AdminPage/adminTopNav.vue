<template>
  <div style="z-index: 99; background-color: black">
    <div id="mySidebar" class="sidebar">
      <a href="javascript:void(0)" class="closebtn" @click="closeNav()">×</a>
      <ul>
        <li>
          <router-link :to="'/dashboard'" class="button">
            <a title="dashboard"> </a>
            <span>DashBoard</span>
          </router-link>
        </li>
        <li>
          <router-link :to="'/home'" class="button">
            <a title="Home"> </a>
            <span>Home</span>
          </router-link>
        </li>
        <li>
          <router-link :to="'/add-task'" class="button">
            <a title="Add Task"> </a>
            <span>Add Task</span>
          </router-link>
        </li>
        <li>
          <router-link exact :to="'/task-list'" class="button">
            <a title="Task"></a>
            <span>Task</span>
          </router-link>
        </li>
        <li>
          <router-link :to="'/board'" class="button">
            <a title="Board"></a>
            <span>Board</span>
          </router-link>
        </li>
        <li>
          <router-link :to="'/gantt-chart'" class="button">
            <a title="Gantt Chart"> </a>
            <span>Gantt Chart</span>
          </router-link>
        </li>
        <li>
          <router-link :to="'/file'" class="button">
            <a title="Files">
            
            </a>
            <span>Files</span>
          </router-link>
        </li>
        <li id="project_settings">
          <router-link :to="'/project-settings/members'" class="button">
            <a title="Project Settings"></a>
            <span>Project Settings</span>
          </router-link>
          <span class="fas fa-caret-down first" @click="toggleFeatures"></span>

          <ul class="feat-show" v-if="showFeatures" id="child_project">
            <li>
              <router-link exact to="/project-settings/members"> Members </router-link>
            </li>

            <li>
              <router-link exact :to="'/project-settings/issues'">
                Issue Type
              </router-link>
            </li>

            <li>
              <router-link exact :to="'/project-settings/category'">
                Category
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="app-header header-shadow" style="width: 100%">
      <button class="openbtn" @click="openNav()">☰</button>
      <div class="header__pane ml-auto"></div>

      <div class="app-header__mobile-menu">
        <div>
          <div class="mobileFlex" >
          <div  class="topbartools">

          <div class="Plusdropdown">
                  <a
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    class="AddHover"
                  >
                    <button
                      title="Add"
                      v-on:click="closeNotif()"
                      type="button"
                      class="rounded-circle p-1 addButtonMobile"
                    >
                      <em class="fa text-white fa-add pr-1 pl-1"></em>
                    </button>
                  </a>
                  <div class="dropdown-menu dropdown-menu-left dropDownList" style="  top: 140px !important;">
                    <addProject />

                    <router-link to="/user-list" style="text-decoration: none">
                      <button type="button" tabindex="0" class="dropdown-item">
                        User Management
                      </button>
                    </router-link>

                    <issue-type />
                    <add-category />
                  </div>
                </div>
        
          <!-- notification bar -->
            <div class="widget-heading">
              <div class="icon">
                <a @click="notifyOn()" title="Notification">
                  <img src="../../assets/Images/bell new.png" alt="" />
                  <sup style="font-size: 16px"
                    ><span v-show="this.NotificationNum > 0">{{ NotificationNum }}</span
                    ><span v-show="this.NotificationNum < 1"> </span
                  ></sup>
                </a>
              </div>
            </div>
          </div>
            <div class="btn-group">
                    <a
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                      class="p-0 btn"
                      v-on:click="closeNotif()"
                      v-if="profilePhoto !== null"
                    >
                      <img
                        width="30"
                        height="30"
                        class="rounded-circle responsive-img"
                        v-bind:src="profilePhoto"
                        loading="lazy"
                        v-on:click="closeNotif()"
                        alt="profile"
                        title="Profile"
                      />

                      <em
                        class="fa fa-angle-down ml-2 opacity-8"
                        v-on:click="closeNotif()"
                      ></em>
                    </a>
                    <a
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      v-on:click="closeNotif()"
                      aria-expanded="false"
                      class="p-0 btn"
                      v-if="profilePhoto == null"
                    >
                      <img
                        width="30"
                        height="30"
                        class="rounded-circle"
                        src="../../assets/dd.jpg"
                        alt=""
                        v-on:click="closeNotif()"
                        title="Profile"
                      />

                      <em
                        class="fa fa-angle-down ml-2 opacity-8"
                        v-on:click="closeNotif()"
                      ></em>
                    </a>
                    <div class="dropdown-menu dropdown-menu-right">
                      <router-link to="/profile" style="text-decoration: none">
                        <button type="button" tabindex="0" class="dropdown-item">
                          User Profile
                        </button>
                      </router-link>
                      <router-link to="/user/activity" style="text-decoration: none">
                        <button type="button" tabindex="0" class="dropdown-item">
                          Activity
                        </button>
                      </router-link>
                      <router-link to="/user/gantt-chart" style="text-decoration: none">
                        <button type="button" tabindex="0" class="dropdown-item">
                          Gantt Chart
                        </button>
                        <router-link to="/users" style="text-decoration: none">
                          <button type="button" tabindex="0" class="dropdown-item">
                            Members
                          </button>
                        </router-link>
                      </router-link>

                      <router-link to="/changePassword" style="text-decoration: none">
                        <button type="button" tabindex="0" class="dropdown-item">
                          Change Password
                        </button>
                      </router-link>

                      <div tabindex="-1" class="dropdown-divider"></div>
                      <button
                        @click="logout"
                        type="button"
                        tabindex="0"
                        class="dropdown-item"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
        </div>
        </div>
      </div>
    
      <div class="app-header__content">
        <div class="app-header-left" style="float: left">
          <ul class="header-menu nav">
            <div class="widget-content-right header-user-info ml-3">
              <router-link to="/dashboard">
                <v-img
                  src="../../assets/Images/logo.png"
                  width="40"
                  alt=""
                  style="text-decoration: none"
                ></v-img>
              </router-link>
            </div>
            <li class="nav-item">
              <router-link
                to="/dashboard"
                class="nav-link topList"
                title="Dashboard"
                style="color: black"
              >
                <em class="nav-link-icon fa fa-database" style="color: black"> </em>
                DashBoard
              </router-link>
            </li>
            <li class="btn-group nav-item">
              <div class="widget-content-left">
                <div class="btn-group">
                  <a
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    class="btn nav-link topList"
                    @click="getProjectsList()"
                    title="Projects"
                    style="color: black"
                  >
                    <em class="nav-link-icon fa fa-edit" style="color: black"></em>
                    Projects
                  </a>

                  <div
                    class="dropdown-menu dropdown-menu auto projects"
                    @click="$event.stopPropagation()"
                    id="scroll"
                    style="
                      max-height: 550px;
                      overflow: scroll;
                      top: 15px;
                      min-width: 500px;
                      margin-left: 5%;
                    "
                  >
                    <v-toolbar
                      id="header"
                      style="height: 44px"
                      flat
                      color="#1d9c70"
                      scrollable
                    >
                      <v-toolbar-title id="heading" style="color: white; z-index: 99">
                        Project
                      </v-toolbar-title>
                    </v-toolbar>
                    <v-text-field
                      autocomplete
                      @keyup="search()"
                      v-model="searchText"
                      dense
                      filled
                      rounded
                      clearable
                      @click:clear="setItNull()"
                      placeholder="Search project "
                      prepend-inner-icon="mdi-magnify"
                      class="pt-6 shrink expanding-search searchTop"
                      :class="{ closed: searchBoxClosed && !searchText }"
                    ></v-text-field>
                    <div v-if="DataLoaded == true">
                      <div v-if="ProjectLoaded.length == 0">
                        <div id="errMsg">
                          <p class="center">There are no projects assigned to you yet.</p>
                          <p class="center">
                            Projects assigned to you will be listed here.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div v-if="DataLoaded == false"></div>
                    <div v-if="DataLoaded == true">
                      <div v-for="item in getProjectsToDisplay()" :key="item.id">
                        <div style="auto" >
                          <div
                            @mouseover="getId(item.project_id)"
                            @mouseleave="mouseleave"
                          >
                            <div
                              class="card cardMsg widget-content notifybox"
                              style="color: black; margin-top: -4%; margin-bottom: 4%"
                            >
                              <div class="row">
                                <div class="col-1" style="margin-left: -4%">
                                  <v-avatar>
                                    <img src="../../assets/Images/logo.png" alt="" />
                                  </v-avatar>
                                </div>
                                <div class="col-13" style="margin-left: 6%">
                                  <a v-on:click="ProjectDetail(item.project_id)">
                                    <div class="widget-content-outer">
                                      <div class="widget-content-wrapper">
                                        <div class="widget-content-left">
                                          <div class="widget-heading" id="projectHeading">
                                            {{ item.project_name }} [{{
                                              item.project_code
                                            }}]
                                          </div>
                                          <div
                                            id="taskProject"
                                            class="widget-subheading menuItem"
                                            style="margin-bottom: -10%"
                                          >
                                            <ul class="header-menu nav">
                                              <li class="nav-item">
                                                <router-link
                                                  to="/AdminDashBoardView"
                                                  style="text-decoration: none"
                                                >
                                                </router-link>
                                              </li>
                                              <li class="nav-item">
                                                <router-link
                                                  :to="'/task-list'"
                                                  style="text-decoration: none"
                                                >
                                                  <a
                                                    @click="redirectUrl(item.project_id)"
                                                    href="javascript:void(0);"
                                                    class="nav-link linkItem"
                                                    style="
                                                      color: black;
                                                      font-weight: bolder;
                                                    "
                                                    title="Task"
                                                  >
                                                    Task
                                                  </a>
                                                </router-link>
                                              </li>
                                              <li
                                                class="nav-item"
                                                v-if="item.project_role != 5"
                                              >
                                                <router-link
                                                  :to="'/add-task'"
                                                  style="text-decoration: none"
                                                >
                                                  <a
                                                    @click="redirectUrl(item.project_id)"
                                                    href="javascript:void(0);"
                                                    class="nav-link linkItem"
                                                    style="
                                                      color: black;
                                                      font-weight: bolder;
                                                    "
                                                    title="Add Task"
                                                  >
                                                    Add Task
                                                  </a>
                                                </router-link>
                                              </li>
                                              <li class="nav-item">
                                                <router-link
                                                  :to="'/file'"
                                                  style="text-decoration: none"
                                                >
                                                  <a
                                                    @click="redirectUrl(item.project_id)"
                                                    href="javascript:void(0);"
                                                    class="nav-link linkItem"
                                                    style="
                                                      color: black;
                                                      font-weight: bolder;
                                                    "
                                                    title="Files"
                                                  >
                                                    Files
                                                  </a>
                                                </router-link>
                                              </li>
                                              <li class="nav-item">
                                                <router-link
                                                  :to="'/gantt-chart'"
                                                  style="text-decoration: none"
                                                >
                                                  <a
                                                    @click="redirectUrl(item.project_id)"
                                                    href="javascript:void(0);"
                                                    class="nav-link linkItem"
                                                    style="
                                                      color: black;
                                                      font-weight: bolder;
                                                    "
                                                    title="Gantt Chart"
                                                  >
                                                    Gantt Chart
                                                  </a>
                                                </router-link>
                                              </li>
                                              <li class="nav-item">
                                                <router-link
                                                  :to="'/board'"
                                                  style="text-decoration: none"
                                                >
                                                  <a
                                                    @click="redirectUrl(item.project_id)"
                                                    href="javascript:void(0);"
                                                    class="nav-link linkItem"
                                                    style="
                                                      color: black;
                                                      font-weight: bolder;
                                                    "
                                                    title="Board"
                                                  >
                                                    Board
                                                  </a>
                                                </router-link>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </a>
                                </div>
                              </div>
                              <div class="col-1">
                                <div class="widget-content-right-top">
                                  <a
                                    @click="redirectUrl(item.project_id)"
                                    class="btn float-right"
                                    v-on:click="ProjectSetting(item.project_id)"
                                    title="Project setting"
                                  >
                                    <v-icon
                                      v-bind="attrs"
                                      v-on="on"
                                      style="
                                        color: black;
                                        margin-top: -200%;
                                        margin-left: 100%;
                                      "
                                      >mdi-cog-outline</v-icon
                                    >
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div v-if="this.ProjectList.length != 0">
                          <a @click="previous()" v-show="this.page !== 1">Previous</a
                          >&nbsp;&nbsp;&nbsp;
                          <a v-if="hasNext && hasNext == true" @click="next()">Next</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <a
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                class="btn nav-link topList"
                title="Recently Viewed"
                style="color: black"
              >
                <em class="nav-link-icon fa fa-eye" style="color: black"></em>
                Recently Viewed
              </a>

              <recentlyViewed />
            </li>

            <li class="dropdown nav-item" v-if="role == 1">
              <div class="widget-content-right">
                <div class=" ">
                  <a
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    class="AddHover"
                  >
                    <button
                      title="Add"
                      v-on:click="closeNotif()"
                      type="button"
                      class="rounded-circle p-1 addButton"
                    >
                      <em class="fa text-white fa-add pr-1 pl-1"></em>
                    </button>
                  </a>
                  <div class="dropdown-menu dropdown-menu-left dropDownList">
                    <addProject />

                    <router-link to="/user-list" style="text-decoration: none">
                      <button type="button" tabindex="0" class="dropdown-item">
                        User Management
                      </button>
                    </router-link>

                    <issue-type />
                    <add-category />
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="app-header-right">
       
          <!-- notification bar -->
          <div class="widget-content-left ml-3 header-user-info">
            <div class="widget-heading">
              <div class="icon">
                <a @click="notifyOn()" title="Notification">
                  <img src="../../assets/Images/bell new.png" alt="" />
                  <sup style="font-size: 16px"
                    ><span v-show="this.NotificationNum > 0">{{ NotificationNum }}</span
                    ><span v-show="this.NotificationNum < 1"> </span
                  ></sup>
                </a>
              </div>
            </div>
          </div>

          <div class="header-btn-lg pr-0">
            <div class="widget-content p-0">
              <div class="widget-content-wrapper">
                <div class="widget-content-left">
                  <div class="btn-group">
                    <a
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                      class="p-0 btn"
                      v-on:click="closeNotif()"
                      v-if="profilePhoto !== null"
                    >
                      <img
                        width="30"
                        height="30"
                        class="rounded-circle responsive-img"
                        v-bind:src="profilePhoto"
                        loading="lazy"
                        v-on:click="closeNotif()"
                        alt="profile"
                        title="Profile"
                      />

                      <em
                        class="fa fa-angle-down ml-2 opacity-8"
                        v-on:click="closeNotif()"
                      ></em>
                    </a>
                    <a
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      v-on:click="closeNotif()"
                      aria-expanded="false"
                      class="p-0 btn"
                      v-if="profilePhoto == null"
                    >
                      <img
                        width="30"
                        height="30"
                        class="rounded-circle"
                        src="../../assets/dd.jpg"
                        alt=""
                        v-on:click="closeNotif()"
                        title="Profile"
                      />

                      <em
                        class="fa fa-angle-down ml-2 opacity-8"
                        v-on:click="closeNotif()"
                      ></em>
                    </a>
                    <div class="dropdown-menu dropdown-menu-right">
                      <router-link to="/profile" style="text-decoration: none">
                        <button type="button" tabindex="0" class="dropdown-item">
                          User Profile
                        </button>
                      </router-link>
                      <router-link to="/user/activity" style="text-decoration: none">
                        <button type="button" tabindex="0" class="dropdown-item">
                          Activity
                        </button>
                      </router-link>
                      <router-link to="/user/gantt-chart" style="text-decoration: none">
                        <button type="button" tabindex="0" class="dropdown-item">
                          Gantt Chart
                        </button>
                        <router-link to="/users" style="text-decoration: none">
                          <button type="button" tabindex="0" class="dropdown-item">
                            Members
                          </button>
                        </router-link>
                      </router-link>

                      <router-link to="/changePassword" style="text-decoration: none">
                        <button type="button" tabindex="0" class="dropdown-item">
                          Change Password
                        </button>
                      </router-link>

                      <div tabindex="-1" class="dropdown-divider"></div>
                      <button
                        @click="logout"
                        type="button"
                        tabindex="0"
                        class="dropdown-item"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>

                <div class="widget-content-right header-user-info ml-3">
                  <router-link to="/dashboard">
                    <v-img src="../../assets/Images/logo.png" width="40" alt=""></v-img
                  ></router-link>
                </div>
                <div class="widget-content-left ml-3 header-user-info">
                  <div class="widget-heading">Innovature Technologies K.K</div>
                  <div class="widget-subheading"></div>
                </div>
                <div class="widget-content-right header-user-info ml-3">
                  <v-img src="" width="50" alt=""></v-img>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <notificationList
            :down="down"
            :notificationList="notificationList"
            @my-message="capture"
            @my-messages="captures"
            :totalNotification="totalNotification"
            @filter-notification="loadmore"
          />


    
    <template>
      <!-- notification bar  -->
      <div v-if="NotifiationBarOpen == 2">
        <div class="theme-settings__inner">
          <div class="scrollbar-container">
            <nav>
              <v-navigation-drawer
                white
                app
                right
                class="new"
                width="265"
                style="overflow: auto; z-index: -99; position: fixed; margin-top: 4%"
              >
                <template v-slot:prepend>
                  <v-icon
                    @click="NotifiationBarOpen--"
                    color="black"
                    class="btn float-right"
                    >fa fa-times</v-icon
                  >
                  <br /><br />

                  <v-col class="d-flex" cols="12" sm="12"> </v-col>
                  <div v-for="Data in notificationList" :key="Data.id">
                    <div class="card cardMsg mb-3 widget-content">
                      <v-avatar class="mr-1">
                        <img
                          style="height: 35px; width: 35px"
                          src="../../assets/Images/profilePicc.jpg"
                          alt=""
                        />
                      </v-avatar>
                      <div class="widget-content-outer mr-6">
                        <div class="widget-content-wrapper">
                          <div class="widget-content-left">
                            <div class="widget-heading WordBreak" style="font-size: 12px">
                              {{ Data.content }}
                              {{ Data.project_id_notification.project_name }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </v-navigation-drawer>
            </nav>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import notificationList from "./Notification/NotificationList.vue";
import addProject from "./AddProjectModal.vue";
import recentlyViewed from "./RecentlyViewed.vue";
import ApiService from "../../service/apiservice";
import Vue from "vue";
import "vue-toast-notification/dist/theme-sugar.css";
import VueToast from "vue-toast-notification";
import IssueType from "./IssueType.vue";
import AddCategory from "./AddCategory.vue";

Vue.use(VueToast);
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    this.classList.toggle("click");
    document.querySelector(".sidebar").classList.toggle("show");
  });
});

document.querySelectorAll(".feat-btn").forEach((featBtn) => {
  featBtn.addEventListener("click", function () {
    document.querySelector("nav ul .feat-show").classList.toggle("show");
    document.querySelector("nav ul .first").classList.toggle("rotate");
  });
});

document.querySelectorAll(".serv-btn").forEach((servBtn) => {
  servBtn.addEventListener("click", function () {
    document.querySelector("nav ul .serv-show").classList.toggle("show1");
    document.querySelector("nav ul .second").classList.toggle("rotate");
  });
});

document.querySelectorAll("nav ul li").forEach((navLi) => {
  navLi.addEventListener("click", function () {
    this.classList.add("active");
    Array.from(this.parentNode.children).forEach((child) => {
      if (child !== this) {
        child.classList.remove("active");
      }
    });
  });
});
export default {
  components: {
    addProject,
    notificationList,
    IssueType,
    AddCategory,
    recentlyViewed,
  },

  data() {
    return {
      box:"",
      showFeatures: false,
      down: false,
      menu: false,
      menu1: false,
      DataLoaded: false,
      menu2: false,
      menu3: false,
      menu4: false,
      menu5: false,
      hasNext: false,
      currentPage: 1,
      totalNotification: "",
      page: 1,
      pageCount: "",
      pageNo: null,
      limit: 10,
      lastData: "",
      searchKey: "",
      id: "",
      idd: "",
      item: [],
      length: 10,
      clicked: false,
      searchBoxClosed: false,
      // searchText: null,
      show: 1,
      NotificationNum: "",
      role: localStorage.getItem("role"),
      notificationValue: 0,
      ProjectList: [],
      project_list_display: [],
      notificationList: [],
      sideBar: "",
      projectid: "",
      profilePhoto: null,
      NotifiationBarOpen: 1, //this value used to open side navigation bar
      dialogCompose: false,
      notificationData: {
        user: null,
      },
    };
  },

  mounted() {
    this.box = document.getElementById("box") ;
    // this.box.style.display = "none";
    this.getUser();

    // this.id = this.$route.params.id;
    this.idd = 3;

    // window.setInterval(() => {
    //   this.notificationLimit();
    // }, 2000);
  },
  methods: {
    toggleFeatures() {
      this.showFeatures = !this.showFeatures;
    },

    openNav() {
      document.getElementById("mySidebar").style.width = "160px";
      document.getElementById("main").style.marginLeft = "250px";
    },

    closeNav() {
      document.getElementById("mySidebar").style.width = "0";
      document.getElementById("main").style.marginLeft = "0";
    },
    previous() {
      this.page = this.page - 1;
      this.getProjectsList();
    },
    next() {
      this.page = this.page + 1;

      this.getProjectsList();
      console.log(this.currentPage, "page");
    },
    closeNotif() {
      this.down = true;
      this.toggleNotifi();
    },
    redirectUrl(id) {
      localStorage.setItem("projectId", id);
      this.$store.commit("getData", id);
    },
    capture(msg) {
      this.down = msg;
      this.notificationData.user = null;
      this.notifications();
      this.toggleNotifi();
    },

    captures(msg) {
      this.down = false;
      this.notificationData.user = msg;
      this.lastData = "";
      this.notificationList = [];
      this.notifications();
    },
    loadmore(msg) {
      this.notificationData.user = msg;

      this.notifications();
    },
    setItNull() {
      this.searchText = "";
      this.search();
    },
    notifyOn() {
      
      this.notificationList = [];
      this.lastData = "";
      this.toggleNotifi();
    },
    async toggleNotifi() {
      this.notificationData.user = null;
      this.show = 2;
      this.box = document.getElementById("box");
      if (this.down) {
        this.box.style.height = "0vh";
        this.box.style.opacity = 0;
        this.box.style.display = "none";
        this.down = false;
      } else {
        this.box.style.height = "93vh";
        this.box.style.width = "410px";
        this.box.style.overflow = "scroll";
        this.box.style.opacity = 1;
        this.box.style.display = "initial";
        this.down = true;
        this.notificationData.user = null;
        const params = {
          last_data: this.lastData,
          limit: 10,
        };
        const response = await ApiService(
          "/notification",
          "POST",
          this.notificationData,
          null,
          params
        );
        this.notificationArray = response.result.notifications;
        this.totalNotification = response.total;
        for (const element of this.notificationArray) {
          this.notificationList.push(element);
        }
        this.lastData = this.notificationArray[
          this.notificationArray.length - 1
        ].notification_id;
      }
    },

    async notifications() {
      const params = {
        last_data: this.lastData,
        limit: 10,
      };
      const response = await ApiService(
        "/notification",
        "POST",
        this.notificationData,
        null,
        params
      );
      if (this.lastData == "") {
        this.totalNotification = response.total;
      }
      this.notificationArray = response.result.notifications;
      for (const element of this.notificationArray) {
        this.notificationList.push(element);
      }
      this.lastData = this.notificationArray[
        this.notificationArray.length - 1
      ].notification_id;
    },
    scriptValue() {
      let Script = document.createElement("script");
      Script.setAttribute(
        "src",
        "https://demo.dashboardpack.com/architectui-html-free/assets/scripts/main.js"
      );
      document.head.appendChild(Script);
    },
    myFunction() {
      document.getElementById("myDropdown").classList.toggle("show");
    },

    async notificationLimit() {
      const response = await ApiService("/notification/count", "GET");
      this.NotificationNum = response.count;
      if (response.logout == 2) {
        this.$router.push({ path: "/" });
      }

      this.sideBar = this.$route.params.id;
    },

    async getProjectsList() {
      this.down = true;
      this.toggleNotifi();
      this.DataLoaded = false;

      const params = {
        limit: this.limit,
        page: this.page,
      };

      const response = await ApiService("/project/getProject", "GET", null, null, params);
      this.DataLoaded = true;
      this.ProjectList = response.listView;
      this.ProjectLists = response.listView;
      this.hasNext = response.hasNext;

      this.pageCount = Math.ceil(response.total / 10);

      this.sideBar = this.$route.params.id;
    },
    getProjectsToDisplay() {
      const start = (this.currentPage - 1) * 10;
      const end = start + 10;
      return this.ProjectList.slice(start, end);
    },

    async getProjectRole(id) {
      try {
        const response = await ApiService("/project/projectRole/" + id, "GET");
        this.notificationList = response;
        if (response.statusCode == 50) {
          this.$router.push("/dashboard");
        }
        localStorage.setItem("projectRole", JSON.stringify(response.project_role));
      } catch (error) {
        Vue.$toast.warning("Network error", {
          position: "top",
        });
      }
    },
    async notification() {
      this.NotifiationBarOpen = this.NotifiationBarOpen = 2;
      this.notificationLimit();
      try {
        const response = await ApiService("/notification", "POST", this.notificationData);
        this.notificationList = response;
      } catch (error) {
        Vue.$toast.warning("Network error", {
          position: "top",
        });
        this.$router.push("/");
        localStorage.clear();
      }
    },
    async ProjectDetail(id) {
      this.clicked = true;
      localStorage.setItem("projectId", JSON.stringify(id));
      const response = await ApiService("/project/projectRole/" + id, "GET");
      this.notificationList = response;
      localStorage.setItem("projectRole", JSON.stringify(response.project_role));
      localStorage.setItem("projectId", id);
      this.$store.commit("getData", id);
      this.$router.push({ path: "/home" });
      this.clicked = true;
      window.location.reload();
    },
    async getProjectDetails(id) {
      try {
        const response = await ApiService("/project/overallProjectStatus/" + id, "GET");
        this.ProjectData = response;
      } catch (error) {
        Vue.$toast.warning("Network error", {
          position: "top",
        });
        this.$router.push("/");
        localStorage.clear();
      }
    },

    logout() {
      this.$router.push("/");
      localStorage.clear();
    },
    async getUser() {
      const response = await ApiService("users/getProfile", "GET");
      this.data = response;

      this.profilePhoto = response?.profile_photo;
      localStorage.setItem("profilePhoto", this.profilePhoto);
      localStorage.setItem("name", this.data.user_name);
    },
    mouseleave() {
      this.projectid = "";
    },
    getId(id) {
      this.projectid = id;
    },
    async search() {
      this.down = true;
      this.toggleNotifi();
      this.DataLoaded = false;

      const params = {
        searchKey: this.searchText,
        limit: this.limit,
        page: this.page,
      };

      const response = await ApiService("/project/getProject", "GET", null, null, params);
      this.DataLoaded = true;
      this.ProjectList = response.listView;
      this.ProjectLists = response.listView;
      this.hasNext = response.hasNext;

      this.pageCount = Math.ceil(response.total / 10);

      this.sideBar = this.$route.params.id;
    },
    ProjectSetting() {
      this.$router.push("/project-settings/members");
      this.$router.go("/project-settings/members");
    },
  },

  computed: {
    pageCount() {
      return Math.ceil(this.ProjectList.length / 10);
    },

    project_display() {
      return this.ProjectList.slice(0, 10);
    },

    ProjectLoaded() {
      return this.ProjectList.slice();
    },
  },
};
</script>

<style scoped>
.scrollbar {
  margin-left: 30px;
  float: left;
  height: 300px;
  width: 65px;
  background: #f5f5f5;
  overflow-y: scroll;
  margin-bottom: 25px;
}
#style-1::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

#style-1::-webkit-scrollbar {
  width: 12px;
  background-color: #f5f5f5;
}

#style-1::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #555;
}

.text {
  text-decoration: none;
}

.dropbtn {
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

.dropbtn:hover {
  background-color: transparent !important;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  overflow: auto;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}
.dropdown-content {
  right: 0;
}
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}
#myDropdown {
  background-color: #fff;
}
.dropdown-menu {
  overflow-x: hidden !important;
}
.dropdown a:hover {
  background-color: #ddd;
}

.show {
  display: block;
}

.v-list.v-sheet a {
  text-decoration: none;
}
.activeColor {
  color: rgb(255, 255, 255);
  background-color: rgb(80, 183, 220);
  font-weight: bolder;
}
.WordBreak {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
}
nav {
  display: flex;
  align-items: center;
  background: #00a9d4;
  height: 60px;
  position: relative;
}
.icon {
  cursor: pointer;
  margin-right: 50px;
  line-height: 60px;
}
.icon span {
  /* background: #f00; */
  padding: -3px;
  color: red;
  font-weight: bolder;
  border-radius: 50%;
  /* color: #fff; */
  vertical-align: top;
  margin-left: -9px;
}
.icon img {
  display: inline-block;
  width: 55px;
  margin-top: 4px;
  margin-right: -83px;
}
.icon:hover {
  opacity: 0.7;
}

.logo {
  flex: 1;
  margin-left: 50px;
  color: #eee;
  font-size: 20px;
  font-family: monospace;
}

nav {
  display: flex;
  align-items: center;
  background: #00a9d4;
  height: 60px;
  position: relative;
}
.icon {
  cursor: pointer;
  margin-right: 50px;
  line-height: 60px;
}
.icon span {
  /* background: #f00; */
  padding: -4px;
  color: red;
  font-weight: bolder;
  border-radius: 50%;
  /* color: #fff; */
  vertical-align: sub;
  margin-left: 75px;
}
.icon img {
  display: inline-block;
  width: 28px;
  margin-top: 2px;
}
.icon:hover {
  opacity: 0.7;
}

.logo {
  flex: 1;
  margin-left: 50px;
  color: #eee;
  font-size: 20px;
  font-family: monospace;
}
.active {
  transition-duration: 0.15s;
  transition-property: opacity;
}
.foo-hover {
  border-radius: 10%;
  height: auto;
  background-color: rgb(55, 55, 55);
  color: rgb(255, 255, 255);
}
.btn-grad {
  margin-left: 2%;
  margin-right: 2%;
  max-height: 78px;
  background-image: linear-gradient(to right, #1a7c48 0%, #1d9c70 51%, #1faa75 100%);

  transition: 0.5s;
  background-size: 200% auto;
  color: white;
  box-shadow: 0 0 20px #eee;
  border-radius: 10px;
  /* display: block; */
}

.btn-grad:hover {
  background-position: right center; /* change the direction of the change here */
  color: #fff;
  /* text-decoration: none; */
}
#header {
  margin-top: -2%;
}
#heading {
  margin-bottom: 2%;
  font-size: medium;
}
#scroll {
  scrollbar-width: thin;
  top: 5px !important;
}
.addButton {
  margin-top: 13px;
  background-color: #3985ff !important;
}
.addButtonMobile{
  background-color: #3985ff !important;
}

.AddHover :hover {
  border-radius: 50%;
}
.searchTop {
  border-radius: 0%;

  margin-top: -3.5%;
}
#errMsg {
  margin-top: -5%;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
    rgb(209, 213, 219) 0px 0px 0px 1px inset;
}
.center {
  text-align: center;
}
.menuItem {
  margin-left: -32px;
}
.notifybox {
  z-index: 2;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
    rgb(209, 213, 219) 0px 0px 0px 1px inset;
}
.notifybox:hover {
  background-color: #fcfade;
}
.linkItem:hover {
  background-color: #c3c2c2;
}
#searchBarEngine {
  background: #fff;
}
sup {
  vertical-align: super;
  font-size: smaller;
}
#projectHeading {
  white-space: nowrap;
  width: 380px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.topList {
  font-size: 1rem;
  font-weight: 400;
  font-style: normal;
  line-height: 2rem;
}




.sidebar {
  height: 100%;
  width: 0;
  position: fixed;
  z-index: 1;
  top: 45px;
  left: 0;
  background-color: rgb(79, 165, 214);
  overflow-x: hidden;
  transition: 0.1s;
  padding-top: 60px;
  display: none;
  font-size: medium;
}
.sidebar ul li {
  list-style: none;
  color: #ffffff;
}
.sidebar a {
  padding: 5px 8px 8px 0;
  text-decoration: none;
  font-size: 25px;
  color: #ffffff;
  display: block;
  transition: 0.3s;
}
.sidebar .button {
  display: flex;
  align-items: center;
  font-size: medium;
}
.sidebar a:hover {
  color: #0000009e;
}

.sidebar .closebtn {
  position: absolute;
  top: 0;
  right: -3px;
  font-size: 36px;
  margin-left: 50px;
}

.sidebar .button:hover .material-icons,
.sidebar .button:hover span {
  color: rgb(44, 118, 188);
}
.openbtn {
  font-size: 20px;
  cursor: pointer;
  background-color: rgba(17, 17, 17, 0);
  color: rgb(0, 0, 0);
  padding: 10px 15px;
  border: none;
  display: none;
}
#project_settings {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

#child_project li a {
  font-size: medium !important;
  margin-left: 50px;
}
.feat-show {
  display: block !important;
}
.mobileFlex{
  display: flex;
  align-items: center;
  gap: 10px;
}

@media screen and (max-width: 600px) {
  .openbtn {
    display: block;
  }
  .sidebar {
    display: block;
  }
  .sidebar ul {
    padding-left: 0 !important ;
  }
}

@media screen and (max-height: 450px) {
  .sidebar {
    padding-top: 15px;
  }
  .sidebar a {
    font-size: 18px;
  }
 
}

.topbartools{
    display: flex;
    align-items: center;
    gap:20px;
    
  }
</style>
