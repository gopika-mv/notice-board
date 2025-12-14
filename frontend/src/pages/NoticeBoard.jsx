import { useState, useEffect } from 'react';
import api from '../api';
import { Search, Filter, Calendar } from 'lucide-react';

const NoticeBoard = () => {
    const [notices, setNotices] = useState([]);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ department_id: '', is_urgent: '', date: '' });
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        fetchDepartments();
        fetchNotices();
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchNotices();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [search, filters]);

    const fetchDepartments = async () => {
        try {
            const { data } = await api.get('/departments');
            setDepartments(data);
        } catch (error) {
            console.error('Error fetching departments', error);
        }
    };

    const fetchNotices = async () => {
        try {
            const query = new URLSearchParams({ search, ...filters }).toString();
            // Filter out empty params
            const cleanParams = {};
            if (search) cleanParams.search = search;
            if (filters.department_id) cleanParams.department_id = filters.department_id;
            if (filters.is_urgent) cleanParams.is_urgent = filters.is_urgent;
            if (filters.date) cleanParams.date = filters.date;

            const { data } = await api.get('/notices', { params: cleanParams });
            setNotices(data);
        } catch (error) {
            console.error('Error fetching notices', error);
        }
    };

    const getPriorityColor = (isUrgent) => {
        return isUrgent ? '#ff4757' : '#2ed573';
    };

    return (
        <div>
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '10px', top: '10px', color: 'rgba(255,255,255,0.7)' }} size={20} />
                    <input
                        type="text"
                        placeholder="Search notices..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ paddingLeft: '40px', margin: 0 }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Filter size={18} />
                    <select
                        value={filters.department_id}
                        onChange={(e) => setFilters({ ...filters, department_id: e.target.value })}
                        style={{ margin: 0, width: '150px' }}
                    >
                        <option value="" style={{ color: 'black' }}>All Departments</option>
                        {departments.map(d => (
                            <option key={d.id} value={d.id} style={{ color: 'black' }}>{d.name}</option>
                        ))}
                    </select>

                    <select
                        value={filters.is_urgent}
                        onChange={(e) => setFilters({ ...filters, is_urgent: e.target.value })}
                        style={{ margin: 0, width: '120px' }}
                    >
                        <option value="" style={{ color: 'black' }}>All Priorities</option>
                        <option value="true" style={{ color: 'black' }}>Urgent</option>
                        <option value="false" style={{ color: 'black' }}>Normal</option>
                    </select>


                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {notices.map(notice => (
                    <div key={notice.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                            <span style={{
                                background: getPriorityColor(notice.is_urgent),
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '0.7em',
                                fontWeight: 'bold'
                            }}>
                                {notice.is_urgent ? 'URGENT' : 'NORMAL'}
                            </span>

                        </div>
                        <h3 style={{ margin: '0 0 10px 0' }}>{notice.title}</h3>
                        <p style={{ flex: 1, opacity: 0.9, whiteSpace: 'pre-wrap' }}>{notice.content}</p>

                        <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8em', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Dept: {notice.Department?.name || 'General'}</span>
                            <span>By: {notice.author?.name}</span>
                        </div>
                    </div>
                ))}
            </div>

            {notices.length === 0 && (
                <div style={{ textAlign: 'center', opacity: 0.7, marginTop: '50px' }}>
                    No notices found matching your criteria.
                </div>
            )}
        </div>
    );
};

export default NoticeBoard;
