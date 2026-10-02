const {db,json}=require("../_lib");
module.exports=async(req,res)=>{
 if(req.method!=="POST")return json(res,405,{error:"POST required"});
 try{
  const sql=db();
  await sql`CREATE TABLE IF NOT EXISTS users (id BIGSERIAL PRIMARY KEY, github_id TEXT UNIQUE NOT NULL, login TEXT NOT NULL, avatar TEXT, created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now())`;
  await sql`CREATE TABLE IF NOT EXISTS projects (id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', category TEXT NOT NULL DEFAULT 'Open Source', github_url TEXT UNIQUE NOT NULL, demo_url TEXT, author_id BIGINT REFERENCES users(id) ON DELETE SET NULL, tags JSONB NOT NULL DEFAULT '[]'::jsonb, featured BOOLEAN NOT NULL DEFAULT false, status TEXT NOT NULL DEFAULT 'pending', stars INTEGER NOT NULL DEFAULT 0, forks INTEGER NOT NULL DEFAULT 0, created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now())`;
  await sql`CREATE INDEX IF NOT EXISTS projects_status_idx ON projects(status)`;
  await sql`CREATE INDEX IF NOT EXISTS projects_author_idx ON projects(author_id)`;
  json(res,200,{ok:true,message:"Database initialized"});
 }catch(e){json(res,500,{error:e.message})}
};
