import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CreateNotice = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: '', content: '', priority: 'normal', department_id: '' });
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isUrgent, setIsUrgent] = useState(false);

    // Fetch departments on mount
    useState(() => {
        const fetchDepts = async () => {
            try {
                const { data } = await api.get('/departments');
                setDepartments(data);
            } catch (error) {
                console.error('Failed to load departments');
            }
        };
        fetchDepts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                title: formData.title,
                content: formData.content,
                department_id: formData.department_id,
                is_urgent: isUrgent
            };
            await api.post('/notices', payload);
            alert('Notice posted! Waiting for admin approval.');
            navigate('/');
        } catch (error) {
            console.error('Error posting notice', error);
            alert('Failed to post notice');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto' }}>
            <h1 className="page-title" style={{ fontSize: '1.5em', marginBottom: '20px' }}>Create New Notice</h1>
            <div className="glass-panel" style={{ padding: '30px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            placeholder="Title"
                            style={{ background: '#2d2d2d', borderColor: '#404040', padding: '15px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            required
                            placeholder="Content"
                            rows="4"
                            style={{ background: '#2d2d2d', borderColor: '#404040', padding: '15px', fontFamily: 'inherit' }}
                        ></textarea>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <select
                            value={formData.department_id}
                            onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                            style={{ background: '#2d2d2d', borderColor: '#404040', padding: '15px' }}
                            required
                        >
                            <option value="">Select Department</option>
                            {departments.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                            type="checkbox"
                            checked={isUrgent}
                            onChange={(e) => setIsUrgent(e.target.checked)}
                            style={{ width: 'auto', margin: 0 }}
                            id="urgent-check"
                        />
                        <label htmlFor="urgent-check" style={{ cursor: 'pointer', opacity: 0.9 }}>Mark as Urgent</label>
                    </div>

                    <button
                        type="submit"
                        className="btn"
                        style={{ width: '100%', background: '#6c5ce7', color: 'white', padding: '15px', fontSize: '1.1em' }}
                        disabled={loading}
                    >
                        {loading ? 'Posting...' : 'Post Notice'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateNotice;
