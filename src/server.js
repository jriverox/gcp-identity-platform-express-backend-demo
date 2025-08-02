const express = require('express');
const settings = require('./settings');
const authRoutes = require('./routes/auth.route');
const signupRoutes = require('./routes/signup.route');
const profileRoutes = require('./routes/profile.route');

const app = express();
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', signupRoutes);
app.use('/api', profileRoutes);

app.listen(settings.port, () => {
  console.log(`Server is running on port ${settings.port}`);
});
