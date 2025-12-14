import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, PlusCircle, CheckSquare, Home, FileText } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="glass-panel" style={{ padding: '15px 30px', margin: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ margin: 0, fontWeight: 'bold' }}>CampusConnect</h2>
            </div>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Home size={18} /> Feed
                </Link>

                {(user.role === 'staff') && (
                    <>
                        <Link to="/create" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <PlusCircle size={18} /> Post Notice
                        </Link>
                        <Link to="/my-notices" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <FileText size={18} /> My Notices
                        </Link>
                    </>
                )}

                {user.role === 'admin' && (
                    <>
                        <Link to="/admin/approvals" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <CheckSquare size={18} /> Notice Approval
                        </Link>
                        <Link to="/admin/staff-approval" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <CheckSquare size={18} /> Staff Approval
                        </Link>
                        <Link to="/admin/departments" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <PlusCircle size={18} /> Add Department
                        </Link>
                    </>
                )}

                <button onClick={logout} className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
