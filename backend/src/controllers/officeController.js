import Office from "../models/Office.js";
import { logActivity } from "../utils/activityLogger.js";

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
    const { name, floor, floorNumber, room, description, category, directions, status } = req.body;
    const office = await Office.create({
      tenantId: req.user.tenantId,
      name,
      floor,
      floorNumber,
      room,
      description,
      category,
      directions,
      status,
    });
    logActivity(req, "OFFICE_CREATED", `Added office: "${name}" (${floor}, Room ${room})`, { resourceType: "office", resourceId: office._id });
    res.status(201).json({ office });
  } catch (err) {
    next(err);
  }
}

// PUT /api/v1/offices/:id  (tenant admin)
export async function updateOffice(req, res, next) {
  try {
    const { name, floor, floorNumber, room, description, category, directions, status } = req.body;
    const office = await Office.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user.tenantId },
      { $set: { name, floor, floorNumber, room, description, category, directions, status } },
      { new: true, runValidators: true, omitUndefined: true }
    );
    if (!office) return res.status(404).json({ error: "Office not found" });
    logActivity(req, "OFFICE_UPDATED", `Updated office: "${office.name}"`, { resourceType: "office", resourceId: office._id });
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
    logActivity(req, "OFFICE_DELETED", `Deleted office: "${office.name}" (${office.floor})`, { resourceType: "office", resourceId: office._id });
    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/offices/bulk-delete  (tenant admin)
export async function bulkDeleteOffices(req, res, next) {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "No office IDs provided" });
    }
    
    const result = await Office.deleteMany({
      _id: { $in: ids },
      tenantId: req.user.tenantId,
    });
    
    logActivity(req, "OFFICES_BULK_DELETED", `Bulk deleted ${result.deletedCount} offices`, { resourceType: "office" });
    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    next(err);
  }
}
