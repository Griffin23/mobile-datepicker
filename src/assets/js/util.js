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