const puppeteer = require('puppeteer')

const run = async (queryUrl) => {
  console.log(`:::: → 17CE...(${queryUrl})`)
  const browser = await puppeteer.launch({
    timeout: 10000,
    args: ['--no-sandbox','--disable-setuid-sandbox'],
    // headless: false,
  })
  
  
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 1200 })
  await page.goto('https://www.17ce.com/').then(async function(response) { console.log(':::: → 17CE... 成功連上 17ce.com。') })
  await page.click('#nav2')                     // 點擊 `Ping` 選單按鈕
  await page.click('a#high')                    // 按下 `高級` (進階搜尋)
  await page.click('input#url')                 // 按下輸入框
  await page.keyboard.type(queryUrl, {          // 輸入查詢內容
    delay: (100 + Math.floor(Math.random() * 1000))
  }).then(async function(response) { console.log(':::: → 17CE... 成功輸入 IP。') })
  await page.click('input#isp0')                // 勾消 `全部` (ISP全部取消)
  await page.click('input#isp1')                // 勾選 `电信`
  await page.click('input#isp2')                // 勾選 `联通`
  await page.click('input#isp4')                // 勾選 `移动`
  await page.click('input#area0')               // 勾消 `全部` (区域全部取消)
  await page.click('input#area1')               // 勾選 `大陆`
  .then(async function(response) { 
    page.click('input#su')
    .then(async function(response) { console.log(':::: → 17CE... 成功送出查詢。AJAX 加載中(約60秒)⋯') })
  })
  // await page.click('input.so_button', {                // 模擬人類的 delay 按下送出查詢 'input.so_button'
  //   delay: (100 + Math.floor(Math.random() * 1000))
  // }).then(async function(response) { console.log(':::: → 17CE... 成功送出查詢。AJAX 加載中(約60秒)⋯') })

  // 等待頁面內容出現
  await page.waitFor(60000)
  await page.waitFor('table#tblSort', { timeout: 60000 })
  .then(async function(response) { console.log(':::: → 17CE... AJAX 加載完。資料解析、存入DB⋯') })

  const result = await page.evaluate(() => {
    let data = []
    let elements = document.querySelectorAll('table.rank_list > tbody > tr')  // 選擇表格的各 tuple

    for (var element of elements) {
      const tdNumber = element.children.length  // 該tuple之欄位數量 (用於檢查tuple是否包含內容，因為有的是空的)

      if (tdNumber > 1) {
        const avgTime = parseFloat(element.children[11].innerText.replace(/ms/, ''))  // 取代文字中的 `ms` 並轉換為 float 數值

        if (avgTime > 0) {
          const source = '17ce'
          const name = element.children[1].innerText
          const isp = element.children[2].innerText
          const province = element.children[3].innerText
          const ip = element.children[4].innerText
          const posts = element.children[6].innerText
          const gets = element.children[7].innerText
          const discards = element.children[8].innerText
          const max = parseFloat(element.children[9].innerText.replace(/ms/, ''))
          const min = parseFloat(element.children[10].innerText.replace(/ms/, ''))
          data.push({ source, name, isp, province, ip, posts, gets, discards, max, min, avgTime }) // 插入列表中
        }
      }
    }
    return data  // 回傳爬蟲結果列表
  })

  await browser.close()
  console.log(`:::: ✓ 17CE(${queryUrl})存完DB。待爬下筆`)

  return {
    result
  }
}

module.exports = {
  run
}
