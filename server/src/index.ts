import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import router from "./router";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.urlencoded({extended:true}));
app.use(express.json());

const CLIENT_URL = process.env.CLIENT_URL;

app.use(
    cors({
      credentials: true,
      origin:CLIENT_URL,
    })
  );

app.use(cookieParser());

app.use("/", router);

app.listen(port, () => {
    console.log(`server has been started on port ${port}`);
})