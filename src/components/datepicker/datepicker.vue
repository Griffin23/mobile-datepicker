<template>
    <div class="datepicker-container">
        <div class="datepicker-close-container">
            <img src="../../assets/img/icon-close.png" alt="close">
        </div>
        <div class="datepicker-title-container">
            <span class="datepicker-title">可自定义的标题</span>
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
        text-align: initial;
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
    .datepicker-title-container {
        height: 44px;
        line-height: 44px;
        padding-left: 24px;
        background: rgba(0,0,0,0.04);
    }
    .datepicker-title {
        opacity: 0.85;
        font-size: 18px;
        color: rgba(0,0,0,0.85);
        letter-spacing: 0;
    }
</styles>