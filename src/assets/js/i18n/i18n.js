export let i18nDict = {
  en: {
    chooseYear: 'year',
    month: {
      '1': {
        name: 'January'
      },
      '2': {
        name: 'February'
      },
      '3': {
        name: 'March'
      },
      '4': {
        name: 'April'
      },
      '5': {
        name: 'May'
      },
      '6': {
        name: 'June'
      },
      '7': {
        name: 'July'
      },
      '8': {
        name: 'August'
      },
      '9': {
        name: 'September'
      },
      '10': {
        name: 'October'
      },
      '11': {
        name: 'November'
      },
      '12': {
        name: 'December'
      }
    },
    week: {
      monday: {
        abbr: 'Mo'
      },
      tuesday: {
        abbr: 'Tu'
      },
      wednesday: {
        abbr: 'We'
      },
      thursday: {
        abbr: 'Th'
      },
      friday: {
        abbr: 'Fr'
      },
      saturday: {
        abbr: 'Sa'
      },
      sunday: {
        abbr: 'Su'
      }
    }
  },
  zh: {
    chooseYear: '年份',
    month: {
      '1': {
        name: '一月'
      },
      '2': {
        name: '二月'
      },
      '3': {
        name: '三月'
      },
      '4': {
        name: '四月'
      },
      '5': {
        name: '五月'
      },
      '6': {
        name: '六月'
      },
      '7': {
        name: '七月'
      },
      '8': {
        name: '八月'
      },
      '9': {
        name: '九月'
      },
      '10': {
        name: '十月'
      },
      '11': {
        name: '十一月'
      },
      '12': {
        name: '十二月'
      }
    },
    week: {
      monday: {
        abbr: '一'
      },
      tuesday: {
        abbr: '二'
      },
      wednesday: {
        abbr: '三'
      },
      thursday: {
        abbr: '四'
      },
      friday: {
        abbr: '五'
      },
      saturday: {
        abbr: '六'
      },
      sunday: {
        abbr: '日'
      }
    }
  }
};

export function t(key, lang) {
  if (Object.keys(i18nDict).indexOf(lang) !== -1) {
    let keys = key.split('.');
    return keys.reduce((prev, curr) => {
      return prev[curr];
    }, i18nDict[lang]);
  }
  return key;
}
