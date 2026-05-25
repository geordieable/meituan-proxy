const express = require("express");
const axios = require("axios");
const config = require("./config");
const { buildParams, getCache, setCache } = require("./utils");

const app = express();
const port = process.env.PORT || 3000;

// 全局跨域（允许小程序请求）
app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,OPTIONS");
  next();
});

app.use(express.json());

// 【关键修复】根路径兜底，解决浏览器打开报错网页解析失败
app.get("/", (req, res) => {
  res.send("美团API代理服务正常运行｜API接口可正常调用");
});

// 1. 商圈列表
app.get("/api/city/business", async (req, res) => {
  try {
    const q = req.query;
    const key = `city_${q.cityid}`;
    let data = getCache(key);
    if (!data) {
      const ret = await axios.get(`${config.API_HOST}/api/v1/city/business`, { params: buildParams(q) });
      data = ret.data;
      setCache(key, data, config.CACHE_SHOP);
    }
    res.json({ code: 0, data });
  } catch (err) {
    res.json({ code: -1, msg: "接口请求失败" });
  }
});

// 2. 周边门店
app.get("/api/shop/nearby", async (req, res) => {
  try {
    const q = req.query;
    const key = `shop_${q.cityid}_${q.lat}_${q.lng}`;
    let data = getCache(key);
    if (!data) {
      const ret = await axios.get(`${config.API_HOST}/api/v1/shop/nearby`, { params: buildParams(q) });
      data = ret.data;
      setCache(key, data, config.CACHE_SHOP);
    }
    res.json({ code: 0, data });
  } catch (err) {
    res.json({ code: -1, msg: "接口请求失败" });
  }
});

// 3. 门店团购列表
app.get("/api/group/list", async (req, res) => {
  try {
    const q = req.query;
    const key = `group_${q.shopid}`;
    let data = getCache(key);
    if (!data) {
      const ret = await axios.get(`${config.API_HOST}/api/v1/group/list`, { params: buildParams(q) });
      data = ret.data;
      setCache(key, data, config.CACHE_GROUP);
    }
    res.json({ code: 0, data });
  } catch (err) {
    res.json({ code: -1, msg: "接口请求失败" });
  }
});

// 4. 门店详情
app.get("/api/shop/detail", async (req, res) => {
  try {
    const q = req.query;
    const key = `detail_${q.shopid}`;
    let data = getCache(key);
    if (!data) {
      const ret = await axios.get(`${config.API_HOST}/api/v1/shop/detail`, { params: buildParams(q) });
      data = ret.data;
      setCache(key, data, config.CACHE_SHOP);
    }
    res.json({ code: 0, data });
  } catch (err) {
    res.json({ code: -1, msg: "接口请求失败" });
  }
});

// 5. 高分榜单
app.get("/api/shop/rank", async (req, res) => {
  try {
    const q = req.query;
    const key = `rank_${q.cityid}`;
    let data = getCache(key);
    if (!data) {
      const ret = await axios.get(`${config.API_HOST}/api/v1/shop/nearby`, { params: buildParams(q) });
      let list = ret.data.data || [];
      list.sort((a, b) => b.avgscore - a.avgscore);
      data = list;
      setCache(key, data, config.CACHE_RANK);
    }
    res.json({ code: 0, data });
  } catch (err) {
    res.json({ code: -1, msg: "接口请求失败" });
  }
});

app.listen(port, () => {
  console.log("✅ 美团代理服务启动成功");
});
