export function notFound(req, res) {
  res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Duplicate key (e.g. username already taken within a tenant)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(", ");
    return res.status(409).json({ error: `Already exists: ${field}` });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ error: `Invalid ${err.path}: ${err.value}` });
  }
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
}
