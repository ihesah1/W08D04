const express = require("express");
require("dotenv").config();
const cors = require("cors");
require("./db");
const app = express();
app.use(express.json());
app.use(cors());

const roleRouter = require('./routers/routes/role');
const userRouter = require("./routers/routes/user");
const postRouter = require("./routers/routes/post");
const commentRouter = require("./routers/routes/comment");


app.use(roleRouter);
app.use(userRouter);
app.use(postRouter);
app.use(commentRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`server running at port ${PORT}`);
});
