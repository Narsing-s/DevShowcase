const {json,sessionUser}=require("./_lib");
module.exports=(req,res)=>json(res,200,{user:sessionUser(req)});
