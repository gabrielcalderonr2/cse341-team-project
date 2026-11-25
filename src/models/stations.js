import station from "./schemas/stations.js";

export async function getAllStations() {
  return station.find({}).lean();
}

export async function getStationById(id) {
  return station.findOne({ id }).lean();
}

export async function getStationsByRegion(region) {
  return station.find({ region }).lean();
}

export async function getStationRegions() {
  return station.distinct("region");
}
