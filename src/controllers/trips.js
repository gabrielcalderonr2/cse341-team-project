import {
  getAllTrips as findAllTrips,
  getTripById as findTripById,
} from "../models/trips.js";

// EJS Controllers

export async function listTripsPage(req, res) {
  return res.render("trips/list", {
    title: "Scenic Train Trips",
  });
}

export async function tripDetailsPage(req, res) {
  try {
    const { tripId } = req.params;
    const details = await findTripById(tripId);

    if (!details) {
      return res.status(404).render("errors/404", {
        title: "Trip Not Found",
      });
    }

    return res.render("trips/details", {
      title: "Trip Details",
      details,
    });
  } catch (error) {
    console.error("Error loading trip details:", error);

    return res.status(500).render("errors/500", {
      title: "Server Error",
    });
  }
}

// API Controllers

export async function getAllTrips(req, res) {
  try {
    const trips = await findAllTrips();
    return res.status(200).json(trips);
  } catch (error) {
    console.error("Error fetching trips:", error);
    return res.status(500).json({ error: "Failed to fetch trips" });
  }
}

export async function getTripById(req, res) {
  try {
    const { id } = req.params;
    const trip = await findTripById(id);

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    return res.status(200).json(trip);
  } catch (error) {
    console.error("Error fetching trip:", error);
    return res.status(500).json({ error: "Failed to fetch trip" });
  }
}
