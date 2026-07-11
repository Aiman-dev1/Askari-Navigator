import Tenant from "../models/Tenant.js";
import User from "../models/User.js";

// GET /api/v1/tenants  (super admin) — all buildings + subscription status
export async function listTenants(req, res, next) {
  try {
    const tenants = await Tenant.find().sort({ buildingName: 1 });
    res.json({ count: tenants.length, tenants });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/tenants  (super admin) — onboard a new building + its admin account
export async function createTenant(req, res, next) {
  try {
    const { buildingName, slug, floors, admin } = req.body;
    if (!buildingName || !slug) {
      return res.status(400).json({ error: "buildingName and slug are required" });
    }

    const tenant = await Tenant.create({ buildingName, slug, floors });

    let adminUser = null;
    if (admin?.email && admin?.password) {
      adminUser = new User({
        tenantId: tenant._id,
        username: admin.username || `${slug}-admin`,
        email: admin.email,
        role: "tenant_admin",
      });
      await adminUser.setPassword(admin.password);
      await adminUser.save();
    }

    res.status(201).json({
      tenant,
      admin: adminUser ? { id: adminUser._id, email: adminUser.email } : null,
    });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/v1/tenants/:id  (super admin) — e.g. change subscriptionStatus
export async function updateTenant(req, res, next) {
  try {
    const { buildingName, subscriptionStatus, floors, settings } = req.body;
    const tenant = await Tenant.findByIdAndUpdate(
      req.params.id,
      { $set: { buildingName, subscriptionStatus, floors, settings } },
      { new: true, runValidators: true, omitUndefined: true }
    );
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });
    res.json({ tenant });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/v1/tenants/:id (super admin) — delete a building permanently
export async function deleteTenant(req, res, next) {
  try {
    const tenant = await Tenant.findByIdAndDelete(req.params.id);
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });
    // Also delete associated admin users if necessary
    await User.deleteMany({ tenantId: req.params.id });
    res.json({ message: "Tenant deleted successfully" });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/tenants/mine/floors/:floorNumber/map  (tenant admin)
// Uploads an SVG floor plan; creates the floor entry if it doesn't exist yet.
export async function uploadFloorMap(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded (field name: map)" });

    const floorNumber = parseInt(req.params.floorNumber, 10);
    if (Number.isNaN(floorNumber)) {
      return res.status(400).json({ error: "Invalid floor number" });
    }

    const tenant = await Tenant.findById(req.user.tenantId);
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    const mapUrl = `/uploads/${req.file.filename}`;
    const floor = tenant.floors.find((f) => f.floorNumber === floorNumber);
    if (floor) {
      floor.mapUrl = mapUrl;
    } else {
      tenant.floors.push({ floorNumber, name: `Floor ${floorNumber}`, mapUrl });
      tenant.floors.sort((a, b) => a.floorNumber - b.floorNumber);
    }
    await tenant.save();

    res.json({ floorNumber, mapUrl, tenant });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/tenants/slug/:slug  (public) — minimal info for guest onboarding
export async function getTenantBySlug(req, res, next) {
  try {
    const tenant = await Tenant.findOne({ slug: req.params.slug.toLowerCase() }).select(
      "buildingName slug floors settings.allowGuests subscriptionStatus"
    );
    if (!tenant) return res.status(404).json({ error: "Building not found" });
    res.json({ tenant });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/tenants/mine  (tenant admin) — the caller's own building
export async function getMyTenant(req, res, next) {
  try {
    const tenant = await Tenant.findById(req.user.tenantId);
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });
    res.json({ tenant });
  } catch (err) {
    next(err);
  }
}

// PUT /api/v1/tenants/mine/floors  (tenant admin) — upload/replace floor plans
export async function updateMyFloors(req, res, next) {
  try {
    const { floors } = req.body;
    if (!Array.isArray(floors)) {
      return res.status(400).json({ error: "floors must be an array" });
    }
    const tenant = await Tenant.findByIdAndUpdate(
      req.user.tenantId,
      { $set: { floors } },
      { new: true, runValidators: true }
    );
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });
    res.json({ tenant });
  } catch (err) {
    next(err);
  }
}
