/**
 * 计算设计稿元素在页面中的真实宽高
 * @param  {Number} psWidth      元素设计稿宽度
 * @param  {Number} psHeight     元素设计稿高度
 * @param  {Number} defaultWidth 设计稿宽度
 * @return {Object}              真实宽高
 */
export function getRealSize (psWidth, psHeight, defaultWidth) {
  defaultWidth = defaultWidth || 750

  var winWidth = window.innerWidth
  var winRatio = psWidth / defaultWidth

  var realWidth = winWidth * winRatio
  var realHeight = realWidth * psHeight / psWidth

  return {
    realWidth: realWidth,
    realHeight: realHeight
  }
}

export function getQueryParameter(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  console.log(results)
  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

export function parseQueryString (query) {
  var vars = query.split('&')
  var queryString = {}
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    // If first entry with this name
    if (typeof queryString[pair[0]] === 'undefined') {
      queryString[pair[0]] = decodeURIComponent(pair[1])
      // If second entry with this name
    } else if (typeof queryString[pair[0]] === 'string') {
      var arr = [queryString[pair[0]], decodeURIComponent(pair[1])]
      queryString[pair[0]] = arr
      // If third or later entry with this name
    } else {
      queryString[pair[0]].push(decodeURIComponent(pair[1]))
    }
  }
  return queryString
}

export function getAuthData () {
  var qs = parseQueryString(window.location.search.substring(1))

  return qs
}

export function trackSection (sectionname) {
  const ga = window.ga

  console.log('section:' + sectionname)

  ga('send', 'pageview', '/' + sectionname)
}

export function trackEvent (eventname) {
  const ga = window.ga

  console.log('event:' + eventname)

  ga('send', 'event', 'LRL_Inclusive_Beauty', 'Mobile', '' + eventname, 1)
}
