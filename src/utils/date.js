
/** 
 * 时间戳转化 年 月 日 时 分 秒
 * formatTime YY-MM-DD hh:mm:ss
 * date: 传入时间戳
*/
export const formatTime = date => {
    var date = new Date(date);
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}


export const formatDate = date => {
    var date = new Date(date);
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return [year, month, day].map(formatNumber).join('-')
}




const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}



// 金额格式处理,自动四舍五入(调用：fmoney("12345.675910", 3)，返回12,345.676)
export const fmoney = (s, n) => {
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse();
    let r = s.split(".")[1];
    let t = "";
    if (s < 0) {
        l = ((Math.abs(s.split(".")[0])) + "").split("").reverse();
    }
    for (var i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    if (s < 0) {
        t += "-";
    }
    var result = t.split("").reverse().join("") + "." + r;
    if (result == null || result == undefined || result.indexOf('NaN') >= 0 || result.indexOf('Undefined') >= 0) {
        result = '0.00';
    }
    return result;
}


/**
 * 数字转为千分位字符
 * @param {Number} num
 * @param {Number} point 保留几位小数，默认2位
 */
export const parseToThousandth = (num, point = 2)=>  {
    let [sInt, sFloat] = (Number.isInteger(num) ? `${num}` : num.toFixed(point)).split('.');
    sInt = sInt.replace(/\d(?=(\d{3})+$)/g, '$&,');
    return sFloat ? `${sInt}.${sFloat}` : `${sInt}`;
}
export const parseToThousandth2 = (num, point = 2)=>  {
    let [sInt, sFloat] = (Number.isInteger(num) ? `${num}` : num.toFixed(point)).split('.');
    sInt = sInt.replace(/\d(?=(\d{3})+$)/g, '$&,');
    return sFloat ? `${sInt}.${sFloat}` : `${sInt}.00`;
}

/**
 * 计算两个日期之间相差的月份
 * @param {Date} minDate 最小日期
 * @param {Date} maxDate 最大日期
 */
export const getMonthRange = (minDate, maxDate) => {
    if (!minDate && !maxDate) return;
    minDate = new Date(minDate);
    maxDate = new Date(maxDate);
    let minYear = minDate.getFullYear();
    let minMonth = minDate.getMonth() + 1;
    let maxYear = maxDate.getFullYear();
    let maxMonth = maxDate.getMonth() + 1;
    return (maxYear * 12 + maxMonth) - (minYear * 12 + minMonth)
}