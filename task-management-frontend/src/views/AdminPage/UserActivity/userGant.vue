<template>
  <div class="ganttMainDiv ">
    <div class="gantt"   >
      <div col="4" md="6" sm="12" xs="12"  class="groupingdiv" style="align-items: center">
       
          <div
            class="page-title-heading"
            style="font-size: 1rem; font-weight: 600"
          >
            Grouping:
          </div>
          <v-card-text>
            <v-chip-group
              v-model="selection"
              active-class="teal white--text"
              :mandatory="mandatory"
              :column="column"
            >
              <v-chip @click="groupFilter(0)" active class="chipset">None</v-chip>

              <v-chip @click="groupFilter(1)" class="chipset">Project</v-chip>
            </v-chip-group>
          </v-card-text>

      </div>

        <div class="d-flex status"  col="8 "  md="12" sm="12" xs="12" style="align-items: center">
          <div
            class="page-title-heading statustop"
            style="font-size: 1rem; font-weight: 600"
          >
            Status:
          </div>
          <v-card-text>
            <v-chip-group
              :mandatory="mandatory"
              :column="column"
              v-model="filter"
              active-class="teal white--text"
              class="statuschips"
            >
              <v-chip active @click="Filter(0)" class="chipset">All</v-chip>

              <v-chip @click="Filter(1)" class="chipset">Open</v-chip>
              <v-chip @click="Filter(2)" class="chipset">Inprogress</v-chip>
              <v-chip @click="Filter(3)" class="chipset">Resolved</v-chip>
              <v-chip @click="Filter(4)" class="chipset">Closed</v-chip>
            </v-chip-group>
          </v-card-text>
        </div>
 
    </div>
    <div class="statusIcons">
      <a title="Open">
        <v-chip  class="ma-1" color="#ed8077" label text-color="white">
          <v-icon start icon="mdi-label"></v-icon>
          Open
        </v-chip>
      </a>
      <a title="Inprogress">
        <v-chip class="ma-1" color="#4488c5" label text-color="white">
          <v-icon start icon="mdi-label"></v-icon>
          Inprogress
        </v-chip>
      </a>
      <a title="Resolved">
        <v-chip class="ma-1" color="#5eb5a6" label text-color="white">
          <v-icon start icon="mdi-label"></v-icon>
          Resolved
        </v-chip>
      </a>
      <a title="Closed">
        <v-chip class="ma-1" color="#a1af2f" label text-color="white">
          <v-icon start icon="mdi-label"></v-icon>
          Closed
        </v-chip>
      </a>
    </div>
    <div v-if="value == false">
      <div class="loader"></div>
    </div>
    <div class="GantBox">
      <div v-if="tasks == '' && value == true">
        <p class="NoData">No Data Available</p>
      </div>
      <div v-if="tasks != ''">
        <div v-for="item in tasks" :key="item.item_id">
          <gantt-elastic :tasks="item" :options="options">
            <gantt-elastic-header slot="header"></gantt-elastic-header>
            <gantt-elastic-footer slot="footer"></gantt-elastic-footer>
          </gantt-elastic>
          <br /><br />
        </div>
        <br /><br />
      </div>
    </div>
  </div>
</template>
  <script>
import GanttElastic from "gantt-elastic";
import store from "../../../store/index.js"
import router from "../../../router/index.js";

import "dayjs/locale/es";
import ApiService from "../../../service/apiservice";

export default {
  components: {
    ganttElasticHeader: { template: `<span>工程表見本</span>` }, // or Header
    ganttElastic: GanttElastic,
    ganttElasticFooter: { template: `<span>担当業務</span>` },
  },
  data() {
    return {
      mandatory: true,
      column: true,
      value: false,
      length: 3,
 
      tasks: [],
      status: 0,
      group: 0,
      options,
      grouping: [],
    };
  },
  mounted() {
    this.getChartData();
  },
  methods: {

        redirectTaskUrl(id,taskId){
      localStorage.setItem("taskId",taskId)
      localStorage.setItem("projectId",id)
      this.$store.commit("getData",id);
      this.$store.commit("getTaskData",taskId);
      
    },

    redirectUrl(id){
localStorage.setItem("projectId",id)
    this.$store.commit("getData", id);
  },
    groupFilter(id) {
      this.group = id;
      this.getChartData();
    },
    Filter(id) {
      this.status = id;
      this.getChartData();
    },
    styleGreen(intTaskStatus) {
      const objStyle = {
        1: "#ed8077",
        2: "#4488c5",
        3: "#5eb5a6",
        4: "#a1af2f",
      };
      return {
        base: {
          fill: objStyle[intTaskStatus],
          stroke: "#B0C4DE",
        },
      };
    },

    async getChartData() {
      this.value = false;
      const params = {
        status: this.status,
        group: this.group,
      };

      const response = await ApiService(
        "task/getUserGanttChart",
        "GET",
        null,
        null,
        params
      );
      this.value = true;
      const objs = [...response];
      this.grouping = [];
      for (const element of objs) {
        const objResponse = element.map(
          ({
            task_id,
            task_name,
            assignee_name,
            start,
            duration,
            task_status,
            project_name,
            project_id,
          }) => ({
            id: task_id,
            label: task_name,
            user: assignee_name,
            project_id: project_id,
            project: project_name,
            start: start - 19800000,
            duration: duration,
            progress: "100",
            type: "task",
            style: this.styleGreen(task_status),
          })
        );
      
        this.grouping.push(objResponse);
    
      }
      this.tasks = this.grouping;
    },

  },
};

const options = {
  maxRows: 10,
  maxHeight: 600,
  title: {
    label: "Your project title as html (link or whatever...)",
    html: false,
  },
  row: {
    height: 15,
  },
  calendar: {
    hour: {
      display: false,
    },
  },
  chart: {
    progress: {
      bar: false,
    },
    expander: {
      display: true,
    },
  },
  taskList: {
    expander: {
      straight: false,
    },

    columns: [
      {
        id: 1,
        label: "Task Id",
        value: "id",
        width: 70,
      },
      {
        id: 2,
        label: "Task Name",
        value: "label",
        width: 200,
        events: {
          click({ data }) {
          
          
            localStorage.setItem("taskId",data.id)
      localStorage.setItem("projectId",data.project_id)
      store.commit("getData",data.project_id);
      store.commit("getTaskData",data.id);
      router.push("/task-view" );
    
         
          },
        },
      },
      {
        id: 3,
        label: "Project Name",
        value: "project",
        width: 200,
        events: {
          click({ data }) {
       
      localStorage.setItem("projectId",data.project_id)
      store.commit("getData",data.project_id);
  
            router.push("/home" );
          },
        },
      },
    ],
  },
};
</script>
  
<style scoped>
.GantBox {
  max-width: 1400px !important;



  height: 100%;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
    rgb(209, 213, 219) 0px 0px 0px 1px inset;
}
.statusIcons {
  margin-left: 60%;
  display: flex;

}
.statustop{
  margin-top:0%;
  font-size: 1rem;
   font-weight: 600
}

.groupingdiv{
  display: flex;
  flex-direction: row;
}
/* .status{
  margin-left: -57%;
} */
.NoData {
  font-size: larger;
  display: flex;
  justify-content: center;
}
@media only screen and (max-width: 1600px) {
  .GantBox {
    max-width: 1200px;
  }
}

.loader {
  --height-of-loader: 4px;
  --loader-color: #0071e2;
  width: 100%;
  height: var(--height-of-loader);
  border-radius: 30px;
  background-color: rgba(0, 0, 0, 0.2);
  position: relative;
}

.loader::before {
  content: "";
  position: absolute;
  background: var(--loader-color);
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  border-radius: 30px;
  animation: moving 1s ease-in-out infinite;
}

@keyframes moving {
  50% {
    width: 100%;
  }

  100% {
    width: 0;
    right: 0;
    left: unset;
  }
}
.gantt{

    display: flex;
    flex-direction: row;
    gap:20%;
   

}
.chipset{
  width: 90px;
  justify-content: center;
}




@media screen and (max-width: 1024px){
  .groupingdiv{
  display: flex;
  flex-direction: row;
}
.GantBox {
  max-width: 950px !important;
  }

  
}
@media screen and (max-width:770px){
  .gantt{

display:flex;
flex-direction:column;


}
.statustop{
  margin-top:0%;
  font-size: 1rem;
   font-weight: 600
 
}
.groupingdiv{
  display: flex;
  /* flex-direction: column; */
}

.GantBox {

  max-width: 100%;

  

  height: 100%;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
    rgb(209, 213, 219) 0px 0px 0px 1px inset;
}
.ganttMainDiv{
  /* overflow-x:scroll ; */
  width: 100%;
}
.statusIcons {
  margin-left: 0%;
}
/* .OverflowScroll{
  overflow:scroll;
} */
.status{
  margin-left: 0%;
}

}


@media screen and (max-width:500px){
  .statustop{
  margin-top:-12%;
  font-size: 1rem;
   font-weight: 600
 
}
  
}
@media screen and (max-width:400px){
  .statustop{
  margin-top:-25%;
  font-size: 1rem;
   font-weight: 600
 
}
  
}
@media screen and (max-width:280px){

  .statusIcons {
 
margin-left: 0%;
display: flex;
flex-wrap: wrap;
}
.statustop{
  margin-top:-65%;
  font-size: 1rem;
   font-weight: 600
 
}


}


</style>



