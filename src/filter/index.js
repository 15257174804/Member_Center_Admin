const filters={
  // 千分位过滤器
  numFormate(val){
    if(!val) return ''
    let intPart=Number(val).toFixed(0)
    let intPartFormate=intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') 
    return intPartFormate
  },
  // 其他过滤器
  titleFormate(val){
    if(!val) return ''
    if(val.length>6){
      val=val.substr(0,5)+'...'
    }
    return val
  },
  timeFormate(val){
    if(!val) return ''
    return val.split(' ')[0]
  }
}
export default filters