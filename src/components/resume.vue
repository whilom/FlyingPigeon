<template>
  <div>
    <div id="he-plugin-standard"></div>
    <div id="clock">
      <div class="date">{{ date }}</div>
      <div class="time">{{ time }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: '',
      time: '',
      clock: null
    }
  },
  beforeCreate() {
    //在页面创建之前设置body的背景色
    document.querySelector('body').setAttribute('style', 'background:#0f3854;background: radial-gradient(ellipse at center, #0a2e38 0%, #000000 70%);')
  },
  created() {
    window.WIDGET = {
      CONFIG: {
        layout: '1',
        width: 450,
        height: 150,
        background: '5',
        dataColor: 'FFFFFF',
        borderRadius: '10',
        key: '17ca4c40f39b42e7b12a77c3da21c34e'
      }
    }
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://widget.qweather.net/standard/static/js/he-standard-common.js?v=2.0'
    document.getElementsByTagName('head')[0].appendChild(script)
  },
  mounted() {
    function checkTime(num) {
      return num < 10 ? '0' + num : num
    }
    this.clock = setInterval(() => {
      var week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      const myDate = new Date()
      this.time = checkTime(myDate.getHours()) + ':' + checkTime(myDate.getMinutes()) + ':' + checkTime(myDate.getSeconds())
      this.date = checkTime(myDate.getFullYear()) + '-' + checkTime(myDate.getMonth() + 1) + '-' + checkTime(myDate.getDate()) + ' ' + week[myDate.getDay()]
    }, 100)
  },
  beforeDestroy() {
    // 清除定时器
    window.clearInterval(this.clock)
    //在页面销毁之前移除body的属性，目的是设置的颜色只对当前页面有效
    document.querySelector('body').removeAttribute('style')
  }
}
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
}

body {
  /* background: #0f3854;
    background: radial-gradient(ellipse at center, #0a2e38 0%, #000000 70%); */
  background-size: 100%;
}

p {
  margin: 0;
  padding: 0;
}

#clock {
  font-family: "Consolas", monospace;
  color: #fff;
  text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  color: #daf6ff;
  text-shadow: 0 0 20px #0aafe6, 0 0 20px rgba(10, 175, 230, 0);
}

#clock .time {
  letter-spacing: 0.05em;
  font-size: 80px;
  padding: 20px 0 0;
}

#clock .date {
  letter-spacing: 0.1em;
  font-size: 28px;
}

#clock .text {
  letter-spacing: 0.1em;
  font-size: 12px;
  padding: 20px 0 0;
}
#he-plugin-standard {
  position: relative;
  left: 764px;
}
</style>