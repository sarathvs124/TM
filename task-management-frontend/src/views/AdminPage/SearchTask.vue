<template>
  <v-col
    class="d-flex searchBar"
    style="margin-top: -3%; margin-left: 75%"
    height="3%"
  >
    <v-form
      ref="form"
      action=""
      @keyup.enter="searchTask"
      @submit.prevent="searchTask()"
    >
      <v-text-field
        type="search"
        v-model="normalSearch.keyWord"
        label="Search Task"
        outlined
        rounded
        clearable
        prepend-inner-icon="mdi-magnify"
        dense
      ></v-text-field>
    </v-form>
  </v-col>
</template>
<script>

import "vue-toast-notification/dist/theme-sugar.css";
import ApiService from "../../service/apiservice.js";

export default {
  data() {
    return {
      normalSearch: {
        status: "",
        subtasking: "",
        keyWord: "",
      },
    };
  },

  method: {
    async searchTask() {
        
        console.log(this.normalSearch.keyWord,"search")
      try {
        const id = this.$route.params.id;
        const response = await ApiService(
          "/task/tasklist/" + id,
          "POST",
          this.normalSearch
        );

        this.task_list = { task: response?.data };
        console.log(this.task_list, "task list");


        this.handlePageChange();
      } catch (error) {
       console.log(error);
      }
    },
   
  },

  watch: {
    searchKey: function () {
      this. searchTask()
    },
  },
};
</script>
