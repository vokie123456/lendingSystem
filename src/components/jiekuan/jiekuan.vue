<template>
  <div class="jiekuan">
    <header class="m-header">
      <h1 class="text">我的借款</h1>
    </header>
    <div class="change-box">
      <div class="change">
        <div :class="{active: isActive}" @click="change(1)">进行中</div>
        <div :class="{active: !isActive}" @click="change(2)">已结束</div>
      </div>
    </div>

    <div class="detail">
      <div class="item" v-for="(item, index) in datalist" @click="toItem(item.loanId)">
        <div class="item-top">
          <span>借款日期：{{item.valueDate}}</span>
          <span>{{item.loanStatus}}</span>
        </div>
        <div class="item-body">
          <div>借款金额： <span class="money">{{item.cashAmount}}</span>元</div>
          <div>产品期限： <span>{{item.phase}}期</span></div>
          <div>月综合费率： <span>{{item.rate*100}}%每月</span></div>
        </div>
      </div>
    </div>
    <my-footer :comein="comein"></my-footer>
    <router-view></router-view>
  </div>
</template>
<script>
  import MyFooter from '@/components/footer/footer'
  import $ from 'jquery'
  import C from '@/assets/js/cookie'
  export default {
    data () {
      return {
        comein: '借款',
        title: '我的借款',
        isActive: true,
        datalist: ""
      }
    },
    created: function(){
      this.change(1)
    },
    methods:{
       change: function(n){

         if(n == 1){
           var that = this;
           this.isActive = true;
           $.post(window.baseUrl+"rest/ylpayLoanAndBill/queryLoanInfo",{
             loginName: window.userinfo.loginName,
             loanStatus: 'loaning'
           }).then(function(res){
//             console.log(res)
             if(res.status ==0){
               that.datalist = res.data.creditInfo
             }
           })
         }else{
           var that = this;
          this.isActive = false;
           $.post(window.baseUrl+"rest/ylpayLoanAndBill/queryLoanInfo",{
             loginName: window.userinfo.loginName,
             loanStatus: 'over'
           }).then(function(res){
//             console.log(res)
             if(res.status ==0){
               that.datalist = res.data.creditInfo
             }
           })
         }
       },
       toItem: function(loanid){
         this.$router.push({
           path: '/jiekuan/'+loanid
         })
       }
    },
    components: {
      MyFooter
    }
  }
</script>

<style scoped>
  .m-header{
    width: 100%;
    height: 44px;
    line-height: 44px;
    position: relative;
    left: 0;
    top: 0;
    background-color: #fff;
  }
  .m-header h1{
    font-size: 0.6rem;
    font-weight: normal;
    margin:0;
  }
  .jiekuan{
    width: 100%;
    height:100%;
    background-color: #e0e0e0;
    overflow: hidden;
  }
  .change{
    width:60%;
    margin:0 auto;
    border:1px solid #379aff;
    border-radius: 5px;
    position: relative;
    display: flex;
  }
  .change-box{
    width:100%;
    background-color: #fff;
    padding:0.5rem 0;
  }
.change div{
  width: 49%;
  height: 1rem;
  line-height:1rem;
  display: inline-block;
  color: #379aff;
  flex:1;
}
  .change  .active{
    background: #379aff;
    color: #fff;
  }
.detail{
  width:100%;
  max-height:10.3rem;
  background-color: #e0e0e0;
  overflow: scroll;
}
.item{
  width:100%;
  background: #fff;
  margin-top:0.2rem;
  font-size:0.4rem;
}
  .item-top{
    border-bottom: 1px solid #c0c0c0;
    height:0.7rem;
    line-height:0.7rem;
    text-align: left;
    padding-left:1rem;
    position: relative;
  }
  .item-top span:nth-child(2){
    float: right;
    padding-right:1rem;
  }
  .item-top:after{
    content: '>';
    position: absolute;
    right:0.6rem;
  }
  .item-body{
    text-align: left;
    padding-left:1rem;
    height: 2.4rem;
    line-height:0.75rem;
    margin-top:5px;
    color:#9d9d9d;
  }
  .money{
    font-size:0.7rem;
    font-weight:700;
    color:#000;
  }
</style>
