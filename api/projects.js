const {db,json,body,sessionUser}=require("./_lib");
module.exports=async(req,res)=>{
 try{
  const sql=db();
  if(req.method==="GET"){
   const rows=await sql`SELECT p.id,p.name,p.description AS desc,p.category,p.github_url AS github,p.demo_url AS demo,p.tags,p.featured,p.stars AS views,p.forks,u.login AS author,u.avatar FROM projects p LEFT JOIN users u ON u.id=p.author_id WHERE p.status='approved' ORDER BY p.featured DESC,p.created_at DESC LIMIT 200`;
   return json(res,200,{projects:rows});
  }
  if(req.method==="POST"){
   const user=sessionUser(req); if(!user)return json(res,401,{error:"Sign in with GitHub before submitting a project"});
   const d=await body(req);
   if(!d.name||!d.github) return json(res,400,{error:"name and github are required"});
   const tags=Array.isArray(d.tags)?d.tags.filter(Boolean).slice(0,12):[];
   const rows=await sql`INSERT INTO projects(name,description,category,github_url,demo_url,author_id,tags,status) VALUES(${String(d.name).slice(0,120)},${String(d.desc||"").slice(0,2000)},${String(d.category||"Open Source").slice(0,80)},${String(d.github)},${d.demo?String(d.demo):null},${user.id},${JSON.stringify(tags)}::jsonb,'pending') ON CONFLICT(github_url) DO UPDATE SET name=EXCLUDED.name,description=EXCLUDED.description,demo_url=EXCLUDED.demo_url,tags=EXCLUDED.tags,updated_at=now() RETURNING id,name,status`;
   return json(res,201,{project:rows[0],message:"Submitted for moderation"});
  }
  res.setHeader("Allow","GET, POST"); return json(res,405,{error:"Method not allowed"});
 }catch(e){json(res,500,{error:e.message})}
};
