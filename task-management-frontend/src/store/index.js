import Vue from 'vue'
import Vuex from 'vuex'
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    projectId: localStorage.getItem("projectId"),
    taskId: localStorage.getItem("TaskId")
  },
  getters: {
  },
  mutations: {
    getData(state, Id) {
      state.projectId = Id;
      
    },

    getTaskData(state,taskId){
      localStorage.setItem("taskId",taskId)

      state.taskId = taskId;
     
    }
  },
  actions: {
  },
  modules: {
  }
})
