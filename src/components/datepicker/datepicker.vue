<template>
    <div class="datepicker-container">
        <div class="datepicker-select-outer-container">
            <span class="datepicker-select-container">
                <span class="datepicker-select" @click="toggleSelect(opSelectType.year)">
                    {{ selectAnchorYear }}
                </span>
                <ul class="datepicker-options" v-show="showSelectYearBool"
                    :class="{'datepicker-options-fixed-ht': anchorYearArr.length > 10}">
                    <li v-for="year in anchorYearArr">
                        <span @click="selectYear(year)"
                              :class="{'datepicker-options-current': year === selectAnchorYear}">
                            {{ year }}
                        </span>
                    </li>
                </ul>
            </span>
            <span class="datepicker-select-container" v-if="false">
                <span class="datepicker-select" @click="toggleSelect(opSelectType.month)">
                    {{ selectAnchorMonth }}
                </span>
                <ul class="datepicker-options" v-show="showSelectMonthBool">
                    <li v-for="month in 12">
                        <span @click=""
                              :class="{'datepicker-options-current': false}">
                            {{ month }}
                        </span>
                    </li>
                </ul>
            </span>
        </div>
        <div class="datepicker-close-container">
            <img src="../../assets/img/icon-close.png" alt="close" @click="close">
        </div>
        <div class="datepicker-title-container" v-show="!!title">
            <span class="datepicker-title">{{ title }}</span>
        </div>
        <div v-for="monthData in calendarData">
            <div class="datepicker-month-title">
                <span :id="`anchor-${monthData.year}-${monthData.month}`">
                    {{ t(`month.${monthData.month}.name`) }} {{ monthData.year }}
                </span>
            </div>
            <div class="datepicker-week">
                <div>{{ t('week.sunday.abbr') }}</div>
                <div>{{ t('week.monday.abbr') }}</div>
                <div>{{ t('week.tuesday.abbr') }}</div>
                <div>{{ t('week.wednesday.abbr') }}</div>
                <div>{{ t('week.thursday.abbr') }}</div>
                <div>{{ t('week.friday.abbr') }}</div>
                <div>{{ t('week.saturday.abbr') }}</div>
            </div>
            <div class="datepicker-day" v-for="weekData in monthData.dateArr">
                <div v-for="dayData in weekData"
                     :class="{'not-optional': !dayData.canBeSelected, 'selected': dayData.isLastSelectedDate}"
                     @click="selectDate(monthData.year, monthData.month, dayData)">
                    {{ dayData.day }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { DATE_TYPE_ENUM } from '../../assets/js/const.js';
    import { getDateByDiffDay, zeroFormat, getWeekDay } from '../../assets/js/util.js';
    import { t } from '../../assets/js/i18n/i18n.js';

    export default {
        name: 'datepicker',
        data() {
            return {
                calendarData: [],
                defaultMinDate: -10,
                defaultMaxDate: 10,
                startDate: '',
                endDate: '',
                lastSelectedDate: '',
                selectAnchorYear: t('chooseYear', this.lang),
                selectAnchorMonth: 'month',
                opSelectType: {
                    year: Symbol(),
                    month: Symbol(),
                },
                anchorYearArr: [], // 可选的年份
                showSelectYearBool: false,
                showSelectMonthBool: false
            }
        },
        props: [
            'title', 'minDate', 'maxDate', 'lang'
        ],
        created() {
            this.initData();
        },
        methods: {
            initData() {
                let minDate = this.getDate(this.minDate, DATE_TYPE_ENUM.minDate);
                let maxDate = this.getDate(this.maxDate, DATE_TYPE_ENUM.maxDate);
                this.startDate = minDate;
                this.endDate = maxDate;
                if (this.startDate.getTime() > this.endDate.getTime()) {
                    return;
                }
                let curYear = this.startDate.getFullYear();
                let curMonth = this.startDate.getMonth() + 1;
                let endYear = this.endDate.getFullYear();
                let endMonth = this.endDate.getMonth() + 2;
                while (curMonth !== endMonth || curYear !== endYear) {
                    let curData = {
                        year: curYear,
                        month: curMonth,
                        dateArr: this.getMonthData(curYear, curMonth)
                    };
                    this.calendarData.push(curData);
                    this.anchorYearArr.push(curYear);
                    if (curMonth === 12) {
                        curYear++;
                        curMonth = 1;
                    } else {
                        curMonth++;
                    }
                }
                // 可选年份去重
                this.anchorYearArr = Array.from(new Set(this.anchorYearArr));
            },
            selectDate(year, month, dayData) {
                if (!dayData.canBeSelected) {
                    return;
                }
                let selectResult = `${year}-${zeroFormat(month)}-${zeroFormat(dayData.day)}`
                // 将上一个选择日期的isLastSelectedDate置为false；同时将当前所选日期的isLastSelectedDate置为true
                this.setIsLastSelectedDate(this.lastSelectedDate, false);
                this.setIsLastSelectedDate(selectResult, true);
                this.lastSelectedDate = selectResult;
                this.close();
                this.$emit('selectDate', selectResult);
            },
            close() {
                this.closeSelect(this.opSelectType.year);
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
                // monthDataPerWeek是monthRawData按每周七天分割的二层数组
                let monthDataPerWeek = [];
                let monthRawData = [];
                // IOS safari Date的month必须为两位数
                let formatMonth = zeroFormat(month);
                // 获取这个月的天数
                let lastDate = new Date(year, formatMonth, 0);
                let dayCount = lastDate.getDate();
                // 将day存入数组
                let startDateMilliTime = this.startDate.getTime();
                let endDateMilliTime = this.endDate.getTime();
                for (let day = 1; day <= dayCount; day++) {
                    let fullDate = new Date(`${year}-${formatMonth}-${zeroFormat(day)}`);
                    monthRawData.push({
                        day: day,
                        canBeSelected: ((fullDate.getTime() >= startDateMilliTime) && (fullDate.getTime() <= endDateMilliTime)),
                        // TODO 为以后实现选择两个日期（比如往返程日期）的场景预留的字段
                        isInSelectedRange: false,
                        isLastSelectedDate: false,
                        fullDate: fullDate
                    });
                }
                // 计算本月第一天为周几
                let weekDay = getWeekDay(year, formatMonth, 1);
                // 添加空串到数组（保持数组第一天为周日）
                for (let i = 0; i < weekDay; i++) {
                    monthRawData.unshift({
                        day: ''
                    });
                }
                // 按照每周七天分割
                for (let i = 0; i < monthRawData.length; i += 7) {
                    monthDataPerWeek.push(monthRawData.slice(i, i + 7));
                }
                // 补足后面的空串（如最后一周有三个数据，则需要补四个空串）
                let lastWeekIndex = monthDataPerWeek.length - 1;
                let lenOfLastWeek = monthDataPerWeek[(lastWeekIndex)].length;
                let oneWeekLen = 7;
                if (lenOfLastWeek < oneWeekLen) {
                    let leftDayLen = oneWeekLen - lenOfLastWeek;
                    for (let i = 0; i < (leftDayLen); i++) {
                        monthDataPerWeek[(lastWeekIndex)].push({
                            day: ''
                        });
                    }
                }
                return monthDataPerWeek;
            },
            setIsLastSelectedDate(dateStr, isSelected) {
                let reg = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})$/;
                let results = reg.exec(dateStr);
                if (Array.isArray(results) && results.length > 3) {
                    let year = parseInt(results.groups.year);
                    let month = parseInt(results.groups.month);
                    let day = parseInt(results.groups.day);
                    let dateArr = this.calendarData.find((item) => {
                        return item.month === month && item.year === year;
                    }).dateArr;
                    for (let i = 0; i < dateArr.length; i++) {
                        for (let j = 0; j < dateArr[i].length; j++) {
                            if (dateArr[i][j].day === day) {
                                dateArr[i][j].isLastSelectedDate = isSelected;
                                return;
                            }
                        }
                    }
                }
            },
            toggleSelect(opType) {
                if (opType === this.opSelectType.year) {
                    this.showSelectYearBool = !this.showSelectYearBool;
                } else {
                    this.showSelectMonthBool = !this.showSelectMonthBool;
                }
            },
            closeSelect(opType) {
                if (opType === this.opSelectType.year) {
                    this.showSelectYearBool = false;
                } else {
                    this.showSelectMonthBool = false;
                }
            },
            selectYear(year) {
                this.selectAnchorYear = year;
                this.closeSelect(this.opSelectType.year);
                window.location.href = `#anchor-${year}-1`;
            },
            t(key) {
                return t(key, this.lang);
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/css/reset.css";
    @import "../../assets/css/util.scss";
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
        height: px2vw($close-width + 2 * $close-vertical-margin);
    }
    .datepicker-close-container > img {
        position: absolute;
        top: 0;
        right: 0;
        width: px2vw($close-width);
        height: px2vw($close-width);
        margin-top: px2vw($close-vertical-margin);
        margin-right: px2vw($close-vertical-margin);
    }
    .datepicker-title-container {
        height: px2vw(44px);
        line-height: px2vw(44px);
        padding-left: px2vw(24px);
        background: rgba(0,0,0,0.04);
    }
    .datepicker-title {
        font-size: px2vw(18px);
        color: rgb(52,52,52);
        letter-spacing: 0;
    }
    /* Start select */
    .datepicker-select-outer-container {
        position: fixed;
        padding-left: px2vw(24px);
        padding-right: px2vw(24px);
        padding-top: px2vw(16px);
    }
    .datepicker-select-outer-container > span:nth-child(2) {
        float: right;
    }
    .datepicker-select-container {
        height: px2vw(24px);
        line-height: px2vw(24px);
    }
    $datepicker-select-width: 70px;
    $datepicker-select-text-pl: 19px;
    .datepicker-select {
        display: inline-block;
        width: px2vw($datepicker-select-width - $datepicker-select-text-pl);
        height: px2vw(24px);
        padding-left: px2vw($datepicker-select-text-pl);
        line-height: px2vw(24px);
        border: px2vw(1px) solid #cccccc;
        border-radius: px2vw(4px);
        background: url('../../assets/img/icon-pullup.png') no-repeat 95% center #ffffff;
        background-size: px2vw(15px) px2vw(15px);
        font-size: px2vw(12px);
        color: rgba(0, 0, 0, 0.85);
        letter-spacing: 0;
    }
    .datepicker-options {
        width: px2vw($datepicker-select-width);
        position: absolute;
        @include boxShadow(0, px2vw(2px), px2vw(4px), px2vw(1px), rgba(0, 0, 0, 0.25));
        border-radius: px2vw(4px);
    }
    $datepicker-options-lh: 18px;
    $datepicker-options-fs: 12px;
    $datepicker-options-pr: 12px;
    $datepicker-options-pt: 1px;
    $datepicker-options-pb: 1px;
    $datepicker-options-bottom-size: 1px;
    .datepicker-options > li {
        display: block;
    }
    .datepicker-options > li > span {
        display: block;
        padding-right: px2vw($datepicker-options-pr);
        line-height: px2vw($datepicker-options-lh);
        text-align: right;
        font-weight: normal;
        padding-top: px2vw($datepicker-options-pt);
        padding-bottom: px2vw($datepicker-options-pb);
        border-bottom: $datepicker-options-bottom-size solid #c6c2c1;
        font-size: px2vw($datepicker-options-fs);
        background-color: #ffffff;
        color: rgba(0, 0, 0, 0.65);
    }
    $datepicker-options-show-length: 10;
    .datepicker-options-fixed-ht {
        height: px2vw($datepicker-options-show-length * ($datepicker-options-pt
            + $datepicker-options-lh + $datepicker-options-pb + $datepicker-options-bottom-size));
        @include overflowScroll();
    }
    .datepicker-options > li > span[class~=datepicker-options-current] {
        background: #3684FF;
        color: #ffffff;
    }
    /* End select */
    .datepicker-month-title {
        height: px2vw(54px);
        line-height: px2vw(54px);
        text-align: center;
    }
    .datepicker-month-title > span {
        opacity: 0.85;
        font-size: px2vw(18px);
        color: rgba(0,0,0,0.85);
        letter-spacing: 0;
    }
    .datepicker-week {
        font-size: 0;
    }
    .datepicker-week > div{
        display: inline-block;
        width: 14.27%;
        line-height: px2vw(32px);
        text-align: center;
        font-size: px2vw(12px);
        color: rgba(0,0,0,0.85);
        letter-spacing: 0;
        font-weight: 800;
    }
    .datepicker-day > div {
        display: inline-block;
        width: 14.27%;
        line-height: px2vw(32px);
        text-align: center;
        font-size: px2vw(12px);
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