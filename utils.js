const crypto = require("crypto");
const config = require("./config");

// 美团官方MD5签名算法
function getSign(params, secret) {
  const keys = Object.keys(params).sort();
  let str = "";
  keys.forEach((k) => {
    if (params[k] !== undefined && params[k] !== "") {
      str += k + params[k];
    }
  });
  str += secret;
  return crypto.createHash("md5").update(str).digest("hex");
}

// 组装带签名、时间戳、随机串的请求参数
function buildParams(query = {}) {
  const timestamp = parseInt(Date.now() / 1000);
  const nonce = Math.random().toString(36).slice(2);
  const params = {
    appkey: config.APP_KEY,
    timestamp,
    nonce,
    ...query,
  };
  params.sign = getSign(params, config.APP_SECRET);
  return params;
}

// 内存缓存（无需数据库，适配免费Render）
const cacheMap = new Map();

function getCache(key) {
  const item = cacheMap.get(key);
  if (!item) return null;
  if (Date.now() > item.expire) {
    cacheMap.delete(key);
    return null;
  }
  return item.data;
}

function setCache(key, data, sec) {
  cacheMap.set(key, {
    data,
    expire: Date.now() + sec * 1000,
  });
}

module.exports = { buildParams, getCache, setCache };
