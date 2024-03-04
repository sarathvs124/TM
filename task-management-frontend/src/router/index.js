import Vue from "vue";
import VueRouter from "vue-router";
import AdminDashBoardViewPage from "../views/AdminPage/AdminDashBoardPage.vue";
import AdminHomePage from "../views/AdminPage/homeView.vue";
import EmailVerification from "../views/Login/EmailVerification.vue";
import ResetView from "../views/Login/ResetView.vue";
import ViewUser from "../views/AdminPage/ViewUser.vue";
import ChangePassword from "../views/AdminPage/ChangePassword.vue";
import psSidebar from "../views/AdminPage/psSidebar.vue";
import MembersView from "../views/AdminPage/MembersView.vue";

import TaskView from "../views/AdminPage/TaskView.vue";
import AdminProfile from "../views/AdminPage/AdminProfile.vue";
import AddTask from "../views/AdminPage/AddTask.vue";
import FileView from '../views/File/FileView.vue'
import TaskUpdates from '../views/AdminPage/TaskUpdates.vue'
import EditTask from '../views/AdminPage/EditTask.vue'
import NotificationView from '../views/AdminPage/Notification/NotificationList.vue'
import issues from '../views/AdminPage/IssueList.vue'
import category from '../views/AdminPage/CategoryList.vue'
import sideBar from '../views/AdminPage/Notification/sideBarr.vue'

import AdminBoard from '../views/AdminPage/AdminBoard.vue'

import batchUpdate from '../views/AdminPage/BatchUpdate.vue'
import loginPage from "../views/Login/LoginPage.vue";
// import PageNotFound from "../views/Login/PageNotFound.vue";
import FournotFour from "../views/Login/fournotFour.vue";


import ganttChart from "../views/GanttChart/ganttChart.vue";
import ganttChartView from "../views/GanttChart/GanttChartView.vue";

import ActivityPage from "../views/AdminPage/UserActivity/UserActivity.vue";
import users from "../views/AdminPage/Members/memberPage.vue";

import usersGantt from "../views/AdminPage/UserActivity/UserGanttChart.vue";



Vue.use(VueRouter);

function guardMyroute(to, from, next) {
  var isAuthenticated = false;
  //this is just an example. You will have to find a better or
  // centralised way to handle you localstorage data handling
  if (localStorage.getItem("accessTocken")) {
    isAuthenticated = true;
  }

  if (isAuthenticated) {
    next(); // allow to enter route
  
  } else {
    next("/"); // go to '/login';
  }
}
const routes = [
  {
    path: "/",
    name: "loginPage",
    component: loginPage,
  },
  // {
  //   path: "*",
  //   name: "PageNotFound",
  //   component: PageNotFound
  // },
   {
      path: "*",
      name: "FournotFour",
      component: FournotFour
    },

  {
    path: "/add-task",
    name: AddTask,
    component: AddTask,
    beforeEnter: guardMyroute,
  },

 

  {
    path: "/board",
    name: "AdminBoard",
    component: AdminBoard,
  },

  
  {
    path: "/dashboard",
    name: "AdminDashBoardViewPage",
    beforeEnter: guardMyroute,
    component: AdminDashBoardViewPage,
  },

  {
    path: "/home",
    name: "AdminHomePage",
    beforeEnter: guardMyroute,
  
    component: AdminHomePage,
  },
  {
    path: "/batch-update",
    name: "batchUpdate",
    beforeEnter: guardMyroute,
    component: batchUpdate,
  },

  {
    path: "/emailVerification",
    name: "EmailVerification",
    component: EmailVerification,
  },
  {
    path: "/reset/:url",
    name: "ResetView",
    component: ResetView,
  },
  {
    path: "/user-list",
    name: ViewUser,
    component: ViewUser,
    beforeEnter: guardMyroute,
  },
  {
    path: "/changePassword",
    name: ChangePassword,
    component: ChangePassword,
    beforeEnter: guardMyroute,
  },
  {
    path: "/psSidebar",
    name: psSidebar,
    component: psSidebar,
    beforeEnter: guardMyroute,
  },
{
    path: '/project-settings/members',
    name: MembersView,
    component: MembersView,
    beforeEnter: guardMyroute,
  },


  {
    path: "/task-list",
    name: TaskView,
    beforeEnter: guardMyroute,
    component: TaskView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/profile",
    name: AdminProfile,
    component: AdminProfile,
    beforeEnter: guardMyroute,
  },
  {
    path: "/add-task",
    name: AddTask,
    component: AddTask,
    beforeEnter: guardMyroute,
  },
  
 



  {
    path: '/file',
    name: FileView,
    component: FileView,
    beforeEnter: guardMyroute
  },
  {
    path: '/task-view',
    name: TaskUpdates,
    component: TaskUpdates,

    beforeEnter: guardMyroute
  },

 
 
  {
    path: "/edit-task",
    name: EditTask,
    component: EditTask,
    beforeEnter: guardMyroute,
  }
  ,
  {
    path: "/Notification",
    name: NotificationView,
    component: NotificationView,
    beforeEnter: guardMyroute
  },


  {
    path: "/login",
    name: "loginPage",
    component: loginPage,
  },
  {
    path: "/sideBar",
    name: "sideBar",
    component: sideBar,
  },
  {
    path: "/project-settings/issues",
    name: "issues",
    component: issues,
    beforeEnter: guardMyroute
  },
  {
    path: "/project-settings/category",
    name: "category",
    component: category,
    beforeEnter: guardMyroute
  },
  {
    path: "/ganttChart",
    name: "ganttChart",
    component: ganttChart,
  },
  {
    path: "/gantt-chart",
    name: "ganttChartView",
    component: ganttChartView,
  },

  {
    path: "/user/activity",
    name: "ActivityPage",
    component: ActivityPage,
  },
  {
    path: "/users",
    name: "users",
    component: users,
  },
  {
    path: "/user/gantt-chart",
    name: "usersGantt",
    component: usersGantt,
  },
 
  
];


const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
