<template>
  <div class="datepicker-container" v-show="show">
    <div class="datepicker-modal-container">
      <div class="datepicker-title-container">
        <div class="datepicker-title">{{ options.title }}</div>
        <div class="flex-place-holder"></div>
        <img src="../../assets/img/icon-close.png" alt="close" @click="close" class="datepicker-close-img">
      </div>
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
      </div>
      <div class="datepicker-content-container">
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
                 :class="{'not-optional': !dayData.canBeSelected, 'selected': dayData.isCurSelectedDate}"
                 @click="selectDate(monthData.year, monthData.month, dayData)">
              {{ dayData.day }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { DATE_TYPE_ENUM } from '../../assets/js/const.js';
  import { getDateByDiffDay, zeroFormat, getWeekDay, addScrollFixEventListener } from '../../assets/js/util.js';
  import { t } from '../../assets/js/i18n/i18n.js';
  import moment from 'moment';

  export default {
    name: 'datepicker',
    data() {
      return {
        calendarData: [],
        defaultMinDate: -10,
        defaultMaxDate: 10,
        startDate: '',
        endDate: '',
        curSelectDateObj: {
          year: '',
          month: '',
          day: '',
        },
        selectAnchorYear: '',
        selectAnchorMonth: 'month',
        opSelectType: {
          year: Symbol(),
          month: Symbol(),
        },
        anchorYearArr: [], // 可选的年份
        showSelectYearBool: false,
        showSelectMonthBool: false,
        language: 'en'
      };
    },
    props: [
      'show',
      // options示例
      // {
      //   lang: 'en',
      //   title: 'custom title11',
      //   minDate: '2019-01-01',
      //   maxDate: '10',
      //   format: 'MM-DD-YYYY',
      // }
      'options'
    ],
    watch: {
      show(newVal) {
        // 禁止背景层发生滚动（全局滚动）
        document.body.style.overflow = (!!newVal) ? 'hidden' : 'visible';
      }
    },
    created() {
      this.options = this.options || {};
      this.setLanguage();
      this.initData();
      this.$nextTick(() => {
        addScrollFixEventListener(document.getElementsByClassName('datepicker-container')[0]);
      });
    },
    methods: {
      initData() {
        this.selectAnchorYear = t('chooseYear', this.language);
        this.startDate = this.getDate(this.options.minDate, DATE_TYPE_ENUM.minDate);
        this.endDate = this.getDate(this.options.maxDate, DATE_TYPE_ENUM.maxDate);
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
      setLanguage() {
        this.language = this.options.lang || this.language;
      },
      getFormattedDate(year, month, day) {
        let dateStr = zeroFormat(year) + zeroFormat(month) + zeroFormat(day);
        return moment(dateStr, 'YYYYMMDD').format(this.options.format || 'YYYY-MM-DD');
      },
      selectDate(year, month, dayData) {
        if (!dayData.canBeSelected) {
          return;
        }
        let selectResult = this.getFormattedDate(year, month, dayData.day);
        // 将上一个选择日期的isCurSelectedDate置为false；同时将当前所选日期的isCurSelectedDate置为true
        this.setIsCurSelectedDate(this.curSelectDateObj, false);
        this.curSelectDateObj = {
          year: year,
          month: month,
          day: dayData.day
        };
        this.setIsCurSelectedDate(this.curSelectDateObj, true);
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
            isCurSelectedDate: false,
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
      setIsCurSelectedDate(dateObj, isSelected) {
        let year = parseInt(dateObj.year);
        let month = parseInt(dateObj.month);
        let day = parseInt(dateObj.day);
        let monthData = this.calendarData.find((item) => {
          return item.month === month && item.year === year;
        });
        let dateArr = (!monthData) ? [] : monthData.dateArr;
        for (let i = 0; i < dateArr.length; i++) {
          for (let j = 0; j < dateArr[i].length; j++) {
            if (dateArr[i][j].day === day) {
              dateArr[i][j].isCurSelectedDate = isSelected;
              return;
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
        return t(key, this.language);
      }
    }
  };
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
    font-size: 16px;

    @include large-screen-style {
      background-color: rgba(0, 0, 0, 0.5);
    }

    .datepicker-modal-container {
      background-color: #FFF;

      @include large-screen-style {
        position: fixed;
        width: px2em(700px);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }

  $close-vertical-margin: 16px;
  $close-width: 22px;
  .datepicker-close-container {
    height: px2em($close-width + 2 * $close-vertical-margin);
  }

  .datepicker-close-container > img {
    position: absolute;
    top: 0;
    right: 0;
    width: px2em($close-width);
    height: px2em($close-width);
    margin-top: px2em($close-vertical-margin);
    margin-right: px2em($close-vertical-margin);

    @include large-screen-style {
      width: px2em(24px);
      height: px2em(24px);
    }
  }

  .datepicker-title-container {
    display: flex;
    align-items: center;
    line-height: px2em(44px);
    padding: 0 px2em(24px);
    background: rgba(0, 0, 0, 0.04);

    .datepicker-title {
      font-size: px2em(18px);
      color: rgb(52, 52, 52);
      letter-spacing: 0;
    }

    .datepicker-close-img {
      height: px2em(24px);
      width: px2em(24px);
    }
  }

  // region select

  .datepicker-select-outer-container {
    padding-left: px2em(24px);
    padding-right: px2em(24px);
    padding-top: px2em(16px);

    @include small-screen-style {
      position: fixed;
    }
  }

  .datepicker-select-outer-container > span:nth-child(2) {
    float: right;
  }

  .datepicker-select-container {
    height: px2em(24px);
    line-height: px2em(24px);
  }

  $datepicker-select-width: 70px;
  $datepicker-select-text-pl: 19px;
  .datepicker-select {
    font-size: px2em(12px);
    display: inline-block;
    width: px2em($datepicker-select-width - $datepicker-select-text-pl, 12px);
    height: px2em(24px, 12px);
    padding-left: px2em($datepicker-select-text-pl, 12px);
    line-height: px2em(24px, 12px);
    border: px2em(1px, 12px) solid #cccccc;
    border-radius: px2em(4px, 12px);
    background: url('../../assets/img/icon-pullup.png') no-repeat 95% center #ffffff;
    background-size: px2em(15px, 12px) px2em(15px, 12px);
    color: rgba(0, 0, 0, 0.85);
    letter-spacing: 0;
  }

  .datepicker-options {
    width: px2em($datepicker-select-width);
    position: absolute;
    @include boxShadow(0, px2em(2px), px2em(4px), px2em(1px), rgba(0, 0, 0, 0.25));
    border-radius: px2em(4px);
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
    padding-right: px2em($datepicker-options-pr);
    line-height: px2em($datepicker-options-lh);
    text-align: right;
    font-weight: normal;
    padding-top: px2em($datepicker-options-pt);
    padding-bottom: px2em($datepicker-options-pb);
    border-bottom: $datepicker-options-bottom-size solid #c6c2c1;
    font-size: px2em($datepicker-options-fs);
    background-color: #ffffff;
    color: rgba(0, 0, 0, 0.65);
  }

  $datepicker-options-show-length: 10;
  .datepicker-options-fixed-ht {
    height: px2em($datepicker-options-show-length * ($datepicker-options-pt
            + $datepicker-options-lh + $datepicker-options-pb + $datepicker-options-bottom-size));
    @include overflowScroll();
  }

  .datepicker-options > li > span[class~=datepicker-options-current] {
    background: #3684FF;
    color: #ffffff;
  }

  // endregion

  .datepicker-content-container {
    @include large-screen-style {
      height: px2em(490px);
      overflow: scroll;
    }
  }

  .datepicker-month-title {
    height: px2em(54px);
    line-height: px2em(54px);
    text-align: center;
  }

  .datepicker-month-title > span {
    opacity: 0.85;
    font-size: px2em(18px);
    color: rgba(0, 0, 0, 0.85);
    letter-spacing: 0;
  }

  .datepicker-week {
    font-size: 0;
  }

  .datepicker-week > div {
    font-size: 12px;
    display: inline-block;
    width: 14.27%;
    line-height: px2em(32px, 12px);
    text-align: center;
    color: rgba(0, 0, 0, 0.85);
    letter-spacing: 0;
    font-weight: 800;
  }

  .datepicker-day > div {
    font-size: px2em(12px);
    display: inline-block;
    width: 14.27%;
    line-height: px2em(32px, 12px);
    text-align: center;
    color: rgba(0, 0, 0, 0.64);
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
    background: rgba(0, 0, 0, 0.09);
  }
</style>
