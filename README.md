# mobile-datepicker

## Demo
[link](http://www.sunsiquan.top:83)

## How to use
Step 1:
npm install mobile-fill-screen-datepicker --save-dev

Step 2(in main.js):
```
...
import datepicker from 'mobile-fill-screen-datepicker'
Vue.use(datepicker)
...
```

Step 3(in your vue):
```
    <datepicker
      :options="datepickerOptions"
      :show="isShowDatePicker"
      @selectDate="selectDate"
      @closeDatepicker="closeDatepicker" 
    />
    
...

    data() {
      return {
        isShowDatePicker: false,
        datepickerOptions: {
          lang: 'en',
          title: 'custom title',
          minDate: '2019-01-01',
          maxDate: '10',
          format: 'MM-DD-YYYY',
        },
      }
    },
    
...
    
  methods: {
    selectDate(result) {
      // handle result
      console.log(result)
    },
    closeDatepicker() {
      this.showDatepickerBool = false
    },
  },
```

## Params

- show(Boolean)
    - true
    - false
    
- options
    - lang
        - language
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
        - custom format. supported by moment.js. For more format details see [moment.js format doc](https://momentjs.com/docs/#/displaying/format/)
        - default YYYY-MM-DD
    
## TODO

- 考虑场景：选择往返日期（多个日期选择框，disable去程日期之前的date）
- 无障碍全键盘访问 a11y

## Github
[https://github.com/Griffin23/mobile-datepicker](https://github.com/Griffin23/mobile-datepicker)
