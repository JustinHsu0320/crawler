
const redis = require("redis")

const RDS_PROT = 6382
const RDS_HOST = '10.88.88.48'
const RDS_PWD = '1qaz@WSX'
const RDS_OPTS = {auth_pass: RDS_PWD}

const client = redis.createClient(RDS_PROT, RDS_HOST, RDS_OPTS)

// 開啟 Redis 通知
client.on('ready', function (res) {
    console.log('✅  Redis client connected.')
})
client.on('error', function (err) {
    console.log('❌  Redis connection error.')
    console.log(err)
})

// prepend 1 data - Redis List
const lpush = (key, obj) => {
    client.lpush(key, JSON.stringify(obj), client.print)
}

// get data - Redis List
const lrange = (key, start, stop) => {
    return new Promise((resolve, reject) => {
        client.lrange(key, start, stop, (err, val) => {
            if (err) return reject(err)
            resolve(val)
        })
    })
}


module.exports = {
    lpush,
    lrange,
}
