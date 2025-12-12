import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import NoticeBoard from './pages/NoticeBoard';
import AdminPanel from './pages/AdminPanel';
import CreateNotice from './pages/CreateNotice';
import Navbar from './components/Navbar';

function App() {
    const { user } = useAuth();

    return (
        <div>
            {user && <Navbar />}
            <div className="container">
                <Routes>
                    <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

                    <Route path="/" element={user ? <NoticeBoard /> : <Navigate to="/login" />} />

                    <Route path="/create" element={
                        user && (user.role === 'staff' || user.role === 'admin')
                            ? <CreateNotice />
                            : <Navigate to="/" />
                    } />

                    <Route path="/admin" element={<Navigate to="/admin/approvals" />} />
                    <Route path="/admin/approvals" element={
                        user && user.role === 'admin'
                            ? <AdminPanel />
                            : <Navigate to="/" />
                    } />
                    <Route path="/admin/departments" element={
                        user && user.role === 'admin'
                            ? <AdminPanel />
                            : <Navigate to="/" />
                    } />

                    <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
