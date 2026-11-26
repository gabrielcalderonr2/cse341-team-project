import {
  getAllTicketClasses as findAllTicketClasses,
  getTicketClassesForDay as findTicketClassesForDay,
  getTicketClassByName as findTicketClassByName,
} from "../models/ticket-classes.js";

export async function getAllTicketClasses(req, res) {
  try {
    const ticketClasses = await findAllTicketClasses();
    return res.status(200).json(ticketClasses);
  } catch (error) {
    console.error("Error fetching ticket classes:", error);
    return res.status(500).json({ error: "Failed to fetch ticket classes" });
  }
}

export async function getTicketClassesForDay(req, res) {
  try {
    const { day } = req.query;

    const validDays = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    if (!day || !validDays.includes(day.toLowerCase())) {
      return res.status(400).json({ error: "Invalid or missing day parameter" });
    }

    const ticketClasses = await findTicketClassesForDay(day);

    return res.status(200).json(ticketClasses);
  } catch (error) {
    console.error("Error fetching ticket classes for day:", error);
    return res.status(500).json({ error: "Failed to fetch ticket classes" });
  }
}

export async function getTicketClassByName(req, res) {
  try {
    const { className } = req.params;
    const ticketClass = await findTicketClassByName(className);

    if (!ticketClass) {
      return res.status(404).json({ error: "Ticket class not found" });
    }

    return res.status(200).json(ticketClass);
  } catch (error) {
    console.error("Error fetching ticket class:", error);
    return res.status(500).json({ error: "Failed to fetch ticket class" });
  }
}