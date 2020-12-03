
function random (value,rand) {
  return Math.floor(value * rand)
}

function handleComment (msg) {
  var color = msg.color || '#000000'
  var shadow = msg.shadow || '#ffffff'
  var rand = msg.rand || 0.5
  var duration = msg.duration  || 4000
  const size = msg.size || 56
  const t = document.createElement('div')

  t.style.position = 'fixed'
  //t.style.left = window.innerWidth + 'px'
  //t.style.top = random((window.innerHeight - 40),rand) + 'px'
  t.style.fontSize = size + 'pt'
  t.style.fontWeight = 'bold'
  t.style.color = color
  t.style.textShadow = `-2px -2px 0px ${shadow}, -2px 2px 0px ${shadow}, 2px -2px 0px ${shadow}, 2px 2px 0px ${shadow}`
  t.style.whiteSpace = 'pre'
  t.style.zIndex = 2147483647

  if(msg.nickname == "OFF"){
    t.innerText = msg.body
  }else{
    t.innerText = msg.name +":"+ msg.body
  }

  document.body.appendChild(t)

  const effect = [{
    left: window.innerWidth + 'px'
  }, {
    left: -t.offsetWidth * 1.2 + 'px'
  }]

  const timing = {}
  timing.duration = (duration) * (window.innerWidth + t.offsetWidth) / window.innerWidth
  timing.iterations = 1
  timing.easing = msg.easing || 'linear'

  t.style.top = random(window.innerHeight - t.offsetHeight , rand) + 'px'

  t.animate(effect, timing).onfinish = function () {
    document.body.removeChild(t)
  }

}
function handleLike (msg) {
	var duration = msg.duration || 4000
  var rand_h = msg.rand_h * 0.8 || 0.5
  var rand_w = msg.rand_w * 0.8 || 0.5
  const image = msg.image || 'Good'

  if (msg.url != undefined){
    if(msg.url.slice(0,8) != "https://" && msg.url.slice(0,7) !="http://"){
      msg.url = null;
      }
    }
  const url = msg.url ||`/public/images/${image}.png`
  const t = document.createElement('img')

  t.addEventListener('load', function (e) {
    t.style.position = 'fixed'
		t.style.top = random(window.innerHeight ,rand_h) - t.height / 2 + 'px'
    t.style.left = random(window.innerWidth ,rand_w) - t.width / 2 + 'px'
    t.style.zIndex = 2147483647
    t.style.opacity = 0.0
    var s = 300/t.height;
    document.body.appendChild(t)

    const effect = [{
      opacity: 0.0,
      transform: 'scale(' + s*0.2 + ',' + s*0.2 +') translate(0, 0px)'
    }, {
      opacity: 1.0,
      transform: 'scale(' + s*0.5 + ',' + s*0.5 +') translate(0, 0)'
    }, {
      opacity: 0.0,
      transform: 'scale(' + s + ',' + s +') translate(0, 0px)'
    }]

    const timing = {}
    timing.duration = duration
    timing.iterations = 1
    timing.easing = msg.easing || 'ease'

    t.animate(effect, timing).onfinish = function () {
      document.body.removeChild(t)
    }
  })
  t.src = url

}
function handleName (msg) {
  if(msg.nickname != "OFF"){
    const color = msg.color || '#000000'
    const shadow = msg.shadow || '#ffffff'
    const rand_h = msg.rand_h * 0.8 || 0.5
    const rand_w = msg.rand_w * 0.8 || 0.5
    const size = msg.size || 56
    const t = document.createElement('div')
    var duration = msg.duration || 4000

    t.style.position = 'fixed'
    t.style.top = random(window.innerHeight ,rand_h) + 100 + 'px'
    t.style.left = random(window.innerWidth ,rand_w) - 150 + 'px'
    t.style.fontSize = size + 'pt'
    t.style.fontWeight = 'bold'
    t.style.color = color
    t.style.textShadow = `-2px -2px 0px ${shadow}, -2px 2px 0px ${shadow}, 2px -2px 0px ${shadow}, 2px 2px 0px ${shadow}`
    t.style.whiteSpace = 'pre'
    t.style.zIndex = 2147483647

    t.innerText = msg.name

    document.body.appendChild(t)
    const effect = [{
      opacity: 0.0,
    }, {
      opacity: 1.0,
    }, {
      opacity: 0.0,
    }]
      
    const timing = {}
    timing.duration = duration
    timing.iterations = 1
    timing.easing = msg.easing || 'linear'
    t.animate(effect, timing).onfinish = function () {
      document.body.removeChild(t)
    }
  }
}
