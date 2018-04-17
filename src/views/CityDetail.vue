<template>

  <el-container>

    <el-header>
      <el-row :gutter="20">
        <el-col :span="16"><div class="grid-content bg-purple"><span>大家好，我是一个标题~大家好，我是一个标题~大家好~</span></div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple"><span class="icon-group" @click="goBack()"><i class="el-icon-back"></i> | <i class="el-icon-edit-outline"></i></span></div></el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-row :gutter="20">
        <el-col :span="12" v-for="o in userList" :key="o.id">
          <div class="grid-content bg-purple">
            <img class="thumb_img" :src="o.thumb_img" :user-id="o.id" @click="selectedUser(o.id)">
          </div>
          <div class="meta">
            <h3 class="like">like: {{o.like}}</h3>
            <p class="desc">{{o.desc}}</p>
          </div>
        </el-col>
      </el-row>
    </el-main>

  </el-container>

  <!--<div class="container city-detail-container">-->
      <!--<div class="user-list">-->
        <!--<el-row :gutter="20">-->
          <!--<el-col :span="12" v-for="o in userList" :key="o.id">-->
            <!--<div class="grid-content bg-purple">-->
              <!--<img class="thumb_img" :src="o.thumb_img" :user-id="o.id" @click="selectedUser(o.id)">-->
            <!--</div>-->
            <!--<div class="meta">-->
              <!--<h3 class="like">like: {{o.like}}</h3>-->
              <!--<p class="desc">{{o.desc}}</p>-->
            <!--</div>-->
          <!--</el-col>-->
        <!--</el-row>-->

      <!--</div>-->
  <!--</div>-->

</template>


<script>

  export default {
    name: 'CityDetail',
    data () {
      return{
        userList: [
          {id:1, like: 99, desc: '哈哈哈~哈哈哈~大傻子~', thumb_img: '../../static/img/bg1.png', origin_img: '../../static/img/bg1.png'},
          {id:2, like: 57, desc: '哈哈哈~哈哈哈~大傻子~', thumb_img: '../../static/img/bg2.png', origin_img: '../../static/img/bg2.png'},
          {id:3, like: 204, desc: '哈哈哈~哈哈哈~大傻子~', thumb_img: '../../static/img/bg3.png', origin_img: '../../static/img/bg3.png'},
          {id:4, like: 1504, desc: '哈哈哈~哈哈哈~大傻子~哈哈啊哈哈', thumb_img: '../../static/img/bg5.png', origin_img: '../../static/img/bg5.png'},
          {id:5, like: 99, desc: '哈哈哈~哈哈哈~大傻子~', thumb_img: '../../static/img/bg1.png', origin_img: '../../static/img/bg1.png'},
          {id:6, like: 57, desc: '哈哈哈~哈哈哈~大傻子~', thumb_img: '../../static/img/bg2.png', origin_img: '../../static/img/bg2.png'},
          {id:7, like: 204, desc: '哈哈哈~哈哈哈~大傻子~', thumb_img: '../../static/img/bg3.png', origin_img: '../../static/img/bg3.png'},
          {id:8, like: 1504, desc: '哈哈哈~哈哈哈~大傻子~哈哈啊哈哈', thumb_img: '../../static/img/bg5.png', origin_img: '../../static/img/bg5.png'},
        ],
      }
    },
    props: ['cityid'],
    mounted () {

    },
    methods:{
      selectedUser(uid){
        this.$router.push({path: '/userDetail', query: { cityid: this.cityid, userid: uid}})
      },
      goBack(){
        this.$router.go(-1)
      }
    }
  }

</script>

<style scoped>
  h3 {
    color: #f60;
    font-size:16px;
    text-align: left;
  }
  .el-header{
    background-color: #dde3ea;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .user-list{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
  }
  .user{
    width: 300px;
    overflow: hidden;
    float: left;
    margin: 30px 0 0 50px;
  }
  .thumb_img{
    width: 100%;
    text-align: center;
  }
  .desc{
    text-align: left;
  }

  .el-row {
    margin-bottom: 20px;
  }
  .grid-content {
    height: 300px;
    overflow: hidden;
  }

</style>
