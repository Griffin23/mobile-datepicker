import Vue from 'vue';
import App from './App.vue';

import moment from 'moment';

import datepicker from './index.js';

Vue.use(datepicker);

Vue.prototype.$moment = moment;

new Vue({
  el: '#app',
  render: h => h(App)
});
