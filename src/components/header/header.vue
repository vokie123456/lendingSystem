<template>
  <header class="m-header">
    <i class="elIconBack" :style="{'background-image':'url('+imageList[0]+')'}" @click="back"></i>
    <h1 class="text">{{title}}</h1>
    <span class="rightContent" @click="clickEvent($event)" v-if="rightContent.length>0">{{rightContent}}</span>
  </header>
</template>

<script>
export default {
  data(){
    return {
      imageList:[window.baseUrl+'static/images/icon/back.png']
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    rightContent:{
      type:String,
      default: ''
    },
    backUrl:{
      type:String,
      default:null
    }
  },
  methods: {
    back: function(){
      if(this.backUrl){
        this.$router.push(this.backUrl);
        return;
      }
      this.$router.back();
    },
    clickEvent:function(event){
      this.$emit("userOperate",event);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.m-header{
  width: 100%;
  height: 44px;
  line-height: 44px;
  position: relative;
  left: 0;
  top: 0;
}
.m-header h1{
  font-size: 0.6rem;
  font-weight: normal;
  margin:0;
}
.elIconBack{
  position: absolute;
  left: 0.5rem;
  top:10px;
  font-style: normal;
  width:0.6rem;
  height:0.6rem;
  background-size: 100% 100%;
}
.rightContent{
  position: absolute;
  right: 0.3rem;
  top:0;
  font-size: 0.35rem;
  color:#000;
  line-height: 55px;
}
</style>
