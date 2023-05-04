const express = require("express");
const router = express.Router();

// const userRouter = require("./user/router/router");
const adminRouter = require("./admin/router/router");

// router.use("/user", userRouter);
router.use("/admin", adminRouter);

module.exports = router;
