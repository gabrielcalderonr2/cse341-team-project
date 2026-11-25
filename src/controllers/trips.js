import {
  getAllTrips,
  getTripById,
  getTripRegions,
  getTripSeasons,
} from "../models/trips.js";

export async function listTripsPage(req, res) {
  try {
    const [regions, trips, seasons] = await Promise.all([
      getTripRegions(),
      getAllTrips(),
      getTripSeasons(),
    ]);

    return res.render("trips/list", {
      title: "Scenic Train Trips",
      regions,
      trips,
      seasons,
    });
  } catch (error) {
    console.error("Error loading trips:", error);

    return res.status(500).render("errors/500", {
      title: "Server Error",
    });
  }
}

export async function tripDetailsPage(req, res) {
  try {
    const { tripId } = req.params;
    const details = await getTripById(tripId);

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
