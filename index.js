const express = require("express");
const axios = require("axios");
const config = require("./config");
const { getCache, setCache } = require("./utils");

const app = express();
const port = process.env.PORT || 3000;

// 全局跨域
app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(express.json());

// 根路径兜底（解决网页解析失败）
app.get("/", (req, res) => {
  res.send("美团Token代理服务运行正常");
});

// 统一请求头（新版仅Token）
const getHeader = () => {
  return {
    "Authorization": `Bearer ${config.MEITUAN_TOKEN}`,
    "Content-Type": "application/json"
  }
}

// 1.商圈列表
app.get("/api/city/business", async (req, res) => {
  try {
    const q = req.query;
    const key = `city_${q.cityid}`;
    let data = getCache(key);
    if(!data){
      const ret = await axios.get(`${config.API_HOST}/api/v1/city/business`,{
        headers:getHeader(),
        params:q
      });
      data = ret.data;
      setCache(key,data,config.CACHE_SHOP);
    }
    res.json({code:0,data});
  }catch(err){
    res.json({code:-1,msg:"接口失败"});
  }
});

// 2.周边门店
app.get("/api/shop/nearby", async (req, res) => {
  try {
    const q = req.query;
    const key = `shop_${q.cityid}_${q.lat}_${q.lng}`;
    let data = getCache(key);
    if(!data){
      const ret = await axios.get(`${config.API_HOST}/api/v1/shop/nearby`,{
        headers:getHeader(),
        params:q
      });
      data = ret.data;
      setCache(key,data,config.CACHE_SHOP);
    }
    res.json({code:0,data});
  }catch(err){
    res.json({code:-1,msg:"接口失败"});
  }
});

// 3.团购列表
app.get("/api/group/list", async (req, res) => {
  try {
    const q = req.query;
    const key = `group_${q.shopid}`;
    let data = getCache(key);
    if(!data){
      const ret = await axios.get(`${config.API_HOST}/api/v1/group/list`,{
        headers:getHeader(),
        params:q
      });
      data = ret.data;
      setCache(key,data,config.CACHE_GROUP);
    }
    res.json({code:0,data});
  }catch(err){
    res.json({code:-1,msg:"接口失败"});
  }
});

// 4.门店详情
app.get("/api/shop/detail", async (req, res) => {
  try {
    const q = req.query;
    const key = `detail_${q.shopid}`;
    let data = getCache(key);
    if(!data){
      const ret = await axios.get(`${config.API_HOST}/api/v1/shop/detail`,{
        headers:getHeader(),
        params:q
      });
      data = ret.data;
      setCache(key,data,config.CACHE_SHOP);
    }
    res.json({code:0,data});
  }catch(err){
    res.json({code:-1,msg:"接口失败"});
  }
});

// 5.高分榜单
app.get("/api/shop/rank", async (req, res) => {
  try {
    const q = req.query;
    const key = `rank_${q.cityid}`;
    let data = getCache(key);
    if(!data){
      const ret = await axios.get(`${config.API_HOST}/api/v1/shop/nearby`,{
        headers:getHeader(),
        params:q
      });
      let list = ret.data.data || [];
      list.sort((a,b)=>b.avgscore - a.avgscore);
      data = list;
      setCache(key,data,config.CACHE_RANK);
    }
    res.json({code:0,data});
  }catch(err){
    res.json({code:-1,msg:"接口失败"});
  }
});

app.listen(port, () => {
  console.log("✅ 新版Token代理服务启动成功");
});
