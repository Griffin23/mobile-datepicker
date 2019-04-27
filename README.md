# mobile-datepicker

## 如何使用
Step 1:
npm install mobile-fill-screen-datepicker --save-dev

Step 2(in main.js):
```
...
import datepicker from 'mobile-fill-screen-datepicker';
Vue.use(datepicker);
...
```

Step 3(in your vue):
```
<datepicker
        v-show="showDatepickerBool"
        :lang="'en'"
        :title="'日期选择'"
        :min-date="'2018-01-01'"
        :max-date="3"
        @selectDate="selectDate"
        @closeDatepicker="closeDatepicker"></datepicker>
```

## 参数说明

- lang
    - 语言版本，可设置en或zh
- title
    - 自定义datepicker标题
- minDate, maxDate
    - 支持传入 yyyy-MM-dd
    - 支持传入相对天数，如：-10、30
    - 默认minDate = -10，maxDate = 10。也就是过去10天到未来10天
    
## TODO

- 考虑场景：选择往返日期（多个日期选择框，disable去程日期之前的date）

## Github
[https://github.com/Griffin23/mobile-datepicker](https://github.com/Griffin23/mobile-datepicker)