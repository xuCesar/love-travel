const STATIC_URL = 'static/img/'

let HOME_LIST = []
let BG_LIST = []
let ICON_LIST = []
let ICON_LIST_HD = []


for (let i = 1; i <= 29; i++) {
  if (i <= 5) {
    HOME_LIST.push(STATIC_URL + 'home' + i + '.png')
    BG_LIST.push(STATIC_URL + 'bg' + i + '.png')
  }
  ICON_LIST.push(STATIC_URL + 'thumb/icon' + i + '.png')
  ICON_LIST_HD.push(STATIC_URL + 'icon/icon' + i + '.png')
}
const ASSETS_LIST = [
  'static/img/bg-extra.jpg',
  'static/img/bg-main.jpg'
]

const SCENE_LIST = [
  require("@/assets/stars.jpg"),
  require("@/assets/logo.png"),
  require("@/assets/earth.jpg"),
  require("@/assets/earth_political_alpha.png"),
]

export {HOME_LIST, BG_LIST, ICON_LIST, ICON_LIST_HD, ASSETS_LIST, SCENE_LIST}

/* 资源路径 */
export const RES_URL = 'http://display.6edigital.com:3000/'

/* API根路径 */
export const API_BASE_URL = 'http://display.6edigital.com:3000/'

export const AUTH_URL = 'http://lorealqiye.trafficmanager.cn/WechatQiYe/OAuth2/Index?redirect_uri='

export const RES_SUCCESS = 2
export const RES_NOT_EMPLOYEE = 5
