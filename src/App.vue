<template>
  <div id="app" style="height: 2000px">
    App.vue - {{ msg }}
    <div>
      date:
      <input
        type="text"
        readonly
        v-model="selectedDate"
        @click="showDatepicker"
        style="cursor: default"
      >
    </div>
    <datepicker
      :options="datepickerOptions"
      :show="isShowDatePicker"
      @selectDate="selectDate"
      @closeDatepicker="closeDatepicker"
    />
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      isShowDatePicker: false,
      selectedDate: '',
      datepickerOptions: {
        lang: 'en',
        title: 'your title',
        minDate: '2001-01-01',
        maxDate: '10',
        format: 'MM-DD-YYYY',
      },
    }
  },
  methods: {
    showDatepicker() {
      this.isShowDatePicker = true
    },
    closeDatepicker() {
      this.isShowDatePicker = false
    },
    selectDate(result) {
      this.selectedDate = result
    },
  },
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
