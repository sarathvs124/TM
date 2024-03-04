<template>
  <aside :class="`${is_expanded ? 'is-expanded' : ''}`" id="box">


    <div class="menu-toggle-wrap">
      <button class="menu-toggle" @click="ToggleMenu">
        <span class="material-icons">keyboard_double_arrow_right</span>
      </button>
    </div>

    <div class="menu">
      <router-link :to="'/home'" class="button ">
        <a title="Home">
        <span class="material-icons">home</span></a>
        <span class="text" data-test="id1">Home</span>
      </router-link>
    <div v-if="this.projectRole != 5">
      <router-link :to="'/add-task' " class="button">
        <a title="Add Task">
        <span class="material-icons">add</span></a>
        <span class="text">Add Task</span>
      </router-link>
      </div>
      <router-link
        exact
        :to="'/task-list' "
        class="button"
      >
      <a title="Task">
        <span class="material-icons">view_list</span></a>
        <span class="text">Task</span>
      </router-link>
      <router-link :to="'/board' " class="button">
        <a title="Board">
        <span class="material-icons">bar_chart</span></a>
        <span class="text">Board</span>
      </router-link>
      
      <router-link :to="'/gantt-chart'" class="button">
        <a title="Gantt Chart">
        <span class="material-icons">legend_toggle</span></a>
        <span class="text">Gantt Chart</span>
      </router-link>
      <router-link :to="'/file'" class="button">
        <a title="Files">
        <span class="material-icons">description</span> </a>
        <span class="text">Files</span>
      </router-link>
      <router-link  :to="'/project-settings/members'" class="button">
        <a title="Project Settings">
        <span class="material-icons">settings</span></a>
        <span class="text">Project Settings</span>
      </router-link>
    </div>

    <div class="flex"></div>

  </aside>
</template>

<script >
import { ref } from "vue";
import ApiService from "../../../service/apiservice";

export default {

  data() {
    return {
      is_expanded:"",
      projectRole: "",
      props: {
        id: Number,
      },


    };
  },
  mounted() {

this.projectId= this.$store.state.projectId;
if(this.projectId==='null'){
      this.$router.push("/dashboard" );
    }
localStorage.setItem("projectId",this.projectId)
this.GetProjectRole();
this.is_expanded = ref(localStorage.getItem("is_expanded") === "true");


  },
  methods: {
    ToggleMenu (){
     
      this.is_expanded = !this.is_expanded;
      localStorage.setItem("is_expanded", this.is_expanded);
      this.$emit("SideBarToggle", this.is_expanded);
    },
    async GetProjectRole() {
      try{

    
      const response = await ApiService(
        "/project/projectRole/" + this.projectId,
        "GET"
      );
      this.ProjectRoleList = response;
      
      localStorage.setItem("projectRole", JSON.stringify(response.project_role));
      this.projectRole=response.project_role
    
      }
      catch(error){

if(error.response.data.errorCode==50){
  this.$router.push("/dashboard");
}
if(error.response.data.errorCode==400){
  this.$router.push("/dashboard");
}
if(error.response.data.errorCode==240){
  this.$router.push("/dashboard");
}
      }
    },
  taskView(){
    localStorage.setItem("search"," ")
  
 },
  },
  }


</script>

<style lang="css" scoped>
.menu{
  padding-top: 4px;
}
aside {
  display: flex;
position:fixed;
  flex-direction: column;
  background-color: rgb(79, 165, 214);
  color: var(--light);
  width: calc(2rem + 32px);
  overflow: hidden; 
  min-height: 100vh;
  padding: 1rem;
  transition: visibility 0s, opacity 0.5s linear;
  /* transition: 0.2s ease-out ; */
}
aside .flex {
  flex: 1 1 0%;
}
aside .logo {
  margin-bottom: 1rem;
}
aside .logo img {
  width: 2rem;
}
aside .menu-toggle-wrap {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
  position: relative;
  top: 0;
  transition: visibility 0s, opacity 0.5s linear;
  /* transition: 0.2s ease-in-out; */
}
aside .menu-toggle-wrap .menu-toggle {
  /* transition: 0.2s ease-in-out; */
  transition: visibility 0s, opacity 0.5s linear;
}
aside .menu-toggle-wrap .menu-toggle .material-icons {
  font-size: 2rem;
  color: var(--light);
  /* transition: 0.2s ease-out; */
  transition: visibility 0s, opacity 0.5s linear;
}
aside .menu-toggle-wrap .menu-toggle:hover .material-icons {
  color: var(--primary);
  /* transform: translateX(0.5rem); */
  transition: visibility 0s, opacity 0.5s linear;
}
aside h3,
aside .button .text {
  opacity: 0;
  transition: visibility 0s, opacity 0.5s linear;
  /* transition: opacity 0.2s ease-in-out; */
}
aside h3 {
  color: var(--grey);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}
aside .menu {
  margin: 0 -1rem;
}
aside .menu .button {
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: visibility 0s, opacity 0.5s linear;
  /* transition: 0.2s ease-in-out; */
  padding: 0.5rem 1rem;
}
aside .menu .button .material-icons {
  font-size: 2rem;
  color: var(--light);
  transition: visibility 0s, opacity 0.5s linear;
  /* transition: 0.2s ease-in-out; */
}
aside .menu .button .text {
  color: var(--light);
  transition: visibility 0s, opacity 0.5s linear;
  /* transition: 0.2s ease-in-out; */
}
aside .menu .button:hover {
  background-color: #f1f4f6
}
aside .menu .button:hover .material-icons,
aside .menu .button:hover .text {
  color: rgb(44, 118, 188);
}
aside .menu .button.router-link-exact-active {
  background-color: #f1f4f6;
}
aside .menu .button.router-link-exact-active .material-icons,
aside .menu .button.router-link-exact-active .text {
  color:rgb(44, 118, 188);
}
aside .footer {
  opacity: 0;
  transition: visibility 0s, opacity 0.5s linear;
  /* transition: opacity 0.3s ease-in-out; */
}
aside .footer p {
  font-size: 0.875rem;
  color: var(--grey);
}
aside.is-expanded {
  width: var(--sidebar-width);
}

aside.is-expanded .menu-toggle-wrap .menu-toggle {
  transform: rotate(-180deg);
}
aside.is-expanded h3,
aside.is-expanded .button .text {
  opacity: 1;
}
aside.is-expanded .button .material-icons {
  margin-right: 1rem;
}
aside.is-expanded .footer {
  opacity: 0;
}

@media (max-width: 1024px) {
  aside {
    position: fixed;
    z-index: 99;
    height: 100%;
  }
}
@media screen and (max-width:600px){
  #box{
    display: none;
  }

}
</style>