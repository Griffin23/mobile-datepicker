import Vue from 'vue';
import App from './App.vue';

import datepicker from './index.js';

Vue.use(datepicker);

new Vue({
  el: '#app',
  render: h => h(App)
});
