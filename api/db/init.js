const {db,json}=require("../_lib");
module.exports=async(req,res)=>{
 if(req.method!=="POST")return json(res,405,{error:"POST required"});
 try{
  const sql=db();
  await sql`CREATE TABLE IF NOT EXISTS users (id BIGSERIAL PRIMARY KEY, github_id TEXT UNIQUE NOT NULL, login TEXT NOT NULL, avatar TEXT, created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now())`;
  await sql`CREATE TABLE IF NOT EXISTS projects (id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', category TEXT NOT NULL DEFAULT 'Open Source', github_url TEXT UNIQUE NOT NULL, demo_url TEXT, author_id BIGINT REFERENCES users(id) ON DELETE SET NULL, tags JSONB NOT NULL DEFAULT '[]'::jsonb, featured BOOLEAN NOT NULL DEFAULT false, status TEXT NOT NULL DEFAULT 'pending', stars INTEGER NOT NULL DEFAULT 0, forks INTEGER NOT NULL DEFAULT 0, created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now())`;
  await sql`CREATE INDEX IF NOT EXISTS projects_status_idx ON projects(status)`;
  await sql`CREATE INDEX IF NOT EXISTS projects_author_idx ON projects(author_id)`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT ''`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS website TEXT`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS views BIGINT NOT NULL DEFAULT 0`;
  await sql`CREATE TABLE IF NOT EXISTS follows (follower_id BIGINT REFERENCES users(id) ON DELETE CASCADE, following_id BIGINT REFERENCES users(id) ON DELETE CASCADE, created_at TIMESTAMPTZ DEFAULT now(), PRIMARY KEY(follower_id,following_id), CHECK(follower_id<>following_id))`;
  await sql`CREATE TABLE IF NOT EXISTS project_likes (user_id BIGINT REFERENCES users(id) ON DELETE CASCADE, project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE, created_at TIMESTAMPTZ DEFAULT now(), PRIMARY KEY(user_id,project_id))`;
  await sql`CREATE TABLE IF NOT EXISTS discussions (id BIGSERIAL PRIMARY KEY, author_id BIGINT REFERENCES users(id) ON DELETE CASCADE, title TEXT NOT NULL, message TEXT NOT NULL, topic TEXT NOT NULL DEFAULT 'General', project_url TEXT, status TEXT NOT NULL DEFAULT 'published', created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now())`;
  await sql`CREATE TABLE IF NOT EXISTS discussion_comments (id BIGSERIAL PRIMARY KEY, discussion_id BIGINT REFERENCES discussions(id) ON DELETE CASCADE, author_id BIGINT REFERENCES users(id) ON DELETE CASCADE, message TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now())`;
  await sql`CREATE TABLE IF NOT EXISTS notifications (id BIGSERIAL PRIMARY KEY, user_id BIGINT REFERENCES users(id) ON DELETE CASCADE, actor_id BIGINT REFERENCES users(id) ON DELETE SET NULL, type TEXT NOT NULL, entity_id BIGINT, message TEXT NOT NULL, read BOOLEAN NOT NULL DEFAULT false, created_at TIMESTAMPTZ DEFAULT now())`;
  await sql`CREATE TABLE IF NOT EXISTS activity (id BIGSERIAL PRIMARY KEY, user_id BIGINT REFERENCES users(id) ON DELETE CASCADE, type TEXT NOT NULL, entity_id BIGINT, message TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now())`;
  json(res,200,{ok:true,message:"Database initialized"});
 }catch(e){json(res,500,{error:e.message})}
};
