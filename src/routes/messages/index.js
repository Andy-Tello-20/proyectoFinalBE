import { Router } from "express";
import MessageManager from "../../dao/db/messages/index.js";

const router = Router();
const messageManager = new MessageManager();

router.get("/", async (req, res) => {
  try {
    const messages = await messageManager.getMessages();
    res.render("chat", { messages });
  } catch (error) {
    console.log(error);
    throw new Error();
  }
});

export default router;
