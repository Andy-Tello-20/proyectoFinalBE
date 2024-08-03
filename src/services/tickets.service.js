import { Tickets } from "../dao/models/index.js";

export default class TicketsService {
  static createTicket(body) {
    return Tickets.create(body);
  }
}
