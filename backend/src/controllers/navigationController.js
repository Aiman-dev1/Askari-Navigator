import Office from "../models/Office.js";
import { logActivity } from "../utils/activityLogger.js";

// GET /api/v1/navigation/search?query=hr  (scope doc §3)
// Searches the caller's building directory by name, description, room or floor.
export async function search(req, res, next) {
  try {
    const { query = "", floor } = req.query;
    const filter = { tenantId: req.user.tenantId };

    if (query.trim()) {
      const rx = new RegExp(query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ name: rx }, { description: rx }, { room: rx }, { floor: rx }];
    }

    // Floor number filter (from the dropdown)
    if (floor !== undefined && floor !== "") {
      filter.floorNumber = parseInt(floor, 10);
    }

    const results = await Office.find(filter).sort({ name: 1 }).limit(50);

    // Log user searches (only when a real query is provided)
    if (query.trim()) {
      logActivity(req, "NAVIGATION_SEARCH", `Searched for: "${query.trim()}" (${results.length} result${results.length === 1 ? "" : "s"})`);
    }

    res.json({ count: results.length, results });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/navigation/directions/:officeId
// Step-by-step wayfinding for one location.
export async function directions(req, res, next) {
  try {
    const office = await Office.findOne({
      _id: req.params.officeId,
      tenantId: req.user.tenantId,
    });
    if (!office) return res.status(404).json({ error: "Location not found" });

    logActivity(req, "DIRECTIONS_VIEWED", `Got directions to: "${office.name}" (${office.floor}, Room ${office.room})`, { resourceType: "office", resourceId: office._id });

    res.json({
      office: office.name,
      floor: office.floor,
      room: office.room,
      directions: office.directions,
    });
  } catch (err) {
    next(err);
  }
}
