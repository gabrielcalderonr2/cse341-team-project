import mongoose from "mongoose";
import schedule from "./schemas/schedules.js";

export async function getSchedulesByTripId(tripId, month = null) {
    // Find the trip and its operating months.
    const trip = await mongoose.connection
        .collection("trips")
        .findOne(
            { id: tripId },
            { projection: { operatingMonths: 1 } }
        );

    if (!trip) {
        return [];
    }

    // Check whether the selected month is valid.
    if (month !== null) {
        const selectedMonth = Number(month);

        if (
            !Number.isInteger(selectedMonth) ||
            selectedMonth < 1 ||
            selectedMonth > 12 ||
            !Array.isArray(trip.operatingMonths) ||
            !trip.operatingMonths.includes(selectedMonth)
        ) {
            return [];
        }
    }

    // Return schedules belonging to the selected trip.
    return schedule.find({ tripId }).lean();
}
