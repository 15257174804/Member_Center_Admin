<template>
  <div class="iCountUp">
    <!-- 面板统计 -->
    <div class="count">
      <!-- 今日 7日 本月 -->
      <div class="ctitle">
        <ul>
          <li :class="activeName=='今日'?'isActive':''" @click="today">今日</li>
          <li :class="activeName=='7日'?'isActive':''" @click="seven">7日</li>
          <li :class="activeName=='按月'?'isActive':''" @click="mouth">按月</li>
        </ul>
      </div>
      <!-- 彩色4格 -->
      <div class="Lottery">
        <div class="Lottery1">
          <p>{{activeName+'新增会员'}}</p>
          <p>{{customNum|numFormate}}</p>
        </div>
        <div class="Lottery2">
          <p>{{activeName+'订单量'}}</p>
          <p>{{orderNum|numFormate}}</p>
        </div>
        <div class="Lottery3">
          <p>{{activeName+'预约订单量'}}</p>
          <p>{{preorderNum|numFormate}}</p>
        </div>
        <div class="Lottery4">
          <p>{{activeName+'收益(元)'}}</p>
          <p>{{profitNum}}</p>
        </div>
      </div>
      <!-- 待办订单 -->
      <div class="orderList">
        <h3>待办订单</h3>
        <div>
          <div @click="goOrder(1)">
            <p :class="{'blue':delievey!='0'}">{{delievey}}</p>
            <p>待发货订单</p>
          </div>
          <div @click="goOrder(2)">
            <p :class="{'blue':pickup!='0'}">{{pickup}}</p>
            <p>待自提订单</p>
          </div>
          <div @click="goOrder(3)">
            <p :class="distribute!='0'?'blue':''">{{distribute}}</p>
            <p>待分配订单</p>
          </div>
          <div @click="goOrder(4)">
            <p :class="{'blue':preExamine!='0'}">{{preExamine}}</p>
            <p>待审核订单</p>
          </div>
          <div @click="goOrder(5)">
            <p :class="{'blue':pickConfirmed!='0'}">{{pickConfirmed}}</p>
            <p>待确认订单</p>
          </div>
          <div @click="goOrder(6)">
            <p :class="{'blue':afterSaleReview!='0'}">{{afterSaleReview}}</p>
            <p>待退款</p>
          </div>
        </div>
      </div>
      <!-- 快速入口+折现表格 -->
      <div class="base">
        <!-- 快速涑口 -->
        <div class="door">
          <h3>快速入口</h3>
          <div class="content">
            <router-link to=''>
              <div style="height:36px;"> 
                尽请期待
                <!-- <img src="../assets/home/商品发布.png" alt="" style="{width:36px;height:36px;}">
                <span>商品发布</span> -->
              </div>
            </router-link>
          </div>
        </div>
        <div class="linechart">
          <div id="myChart" :style="{width: '98%', height: '400px'}"></div>
        </div>
      </div>

    </div>
    <!-- 消息通知商品排行 -->
    <div class="notify">
      <!-- 公告 -->
      <div class="talk">
        <div>
          <div class="talktitle">
            <img src="../assets/home/gonggao.png" align="bottom">
            <span style="margin-left:6px;">通知公告</span>
          </div>
          <router-link :to="{path:'/newslist'}">
            <span class="more">更多</span>
          </router-link>
        </div>
        <!-- 主体内容 -->
          <div v-if="show">
            <div v-if="newslist[0].titlePic!=''" class="firstlabel">
              <img :src="axios.defaults.baseURL + '/b2c/image/' + newslist[0].titlePic" />
              <div style="cursor: pointer;" @click="goNews">
                <span>{{newslist[0].title|titleFormate}}</span>
                <span style="color:#909399;font-size:0.75rem;">{{newslist[0].createTime|timeFormate}}</span>
              </div>
            </div>
            <ul>
              <li v-for="(item,i) of newslist.slice(1)" :key="i" style="cursor: pointer;" @click="goNews">
                <span>{{item.title|titleFormate}}</span>
                <span style="color:#909399;font-size:0.75rem;margin-top:4px;">{{item.createTime|timeFormate}}</span>
              </li>
            </ul>
            <div style="padding:50px;" v-if="newslist.length==0">暂无公告</div>
          </div>
      </div>
      <!-- 销量排行 -->
      <div class="rank">
        <div>
          <div class="ranktitle">
            <img src="../assets/home/paihang.png" align="bottom">
            <span style="margin-left:6px;">单品销量排行</span>
          </div>
          <router-link :to="{path:''}">  <!--跳转链接需要修改-->
            <span class="more">更多</span>
          </router-link>
        </div>
        <div>尽请期待</div>
      </div>
    </div>
  </div>
</template>

 <script>
export default {
  name: "demo",
  data() {
    return {
      title:'测试标题公告haoba 6',
      activeName:'今日',   //面板切换绑定的内容
      customNum:'0',     //新增会员数
      orderNum:'0',      //普通订单数
      preorderNum:'0',   //预约订单数
      profitNum:'0',     //金额收益
      searchParams:{
        startTime:'',
        endTime:''
      },
      countMode:1,   //会员统计方式按天按周按月 
      preExamine:'0',  //预约待审核订单数  
      distribute:'0',  //自提待分配订单
      pickConfirmed:'0',    //自提待确认
      afterSaleReview:'0',  //售后待审核
      delievey:'0',     //待发货订单
      pickup:'0',       //待自提订单
      option:{
        title:{
          text:'流量统计',
          textStyle: {
            color: "#303133"
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['浏览量(PV)', '访客数(UV)'],
          x:'right'
        },
        grid: {
          top:'20%',
          left: '1%',
          right: '9%',
          containLabel: true
        },
        color:['#ff4e4d','#88b0ff'],
        xAxis: {
          type: 'category',
          name:'日期',
          boundaryGap: false,
          data: [],
          axisLabel: {
            interval: 0,//横轴信息全部显示  
            rotate: -30,//-30度角倾斜显示  
          },
          splitLine:{
            show:false,
            lineStyle:{ type: 'dotted' }
          },
          axisTick:{
            show:false
          },
          nameTextStyle:{
            color:'#606266'
          },
          axisLine:{
            lineStyle:{
              color:'#606266'
            }
          }
        },
        yAxis: {
          name:'单位/次',
          type: 'value',
          splitLine:{
            show:true,
            lineStyle:{ type: 'dotted' }
          },
          axisTick:{
            show:false
          },
          axisLine:{
            show:false
          }
        },
        series: [
          {
              name: '浏览量(PV)',
              type: 'line',
              smooth: true,
              areaStyle:{
                // color:'rgba(247,238,241,.8)'
                color:{
                  type:'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                      offset: 0, color: 'rgba(254,222,219,.8)' // 0% 处的颜色
                  }, {
                      offset: 1, color: 'rgba(254,250,250,.6)' // 100% 处的颜色
                  }],
                }
              },
              lineStyle:{
                width:1
              },
              data: [6,3,2,3,2,4,2]
          },
          {
              name: '访客数(UV)',
              type: 'line',
              smooth: true,
              areaStyle:{
                // color:'rgba(233,242,255,.5)'
                color:{
                  type:'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                      offset: 0, color: 'rgba(221,236,253,.8)' // 0% 处的颜色
                  }, {
                      offset: 1, color: 'rgba(245,249,253,.6)' // 100% 处的颜色
                  }]
                }
              },
              lineStyle:{
                width:1
              },
              data: []
          }
        ]
      },
      newslist:[],
      show:false,
    };
  },
  watch:{
    option:{
      handler(newVal,oldVal){
        if(this.myChart){
          if (newVal) {
            this.myChart.setOption(newVal);
          } else {
            this.myChart.setOption(oldVal);
          }
        }else{
          this.getmychart();
        }
      },
      deep:true
    }
  },
  methods: {
    goOrder(val){
      if(val==1){
        this.$router.push({path:'/order',query: {flag:'1',status:'2',pickupWay:'2'}})
      }else if(val==2){
        this.$router.push({path:'/order',query: {flag:'2',status:'2',pickupWay:'1'}})
      }else if(val==3){
        this.$router.push({path:'/order',query: {flag:'3',pickupWay:'1'}})
      }else if(val==4){
        this.$router.push({path:'/preorder',query: {flag:'1',status:'5'}})
      }else if(val==5){
        this.$router.push({path:'/order',query: {flag:'4',clientConfirm:'0'}})
      }else{
        this.$router.push({path:'/refund'})
      }
    },
    // tab被选中时触发的事件 今日 7日 按月
    today(){
      this.activeName='今日';
      let time=new Date();
      let y=time.getFullYear();
      let m=time.getMonth()+1;
      let d=time.getDate();
      this.searchParams.startTime=y+'-'+m+'-'+d+' '+"00:00:00";
      this.searchParams.endTime=y+'-'+m+'-'+d+' '+"23:59:59";
      this.getOrderNum();
      this.getAmount();
      this.countMode=1;
      this.getCustom();
      this.getpreExamine();
      this.getdistribute();
      this.getpickConfirmed();
      this.getafterSaleReview();
      this.getdelievey();
      this.getpickup();
      this.getUV();
    },
    seven(){
      this.activeName='7日';
      let time=new Date();
      let y=time.getFullYear();
      let m=time.getMonth()+1;
      let d=time.getDate();
      this.searchParams.endTime=y+'-'+m+'-'+d+' '+"23:59:59";
      if(d<=7){
        if(m>1){
          m=m-1;
        }else{
          y=y-1;
          m=12;
        }
      }
      time.setDate(time.getDate() - 7);
      y=time.getFullYear();
      m=time.getMonth()+1;
      d=time.getDate();
      this.searchParams.startTime=y+'-'+m+'-'+d+' '+"00:00:00";
      this.getOrderNum();
      this.getAmount();
      this.countMode=2;
      this.getCustom();
      this.getpreExamine();
      this.getdistribute();
      this.getpickConfirmed();
      this.getafterSaleReview();
      this.getdelievey();
      this.getpickup();
      this.getUV();
    },
    mouth(){
      this.activeName='按月';
      let time=new Date();
      let y=time.getFullYear();
      let m=time.getMonth()+1;
      let d=time.getDate();
      this.searchParams.endTime=y+'-'+m+'-'+d+' '+"23:59:59";
      if(m>1){
        m=m-1
      }else{
        y=y-1;
        m=12;
      }
      this.searchParams.startTime=y+'-'+m+'-'+d+' '+"23:59:59";
      this.getOrderNum();
      this.getAmount();
      this.countMode=3;
      this.getCustom();
      this.getpreExamine();
      this.getdistribute();
      this.getpickConfirmed();
      this.getafterSaleReview();
      this.getdelievey();
      this.getpickup();
      this.getUV();
    },
    // 折线图
    getmychart(){
      let myChart = this.echarts.init(document.getElementById('myChart'))
      myChart.setOption(this.option,true)
      window.onresize = function(){
        myChart.resize();
      }
    },
    // 获取普通订单数和预约订单数
    getOrderNum(){
      // let time=new Date();
      // let y=time.getFullYear();
      // let m=time.getMonth()+1;
      // let d=time.getDate();
      // this.searchParams.startTime=y+'-'+m+'-'+d+' '+"00:00:00";
      // this.searchParams.endTime=y+'-'+m+'-'+d+' '+"23:59:59";
      let params=this.searchParams;
      params.statisticalType=1;
      // console.log('111')
      // console.log(params)
      this.axios.get('/b2c/statistical/order',{params})
      .then(res=>{
        // console.log('222')
        // console.log(res.data)
        if(res.data.code>0){
          this.orderNum=res.data.msg.count;
          if(this.orderNum==0){
            this.orderNum='0'
          }
          // 获取预约订单数
          let params={
            statisticalType:2,
            startTime:this.searchParams.startTime,
            endTime:this.searchParams.endTime
          }
          this.axios.get('/b2c/statistical/order',{params})
          .then(res=>{
            this.preorderNum=res.data.msg.count;
            if(this.preorderNum==0){
              this.preorderNum='0'
            }
          })
        }
        
      })
      
    },
    // 获取订单金额
    getAmount(){
      let params=this.searchParams;
      params.statisticalType=0;
      this.axios.get('/b2c/statistical/order/amount',{params})
      .then(res=>{
        // console.log('获取金额')
        // console.log(res.data)
        this.profitNum=res.data.msg.amount
        if(this.profitNum==0){
          this.profitNum='0'
        }
      })
    },
    // 获取新增会员数
    getCustom(){
      
      let params={
        countMode:this.countMode
      }
      this.axios.get('/crm/custom/registCount',{params})
      .then(res=>{
        // console.log('获取会员数')
        // console.log(res.data)
        this.customNum=res.data.msg.currCount;
        if(this.customNum==0){
          this.customNum='0'
        }
      })
    },
    // 获取预约待审核订单
    getpreExamine(){
      let params=this.searchParams;
      this.axios.get('/b2c/statistical/order/business/review',{params})
      .then(res=>{
        // console.log('获取预约待审核订单数')
        // console.log(res.data)
        this.preExamine=res.data.msg.count;
      })
    },
    // 获取自提待分配订单
    getdistribute(){
      let params=this.searchParams;
      this.axios.get('/b2c/statistical/order/allocated',{params})
      .then(res=>{
        // console.log('获取自提待分配订单')
        // console.log(res.data)
        this.distribute=res.data.msg.count;
        // console.log(this.distribute!='0')
      })
    },
    // 获取自提待确认订单
    getpickConfirmed(){
      let params=this.searchParams;
      this.axios.get('/b2c/statistical/order/pickConfirmed',{params})
      .then(res=>{
        // console.log('获取自提待确认订单')
        // console.log(res.data)
        this.pickConfirmed=res.data.msg.count;
      })
    },
    // 获取售后待审核订单
    getafterSaleReview(){
      let params=this.searchParams;
      this.axios.get('/b2c/statistical/order/afterSaleReview',{params})
      .then(res=>{
        // console.log('获取售后待审核订单')
        // console.log(res.data)
        this.afterSaleReview=res.data.msg.count;
      })
    },
    // 获取待发货订单
    getdelievey(){
      let params=this.searchParams;
      this.axios.get('/b2c/statistical/order/toSend',{params})
      .then(res=>{
        // console.log('获取待发货订单')
        // console.log(res.data)
        this.delievey=res.data.msg.count;
      })
    },
    // 获取待自提订单
    getpickup(){
      let params=this.searchParams;
      this.axios.get('/b2c/statistical/order/toStay',{params})
      .then(res=>{
        // console.log('获取待自提订单')
        // console.log(res.data)
        this.pickup=res.data.msg.count;
      })
    },
    // 获取访客数
    getUV(){
      let params={
        countType:this.countMode
      }
      this.axios.get('/crm/user/loginLog/group',{params})
      .then(res=>{
        // console.log('获取UV')
        // console.log(res.data)
        let _xdata=res.data.msg.datas;
        let _xAxis=[];
        let _series=[]
        let len=_xdata.length>7?7:_xdata.length
        if(this.countMode==1){
          this.option.title.text='流量统计(按天)';
          for(let i=0;i<len;i++){
            _xAxis.push(_xdata[i].loginDate.slice(5))
            _series.push(_xdata[i].loginCount)
          }
        }else if(this.countMode==2){
          this.option.title.text='流量统计(按周)';
          for(let i=0;i<len;i++){
            _xAxis.push(_xdata[i].weekStartDate+_xdata[i].weekEndDate)
            // _xAxis.push()
            _series.push(_xdata[i].loginCount)
          }
        }else{
          this.option.title.text='流量统计(按月)';
          for(let i=0;i<len;i++){
            _xAxis.push(_xdata[i].loginMonth)
            _series.push(_xdata[i].loginCount)
          }
        }
        
        this.option.xAxis.data=_xAxis
        this.option.series[1].data=_series
        // console.log(this.option.xAxis.data)
        // console.log(this.option.series[1].data)
      })
    },
    // 获取公告列表
    getNews(){
      let params={}
      this.axios.get('/b2c/news/list',params)
      .then(res=>{
        if(res.data.code>0){
          this.show=true;
          if(res.data.msg.datas.length>0){
            this.newslist=res.data.msg.datas;
            if(this.newslist.length>6){
              this.newslist=this.newslist.splice(0,6);
            }
          }else{
            let obj={
              titlePic:''
            }
            this.newslist.push(obj);
          }
        }
        // console.log(this.newslist)
      })
    },
    goNews(){
      this.$router.push('/newslist');
    }
  },
  mounted(){
    // 获取订单数量和预约订单数量
    
    this.getmychart();
    
  },
  created(){
    this.today();
    this.getNews();
  }
};
</script>
 
<style lang="scss">
  .iCountUp{
    width:100%;height:100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-around;
    padding:10px;
    .count{
      width:80%;height:100%;
      .ctitle ul{
        display:flex;
        list-style: none;
        padding:0;
        li{
          border:1px solid #e4e7ed;
          margin-right:8px;
          width:60px;height:30px;
          text-align: center;
          line-height: 30px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          color:#606266;
        }
        .isActive{
          background-color: #4b9bf7;
          color:#fff;
        }
      }
      .Lottery{
        width:98%;
        display: flex;
        justify-content: space-between;
        .Lottery1{
          width:24%;height:125px;
          background: url('../assets/home/1.png') no-repeat center center;
          background-size: 100% 100%;
          color:#fff;
          border-radius: 13px;
          p:first-child{font-size:14px;margin:24px 0 14px 15px;}
          p:last-child{font-size:28px;font-weight: 540;margin:0 0 0 26px;}
        }
        .Lottery2{
          width:24%;height:125px;
          background: url('../assets/home/2.png') no-repeat center center;
          background-size: 100% 100%;
          color:#fff;
          border-radius: 13px;
          p:first-child{font-size:14px;margin:24px 0 14px 15px;}
          p:last-child{font-size:28px;font-weight: 540;margin:0 0 0 26px;}
        }
        .Lottery3{
          width:24%;height:125px;
          background: url('../assets/home/3.png') no-repeat center center;
          background-size: 100% 100%;
          color:#fff;
          border-radius: 13px;
          p:first-child{font-size:14px;margin:24px 0 14px 15px;}
          p:last-child{font-size:28px;font-weight: 540;margin:0 0 0 26px;}
        }
        .Lottery4{
          width:24%;height:125px;
          background: url('../assets/home/4.png') no-repeat center center;
          background-size: 100% 100%;
          color:#fff;
          border-radius: 13px;
          p:first-child{font-size:14px;margin:24px 0 14px 15px;}
          p:last-child{font-size:28px;font-weight: 540;margin:0 0 0 26px;}
        }
      }
      .orderList{
        width:98%;
        padding:15px;
        background-color: #fafafa;
        margin-top:2%;
        border-radius: 13px;
        .blue{color:#1964d8 !important;}
        h3{margin:0 0 33px 0;color:#303133;}
        div{
          cursor: pointer;
          display: flex;
          justify-content: space-around;
          font-size: 14px;
          color:#606266;
          div{
            height:70px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            p{margin: 0 0 10px 0;}
            p:first-child{
              font-weight: 600;
              font-size: 20px;
              color:#303133;
            }
          }
        }
      }
      .base{
        width:98%;
        display: flex;
        justify-content: space-between;
        margin-top:2%;
        .door{
          width:28.5%;
          height: 400px;
          padding:15px;
          background-color: #fafafa;
          border-radius: 13px;
          h3{margin:0 0 33px 0;color:#303133;}
          
        }
        .linechart{
          width:69%;
          height: 400px;
          padding:15px;
          background-color: #fafafa;
          border-radius: 13px;
        }
      }
    }
    .notify{
      width:20%;height:100%;
      padding-top:62px;
      .talk{
        width:93%;
        background-color: #fafafa;
        padding:14px;
        margin-bottom: 6%;
        border-radius: 13px;
        // 通知的标题栏
        div:first-child{
          color:#303133;
          font-size: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          .more{
            color:#4b9bf7;
            font-size: 14px;
            cursor: pointer;
          }
        }
        // 主体内容
        div:last-child{
          .firstlabel{
            display: flex;
            align-items: center;
            justify-content: flex-start;
            font-size: 0.8rem;
            height:40px;
            img{
              width:40%;height:40px;
              margin-right:6px;
            }
            div{
              height:40px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
          }
          ul{
            width:100%;
            margin:0;
            padding-left:14px;
            color:#303133;
            font-size: 0.8rem;
            li{margin-bottom: 4px;}
            li span:last-child{
              float:right;
            }
          }
        }
      }
      .rank{
        width:93%;height:400px;
        background-color: #fafafa;
        padding:14px;
        border-radius: 13px;
        // 销量排行的标题栏
        div:first-child{
          color:#606266;
          font-size: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .more{
            color:#4b9bf7;
            font-size: 14px;
            cursor: pointer;
          }
        }
        div:last-child{
          padding:50px;
        }
      }
    }
  }
</style>

