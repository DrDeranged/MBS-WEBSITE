import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();
app.set("trust proxy", 1);

function isAllowedOrigin(origin: string | undefined) {
  return (
    !origin ||
    origin === "https://my-business-solutions.com" ||
    origin === "https://www.my-business-solutions.com" ||
    /^https:\/\/[a-z0-9-]+\.replit\.dev$/i.test(origin) ||
    /^https?:\/\/localhost(?::\d+)?$/i.test(origin) ||
    /^https?:\/\/127\.0\.0\.1(?::\d+)?$/i.test(origin)
  );
}

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use((req, res, next) => {
  if (!isAllowedOrigin(req.get("origin"))) {
    res.status(403).json({ error: "Origin not allowed" });
    return;
  }
  next();
});
app.use(
  cors({
    origin(origin, callback) {
      callback(null, isAllowedOrigin(origin));
    },
  }),
);
app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true, limit: "32kb" }));

app.use("/api", router);

export default app;
