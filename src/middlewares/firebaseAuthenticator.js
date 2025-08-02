const { admin, getTenantAuth } = require('../utils/firebaseAdmin');

// Middleware multi-tenant de autenticación y revocación
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ error: 'Authorization header missing or malformed' });
  }
  const idToken = authHeader.split(' ')[1];
  try {
    // Decodifica el token sin forzar revocación (manejo manual después). :contentReference[oaicite:7]{index=7}
    const decoded = await admin.auth().verifyIdToken(idToken);
    const tenantId = decoded.firebase?.tenant || null;

    // Obtener el auth correspondiente (tenant-aware si aplica)
    const authInstance = getTenantAuth(tenantId);

    // Obtener el user record dentro del scope correcto. :contentReference[oaicite:8]{index=8}
    const userRecord = await (tenantId
      ? authInstance.getUser(decoded.uid)
      : admin.auth().getUser(decoded.uid));

    // Chequeo de revocación: compara auth_time vs tokensValidAfterTime manualmente. :contentReference[oaicite:9]{index=9}
    if (userRecord.disabled) {
      return res.status(403).json({ error: 'User is disabled' });
    }
    const tokensValidAfterTime = Math.floor(
      new Date(userRecord.tokensValidAfterTime).getTime() / 1000
    );
    if (decoded.auth_time < tokensValidAfterTime) {
      return res.status(401).json({ error: 'Token has been revoked' });
    }

    // Adjunta info útil al request
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      tenantId,
      claims: decoded, // incluye custom claims y firebase.tenant
      userRecord,
    };
    next();
  } catch (err) {
    console.error('Authentication failure', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { authenticate };
