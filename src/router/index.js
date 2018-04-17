import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/views/LandingView'
import Home from '@/views/HomeView'
import CityDetail from '@/views/CityDetail'
import UserDetail from '@/views/UserDetail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing',
      component: Landing
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/citydetail',
      name: 'CityDetail',
      component: CityDetail,
      props (route) {
        return route.query || {}
      }
    },
    {
      path: '/userdetail',
      name: 'UserDetail',
      component: UserDetail,
      props (route) {
        return route.query || {}
      }
    }
  ]
})
