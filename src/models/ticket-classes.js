import ticketClass from "./schemas/ticket-classes.js";

export async function getAllTicketClasses() {
  return ticketClass.find({}).lean();
}

export async function getTicketClassByName(className) {
  return ticketClass.findOne({ class: className }).lean();
}