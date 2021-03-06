const check = (a, b, x, y) => {
  if(y <= a || b <= x){  
    return false;
  }else{
    return true;
  }
}

/**
 * 判断时间段是否冲突
 * @param a 第一个时间段开始时间
 * @param b 第一个时间段结束时间
 * @param x 第二个时间段开始时间
 * @param y 第二个时间段结束时间
 */
export const checkTime = (a, b, x, y) => {
  const times1 = [], times2 = [];
  // 是否跨天
  a < b ? times1.push([a, b]) : times1.push([a, "24:00"], ["00:00", b])
  x < y ? times2.push([x, y]) : times2.push([x, "24:00"], ["00:00", y])
  
  let flag = false;
  //循环比较时间段是否冲突
  for (let i = 0; i < times1.length; i++) {
    if (flag) break;
    for (let j = 0; j < times2.length; j++) {
      if(check(times1[i][0], times1[i][1], times2[j][0], times2[j][1])){
        flag = true;
        break;
      }
    }
  }
  if (flag) {
    return false;
  }else{
    return true;
  }
}
/**
 * 判断时间段数组是否冲突
 * @param times   例 ["7:00-9:00", "10:00-12:00"]
 * @param startTime 例 "8:00"
 * @param endTime   例 "11:00"
 * @returns false
 */
export const checkTimes = (times: string[],startTime: string,endTime: string) => {
  let haveSeat = true
  times.forEach(v => {
    const items = v.split('-')
    if(!checkTime(items[0],items[1],startTime,endTime)){
      haveSeat = false
    }
  });
  return haveSeat
}
/**
 * 日期相减计算天数
 * @param date1 小日期
 * @param date2 大日期
 */
export const DateMinus = (date1: string, date2: string) => {
  const sdate = new Date(date1); 
  const now = new Date(date2); 
  const days = now.getTime() - sdate.getTime(); 
  const day = days / (1000 * 60 * 60 * 24); 
  return day; 　
}
/**
 * 获取时间段相差的分钟数
 * @param startTime 开始时间  9:00
 * @param endTime 结束时间  9:15
 * @returns 15
 */
export const intervalTime = (startTime: string, endTime: string) => {
  const start1 = startTime.split(":");
  const startAll = parseInt(start1[0]) * 60 + parseInt(start1[1]);
    
  const end1 = endTime.split(":");
  const endAll = parseInt(end1[0]) * 60 + parseInt(end1[1]);
  
  return endAll-startAll
}
