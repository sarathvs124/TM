import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import CKEditor from '@ckeditor/ckeditor5-vue2';
import VTooltip from "v-tooltip";
import "./assets/tooltip.css";



Vue.config.productionTip = false
Vue.use( CKEditor ,VTooltip);
new Vue({
  router,
  store,
  vuetify,
 
  render: h => h(App)
}).$mount('#app')
