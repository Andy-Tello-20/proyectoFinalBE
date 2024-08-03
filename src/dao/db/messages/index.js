import { messageMongo } from "../../models/index.js";

class MessageManager {
  async getMessages() {
    try {
      const messages = await messageMongo.find();
      if (messages.length == 0) {
        return "No hay mensajes guardados aun";
      } else {
        const userData = messages.map((message) => {
          return { user: message.user, message: message.message };
        });
        const userDataString = JSON.stringify(userData);
        return userDataString;
      }
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  }

  async createData(data) {
    try {
      return await messageMongo.create(data);
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  }
}

export default MessageManager;
