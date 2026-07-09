import Office from "../models/Office.js";

// GET /api/v1/navigation/search?query=hr  (scope doc §3)
// Searches the caller's building directory by name, description, room or floor.
export async function search(req, res, next) {
  try {
    const { query = "" } = req.query;
    const filter = { tenantId: req.user.tenantId };

    if (query.trim()) {
      const rx = new RegExp(query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ name: rx }, { description: rx }, { room: rx }, { floor: rx }];
    }

    const results = await Office.find(filter).sort({ name: 1 }).limit(50);
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
