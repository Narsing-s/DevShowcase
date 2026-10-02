const { neon } = require("@neondatabase/serverless");
const crypto = require("crypto");

function db(){
  if(!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  return neon(process.env.DATABASE_URL);
}
function secret(){
  if(!process.env.SESSION_SECRET) throw new Error("SESSION_SECRET is not configured");
  return process.env.SESSION_SECRET;
}
function sign(value){
  return crypto.createHmac("sha256",secret()).update(value).digest("base64url");
}
function cookie(name,value,maxAge=60*60*24*7){
  return `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}
function readCookies(req){
  return Object.fromEntries((req.headers.cookie||"").split(";").filter(Boolean).map(x=>{const i=x.indexOf("=");return [x.slice(0,i).trim(),decodeURIComponent(x.slice(i+1))]}));
}
function sessionUser(req){
  const c=readCookies(req), raw=c.ds_session;
  if(!raw)return null;
  const [payload,sig]=raw.split(".");
  if(!payload||!sig||!crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(sign(payload))))return null;
  try{return JSON.parse(Buffer.from(payload,"base64url").toString())}catch{return null}
}
function sessionCookie(user){
  const payload=Buffer.from(JSON.stringify({id:user.id,login:user.login,avatar:user.avatar}),"utf8").toString("base64url");
  return cookie("ds_session",payload+"."+sign(payload));
}
function json(res,status,data,headers={}){
  res.statusCode=status;Object.entries({"Content-Type":"application/json; charset=utf-8",...headers}).forEach(([k,v])=>res.setHeader(k,v));res.end(JSON.stringify(data));
}
async function body(req){let s="";for await(const c of req)s+=c;return s?JSON.parse(s):{}}
module.exports={db,sessionUser,sessionCookie,cookie,json,body};
