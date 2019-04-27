/***
 * 根据日期差（天数）获取日期
 * @param diffDay
 * @returns {Date}
 */
export function getDateByDiffDay(diffDay) {
    let today = new Date();
    let time = today.getTime() + diffDay * 24 * 60 * 60 * 1000;
    return new Date(time);
}

// 小于10，前面加0
export function zeroFormat(d) {
    return (parseInt(d) < 10) ? `0${d}` : d;
}

// 计算周几
export function getWeekDay(year, month, day) {
    let d = new Date();
    d.setFullYear(year, parseInt(month) - 1, day);
    return d.getDay();
}