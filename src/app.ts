import express, {Express, Request, Response} from "express";
import {connect, disconnect} from "./services/db";
import helmet from "helmet";
import {default as cors} from "cors";

const app: Express = express();

//APP MIDDLE-WARES
// Middleware
if (process.env.NODE_ENV === "production") {
    app.use(helmet());
}
app.use(cors());
app.disable("x-powered-by");
app.use(express.urlencoded({extended: true}));
app.use(express.json());


//APP ROUTES - IMPORT
import {default as routes} from "./routes";

app.use("/api", routes);

//DEFAULT RESPONSE TO TEST API
// app.get("*", (req: Request, res: Response) => {
//     res.status(200).send("Hello, world!");
// });

export default app;