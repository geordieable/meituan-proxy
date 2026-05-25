const cacheMap = new Map();

// 缓存读取
function getCache(key) {
  const item = cacheMap.get(key);
  if (!item) return null;
  if (Date.now() > item.expire) {
    cacheMap.delete(key);
    return null;
  }
  return item.data;
}

// 缓存写入
function setCache(key, data, sec) {
  cacheMap.set(key, {
    data,
    expire: Date.now() + sec * 1000,
  });
}

module.exports = { getCache, setCache };