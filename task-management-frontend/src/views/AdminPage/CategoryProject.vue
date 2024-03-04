<template>
  <div>
    <h6>Category</h6>
    <div class="card-shadow-danger mb-3 widget-chart widget-chart2 text-left card MainCardShadow">
      <div class="widget-content" style="word-break: break-all">
        <div class="widget-content-outer">
          <div class="widget-content-wrapper">
            <div class="widget-content-left pr-2 fsize-1" id="headingFlex">
              <div v-for="categories in category" :key="categories.id">
                <div class="widget-content-right w-100">
                  <div class="progress-sub-label">
                    <div class="sub-label-right" id="heading">{{ categories.category }}</div>
                  </div>
                  <div class="progress-bar-xs progress" style="word-wrap: break-word">
                    <div
                    title="Open"
                      class="progress-bar bg-danger"
                      role="progressbar"
                      aria-valuenow="10"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      :style="{ width: categories.openPercent + '%' }"

                    >
                    </div>
                    <div
                      class="progress-bar bg-primary"
                      role="progressbar"
                      aria-valuenow="20"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      title="Inprogress"
                      :style="{ width: categories.inprogressPercent + '%' }"

                    ></div>
                    <div
                      class="progress-bar bg-warning"
                      role="progressbar"
                      aria-valuenow="60"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      title="Resolved"

                      :style="{ width: categories.resolvedPercent + '%' }"

                    ></div>
                    <div
                      class="progress-bar bg-success"
                      role="progressbar"
                      aria-valuenow="10"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      title="Closed"
                      :style="{ width: categories.closedPercent + '%' }"
                    ></div>
                  </div>
                  <div class="progress-sub-label">
                    <div class="sub-label-right">Closed {{ categories.closedPercent }}%</div>
                    &nbsp;&nbsp;&nbsp;
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    category: Object,

  },
  data() {
    return {
      projectId:"",
      closed: "",
      category: [],
    };
  },
  methods: {
    async ProjectStatus() {
      try {


        this.projectStatus = response.categoryPercentage;
        this.category = response.categoryPercentage;
        this.inProgress =
          (this.projectStatus.inProgress * 100) / this.projectStatus.total_task;
        this.closed = this.projectStatus[0].percent;
        this.openTask =
          (this.projectStatus.openTask * 100) / this.projectStatus.total_task;
        this.resolved =
          (this.projectStatus.resolved * 100) / this.projectStatus.total_task;
        this.projectRole = localStorage.getItem("projectRole");
      } catch (error) {
        console.log("ee",error)
        const response= error?.response?.data
        if (response?.statusCode == 50 || response?.statusCode==399) {
          this.$router.push("/dashboard");
        }
       
      }
    },
  },
  mounted() {
    this.projectId= this.$store.state.projectId;

localStorage.setItem("projectId",this.projectId)

    this.ProjectStatus();
  },
};
</script>
<style scoped>
h6 {
  font-weight: bold;
}
#headingFlex {
  display: flex;
  flex-direction: column;
  width: 100%;
}
#heading {
  font-weight: bold;
  margin-top: 20px;
  color: olivedrab;
}
.MainCardShadow{
  overflow-y: scroll;
  height: 350px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
}
</style>
