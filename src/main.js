import Vue from 'vue'
import App from './App.vue'
import CxltToastr from 'cxlt-vue2-toastr'
import 'cxlt-vue2-toastr/dist/css/cxlt-vue2-toastr.css'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

let toastrConfigs = {
    position: 'top right',
    showDuration: 5000
};

Vue.use(VueMaterial);
Vue.use(CxltToastr, toastrConfigs);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
