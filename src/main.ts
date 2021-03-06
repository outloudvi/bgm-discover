import Vue from 'vue';
import Element from 'element-ui';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store/state';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;

Vue.use(Element);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
