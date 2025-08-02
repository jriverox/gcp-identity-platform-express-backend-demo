const {
  getTenantAuth,
  exchangeCustomTokenForIdToken,
  generatePasswordResetLink,
} = require('../utils/firebaseAdmin');
const {
  generateTemporaryPassword,
} = require('../utils/temporaryPasswordGenerator');

// Signup with email and password. Allows the self-signup of users.
const signUpWithEmailPasswordHandler = async (req, res) => {
  const { email, password, tenantId } = req.body;
  if (!email || !password || !tenantId) {
    return res
      .status(400)
      .json({ error: 'email, password y tenantId son requeridos' });
  }

  try {
    const tenantAuth = getTenantAuth(tenantId);

    // Crea usuario dentro del tenant. :contentReference[oaicite:10]{index=10}
    const userRecord = await tenantAuth.createUser({
      email,
      password,
    });

    // Genera custom token multi-tenant. :contentReference[oaicite:11]{index=11}
    const customToken = await tenantAuth.createCustomToken(userRecord.uid);

    // Intercambia por ID token (el cliente usará este). :contentReference[oaicite:12]{index=12}
    const signInResult = await exchangeCustomTokenForIdToken(
      customToken,
      tenantId
    );

    res.json({
      message: 'Usuario creado en tenant',
      uid: userRecord.uid,
      idToken: signInResult.idToken,
      refreshToken: signInResult.refreshToken,
      expiresIn: signInResult.expiresIn,
    });
  } catch (err) {
    console.error(
      'Error creando usuario en tenant',
      err.response?.data || err.message
    );
    const msg =
      err.response?.data?.error?.message ||
      err.message ||
      'Error creando usuario';
    res.status(400).json({ error: msg });
  }
};

// Pre-signup with email and temporary password. Allows admins to register users with temporay password, this return a link for password reset.
const preSignUpWithEmailTemporaryPasswordHandler = async (req, res) => {
  const { email, tenantId } = req.body;
  if (!email || !tenantId) {
    return res
      .status(400)
      .json({ error: 'email, password y tenantId son requeridos' });
  }
  try {
    const temporaryPassword = generateTemporaryPassword();
    const tenantAuth = getTenantAuth(tenantId);
    const userRecord = await tenantAuth.createUser({
      email,
      password: temporaryPassword,
      emailVerified: false,
    });
    const link = await generatePasswordResetLink(email, tenantId);
    console.log(`Reset link: ${link}`); // Por PoC, lo mostramos en consola
    res.json({ text: `Reset link: ${link}` });
  } catch (error) {
    console.error(
      'Error creando usuario en tenant',
      error.response?.data || error.message
    );
    const msg =
      error.response?.data?.error?.message ||
      error.message ||
      'Error creando usuario';
    res.status(400).json({ error: msg });
  }
};
module.exports = {
  signUpWithEmailPasswordHandler,
  preSignUpWithEmailTemporaryPasswordHandler,
};
