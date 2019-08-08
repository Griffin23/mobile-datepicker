# mobile-datepicker

## Demo
[link](http://www.sunsiquan.top:83)

## How to use
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
        :show="showDatepickerBool"
        :lang="'en'"
        :title="'custom title'"
        :min-date="'2018-01-01'"
        :max-date="3"
        :format="'mm-dd-yy'"
        @selectDate="selectDate"
        @closeDatepicker="closeDatepicker"></datepicker>
        
...

    methods: {
        selectDate(result) {
            // handle result
            ...
        },
        closeDatepicker() {
            this.showDatepickerBool = false;
        }
    }
```

## Params

- show(Boolean)
    - true
    - false
- lang
    - set language
        - en
        - zh
    - default en
- title
    - customize your datepicker title
- minDate, maxDate
    - support input: yyyy-MM-dd
    - support input number, e.g. -10 or 30
    - default minDate = -10, maxDate = 10
- format
    - custom format. e.g. yyyy-mm-dd or yy-mm-dd or yyyy&whatever&mm&whatever&dd
    - output: 
        - yyyy replaced by year. e.g. 2019
        - yy replaced by short year. e.g. 19
        - mm replaced by month
        - dd replaced by day
    - default yyyy-mm-dd
    
## TODO

- 考虑场景：选择往返日期（多个日期选择框，disable去程日期之前的date）

## Github
[https://github.com/Griffin23/mobile-datepicker](https://github.com/Griffin23/mobile-datepicker)