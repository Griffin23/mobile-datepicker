<template>
    <div class="datepicker-container">
        <div class="datepicker-close-container">
            <img src="../../assets/img/icon-close.png" alt="close" @click="close">
        </div>
        <div class="datepicker-title-container" v-show="!!title">
            <span class="datepicker-title">{{ title }}</span>
        </div>
        <div v-for="index in 2">
            <div class="datepicker-month-title">
                <span>2019 {{ index }}月</span>
            </div>
            <div class="datepicker-week">
                <div>日</div>
                <div>一</div>
                <div>二</div>
                <div>三</div>
                <div>四</div>
                <div>五</div>
                <div>六</div>
            </div>
            <div class="datepicker-day">
                <div v-for="index in 30">
                    {{ index }}
                </div>
            </div>
        </div>
        <button @click="selectDate" v-show="false">select {{ selectedDate }}</button>
    </div>
</template>

<script>
    import { DATE_TYPE_ENUM } from '../../assets/js/const.js';
    import { getDateByDiffDay } from '../../assets/js/util.js';

    export default {
        name: 'datepicker',
        data() {
            return {
                calendarData: [],
                defaultMinDate: -10,
                defaultMaxDate: 10,
                selectedDate: '2019-01-01'
            }
        },
        props: [
            'title', 'minDate', 'maxDate'
        ],
        created() {
            this.initData();
        },
        methods: {
            initData() {
                let minDate = this.getDate(this.minDate, DATE_TYPE_ENUM.minDate);
                let maxDate = this.getDate(this.maxDate, DATE_TYPE_ENUM.maxDate);
                if (minDate.getTime() > maxDate.getTime()) {
                    return;
                }
                let curYear = minDate.getFullYear();
                let curMonth = minDate.getMonth() + 1;
                let endYear = maxDate.getFullYear();
                let endMonth = maxDate.getMonth() + 2;
                while (curMonth !== endMonth || curYear !== endYear) {
                    let curData = {
                        year: curYear,
                        month: curMonth,
                        dateArr: this.getMonthData(curYear, curMonth)
                    };
                    this.calendarData.push(curData);
                    if (curMonth === 12) {
                        curYear++;
                        curMonth = 1;
                    } else {
                        curMonth++;
                    }
                }
                console.log(this.calendarData);
            },
            selectDate() {
                this.$emit('selectDate', this.selectedDate);
            },
            close() {
                this.$emit('closeDatepicker');
            },
            getDate(dateStr, dateType) {
                // 处理传入 yyyy-MM-dd 的情况
                let reg = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})$/;
                let results = reg.exec(dateStr);
                if (Array.isArray(results) && results.length > 3) {
                    let d = new Date();
                    d.setFullYear(results.groups.year, parseInt(results.groups.month) - 1, results.groups.day);
                    return d;
                }
                // 处理传入 相对天数 的情况
                if (Number.isInteger(dateStr)) {
                    return getDateByDiffDay(dateStr);
                }
                return getDateByDiffDay((dateType === DATE_TYPE_ENUM.minDate) ? this.defaultMinDate : this.defaultMaxDate);
            },
            getMonthData(year, month) {
                // TODO
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
    .datepicker-close-container > img {
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
    .datepicker-month-title {
        height: 54px;
        line-height: 54px;
        text-align: center;
    }
    .date-picker-month-title > span {
        opacity: 0.85;
        font-size: 18px;
        color: rgba(0,0,0,0.85);
        letter-spacing: 0;
    }
    .datepicker-week {
        font-size: 0;
    }
    .datepicker-week > div{
        display: inline-block;
        width: 14.27%;
        line-height: 32px;
        text-align: center;
        font-size: 12px;
        color: rgba(0,0,0,0.85);
        letter-spacing: 0;
        font-weight: 800;
    }
    .datepicker-day > div {
        display: inline-block;
        width: 14.27%;
        line-height: 32px;
        text-align: center;
        font-size: 12px;
        color: rgba(0,0,0,0.64);
        letter-spacing: 0;
    }
    .datepicker-day .selected {
        color: #ffffff;
        background-color: #3684FF;
    }
    .not-optional {
        opacity: 0.26;
    }
    .in-date-range {
        background: rgba(0,0,0,0.09);
    }
</style>