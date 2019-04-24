<template>
    <div class="datepicker-container">
        <div class="datepicker-close-container">
            <img src="../../assets/img/icon-close.png" alt="close">
        </div>
        <button @click="selectDate">select {{ selectedDate }}</button>
    </div>
</template>

<script>
    export default {
        name: 'datepicker',
        data() {
            return {
                selectedDate: '2019-01-01'
            }
        },
        props: ['testProp'],
        created() {
            console.log('datepicker created ... ');
        },
        methods: {
            selectDate() {
                this.$emit('selectDate', this.selectedDate);
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/css/reset.css";
    .datepicker-container {
        position: fixed;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        background: #fff;
    }
    $close-vertical-margin: 16px;
    $close-width: 22px;
    .datepicker-close-container {
        height: $close-width + 2 * $close-vertical-margin
    }
    .datepicker-close-container img {
        position: absolute;
        top: 0;
        right: 0;
        width: $close-width;
        height: $close-width;
        margin-top: $close-vertical-margin;
        margin-right: $close-vertical-margin;
    }
</styles>