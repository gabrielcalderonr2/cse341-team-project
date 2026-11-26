import ticketClass from "./schemas/ticket-classes.js";

export async function getAllTicketClasses() {
  return ticketClass.find({}).lean();
}

export async function getTicketClassesForDay(day) {
  const normalizedDay = day.toLowerCase();

  const validDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  if (!validDays.includes(normalizedDay)) {
    return [];
  }

  // All ticket classes are currently available every day.
  return getAllTicketClasses();
}

export async function getTicketClassByName(className) {
  return ticketClass.findOne({ class: className }).lean();
}
