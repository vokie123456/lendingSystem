<template>
  <div class="guaranteeInfo_body">
    <ul>
      <li class="clear" v-for="(list,i) in data">
        <router-link :to="typeof list.linkUrl=='undefined'?'':list.linkUrl" class="clear">
          <span class="floatLeft">{{list.name}}</span>
          <span class="floatRight" v-if="list.type=='date'">
            <i @click="openTimePicker()">{{list.value==""?list.placeHolder:list.value}} &gt;</i>
            <mt-datetime-picker
              ref="dateSelect"
              type="date"
              v-model="list.value"
              year-format="{value} 年"
              month-format="{value} 月"
              date-format="{value} 日"
              @confirm="handleConfirm"
              :startDate="list.startDate"
              :endDate="list.endDate">
            </mt-datetime-picker>

          </span>
          <span class="floatRight" v-else-if="list.input&&!list.slots">
              <input :type="list.type" :placeholder="list.placeHolder" :required="list.require" :attr-regex="list.regex" v-model="list.value" />
            </span>
          <span class="floatRight" v-else-if="!list.input&&!list.slots">
              {{list.value}} &gt;
            </span>
          <span  class="floatRight" v-else-if="list.slots">
              <i @click="openPicker(list.index)">{{list.value==""?list.placeHolder:list.value}} &gt;</i>
              <select-list ref="picker" :defaultIndex="list.defaultIndex" :slots="list.slots" :index="list.index" />
            </span>
        </router-link>
      </li>
    </ul>
    <div class="textCenter">
      <mt-button type="primary" @click="submit()">保 存</mt-button>
    </div>
  </div>
</template>
<style>
  .applyList_body .guaranteeInfo_new{
    text-align: center;
    position: relative;
  }
  .applyList_body .guaranteeInfo_new a{
    display: inline-block;
    padding:0;
  }
  .applyList_body .guaranteeInfo_new a.delete{
    position:absolute;
    right:0.6rem;
    top:0.3rem;
    /*background:url("@/img/delete.png") no-repeat;*/
    width:15px;
    height:18px;
  }
</style>
<script>
import SelectList from '@/components/modal/selectList'
import { Toast } from 'mint-ui';
import {util} from '@/assets/js/util'
import $ from 'jquery';

export default{
  data(){
    return {
      data: [
        {name:"担保方式",alias:"ensureMethod",value:"",placeHolder:"请选择担保方式",input:false,require:false,empty:"请选择担保方式!",index:0,defaultIndex:0,slots:[{values: ['个人', '企业']}]},
        {name:"担保人姓名",alias:"ensureName",value:"",placeHolder:"请输入担保人姓名",type:"text",input:true,require:false,regex:/^[\u4e00-\u9fa5]+((·|•|●)[\u4e00-\u9fa5]+)*$/i,length:10,empty:"担保人姓名不能为空!",err:"担保人姓名格式不正确!"},
        {name:"担保人身份证号",alias:"ensureIdNo",value:"",placeHolder:"请输入担保人身份证号",type:"text",input:true,require:false,regex:/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/i,empty:"担保人身份证号不能为空!",err:"担保人身份证号格式不正确!"},
        {name:"家庭住址",alias:"ensureAddress",value:"",linkUrl:"./guarantee/guaranteeInfo?name=ensureAddress"},
        {name:"担保机构全称",alias:"ensureOrganizationName",value:"",placeHolder:"请输入担保机构",type:"text",input:true,require:false,regex:/^.{1,20}$/i,empty:"担保机构不能为空!",err:"担保机构需要在20字之内!"},
        {name:"担保机构地址",alias:"ensureOrganizationAddress",value:"",linkUrl:"./guarantee/guaranteeInfo?name=ensureOrganizationAddress"},
        {name:"担保机构经营范围",alias:"ensureOrganizationRun",value:"",linkUrl:"./guarantee/guaranteeInfo?name=ensureOrganizationRun"},
        {name:"社会信用代码",alias:"ensureSocialCreditCode",value:"",placeHolder:"请输入社会信用代码",type:"text",input:true,require:false,regex:/^[1-9A-GY]{1}[1239]{1}[1-5]{1}[0-9]{5}[0-9A-Z]{10}$/i,empty:"社会信用代码不能为空!",err:"社会信用代码格式不正确!"},
        {name:"公司成立日期",alias:"ensureOrganizationSetupDate",value:"",type:"date",placeHolder:"请选择还款日期",startDate:new Date(1990,1,1),endDate: new Date(),input:false,require:true,empty:"请选择公司成立日期!"},
        {name:"联系电话",alias:"ensureTel",value:"",placeHolder:"请输入联系电话",type:"number",input:true,require:false,regex:/^[1][3,4,5,7,8][0-9]{9}$/,empty:"联系电话不能为空!",err:"联系电话格式不正确!"},
      ],
      value:null,
      queryEnum:{},
      applyInfo:{},
    }
  },
  watch:{
    data:{
      handler(curVal,oldVal){
        if(curVal[8].value&&Object.prototype.toString.call(curVal[8].value)=="[object Date]"){
          this.handleConfirm(curVal[8].value);
        }
      },
      deep:true
    }
  },
  beforeCreate(){
    eventHandle.$off("setEnumData");
    eventHandle.$off("setApplyInfo");
    eventHandle.$off("confirm");
    eventHandle.$emit("title","担保信息");
    eventHandle.$on("confirm",(values,index)=>{
      this.confirm(values,index);
    });
    eventHandle.$on("setEnumData",(data)=>{
      if(!util.checkObjectIsEmpty(data)){
        this.queryEnum=data.queryEnum;
        const {ensureMethod}=this.queryEnum;
        if(ensureMethod){
          this.data[0].slots[0].values=[];
          for(let key of ensureMethod){
            this.data[0].slots[0].values.push(key.value);
          }
        }
      }
    });
    eventHandle.$on("setApplyInfo",(data)=>{
      if(!util.checkObjectIsEmpty(data)){
        this.applyInfo=data.applyInfo;
        let {ensureInfo}=this.applyInfo;
        console.log("ensureInfo：",ensureInfo);
        if(ensureInfo){
          for(let key in this.data){
            if(ensureInfo[this.data[key]["alias"]]!=""){
              this.data[key].value=(!ensureInfo[this.data[key]["alias"]])?"":ensureInfo[this.data[key]["alias"]];
            }
            if (this.data[key].slots) {
              for (let i = 0, len = this.data[key].slots[0].values.length; i < len; i++) {
                if (this.data[key].value == this.data[key].slots[0].values[i]) {
                  this.data[key].defaultIndex = i;
                }
              }
            }
          }
        }
      }
    });
  },
  created(){
    eventHandle.$emit("getEnumData");
    eventHandle.$emit("getApplyInfo");
  },
  destoryed(){
    eventHandle.$off("setEnumData");
    eventHandle.$off("setApplyInfo");
    eventHandle.$off("confirm");
  },
  methods:{
    openPicker:function(index){
      this.$refs.picker[index].open();
    },
    openTimePicker:function(){
      this.$refs.dateSelect[0].open();
    },
    handleConfirm:function(value,index){
      value=Object.prototype.toString.call(value)==="[object Date]"?value:new Date(value);
      let time=value.getFullYear()+"-"+((value.getMonth()+1)<10?"0"+(value.getMonth()+1):(value.getMonth()+1))+"-"+(value.getDate()<10?"0"+value.getDate():value.getDate());
      this.data[8].value=time;
    },
    confirm:function(values,index){
      this.data.forEach((list,i)=>{
        if(list.index==index){
          list.value=values[0];
          return;
        }
      });
    },
    submit:function(){
      let valueList={};
      for(let i=0,len=this.data.length;i<len;i++){
        if(this.data[i].require&&this.data[i].value==""){
          Toast(this.data[i].empty);
          return;
        }
        if(!this.data[i].require){
          if(this.data[i].value.length>0&&this.data[i].regex){
            if(!this.data[i].regex.test(this.data[i].value)){
              Toast(this.data[i].err);
              return;
            }else if(this.data[i].length&&this.data[i].value.length>this.data[i].length){
              Toast(this.data[i].err);
              return;
            }
          }
        }else{
          if(this.data[i].regex&&!this.data[i].regex.test(this.data[i].value)){
            Toast(this.data[i].err);
            return;
          }
        }

        valueList[this.data[i].alias]=this.data[i].value;
      }
      if(util.checkObjectIsEmpty(this.queryEnum)){
        Toast("获取枚举信息失败，请稍后尝试！");
        eventHandle.$emit("getEnumData");
        return false;
      }
      let {ensureMethod}=this.queryEnum;
      valueList.ensureMethod=util.selectValueForObject(ensureMethod,valueList.ensureMethod);
      valueList.loginName=window.userinfo.loginName;
      console.log("valueList1111:",valueList);
      $.post(window.baseUrl+"rest/addInfoForylpayCapply/addEnsureInfo",valueList).then((response) => {
        if(response.status==0){
          Toast("担保信息补件成功！");
          eventHandle.$emit("updateApply");
        }else{
          Toast(response.message);
        }
        console.log(response)
      })
        .catch(function(response) {
          Toast("担保信息补件异常，请稍后重试！");
        });

    }
  },
  components:{
    SelectList
  }
}
</script>
