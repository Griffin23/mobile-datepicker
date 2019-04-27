# mobile-datepicker

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
        v-show="showDatepickerBool"
        :lang="'en'"
        :title="'custom title'"
        :min-date="'2018-01-01'"
        :max-date="3"
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

- lang
    - set language
        - en
        - zh
- title
    - customize your datepicker title
- minDate, maxDate
    - support input: yyyy-MM-dd
    - support input number, e.g. -10 or 30
    - default minDate = -10, maxDate = 10
    
## TODO

- 考虑场景：选择往返日期（多个日期选择框，disable去程日期之前的date）

## Github
[https://github.com/Griffin23/mobile-datepicker](https://github.com/Griffin23/mobile-datepicker)