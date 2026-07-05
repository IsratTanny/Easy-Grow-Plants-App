import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, setAuthToken } from '../api/axios';
import { Leaf, Server } from 'lucide-react';
import { signInWithEmailAndPassword, signOut, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase';
import { isNative } from '../utils/platform';

export default function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Native app only: let the user point the app at their server's address.
    const [showServer, setShowServer] = useState(false);
    const [serverUrl, setServerUrl] = useState(localStorage.getItem('custom_server_url') || '');

    const saveServer = () => {
        const url = serverUrl.trim().replace(/\/+$/, '');
        if (url) localStorage.setItem('custom_server_url', url);
        else localStorage.removeItem('custom_server_url');
        window.location.reload(); // re-init the API client with the new address
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // 1. Django Authentication Flow
            const res = await api.post('/auth/login/', formData);

            // 2. Set Django tokens
            setAuthToken(res.data.access, res.data.refresh);

            // 3. Fetch user profile to get complete details (role, email)
            const userRes = await api.get('/auth/me/');
            const userRole = userRes.data.role;
            const userEmail = userRes.data.email;

            // 4. Persistence: Sync with Navbar and other components
            localStorage.setItem('userRole', userRole);
            localStorage.setItem('user_role', userRole); // Legacy support
            localStorage.setItem('username', userRes.data.username);
            
            // Dispatch event to update Navbar state immediately
            window.dispatchEvent(new Event('authChange'));

            // 5. Email Verification Check for Buyers
            if (userRole === 'buyer' && userEmail && !userRes.data.is_verified) {
                try {
                    // Sign into Firebase strictly to check email verification status
                    const fbCred = await signInWithEmailAndPassword(auth, userEmail, formData.password);
                    if (!fbCred.user.emailVerified) {
                        await sendEmailVerification(fbCred.user);
                        await signOut(auth);
                        setError('Your email is not verified. A new verification link has been sent to your email.');
                        return;
                    }
                } catch (fbErr) {
                    console.error("Firebase Auth Error: ", fbErr.code, fbErr.message);
                    
                    if (fbErr.code === 'auth/invalid-credential' || fbErr.code === 'auth/wrong-password') {
                        setError('Firebase authentication failed. This usually happens if your password was reset in Django but not in Firebase. Please use "Forgot Password" or contact support.');
                    } else if (fbErr.code === 'auth/user-not-found') {
                        setError('Firebase account not found. Please contact support to sync your account.');
                    } else {
                        setError('Verification check failed. Please ensure your email is verified.');
                    }
                    return;
                }
            }

            // 6. Role-Based Navigation
            if (userRole === 'buyer') {
                navigate('/marketplace');
            } else if (userRole === 'seller') {
                navigate('/seller-dashboard');
            } else if (userRole === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/dashboard');
            }

        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.detail || 'Invalid username or password');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl border border-nature-100">
            <div className="text-center mb-8">
                <Leaf className="w-12 h-12 text-nature-600 mx-auto mb-2" />
                <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                <p className="text-gray-500">Sign in to manage your garden</p>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-center">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nature-500 outline-none"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nature-500 outline-none"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>
                <button type="submit" className="w-full btn btn-primary py-3">Sign In</button>
            </form>

            <p className="mt-6 text-center text-gray-600">
                Don't have an account? <Link to="/register" className="text-nature-600 font-medium hover:underline">Register</Link>
            </p>

            {isNative() && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => setShowServer((s) => !s)}
                        className="flex items-center gap-1.5 mx-auto text-xs font-bold text-gray-400 hover:text-nature-600 transition-colors"
                    >
                        <Server className="w-3.5 h-3.5" /> Server settings
                    </button>
                    {showServer && (
                        <div className="mt-3 space-y-2">
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide">Backend server address</label>
                            <input
                                type="url"
                                inputMode="url"
                                autoCapitalize="none"
                                placeholder="http://192.168.0.42:8000"
                                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-nature-500 outline-none"
                                value={serverUrl}
                                onChange={(e) => setServerUrl(e.target.value)}
                            />
                            <button type="button" onClick={saveServer} className="w-full bg-nature-900 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-nature-700 transition-colors">
                                Save & Connect
                            </button>
                            <p className="text-[10px] text-gray-400 leading-relaxed">
                                Enter the address shown by the server launcher (e.g. <b>http://YOUR-PC-IP:8000</b>). Your phone must be on the same Wi‑Fi. The app reloads to connect.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
