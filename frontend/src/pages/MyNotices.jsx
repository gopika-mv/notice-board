import { useState, useEffect } from 'react';
import api from '../api';

const MyNotices = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyNotices();
    }, []);

    const fetchMyNotices = async () => {
        try {
            const { data } = await api.get('/notices/my');
            setNotices(data);
        } catch (error) {
            console.error('Error fetching my notices', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: { background: '#ffa502', color: 'white' },
            approved: { background: '#2ed573', color: 'white' },
            rejected: { background: '#ff4757', color: 'white' }
        };

        return (
            <span style={{
                ...styles[status],
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '0.85em',
                fontWeight: 'bold',
                textTransform: 'uppercase'
            }}>
                {status}
            </span>
        );
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
    }

    return (
        <div>
            <h1 className="page-title">My Notices</h1>
            <div style={{ display: 'grid', gap: '20px' }}>
                {notices.map(notice => (
                    <div key={notice.id} className="glass-panel" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.2em' }}>{notice.title}</h3>
                                    {notice.is_urgent && (
                                        <span style={{
                                            background: '#ff4757',
                                            padding: '2px 8px',
                                            borderRadius: '8px',
                                            fontSize: '0.75em',
                                            fontWeight: 'bold'
                                        }}>
                                            URGENT
                                        </span>
                                    )}
                                </div>
                                <p style={{ margin: '10px 0', opacity: 0.9 }}>{notice.content}</p>
                                <div style={{ fontSize: '0.85em', opacity: 0.7, marginTop: '10px' }}>
                                    <div>Department: {notice.Department?.name || 'N/A'}</div>
                                    <div>Posted: {new Date(notice.date).toLocaleString()}</div>
                                    {notice.approver && (
                                        <div>
                                            {notice.status === 'approved' ? 'Approved' : 'Rejected'} by: {notice.approver?.name} on {new Date(notice.approved_at).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div style={{ marginLeft: '20px' }}>
                                {getStatusBadge(notice.status)}
                            </div>
                        </div>
                    </div>
                ))}

                {notices.length === 0 && (
                    <div style={{ textAlign: 'center', opacity: 0.7, padding: '40px' }} className="glass-panel">
                        You haven't posted any notices yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyNotices;
