import Tenant from "../models/Tenant.js";
import User from "../models/User.js";
import Office from "../models/Office.js";
import Faq from "../models/Faq.js";
import ChatRoom from "../models/ChatRoom.js";
import Message from "../models/Message.js";
import { logActivity } from "../utils/activityLogger.js";

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
    logActivity(req, "BUILDING_CREATED", `Onboarded new building: "${tenant.buildingName}" (slug: ${tenant.slug})`, { resourceType: "tenant", resourceId: tenant._id });
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
    logActivity(req, "BUILDING_STATUS_CHANGED", `Changed "${tenant.buildingName}" status to ${req.body.subscriptionStatus || "updated"}`, { resourceType: "tenant", resourceId: tenant._id });
    res.json({ tenant });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/v1/tenants/:id (super admin)
// Cascade-deletes the building and ALL related data:
//   Users → Offices → FAQs → Messages → ChatRooms → Tenant
export async function deleteTenant(req, res, next) {
  try {
    const tenantId = req.params.id;

    const tenant = await Tenant.findById(tenantId);
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    // Run all related deletions in parallel for speed
    const [users, offices, faqs, messages, chatRooms] = await Promise.all([
      User.deleteMany({ tenantId }),
      Office.deleteMany({ tenantId }),
      Faq.deleteMany({ tenantId }),
      Message.deleteMany({ tenantId }),
      ChatRoom.deleteMany({ tenantId }),
    ]);

    // Finally delete the tenant itself
    await Tenant.findByIdAndDelete(tenantId);

    const summary = {
      users: users.deletedCount,
      offices: offices.deletedCount,
      faqs: faqs.deletedCount,
      messages: messages.deletedCount,
      chatRooms: chatRooms.deletedCount,
    };

    console.log(`[Tenant Delete] "${tenant.buildingName}" removed. Cascade summary:`, summary);

    logActivity(req, "BUILDING_DELETED", `Deleted building: "${tenant.buildingName}" — ${summary.users} users, ${summary.offices} offices, ${summary.faqs} FAQs, ${summary.chatRooms} rooms, ${summary.messages} messages removed.`, { resourceType: "tenant" });

    res.json({
      message: `Building "${tenant.buildingName}" and all its data deleted permanently.`,
      deleted: summary,
    });
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

    logActivity(req, "FLOOR_MAP_UPLOADED", `Uploaded floor map for Floor ${floorNumber}`, { resourceType: "tenant", resourceId: tenant._id });

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

// DELETE /api/v1/tenants/mine/floors/:floorNumber/map  (tenant admin)
export async function deleteFloorMap(req, res, next) {
  try {
    const floorNumber = parseInt(req.params.floorNumber, 10);
    if (Number.isNaN(floorNumber)) {
      return res.status(400).json({ error: "Invalid floor number" });
    }

    const tenant = await Tenant.findById(req.user.tenantId);
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    const floor = tenant.floors.find((f) => f.floorNumber === floorNumber);
    if (floor) {
      floor.mapUrl = null;
      await tenant.save();
      logActivity(req, "FLOOR_MAP_DELETED", `Deleted floor map for Floor ${floorNumber}`, { resourceType: "tenant", resourceId: tenant._id });
    }

    res.json({ floorNumber, tenant });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/v1/tenants/mine/floors/maps/bulk-delete  (tenant admin)
export async function bulkDeleteFloorMaps(req, res, next) {
  try {
    const { floorNumbers } = req.body;
    if (!Array.isArray(floorNumbers) || floorNumbers.length === 0) {
      return res.status(400).json({ error: "floorNumbers must be a non-empty array" });
    }

    const tenant = await Tenant.findById(req.user.tenantId);
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    let deletedCount = 0;
    tenant.floors.forEach((floor) => {
      if (floorNumbers.includes(floor.floorNumber) && floor.mapUrl) {
        floor.mapUrl = null;
        deletedCount++;
      }
    });

    if (deletedCount > 0) {
      await tenant.save();
      logActivity(
        req,
        "FLOOR_MAPS_BULK_DELETED",
        `Bulk deleted ${deletedCount} floor maps`,
        { resourceType: "tenant", resourceId: tenant._id }
      );
    }

    res.json({ deletedCount, tenant });
  } catch (err) {
    next(err);
  }
}
