<template>

  <!--<div class="container home-container">-->
    <!--<div class="btn btn1 item" @click="selectedCity(1)">btn1</div>-->
    <!--<div class="btn btn2 item" @click="selectedCity(2)">btn2</div>-->
    <!--<div class="btn btn3 item" @click="selectedCity(3)">btn3</div>-->
  <!--</div>-->
  <div id="container"></div>


</template>


<script>

  import C3D from '@/scripts/3d'

  export default {
    name: 'Home',
    data () {
      return{
        sceneImg: this.GLOBAL.ASSETS_LIST
      }
    },
    mounted () {
      C3D.init()
    },
    methods:{
        selectedCity(id){
          this.$router.push({path: '/cityDetail', query: { cityid: id }})
        }
    }
  }

</script>

<style scoped>
  .btn{
    /*width:200px;*/
    height:100px;
    text-align: center;
    line-height:100px;
    background-color: #f60;
  }
  .item {
    flex-grow: 1;
  }

</style>
