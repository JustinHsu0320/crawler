const config = require('../config/config')
const redis = require("../config/redis")

const _17ce = require('./17ce')

let _17ceTimer = null     // 17ce 計時器 id

const status = {
  is17ceRunning: false,       // 是否開始 17ce 任務
  is17ceCrawling: false,      // 17ce 爬蟲是否進行當中
  current17ceUrl: null,       // 當前爬蟲的url
  next17ceUrl: null,          // 記錄是否正在進行爬蟲任務
  current17ceUrlIndex: 0,     // 記錄當前執行到的 URL 的 index
  _17ceTimer,
}

const _17ceTask = (url = null) => {
  if(!url) return
  status.is17ceCrawling = true
  _17ce.run(url).then((result) => {  // 執行爬蟲工作
    status.is17ceCrawling = false
    const time = +new Date()
    if(result !== null) redis.lpush('17ce', {url, time, ...result}) // 若成功則加入資料庫
  })
}

const start17ce = (urls, intervalSeconds) => {
  config.get().then((data) => { // 使用 config.json > 17ce (key)
    const s = status
    let interval = 0  // 爬蟲間隔
    let urlList = []                      // url列表
    if (urls && intervalSeconds) { // 第一次
      urlList = urls
      interval = intervalSeconds

      // 回寫 config.json 下次回圈時使用
      data.crawler.url = urls
      data.crawler.interval = intervalSeconds
      config.set(data).then((data) => { console.log('new Config.json: ', data) })

    } else { // 第二次以後
      urlList = data.crawler.url
      interval = data.crawler.interval
    }

    const url = s.current17ceUrl = urlList[s.current17ceUrlIndex]  // 本次要爬的url

    if(! Array.isArray(urlList)) {          // url列表 err
      console.log(`❌  [PUT] body.url Error`)
      return
    }

    s.is17ceRunning = true  // 標示`已開啟爬蟲`

    if(s.current17ceUrlIndex > urlList.length - 1) s.current17ceUrlIndex = 0

    if(urlList.length > 0) {
      console.log(`:: → ${url} (下次任務會在 ${interval}s 後開始)`)
      _17ceTask(url)
    }
    else {  // 若列表為空
      console.log(`:: 爬蟲列表為空, 下次嘗試會在 ${interval}s 後開始`)
      s.current17ceUrl = s.current17ceUrl = null
      s.current17ceUrlIndex = 0
    }

    if(++s.current17ceUrlIndex >= urlList.length) s.current17ceUrlIndex = 0
    s.next17ceUrl = urlList[s.current17ceUrlIndex]

    _17ceTimer = setTimeout(start17ce, interval * 1000)  // 每間隔 interval 秒執行一次爬蟲工作
  })
}

const stop = (type = `17ce`) => {
  switch (type) {
    case `17ce`:
      clearTimeout(_17ceTimer)         // 停止 setTimeout(但本次的任務會持續進行到結束為止)
      _17ceTimer = null                // 清空記錄 setTimeout 的 timer id
      status.is17ceRunning = false
      status.current17ceUrlIndex = 0
      console.log(`Stop 17ce.`)
      break
  }
}

// 控制任務開始或停止(已開始或停止的不受影響)
const controlTask = (run = true, url, intervalSeconds, type = `17ce`) => {
  if(run) {
    switch (type) {
      case `17ce`:
        if(_17ceTimer === null) {
          start17ce(url, intervalSeconds)
          console.log(`Start 17ce crawler.`)
        }
        break
    }
  } else {
    stop(type)
  }
}

// 取得當前爬蟲狀態
const getStatus = () => status

module.exports = {
  controlTask,
  getStatus,
}
