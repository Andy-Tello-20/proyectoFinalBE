import { Users } from "../dao/models/index.js";

export default class UsersService {
  //logica aplicada directamente para usar con mongo
  static async getByEmail(email) {
    return await Users.findOne({ email });
  }
}
