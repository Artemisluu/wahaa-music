
class Swiper {
  constructor(node) {
    if(!node) throw new Error('需要传递需要绑定的DOM元素')
    let root = typeof node === 'string' ? document.querySelector(node) : node
    let eventHub = {'swipLeft': [],'swipRight':[]}

    let initx
    let newX
    let clock
    root.ontouchstart = function(e) {
      initx = e.changedTouches[0].pageX
    }

    root.ontouchmove = function(e){
      if(clock) clearInterval(clock)
      clock = setTimeout(() =>{
        newX = e.changedTouches[0].pageX
        if(newX - initx > 10){
          eventHub['swipRight'].forEach(fn=>fn(root))
        }else if(initx - newX > 10){
          eventHub['swipLeft'].forEach(fn=>fn(root))
        }
      },100)
    }

    this.on = function (type, fn){
      if(eventHub[type]) {
        eventHub[type].push(fn)
      }
    }
    
    this.off = function (type,fn){
      let index = eventHub[type].indexOf(fn)
      if(index !== -1) {
        eventHub[type].splice(index,1)
      }
    }
  }
}


export default Swiper
















/*
let Swiper = (function(){
  let root = document
  let eventHub = {'swipLeft':[],'swipRight':[]}
  function bind(node) {
    root = node 
  }
  function on(type,fn) {
    if(eventHub[type]) {
      eventHub[type].push(fn)
    }
  }

  let initx
  let newX
  let clock
  root.ontouchstart = function(e) {
    initx = e.changedTouches[0].pageX
  }

  root.ontouchmove = function(e) {
    if(clock) clearInterval(clock)
    clock = setTimeout(()=>{
      newX = e.changedTouches[0].pageX
      if(newX - initx > 0) {
        eventHub['swipRight'].forEach(fn=>fn())
      }else{
        eventHub['swipLeft'].forEach(fn=>fn())
      }
    }, 100)
  }
  return {
    bind: bind,
    on: on
  }
})()

Swiper.bind(document.querySelector('#box'))

Swiper.on('swipLeft',function() {
  console.log('swipLeft');
})
Swiper.on('swipLeft',function(){
  console.log('swipLeft 111');
})

Swiper.on('swipRight',function(){
  console.log('swipRight');
})

Swiper.on('swipRight',function(){
  console.log('swipRight 222');
})
 */