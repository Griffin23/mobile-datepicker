<template>
    <div id="app">
        App.vue - {{ msg }}
        <div>
            date: <input type="text" v-model="selectedDate" @click="showDatepicker">
        </div>
        <datepicker
                v-show="showDatepickerBool"
                :title="'Date'"
                :min-date="'xx'"
                :max-date="'xx'"
                @selectDate="selectDate"
                @closeDatepicker="closeDatepicker"></datepicker>
    </div>
</template>

<script>
    export default {
        name: 'app',
        data() {
            return {
                msg: 'Welcome to Your Vue.js App',
                showDatepickerBool: false,
                selectedDate: ''
            }
        },
        methods: {
            showDatepicker() {
                this.showDatepickerBool = true;
            },
            closeDatepicker() {
                this.showDatepickerBool = false;
            },
            selectDate(result) {
                this.selectedDate = result;
            }
        }
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
