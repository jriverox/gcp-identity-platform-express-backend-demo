const profileHandler = async (req, res) => {
  res.json({
    message: 'Acceso autorizado multi-tenant',
    user: {
      uid: req.user.uid,
      email: req.user.email,
      tenantId: req.user.tenantId,
      claims: req.user.claims,
    },
  });
};

module.exports = { profileHandler };
