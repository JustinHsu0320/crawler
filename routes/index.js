const express = require('express')
const router = express.Router()

const crawler = require('../modules/crawler')
const redis = require("../config/redis")


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' })
})


// [PUT] 控制 crawler 開關
router.put('/crawler', (req, res) => {
  if(req.body.hasOwnProperty('run') 
  && req.body.hasOwnProperty('url')
  && req.body.hasOwnProperty('intervalSeconds')) 
  {
    crawler.controlTask(req.body.run, req.body.url, req.body.intervalSeconds)
    res.send(crawler.getStatus())
  }
  else res.send(`req.body lack`)
})

// [GET] Redis 17CE 列表
router.get('/list', async (req, res) => {
  try{
    res.send((await redis.lrange('17ce', 0, 0))[0]) // 只要一筆最新～ [0]
  }
  catch(e) {
    res.status(400).send(e)
  }
})

module.exports = router;
