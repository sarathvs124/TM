<template>
  <div class="OverflowScroll">
    <div class="btngroups"   >
      <div  >
        <div class="d-flex groupingDiv" style="align-items: center">
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
              <v-chip @click="groupFilter(0)" active class="chipset"
                >None</v-chip
              >

              <v-chip @click="groupFilter(1)" class="chipset">Assignee</v-chip>
            </v-chip-group>
          </v-card-text>
        </div>
      </div>
      <div   >
        <div class="d-flex StatusDiv">
          <div
            class="page-title-heading statustop"
          
          >
            Status:
          </div>
          <v-card-text>
            <v-chip-group
              :mandatory="mandatory"
              :column="column"
              v-model="filter"
              active-class="teal white--text"
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
    </div>
    <div class="statusIcons">
      <a title="Open">
        <v-chip class="ma-1 chipset" color="#ed8077" label text-color="white">
          <v-icon start icon="mdi-label"></v-icon>
          Open
        </v-chip>
      </a>
      <a title="Inprogress">
        <v-chip class="ma-1 chipset" color="#4488c5" label text-color="white">
          <v-icon start icon="mdi-label"></v-icon>
          Inprogress
        </v-chip>
      </a>
      <a title="Resolved">
        <v-chip class="ma-1 chipset" color="#5eb5a6" label text-color="white">
          <v-icon start icon="mdi-label"></v-icon>
          Resolved
        </v-chip>
      </a>
      <a title="Closed">
        <v-chip class="ma-1 chipset" color="#a1af2f" label text-color="white">
          <v-icon start icon="mdi-label"></v-icon>
          Closed
        </v-chip>
      </a>
    </div>

    <div class="GantBox">
      <div v-if="tasks == ''">
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
      </div>
    </div>
  </div>
</template>
  <script>
import router from "../../router/index.js";
import store from "../../store/index.js";
import GanttElastic from "gantt-elastic";
import "dayjs/locale/es";
import ApiService from "../../service/apiservice";

export default {
  components: {
    ganttElastic: GanttElastic,
  },
  data() {
    return {
      mandatory: true,
      column: true,
      length: 3,
      grouping: [],
      tasks: [],
      status: 0,
      group: 0,
      options,
    };
  },
  mounted() {
    this.projectId = this.$store.state.projectId;
    if (this.projectId === "null") {
      this.$router.push("/dashboard");
    }
    localStorage.setItem("projectId", this.projectId);

    this.getChartData();
  },
  methods: {
    groupFilter(id) {
      this.tasks = [];
      this.group = id;
      this.getChartData();
    },
    Filter(id) {
      this.tasks = [];

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
      const params = {
        status: this.status,
        group: this.group,
      };
      const id = this.projectId;

      const response = await ApiService(
        "task/getGanttChart/" + id,
        "GET",
        null,
        null,
        params
      );
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
            project_id,
          }) => ({
            id: task_id,
            label: task_name,
            user: assignee_name,
            project_id: project_id,
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
  maxRows: 100,
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
        width: 160,
        style: {
          "task-list-header-label": {
            cursor: "pointer",
          },
        },
        events: {
          click({ data }) {
            localStorage.setItem("taskId", data.id);
            localStorage.setItem("projectId", data.project_id);
            store.commit("getData", data.project_id);
            store.commit("getTaskData", data.id);
            router.push("/task-view");
          },
        },
      },
      {
        id: 3,
        label: "Assignee",
        value: "user",
        width: 130,
        html: true,
      },
    ],
  },
};
</script>
  
<style scoped>
.GantBox {
  max-width: 100%;
  margin-right: -10%;
  height: 100%;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
    rgb(209, 213, 219) 0px 0px 0px 1px inset;
}
.statusIcons{
  margin-left: 70%;

}
.statustop{
  margin-top:0%;
  font-size: 1rem;
   font-weight: 600
}
.groupingDiv{
  display: flex;
  flex-direction: row;
}
.StatusDiv{
  align-items: center;
}
.NoData {
  font-size: larger;
  display: flex;
  justify-content: center;
}
.btngroups{
  display: flex;
  flex-direction: row;

}
@media only screen and (max-width: 1450px) {
  .GantBox {
    max-width: 100%;
  }
  .statusIcons{
    margin-left: 55%;
  }
}

.chipset {
  width: 90px;
  justify-content: center;
}
@media screen and (max-width: 700px) {
  .OverflowScroll {
    overflow-x: scroll;
  }
  .btngroups{
  display: flex;
  flex-direction:column ;
  flex-wrap: wrap;
}
.statusIcons{
    margin-left: 0%;
  }
  .GantBox {
    max-width:100%;
  margin-right: -10%;
  height: 100%;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
    rgb(209, 213, 219) 0px 0px 0px 1px inset;

    overflow-x: scroll;

}
.groupingDiv{
  display: flex;
  flex-direction: row;
}
.StatusDiv{
  align-items: center;
   margin-left:0%
}
.statustop{
  margin-top:-25%;
  font-size: 1rem;
   font-weight: 600
 
}

}
</style>