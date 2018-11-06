# 17CE SD
OS: Ubuntu 16.04
語言: Node.js 10.12.0 , npm 6.4.1
資料庫: Redis 2.8.0

## 一、安裝
### 1. Node.js (https://nodejs.org/en/download/package-manager/)
```
$ sudo apt-get update
$ sudo apt install curl
$ curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```

移動到目錄並安裝相依
```
$ cd 17ce
$ npm i
```
### 2. Redis

#### 安裝 redis (For Mac)
https://medium.com/@djamaldg/install-use-redis-on-macos-sierra-432ab426640e

#### 安裝 redis (For Linux)
https://redis.io/topics/quickstart

#### 啟動 redis (For Mac)
```
$ redis-server
```

## 二、API

### /api/v1/17ce/list
#### [GET]
當前爬蟲狀態

##### Response 200
```
{
    "url": String,          // URL
    "time": Number,         // 時間
    "result": Array,        // 資料
}
```


### /api/v1/17ce/crawler

#### [PUT]
控制爬蟲器開始或停止

##### Body
```
{
    "run": true,
    "url": ["103.43.108.88","103.43.110.88"],
    "intervalSeconds": 180
}
```
* run: `true` (required, Boolean) - `true`: 開始; `false`: 停止
* url: `[]` (required, Array)
* intervalSeconds: `180` (required, Int)



## 三、Q&A
### 1. 運行 Puppeteer 出現 UnhandledPromiseRejectionWarning: Error: Failed to launch chrome!  
```
$ sudo apt-get update

$ sudo apt-get install libpangocairo-1.0-0 libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libgconf2-4 libasound2 libatk1.0-0 libgtk-3-0
```
https://github.com/GoogleChrome/puppeteer/issues/404

### 2. 安裝 Chromium 失敗：Failed to download Chromium r536395! Set "PUPPETEER_SKIP_CHROMIUM_DOWNLOAD" env variable to skip download

```
$ sudo npm install -g puppeteer --unsafe-perm=true --allow-root
```
https://github.com/GoogleChrome/puppeteer/issues/2173

