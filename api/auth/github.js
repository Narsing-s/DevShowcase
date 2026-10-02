const crypto=require("crypto");
const {json}=require("../_lib");
module.exports=async(req,res)=>{
 if(req.method!=="GET")return json(res,405,{error:"GET required"});
 if(!process.env.GITHUB_CLIENT_ID||!process.env.APP_URL)return json(res,500,{error:"GITHUB_CLIENT_ID and APP_URL are required"});
 const state=crypto.randomUUID();
 res.setHeader("Set-Cookie",`ds_oauth=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`);
 const u=new URL("https://github.com/login/oauth/authorize");
 u.searchParams.set("client_id",process.env.GITHUB_CLIENT_ID);u.searchParams.set("redirect_uri",process.env.APP_URL+"/api/auth/github/callback");u.searchParams.set("scope","read:user user:email");u.searchParams.set("state",state);
 res.statusCode=302;res.setHeader("Location",u.toString());res.end();
};
