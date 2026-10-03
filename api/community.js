const {db,json,body,sessionUser}=require("./_lib");
module.exports=async(req,res)=>{
 try{
  const sql=db(),user=sessionUser(req),url=new URL(req.url,"http://localhost"),type=url.searchParams.get("type");
  if(req.method==="GET"){
   if(!type){
    const rows=await sql\`SELECT d.id,d.title,d.message,d.topic,d.project_url AS project,d.created_at,u.login AS author,u.avatar FROM discussions d JOIN users u ON u.id=d.author_id WHERE d.status='published' ORDER BY d.created_at DESC LIMIT 50\`;
    return json(res,200,{discussions:rows});
   }
   if(type==="opportunities"){const rows=await sql\`SELECT o.*,u.login AS author,u.avatar FROM opportunities o LEFT JOIN users u ON u.id=o.author_id WHERE o.status='published' ORDER BY o.created_at DESC LIMIT 100\`;return json(res,200,{opportunities:rows});}
   if(type==="resources"){const rows=await sql\`SELECT r.*,u.login AS author,u.avatar FROM resources r LEFT JOIN users u ON u.id=r.author_id ORDER BY r.created_at DESC LIMIT 100\`;return json(res,200,{resources:rows});}
   if(type==="events"){const rows=await sql`SELECT e.*,u.login AS author,u.avatar,(SELECT count(*) FROM event_attendees a WHERE a.event_id=e.id) AS attendees FROM events e LEFT JOIN users u ON u.id=e.author_id ORDER BY e.starts_at NULLS LAST,e.created_at DESC LIMIT 100`;return json(res,200,{events:rows});}
   if(type==="mentors"){const rows=await sql`SELECT u.id,u.login,u.avatar,u.bio,u.website,mp.headline,mp.expertise,mp.availability,mp.profile_url FROM mentor_profiles mp JOIN users u ON u.id=mp.user_id ORDER BY mp.updated_at DESC LIMIT 100`;return json(res,200,{mentors:rows});}
   return json(res,400,{error:"Unknown community type"});
  }
  if(req.method!=="POST"){res.setHeader("Allow","GET,POST");return json(res,405,{error:"Method not allowed"});}
  if(!user)return json(res,401,{error:"Sign in with GitHub required"});
  const d=await body(req);
  if(!type){
   if(!d.title||!d.message)return json(res,400,{error:"title and message are required"});
   const x=await sql\`INSERT INTO discussions(author_id,title,message,topic,project_url) VALUES(\${user.id},\${String(d.title).slice(0,160)},\${String(d.message).slice(0,5000)},\${String(d.topic||"General").slice(0,80)},\${d.project?String(d.project).slice(0,500):null}) RETURNING id\`;
   await sql\`INSERT INTO activity(user_id,type,entity_id,message) VALUES(\${user.id},'discussion',\${x[0].id},'started a discussion')\`;
   return json(res,201,{id:x[0].id});
  }
  if(type==="opportunities"){
   if(!d.title||!d.description)return json(res,400,{error:"title and description are required"});
   const rows=await sql\`INSERT INTO opportunities(author_id,title,type,level,description,url) VALUES(\${user.id},\${String(d.title).slice(0,160)},\${String(d.type||"Open Source").slice(0,60)},\${String(d.level||"All levels").slice(0,60)},\${String(d.description).slice(0,3000)},\${d.url?String(d.url).slice(0,500):null}) RETURNING *\`;
   return json(res,201,{opportunity:rows[0]});
  }
  if(type==="interest"){
   const opportunityId=Number(d.opportunity_id);
   if(!Number.isInteger(opportunityId)||opportunityId<1)return json(res,400,{error:"valid opportunity_id is required"});
   await sql\`INSERT INTO opportunity_interests(opportunity_id,user_id) VALUES(\${opportunityId},\${user.id}) ON CONFLICT DO NOTHING\`;
   return json(res,201,{ok:true});
  }
  if(type==="resources"){
   if(!d.title||!d.url)return json(res,400,{error:"title and url are required"});
   const rows=await sql\`INSERT INTO resources(author_id,title,description,url,category) VALUES(\${user.id},\${String(d.title).slice(0,160)},\${String(d.description||"").slice(0,3000)},\${String(d.url).slice(0,1000)},\${String(d.category||"Learning").slice(0,60)}) RETURNING *\`;
   return json(res,201,{resource:rows[0]});
  }
  if(type==="events"){
   if(!d.title)return json(res,400,{error:"title is required"});
   const starts=d.starts_at?new Date(d.starts_at):null;
   if(starts&&!Number.isFinite(starts.getTime()))return json(res,400,{error:"starts_at must be a valid date"});
   const rows=await sql\`INSERT INTO events(author_id,title,description,starts_at,url) VALUES(\${user.id},\${String(d.title).slice(0,160)},\${String(d.description||"").slice(0,3000)},\${starts},\${d.url?String(d.url).slice(0,1000):null}) RETURNING *\`;
   return json(res,201,{event:rows[0]});
  }
  if(type==="mentor"){
   const headline=String(d.title||"Community Mentor").slice(0,160);
   const expertise=String(d.tech||"").slice(0,500);
   const availability="Open to requests";
   const profileUrl=d.url?String(d.url).slice(0,500):null;
   await sql`INSERT INTO mentor_profiles(user_id,headline,expertise,availability,profile_url) VALUES(${user.id},${headline},${expertise},${availability},${profileUrl}) ON CONFLICT(user_id) DO UPDATE SET headline=EXCLUDED.headline,expertise=EXCLUDED.expertise,profile_url=EXCLUDED.profile_url,updated_at=now()`;
   return json(res,201,{ok:true,mentor:true});
  }
  if(type==="collaborate"){
   if(!d.title||!d.message)return json(res,400,{error:"title and message are required"});
   const rows=await sql`INSERT INTO collaboration_requests(requester_id,title,message,technology,url) VALUES(${user.id},${String(d.title).slice(0,160)},${String(d.message).slice(0,3000)},${String(d.tech||"").slice(0,500)},${d.url?String(d.url).slice(0,500):null}) RETURNING *`;
   await sql`INSERT INTO activity(user_id,type,entity_id,message) VALUES(${user.id},'collaboration',${rows[0].id},'created a collaboration request')`;
   return json(res,201,{request:rows[0]});
  }
  if(type==="mentorship"){
   const mentorId=Number(d.mentor_id);
   if(!Number.isInteger(mentorId)||mentorId<1)return json(res,400,{error:"valid mentor_id is required"});
   if(mentorId===Number(user.id))return json(res,400,{error:"You cannot request mentorship from yourself"});
   const rows=await sql\`INSERT INTO mentorship_requests(requester_id,mentor_id,topic,message) VALUES(\${user.id},\${mentorId},\${String(d.topic||"General").slice(0,120)},\${String(d.message||"").slice(0,3000)}) RETURNING *\`;
   return json(res,201,{request:rows[0]});
  }
  return json(res,400,{error:"Unsupported community type"});
 }catch(e){return json(res,500,{error:e.message});}
};