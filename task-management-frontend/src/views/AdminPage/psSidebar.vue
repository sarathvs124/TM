<template>
  <div class="app-main__outer section">
    <div height="100%" class="frame">
      <v-card class="projectsidebar" id="forHeightMedia">
        <v-navigation-drawer
          class="sideBar"
          absolute
          color="rgba(255,255,255,.45);"
          width="100%"
          permanent
        >

        <div class="navigator">
        <div justify="left">
      
           <v-icon color="black">mdi-settings</v-icon><h6 id="h6" data-test="heading1">
           Project Settings </h6>
        </div>
        <div class=" navcontent">
        
          <ul class="vertical-nav-menu" style="justify-content: center">
            <router-link exact to="/project-settings/members" >

            <v-list class="list">
                <div class="TextFont">
                  <a class="mm" style="text-decoration-color:  #fcfade;color:black"> MEMBERS </a>
                </div>
            </v-list>
          </router-link>

            <router-link exact :to="'/project-settings/issues'" >

            <v-list class="list">
                <div >

                  <a class="mm" style="text-decoration-color:  #fcfade;color:black"> ISSUE TYPE </a>

                </div>
            </v-list>
          </router-link>
          <router-link exact :to="'/project-settings/category'" >

            <v-list class="list">
                <div >
                  <a class="mm" style="text-decoration-color:  #fcfade;color:black"> CATEOGORY </a>
                </div>
            </v-list>
          </router-link>

          </ul>
       
      </div>
        </div>
        </v-navigation-drawer>
      </v-card>

      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({}),
};
</script>




<style scoped>
.mainDiv {
  min-height: 100%;
  max-width: 20%;

  background-color: #d6d6d6e0;
  font-family: "Open Sans", sans-serif;
}
.section {
  padding-left: 0 !important;
  width: 100%;
}
.sideBar{
  width: 22%;
  background-color: #f0f3f4;
}
.mm {
  color: black;
  font-size: small;

  text-decoration-color: aliceblue;

}
.title {
  padding: 15px 0px 15px 0;
  margin: 0 !important;
  position: relative;
  min-height: 65px;
  padding-top: 16px;
}
#h6 {
  font-size: x-large;
  font-weight: 400;
 
  margin-left: 25px;
 
}
.frame {
  display: -webkit-inline-box;
  height: 100%;
  width: 100%;
}

.ActiveLink {
  background-color: #fcfade !important;
 
}
.list:hover {
  background-color: #fcfade !important;

  text-decoration: none !important;
}


.navigator {
  margin-top: 7%;
  margin-left: 4%;
  background-color: #f0f3f4;
}
.navcontent {
  margin-top: 10%;
  margin-left: -27px;
}
.list {
  padding: 5%;
  background-color: aliceblue;
  text-decoration: none 
}

#forHeightMedia{
      height: 100%;
      position: absolute;
    }

    .projectsidebar{
      width:12%;

    }

@media only screen and (max-width: 1450px) {
#h6{
 
  font-size: x-large;
  font-weight: 400;
 
  margin-left:0px;
 

}
.mm{
  font-size: 14px;
}
}

 .router-link-exact-active {
  background-color: #fcfade !important;
  height: 20px;
  }
  @media screen and (max-width:992px){
    #forHeightMedia{
      height: 150vh;
    }
    .projectsidebar{
      width:20%;

    }
  }
  @media screen and (max-width:600px){
    #forHeightMedia{
      display: none!important;
    }
    
    
  } 
  @media only screen and (max-width: 1280px) {
#h6{
  font-size: 16px;
}
.mm{
  font-size: 14px;
}
.projectsidebar{
      width:16%;

    }

}



</style>