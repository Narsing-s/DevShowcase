const {json,cookie}=require("../_lib");
module.exports=(req,res)=>{res.setHeader("Set-Cookie",cookie("ds_session","",0));res.statusCode=302;res.setHeader("Location","/");res.end()};
