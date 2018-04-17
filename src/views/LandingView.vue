<template>

  <div class="container landing-wrap">
    <div class="landing-bar loading-bar" v-if="!completed">
      <div class="inner-bar">
        <p>Loading</p>
        {{percent}}
      </div>
    </div>

  </div>

</template>


<script>

  import Promise from 'es6-promise'
  import C3D from '@/scripts/3d'

  export default {
    name: 'LandingView',
    data () {
      return{
        completed: false,
        percent: 0,
      }
    },
    mounted () {
      let num = 0
      const imageList = [].concat(this.GLOBAL.ASSETS_LIST, this.GLOBAL.HOME_LIST, this.GLOBAL.BG_LIST, this.GLOBAL.ICON_LIST, this.GLOBAL.SCENE_LIST)
      const length = imageList.length
      const imageLoad = (src) => (
        new Promise((resolve, reject) => {
          const img = new Image()
          img.onload = () => {
            if (src.substring(0,1) == '/'){
              C3D.load(img)
              console.log(img)
            }
//            console.log(src)
            resolve({src, status: 'ok'})
          }
          img.onerror = () => {
            resolve({src, status: 'error'})
          }
          img.src = src
        })
      )

      imageList.map(val => {
        imageLoad(val)
          .then((res) => {
            this.percent += 1 / length * 100
            num++
            if (num === length) {
              this.completed = true
//              this.$router.push('/home')
            }
          })
      })

    },

  }

</script>

<style scoped>
  .loading-bar{
    width:100%;
    font-size:24px;
    display: flex;
    justify-content: center;
    align-items:center;
  }
</style>
