const {db,json}=require("../_lib");
module.exports=async(req,res)=>{
 if(req.method!=="POST")return json(res,405,{error:"POST required"});
 const expected=process.env.DB_INIT_SECRET;
 if(!expected)return json(res,503,{error:"DB initialization is disabled until DB_INIT_SECRET is configured"});
 const supplied=(req.headers["x-db-init-secret"]||"").toString();
 if(!supplied||supplied!==expected)return json(res,401,{error:"Unauthorized"});
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
  await sql`CREATE TABLE IF NOT EXISTS opportunities (id BIGSERIAL PRIMARY KEY, author_id BIGINT REFERENCES users(id) ON DELETE SET NULL, title TEXT NOT NULL, type TEXT NOT NULL DEFAULT 'Open Source', level TEXT NOT NULL DEFAULT 'All levels', description TEXT NOT NULL DEFAULT '', url TEXT, status TEXT NOT NULL DEFAULT 'published', created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now())`;
  await sql`CREATE TABLE IF NOT EXISTS opportunity_interests (opportunity_id BIGINT REFERENCES opportunities(id) ON DELETE CASCADE, user_id BIGINT REFERENCES users(id) ON DELETE CASCADE, created_at TIMESTAMPTZ DEFAULT now(), PRIMARY KEY(opportunity_id,user_id))`;
  await sql`CREATE TABLE IF NOT EXISTS mentorship_requests (id BIGSERIAL PRIMARY KEY, requester_id BIGINT REFERENCES users(id) ON DELETE CASCADE, mentor_id BIGINT REFERENCES users(id) ON DELETE CASCADE, topic TEXT NOT NULL DEFAULT 'General', message TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'pending', created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now())`;
  await sql`CREATE TABLE IF NOT EXISTS resources (id BIGSERIAL PRIMARY KEY, author_id BIGINT REFERENCES users(id) ON DELETE SET NULL, title TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', url TEXT NOT NULL, category TEXT NOT NULL DEFAULT 'Learning', created_at TIMESTAMPTZ DEFAULT now())`;
  await sql`CREATE TABLE IF NOT EXISTS events (id BIGSERIAL PRIMARY KEY, author_id BIGINT REFERENCES users(id) ON DELETE SET NULL, title TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', starts_at TIMESTAMPTZ, url TEXT, created_at TIMESTAMPTZ DEFAULT now())`;
  await sql`CREATE INDEX IF NOT EXISTS opportunities_created_idx ON opportunities(created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS mentorship_request_status_idx ON mentorship_requests(status)`;
  await sql`CREATE INDEX IF NOT EXISTS resources_category_idx ON resources(category)`;
  await sql`CREATE INDEX IF NOT EXISTS events_starts_idx ON events(starts_at)`;
  json(res,200,{ok:true,message:"Database initialized"});
 }catch(e){json(res,500,{error:e.message})}
};
