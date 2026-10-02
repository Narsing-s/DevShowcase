const {db,json,sessionCookie,cookie}=require("../../_lib");
const crypto=require("crypto");
function cookies(req){return Object.fromEntries((req.headers.cookie||"").split(";").filter(Boolean).map(x=>{const i=x.indexOf("=");return [x.slice(0,i).trim(),decodeURIComponent(x.slice(i+1))]}))}
module.exports=async(req,res)=>{
 try{
  const c=cookies(req), code=req.query.code, state=req.query.state;
  if(!code||!state||c.ds_oauth!==state)return json(res,400,{error:"Invalid OAuth state"});
  const tokenRes=await fetch("https://github.com/login/oauth/access_token",{method:"POST",headers:{"Accept":"application/json","Content-Type":"application/json"},body:JSON.stringify({client_id:process.env.GITHUB_CLIENT_ID,client_secret:process.env.GITHUB_CLIENT_SECRET,code})});
  const token=await tokenRes.json(); if(!token.access_token)throw new Error("GitHub OAuth failed");
  const gh=await fetch("https://api.github.com/user",{headers:{Authorization:"Bearer "+token.access_token,Accept:"application/vnd.github+json","User-Agent":"DevShowcase"}});
  const u=await gh.json(); if(!u.id)throw new Error("Unable to read GitHub profile");
  const sql=db();
  const rows=await sql`INSERT INTO users(github_id,login,avatar) VALUES(${String(u.id)},${u.login},${u.avatar_url||null}) ON CONFLICT(github_id) DO UPDATE SET login=EXCLUDED.login,avatar=EXCLUDED.avatar,updated_at=now() RETURNING id,login,avatar`;
  res.setHeader("Set-Cookie",[sessionCookie(rows[0]),cookie("ds_oauth","",0)]);
  res.statusCode=302;res.setHeader("Location",process.env.APP_URL+"/");res.end();
 }catch(e){json(res,500,{error:e.message})}
};
