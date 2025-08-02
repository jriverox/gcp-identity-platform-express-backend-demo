const axios = require('axios');
const admin = require('firebase-admin');
const settings = require('../settings');

const IDENTITY_TOOLKIT_URL = 'https://identitytoolkit.googleapis.com';

// Inicializa Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: settings.gcp_project_id,
    clientEmail: settings.gcp_sa_client_email,
    privateKey: settings.gcp_sa_private_key,
  }),
});

// Cache simple de TenantAwareAuth por tenantId para no recrear constantemente
const tenantAuthCache = new Map();

function getTenantAuth(tenantId) {
  if (!tenantId) return admin.auth(); // proyecto-level
  if (tenantAuthCache.has(tenantId)) return tenantAuthCache.get(tenantId);
  const tenantAuth = admin.auth().tenantManager().authForTenant(tenantId);
  tenantAuthCache.set(tenantId, tenantAuth);
  return tenantAuth;
}

// Intercambia un custom token multi-tenant por un ID token (REST API)
async function exchangeCustomTokenForIdToken(customToken, tenantId) {
  const url = `${IDENTITY_TOOLKIT_URL}/v1/accounts:signInWithCustomToken?key=${settings.gcp_identity_api_key}`;
  const payload = {
    token: customToken,
    returnSecureToken: true,
    tenantId, // obligatorio para multi-tenant; debe coincidir con el tenant_id embebido. :contentReference[oaicite:5]{index=5}
  };
  const resp = await axios.post(url, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return resp.data; // contiene idToken, refreshToken, etc.
}

// Login email/password usando REST API (multi-tenant)
async function signInWithEmailPassword(email, password, tenantId) {
  const url = `${IDENTITY_TOOLKIT_URL}/v1/accounts:signInWithPassword?key=${settings.gcp_identity_api_key}`;
  const payload = {
    email,
    password,
    returnSecureToken: true,
    tenantId, // para que la autenticación ocurra en ese tenant. :contentReference[oaicite:6]{index=6}
  };
  const resp = await axios.post(url, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return resp.data;
}

const generatePasswordResetLink = async (email, tenantId) => {
  const tenantAuth = getTenantAuth(tenantId);
  const link = await tenantAuth.generatePasswordResetLink(email);
  return link;
};

module.exports = {
  admin,
  getTenantAuth,
  exchangeCustomTokenForIdToken,
  signInWithEmailPassword,
  generatePasswordResetLink,
};
