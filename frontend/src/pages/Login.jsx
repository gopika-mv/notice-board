import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const Login = () => {
    const { login } = useAuth();
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '', role: 'student', department_id: '' });
    const [error, setError] = useState('');
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        if (isRegister) {
            fetchDepartments();
        }
    }, [isRegister]);

    const fetchDepartments = async () => {
        try {
            const { data } = await api.get('/departments');
            setDepartments(data);
        } catch (error) {
            console.error('Error fetching departments', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isRegister) {
                const response = await api.post('/auth/register', formData);
                const message = formData.role === 'staff'
                    ? 'Registration successful! Waiting for admin approval.'
                    : 'Registration successful! Please login.';
                alert(message);
                setIsRegister(false);
            } else {
                await login(formData.username, formData.password);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Action failed');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <div className="glass-panel" style={{ padding: '40px', width: '350px', textAlign: 'center' }}>
                <h1 style={{ marginBottom: '20px' }}>{isRegister ? 'Register' : 'Login'}</h1>
                {error && <div style={{ background: 'rgba(255,0,0,0.2)', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />

                    {isRegister && (
                        <>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="student" style={{ color: 'black' }}>Student</option>
                                <option value="staff" style={{ color: 'black' }}>Staff</option>

                            </select>
                            {(formData.role === 'staff' || formData.role === 'student') && (
                                <select
                                    value={formData.department_id}
                                    onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                                    required
                                >
                                    <option value="" style={{ color: 'black' }}>Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id} style={{ color: 'black' }}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                        {isRegister ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                <p style={{ marginTop: '20px', fontSize: '0.9em', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setIsRegister(!isRegister)}>
                    {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
                </p>
            </div>
        </div>
    );
};

export default Login;
