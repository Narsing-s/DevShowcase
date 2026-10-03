const {db,json}=require("./_lib");
module.exports=async(req,res)=>{
 if(req.method!=="GET")return json(res,405,{error:"Method not allowed"});
 try{const sql=db();await sql`SELECT 1 AS ok`;return json(res,200,{ok:true,service:"DevShowcase API",database:"connected",timestamp:new Date().toISOString()});}
 catch(e){return json(res,503,{ok:false,service:"DevShowcase API",database:"unavailable",error:"Database unavailable"});}
};
