const {db,json,body,sessionUser}=require("../_lib");
module.exports=async(req,res)=>{
 try{
  const user=sessionUser(req);
  if(!user||!process.env.ADMIN_GITHUB_LOGINS?.split(",").map(x=>x.trim()).includes(user.login))return json(res,403,{error:"Admin access required"});
  const sql=db();
  if(req.method==="GET"){const rows=await sql`SELECT p.*,u.login AS author FROM projects p LEFT JOIN users u ON u.id=p.author_id ORDER BY p.created_at DESC LIMIT 500`;return json(res,200,{projects:rows})}
  if(req.method==="PATCH"){const d=await body(req);if(!d.id||!["approved","rejected","pending"].includes(d.status))return json(res,400,{error:"id and valid status required"});const rows=await sql`UPDATE projects SET status=${d.status},featured=COALESCE(${d.featured},featured),updated_at=now() WHERE id=${d.id} RETURNING id,status,featured`;return json(res,200,{project:rows[0]})}
  return json(res,405,{error:"Method not allowed"});
 }catch(e){json(res,500,{error:e.message})}
};
