import { getScheduleById } from "../models/schedules.js";
import { getTripById } from "../models/trips.js";
import {
  getAllTicketClasses,
  getTicketClassesForDay,
  getTicketClassByName,
} from "../models/ticket-classes.js";
import {
  createBooking,
  getAllBookings as findAllBookings,
  getBookingById,
} from "../models/bookings.js";
import { generateConfirmationCode } from "../includes/helpers.js";

export async function bookingPage(req, res) {
  try {
    const scheduleId = Number(req.params.scheduleId);

    if (!Number.isInteger(scheduleId)) {
      return res.status(400).send("Invalid schedule ID.");
    }

    const schedule = await getScheduleById(scheduleId);

    if (!schedule || !schedule.status) {
      return res.status(404).send("Schedule not found or unavailable.");
    }

    const trip = await getTripById(schedule.tripId);

    if (!trip) {
      return res.status(404).send("Trip not found.");
    }

    const ticketClasses = await getAllTicketClasses();

    const ticketOptions = ticketClasses.map((ticketClass) => ({
      class: ticketClass.class,
      name: ticketClass.name,
      price: trip.distance * ticketClass.pricePerKm,
      amenities: ticketClass.amenities,
      description: ticketClass.description,
    }));

    return res.render("trips/book", {
      title: "Book Trip",
      schedule,
      ticketOptions,
    });
  } catch (error) {
    console.error("Error loading booking page:", error);
    return res.status(500).send("Unable to load booking page.");
  }
}

export async function processBookingRequest(req, res) {
  try {
    const {
      scheduleId,
      ticketClass,
      selectedDay,
      passengers,
    } = req.body;

    const numericScheduleId = Number(scheduleId);

    if (!Number.isInteger(numericScheduleId)) {
      return res.status(400).send("Invalid schedule ID.");
    }

    const schedule = await getScheduleById(numericScheduleId);

    if (!schedule || !schedule.status) {
      return res.status(400).send("Schedule is unavailable.");
    }

    const availableTicketClasses = await getTicketClassesForDay(selectedDay);

    const isTicketAvailable = availableTicketClasses.some(
    (ticket) => ticket.class === ticketClass
    );

    if (!isTicketAvailable) {
    return res.status(400).send("Selected ticket class is not available for this day.");
    }

    const selectedTicketClass = await getTicketClassByName(ticketClass);

    if (!selectedTicketClass) {
      return res.status(400).send("Invalid ticket class.");
    }

    const passengerList = Array.isArray(passengers)
      ? passengers
      : passengers
        ? [passengers]
        : [];

    if (passengerList.length < 1 || passengerList.length > 8) {
      return res.status(400).send("A booking must have between 1 and 8 passengers.");
    }

    const booking = await createBooking({
      id: generateConfirmationCode(),
      scheduleId: numericScheduleId,
      tripId: schedule.tripId,
      ticketClass: selectedTicketClass.class,
      selectedDay,
      passengers: passengerList,
    });

    return res.redirect(`/trips/confirmation/${booking.id}`);
  } catch (error) {
    console.error("Error processing booking:", error);

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).send("Invalid booking information.");
    }

    return res.status(500).send("Unable to process booking.");
  }
}

export async function confirmationPage(req, res) {
  try {
    const { confirmationId } = req.params;

    const confirmation = await getBookingById(confirmationId);

    if (!confirmation) {
      return res.status(404).send("Booking not found.");
    }

    return res.render("trips/confirm", {
      title: "Trip Confirmation",
      confirmation,
    });
  } catch (error) {
    console.error("Error loading booking confirmation:", error);
    return res.status(500).send("Unable to load booking confirmation.");
  }
}

export async function getAllBookings(req, res) {
  try {
    const bookings = await findAllBookings();

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);

    return res.status(500).json({
      error: "Failed to fetch bookings.",
    });
  }
}

export function bookingsAdminPage(req, res) {
  return res.render("bookings", {
    title: "Bookings Administration",
  });
}
