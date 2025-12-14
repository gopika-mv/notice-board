import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api';
import { Check, X } from 'lucide-react';

const AdminPanel = () => {
    const location = useLocation();
    const isApprovalsView = location.pathname.includes('approvals') && !location.pathname.includes('staff-approval');
    const isStaffApprovalView = location.pathname.includes('staff-approval');
    const isDeptView = location.pathname.includes('departments');

    const [pendingNotices, setPendingNotices] = useState([]);
    const [pendingStaff, setPendingStaff] = useState([]);
    const [newDept, setNewDept] = useState('');

    useEffect(() => {
        if (isApprovalsView) {
            fetchPending();
        }
        if (isStaffApprovalView) {
            fetchPendingStaff();
        }
    }, [isApprovalsView, isStaffApprovalView]);

    const fetchPending = async () => {
        try {
            const { data } = await api.get('/notices/pending');
            setPendingNotices(data);
        } catch (error) {
            console.error('Error fetching pending notices', error);
        }
    };

    const fetchPendingStaff = async () => {
        try {
            const { data } = await api.get('/staff/pending');
            setPendingStaff(data);
        } catch (error) {
            console.error('Error fetching pending staff', error);
        }
    };

    const handleAction = async (id, status) => {
        try {
            await api.put(`/notices/${id}/status`, { status });
            // Optimistic update
            setPendingNotices(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error(`Error ${status} notice`, error);
            alert('Action failed');
        }
    };

    const handleStaffAction = async (id, approval_status) => {
        try {
            await api.put(`/staff/${id}/status`, { approval_status });
            // Optimistic update
            setPendingStaff(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error(`Error ${approval_status === 'approved' ? 'approving' : 'rejecting'} staff`, error);
            alert('Action failed');
        }
    };

    const handleAddDepartment = async () => {
        if (!newDept.trim()) return;
        try {
            await api.post('/departments', { name: newDept });
            setNewDept('');
            alert('Department added successfully');
        } catch (error) {
            console.error('Error adding department', error);
            alert('Failed to add department');
        }
    };

    return (
        <div>
            {isDeptView && (
                <>
                    <h1 className="page-title">Manage Departments</h1>
                    <div style={{ maxWidth: '600px', margin: '0 auto 40px auto' }}>
                        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Add Department</h3>
                        <div className="glass-panel" style={{ padding: '30px', display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                placeholder="Department Name"
                                value={newDept}
                                onChange={(e) => setNewDept(e.target.value)}
                                style={{ margin: 0, background: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,255,255,0.1)' }}
                            />
                            <button
                                className="btn"
                                onClick={handleAddDepartment}
                                style={{ background: '#6c5ce7', color: 'white', width: '100px' }}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </>
            )}

            {isApprovalsView && (
                <>
                    <h1 className="page-title">Notice Approval</h1>
                    <div style={{ display: 'grid', gap: '20px' }}>
                        {pendingNotices.map(notice => (
                            <div key={notice.id} className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                                        <span style={{ fontWeight: 'bold' }}>{notice.title}</span>
                                        <span style={{ opacity: 0.7, fontSize: '0.9em' }}>({notice.Department?.name})</span>
                                        <span style={{
                                            background: notice.is_urgent ? '#ff4757' : '#2ed573',
                                            padding: '0 5px',
                                            borderRadius: '4px',
                                            fontSize: '0.8em'
                                        }}>
                                            {notice.is_urgent ? 'URGENT' : 'NORMAL'}
                                        </span>
                                    </div>
                                    <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9em' }}>{notice.content}</p>
                                    <div style={{ fontSize: '0.8em', marginTop: '5px', opacity: 0.6 }}>
                                        Posted by: {notice.author?.username}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', marginLeft: '20px' }}>
                                    <button
                                        className="btn"
                                        style={{ background: '#2ed573', color: 'white', display: 'flex', alignItems: 'center', padding: '8px' }}
                                        onClick={() => handleAction(notice.id, 'approved')}
                                        title="Approve"
                                    >
                                        <Check size={20} />
                                    </button>
                                    <button
                                        className="btn"
                                        style={{ background: '#ff4757', color: 'white', display: 'flex', alignItems: 'center', padding: '8px' }}
                                        onClick={() => handleAction(notice.id, 'rejected')}
                                        title="Reject"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {pendingNotices.length === 0 && (
                            <div style={{ textAlign: 'center', opacity: 0.7, padding: '40px' }} className="glass-panel">
                                No pending notices to review.
                            </div>
                        )}
                    </div>
                </>
            )}

            {isStaffApprovalView && (
                <>
                    <h1 className="page-title">Staff Approval</h1>
                    <div style={{ display: 'grid', gap: '20px' }}>
                        {pendingStaff.map(staff => (
                            <div key={staff.id} className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '5px', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{staff.username}</span>
                                        <span style={{ opacity: 0.7, fontSize: '0.9em' }}>({staff.Department?.name || 'No Department'})</span>
                                    </div>
                                    <div style={{ fontSize: '0.85em', opacity: 0.7, marginTop: '5px' }}>
                                        Registered: {new Date(staff.createdAt).toLocaleString()}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', marginLeft: '20px' }}>
                                    <button
                                        className="btn"
                                        style={{ background: '#2ed573', color: 'white', display: 'flex', alignItems: 'center', padding: '8px 16px' }}
                                        onClick={() => handleStaffAction(staff.id, 'approved')}
                                        title="Approve"
                                    >
                                        <Check size={20} style={{ marginRight: '5px' }} /> Approve
                                    </button>
                                    <button
                                        className="btn"
                                        style={{ background: '#ff4757', color: 'white', display: 'flex', alignItems: 'center', padding: '8px 16px' }}
                                        onClick={() => handleStaffAction(staff.id, 'rejected')}
                                        title="Reject"
                                    >
                                        <X size={20} style={{ marginRight: '5px' }} /> Reject
                                    </button>
                                </div>
                            </div>
                        ))}

                        {pendingStaff.length === 0 && (
                            <div style={{ textAlign: 'center', opacity: 0.7, padding: '40px' }} className="glass-panel">
                                No pending staff registrations.
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminPanel;
