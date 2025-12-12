const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Helper to login and get token
const login = async (username, password) => {
    try {
        const res = await axios.post(`http://localhost:${process.env.PORT || 5000}/api/auth/login`, { username, password });
        return res.data.token;
    } catch (error) {
        console.error(`Login failed for ${username}:`, error.response?.data?.message || error.message);
        return null;
    }
};

const run = async () => {
    console.log('--- Verifying Permissions ---');

    // 1. Login as Staff to post a notice
    const staffToken = await login('staff', 'staff123');
    if (!staffToken) return;

    let noticeId;
    try {
        const res = await axios.post(`http://localhost:${process.env.PORT || 5000}/api/notices`, {
            title: 'Test Notice from Staff',
            content: 'Content',
            priority: 'normal'
        }, { headers: { Authorization: `Bearer ${staffToken}` } });
        console.log('[PASS] Staff posted notice:', res.data.title);
        noticeId = res.data.id;
    } catch (error) {
        console.error('[FAIL] Staff could not post notice:', error.response?.data?.message);
    }

    // 2. Login as Admin
    const adminToken = await login('admin', 'admin123');
    if (!adminToken) return;

    // 3. Admin tries to post (Should FAIL)
    try {
        await axios.post(`http://localhost:${process.env.PORT || 5000}/api/notices`, {
            title: 'Admin Notice',
            content: 'Content'
        }, { headers: { Authorization: `Bearer ${adminToken}` } });
        console.error('[FAIL] Admin was able to post a notice! (Should be forbidden)');
    } catch (error) {
        if (error.response?.status === 403) {
            console.log('[PASS] Admin cannot post notice (403 Forbidden received)');
        } else {
            console.error('[FAIL] Admin post failed but with unexpected status:', error.response?.status);
        }
    }

    // 4. Admin tries to approve Staff notice (Should PASS)
    if (noticeId) {
        try {
            const res = await axios.put(`http://localhost:${process.env.PORT || 5000}/api/notices/${noticeId}/status`, {
                status: 'approved'
            }, { headers: { Authorization: `Bearer ${adminToken}` } });
            console.log(`[PASS] Admin approved notice ${noticeId}:`, res.data.message);
        } catch (error) {
            console.error('[FAIL] Admin could not approve notice:', error.response?.data?.message);
        }
    }
    console.log('--- Verification Complete ---');
};

run();
