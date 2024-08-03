import express from "express";
import path from "path";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { Server } from "socket.io";
import session from "express-session";
import mongoStore from "connect-mongo";
import passport from "passport";
import cookieParser from "cookie-parser";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import __dirname from "./dirname.js";
import router from "./routes/index.js";
import paymentRoute from "./routes/payment.js"
import MessageManager from "./dao/db/messages/index.js";
import { passportStrategy } from "./config/passport.js";
import config from "./config/config.js";
import { errorHandlerMiddleware } from "./middlewares/errorHandler.middleware.js";
import { addLogger, logger } from "./config/logger.js";
import cors from "cors";

const app = express();
const PORT = 8080;
app.use(cookieParser());
app.set("port", process.env.PORT || 8080);
app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    store: mongoStore.create({
      mongoUrl: config.DB_URL,
      mongoOptions: {},
      ttl: 240,
    }),
    secret: "secretPassword",
    resave: true, // cada vez que se actualiza la pagina se resetea el ttl
    saveUninitialized: true,
  })
);
passportStrategy();
app.use(passport.initialize());

if (process.env.NODE_ENV !== "production") {
  const swaggerConfig = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Producst and Carts documentation",
        description: "Here is the brief of the doc",
      },
    },
    apis: [path.join(__dirname, "/docs", "**", "*.yaml")],
  };
  const specs = swaggerJsdoc(swaggerConfig);
  app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
}

handlebars.create({ allowProtoMethodsByDefault: true });
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use(addLogger);
app.get("/", async (req, res) => {
  try {
    if (req.cookies.token) return res.redirect("/api/views/products");
    res.render("login", {});
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
});
app.use("/api", router,paymentRoute);
//app.get("/", (req, res) => {
//  logger.info("Welcome to the API");
//  return res.send({ message: "Welcome to the API" });
//});

app.use(errorHandlerMiddleware);

const httpServer = app.listen(PORT, () => {
  console.log(`Server PORT: ${PORT}`, `- Entorno: ${config.ENV}`);
});

//Socket
const messageManager = new MessageManager();

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("dataUser", async (data) => {
    try {
      await messageManager.createData(data);
    } catch (error) {
      console.log(error);
    }
  });
});

//Database MongoDB
if (config.PERSISTENCE === "mongoDB") {
  const connectMongoDB = async () => {
    try {
      await mongoose.connect(config.DB_URL);
      console.log("Conectado a MongoDB con Mongoose");
    } catch (error) {
      console.log("No se pudo conectar a la BD con Mongoose");
      process.exit();
    }
  };

  connectMongoDB();
}
