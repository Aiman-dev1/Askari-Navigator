import Tenant from "../models/Tenant.js";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";

function publicUser(user) {
  return {
    id: user._id,
    tenantId: user.tenantId,
    username: user.username,
    email: user.email,
    role: user.role,
    isGuest: user.isGuest,
    createdAt: user.createdAt,
  };
}

// POST /api/v1/auth/register  { username, email, password, tenantSlug }
export async function register(req, res, next) {
  try {
    const { username, email, password, tenantSlug } = req.body;
    if (!username || !email || !password || !tenantSlug) {
      return res
        .status(400)
        .json({ error: "username, email, password and tenantSlug are required" });
    }

    const tenant = await Tenant.findOne({ slug: tenantSlug.toLowerCase() });
    if (!tenant) return res.status(404).json({ error: "Building not found" });
    if (tenant.subscriptionStatus === "Suspended" || tenant.subscriptionStatus === "Cancelled") {
      return res.status(403).json({ error: "This building's subscription is not active" });
    }

    const user = new User({ tenantId: tenant._id, username, email, role: "user" });
    await user.setPassword(password);
    await user.save();

    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/auth/login  { email, password, tenantSlug? }
export async function login(req, res, next) {
  try {
    const { email, password, tenantSlug } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const query = { email: email.toLowerCase() };
    if (tenantSlug) {
      const tenant = await Tenant.findOne({ slug: tenantSlug.toLowerCase() });
      if (!tenant) return res.status(404).json({ error: "Building not found" });
      query.tenantId = tenant._id;
    }

    const user = await User.findOne(query).select("+passwordHash");
    
    if (!user) {
      console.log(`[Auth Debug] User not found for email: ${email}, query:`, query);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    if (!user.passwordHash) {
      console.log(`[Auth Debug] User found but no password hash: ${user.email}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      console.log(`[Auth Debug] Password mismatch for user: ${user.email}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/auth/guest  { username, tenantSlug }
// Friction-free pseudonymous onboarding (scope doc §2C)
export async function guest(req, res, next) {
  try {
    const { username, tenantSlug } = req.body;
    if (!username || !tenantSlug) {
      return res.status(400).json({ error: "username and tenantSlug are required" });
    }

    const tenant = await Tenant.findOne({ slug: tenantSlug.toLowerCase() });
    if (!tenant) return res.status(404).json({ error: "Building not found" });
    if (!tenant.settings.allowGuests) {
      return res.status(403).json({ error: "Guest access is disabled for this building" });
    }

    const user = await User.create({
      tenantId: tenant._id,
      username,
      role: "user",
      isGuest: true,
    });

    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/auth/me
export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.sub);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/v1/auth/me  { username }
// The JWT embeds the username (chat uses it as the sender name), so a
// fresh token is returned along with the updated profile.
export async function updateMe(req, res, next) {
  try {
    const username = (req.body.username || "").trim();
    if (!username) return res.status(400).json({ error: "username is required" });
    if (username.length < 2 || username.length > 30) {
      return res.status(400).json({ error: "Username must be 2–30 characters" });
    }

    const user = await User.findById(req.user.sub);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.username = username;
    await user.save(); // duplicate within the building → 409 via error handler

    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}
