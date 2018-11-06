const fs = require('fs')
const extend = require('extend')

const filePath = `./config/config.json` // 設定檔之路徑

// 預設之設定值
const defaultConfig = {
    crawler: {
      running: true,           // 是否運行 PING 爬蟲
      interval: 180,           // 爬蟲間隔(s)
      url: [],                 // 爬蟲 URL 列表
    }
}

// 取得 config
const get = (name = null) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (e, data) => {
      if (e) reject(e)
      
      data = JSON.parse(data.toString().trim())

      if(name === null || name === '')  // 若name(欄位)為空
        resolve(data)  // 回傳所有設定
      if(data.hasOwnProperty(name))
        resolve(data[name])  // 回傳指定的設定
    })
  })
}

// 設定 config (data 為欲設定的部分)
const set = (data) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (e, fileData) => {
      if (e) { reject(e) }
      let newData = JSON.parse(fileData.toString())  // 將 newData 轉成obj

      extend(true, newData, data) // 遞迴合併

      let clawlerUrl = null
      try{ clawlerUrl = data.crawler.url || null }
      catch(e){ reject(e) }

      if(clawlerUrl != null) {
        newData.crawler.url = [...clawlerUrl];
      }

      // TODO: 防呆/檢查輸入的資料，目前只有在前端檢查

      fs.writeFile(filePath, JSON.stringify(newData), (e) => { // 寫入檔案
        if (!e) resolve(newData)
        else reject(e)
      })
    })
  })
}

// 恢復設定值為預設值
const restore = () => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(defaultConfig), (e) => {
      if (!e) resolve(defaultConfig)
      else reject(e)
    })
  })

}

module.exports = {
  get,
  set,
  restore,
}
