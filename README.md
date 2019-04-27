# mobile-datepicker

## 如何使用
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