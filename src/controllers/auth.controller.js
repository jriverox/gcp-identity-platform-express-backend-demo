const { signInWithEmailPassword } = require('../utils/firebaseAdmin');

const signInWithEmailPasswordHandler = async (req, res) => {
  const { email, password, tenantId } = req.body;
  if (!email || !password || !tenantId) {
    return res
      .status(400)
      .json({ error: 'email, password y tenantId son requeridos' });
  }

  try {
    const data = await signInWithEmailPassword(email, password, tenantId);
    res.json({
      message: 'Login exitoso',
      uid: data.localId,
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn,
    });
  } catch (err) {
    console.error(
      'Login error multi-tenant',
      err.response?.data || err.message
    );
    const msg = err.response?.data?.error?.message || 'Error autenticando';
    res.status(400).json({ error: msg });
  }
};

module.exports = { signInWithEmailPasswordHandler };
