import Office from "../models/Office.js";

// GET /api/v1/offices — full directory for the caller's building
export async function listOffices(req, res, next) {
  try {
    const offices = await Office.find({ tenantId: req.user.tenantId }).sort({
      floorNumber: 1,
      name: 1,
    });
    res.json({ count: offices.length, offices });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/offices  (tenant admin)
export async function createOffice(req, res, next) {
  try {
    const { name, floor, floorNumber, room, description, category, directions } = req.body;
    const office = await Office.create({
      tenantId: req.user.tenantId,
      name,
      floor,
      floorNumber,
      room,
      description,
      category,
      directions,
    });
    res.status(201).json({ office });
  } catch (err) {
    next(err);
  }
}

// PUT /api/v1/offices/:id  (tenant admin)
export async function updateOffice(req, res, next) {
  try {
    const { name, floor, floorNumber, room, description, category, directions } = req.body;
    const office = await Office.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user.tenantId },
      { $set: { name, floor, floorNumber, room, description, category, directions } },
      { new: true, runValidators: true, omitUndefined: true }
    );
    if (!office) return res.status(404).json({ error: "Office not found" });
    res.json({ office });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/v1/offices/:id  (tenant admin)
export async function deleteOffice(req, res, next) {
  try {
    const office = await Office.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.user.tenantId,
    });
    if (!office) return res.status(404).json({ error: "Office not found" });
    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
}
