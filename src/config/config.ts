const check = (a, b, x, y) => {
  if(y <= a || b <= x){  
    return false;
  }else{
    return true;
  }
}

/**
 * 
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

