const express=require("express")
const router=express.Router()

router.use("/auth",require("./auth.route"))
router.use("/post",require("./post.route"))

module.exports=router