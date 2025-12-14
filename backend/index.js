const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// const db = require('./config/database'); // We will create this next
// const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const { syncDatabase } = require('./models');

app.use(cors());
app.use(express.json());

// Sync DB
syncDatabase();

const authRoutes = require('./routes/authRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const deptRoutes = require('./routes/deptRoutes');
const staffRoutes = require('./routes/staffRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/departments', deptRoutes);
app.use('/api/staff', staffRoutes);


app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
