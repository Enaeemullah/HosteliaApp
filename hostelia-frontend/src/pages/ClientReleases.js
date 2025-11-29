import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
const USERS_KEY = 'release-manager:users';
const CURRENT_USER_KEY = 'release-manager:currentUser';
// Auth Context
const AuthContext = createContext(null);
const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => localStorage.getItem(CURRENT_USER_KEY));
    const getAllUsers = () => {
        try {
            const users = localStorage.getItem(USERS_KEY);
            return users ? JSON.parse(users) : {};
        }
        catch {
            return {};
        }
    };
    const saveUsers = (users) => {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    };
    const signup = (email, password) => {
        const normalizedEmail = email.toLowerCase().trim();
        const users = getAllUsers();
        if (users[normalizedEmail]) {
            return false;
        }
        users[normalizedEmail] = {
            email: normalizedEmail,
            password,
            releases: {},
        };
        saveUsers(users);
        return true;
    };
    const login = (email, password) => {
        const normalizedEmail = email.toLowerCase().trim();
        const users = getAllUsers();
        const user = users[normalizedEmail];
        if (user && user.password === password) {
            setCurrentUser(normalizedEmail);
            localStorage.setItem(CURRENT_USER_KEY, normalizedEmail);
            return true;
        }
        return false;
    };
    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem(CURRENT_USER_KEY);
    };
    const value = useMemo(() => ({ currentUser, login, signup, logout }), [currentUser]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
// Releases Context
const ReleasesContext = createContext(null);
const useReleases = () => {
    const context = useContext(ReleasesContext);
    if (!context) {
        throw new Error('useReleases must be used within ReleasesProvider');
    }
    return context;
};
const ReleasesProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [releases, setReleases] = useState({});
    useEffect(() => {
        if (!currentUser) {
            setReleases({});
            return;
        }
        const users = localStorage.getItem(USERS_KEY);
        if (users) {
            const allUsers = JSON.parse(users);
            setReleases(allUsers[currentUser]?.releases || {});
        }
    }, [currentUser]);
    const saveReleases = (newReleases) => {
        if (!currentUser)
            return;
        const users = localStorage.getItem(USERS_KEY);
        if (!users)
            return;
        const allUsers = JSON.parse(users);
        if (!allUsers[currentUser])
            return;
        allUsers[currentUser].releases = newReleases;
        localStorage.setItem(USERS_KEY, JSON.stringify(allUsers));
    };
    const addRelease = (client, env, release) => {
        const normalizedClient = client.trim();
        const normalizedEnv = env.trim();
        if (!normalizedClient || !normalizedEnv)
            return;
        const newReleases = {
            ...releases,
            [normalizedClient]: {
                ...(releases[normalizedClient] || {}),
                [normalizedEnv]: release,
            },
        };
        setReleases(newReleases);
        saveReleases(newReleases);
    };
    const updateRelease = (client, env, release) => {
        if (!releases[client])
            return;
        const newReleases = {
            ...releases,
            [client]: {
                ...releases[client],
                [env]: release,
            },
        };
        setReleases(newReleases);
        saveReleases(newReleases);
    };
    const deleteRelease = (client, env) => {
        if (!releases[client])
            return;
        const newReleases = { ...releases };
        delete newReleases[client][env];
        if (!Object.keys(newReleases[client]).length) {
            delete newReleases[client];
        }
        setReleases(newReleases);
        saveReleases(newReleases);
    };
    const exportData = () => {
        const dataStr = JSON.stringify(releases, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `releases-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };
    return (_jsx(ReleasesContext.Provider, { value: { releases, addRelease, updateRelease, deleteRelease, exportData }, children: children }));
};
// Icons
const PlusIcon = () => (_jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("line", { x1: "12", y1: "5", x2: "12", y2: "19" }), _jsx("line", { x1: "5", y1: "12", x2: "19", y2: "12" })] }));
const EditIcon = () => (_jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }), _jsx("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })] }));
const DeleteIcon = () => (_jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("polyline", { points: "3 6 5 6 21 6" }), _jsx("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })] }));
const DownloadIcon = () => (_jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }), _jsx("polyline", { points: "7 10 12 15 17 10" }), _jsx("line", { x1: "12", y1: "15", x2: "12", y2: "3" })] }));
const SearchIcon = () => (_jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("circle", { cx: "11", cy: "11", r: "8" }), _jsx("path", { d: "m21 21-4.35-4.35" })] }));
const CloseIcon = () => (_jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), _jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })] }));
const LogoutIcon = () => (_jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }), _jsx("polyline", { points: "16 17 21 12 16 7" }), _jsx("line", { x1: "21", y1: "12", x2: "9", y2: "12" })] }));
// Auth Screen Component
const AuthScreen = () => {
    const { login, signup } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }
        if (isLogin) {
            const success = login(email, password);
            setError(success ? '' : 'Invalid email or password');
        }
        else {
            const success = signup(email, password);
            if (!success) {
                setError('Email already exists');
            }
            else {
                login(email, password);
            }
        }
    };
    const inputStyle = {
        width: '100%',
        padding: '12px',
        border: '1px solid #d9d9d9',
        fontSize: '14px',
        outline: 'none',
        marginBottom: '16px',
    };
    return (_jsx("div", { style: {
            minHeight: '100vh',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
        }, children: _jsxs("div", { style: {
                width: '100%',
                maxWidth: '400px',
                border: '1px solid #000',
                padding: '40px',
            }, children: [_jsx("h1", { style: {
                        fontSize: '24px',
                        fontWeight: 300,
                        marginBottom: '8px',
                        textAlign: 'center',
                    }, children: "Client Release Manager" }), _jsx("p", { style: {
                        color: '#666',
                        fontSize: '14px',
                        textAlign: 'center',
                        marginBottom: '32px',
                    }, children: isLogin ? 'Sign in to your account' : 'Create a new account' }), error && (_jsx("div", { style: {
                        padding: '12px',
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #000',
                        marginBottom: '16px',
                        fontSize: '14px',
                    }, children: error })), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }, children: "Email" }), _jsx("input", { type: "email", value: email, onChange: (e) => {
                                setEmail(e.target.value);
                                setError('');
                            }, placeholder: "Enter your email", style: inputStyle }), _jsx("label", { style: { display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }, children: "Password" }), _jsx("input", { type: "password", value: password, onChange: (e) => {
                                setPassword(e.target.value);
                                setError('');
                            }, placeholder: "Enter your password", style: inputStyle }), _jsx("button", { onClick: handleSubmit, style: {
                                width: '100%',
                                padding: '12px',
                                backgroundColor: '#000',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 500,
                                marginBottom: '16px',
                            }, children: isLogin ? 'Sign In' : 'Sign Up' }), _jsx("div", { style: { textAlign: 'center' }, children: _jsx("button", { onClick: () => {
                                    setIsLogin(!isLogin);
                                    setError('');
                                }, style: {
                                    background: 'none',
                                    border: 'none',
                                    color: '#666',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    textDecoration: 'underline',
                                }, children: isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in' }) })] })] }) }));
};
// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen)
        return null;
    return (_jsx("div", { style: {
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
        }, children: _jsxs("div", { style: {
                backgroundColor: '#fff',
                width: '100%',
                maxWidth: '500px',
                maxHeight: '90vh',
                overflowY: 'auto',
                border: '1px solid #000',
            }, children: [_jsxs("div", { style: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 24px',
                        borderBottom: '1px solid #000',
                    }, children: [_jsx("h2", { style: { margin: 0, fontSize: '18px', fontWeight: 400 }, children: title }), _jsx("button", { onClick: onClose, style: {
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                            }, children: _jsx(CloseIcon, {}) })] }), _jsx("div", { style: { padding: '24px' }, children: children })] }) }));
};
// Release Form Component
const ReleaseForm = ({ initialData, onSubmit, onCancel }) => {
    const [client, setClient] = useState(initialData?.client || '');
    const [env, setEnvironment] = useState(initialData?.env || '');
    const [branch, setBranch] = useState(initialData?.release.branch || '');
    const [version, setVersion] = useState(initialData?.release.version || '');
    const [build, setBuild] = useState(initialData ? String(initialData.release.build) : '1');
    const [date, setDate] = useState(initialData?.release.date || new Date().toISOString().split('T')[0]);
    const handleSubmit = () => {
        if (!client || !env || !branch || !version || !build)
            return;
        onSubmit(client.toLowerCase().trim(), env.toLowerCase().trim(), {
            branch,
            version,
            build: parseInt(build, 10),
            date,
        });
    };
    const inputStyle = {
        width: '100%',
        padding: '8px 12px',
        border: '1px solid #d9d9d9',
        fontSize: '14px',
        outline: 'none',
    };
    const labelStyle = {
        display: 'block',
        marginBottom: '4px',
        fontSize: '14px',
        fontWeight: 500,
    };
    return (_jsxs("div", { children: [_jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("label", { style: labelStyle, children: "Client Name" }), _jsx("input", { type: "text", value: client, onChange: (e) => setClient(e.target.value), placeholder: "Enter client name", disabled: !!initialData, style: inputStyle })] }), _jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("label", { style: labelStyle, children: "Environment" }), _jsx("input", { type: "text", value: env, onChange: (e) => setEnvironment(e.target.value), placeholder: "dev, uat, prod, hotfix", disabled: !!initialData, style: inputStyle })] }), _jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("label", { style: labelStyle, children: "Branch" }), _jsx("input", { type: "text", value: branch, onChange: (e) => setBranch(e.target.value), placeholder: "client/environment", style: inputStyle })] }), _jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("label", { style: labelStyle, children: "Version" }), _jsx("input", { type: "text", value: version, onChange: (e) => setVersion(e.target.value), placeholder: "2.1.0", style: inputStyle })] }), _jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("label", { style: labelStyle, children: "Build Number" }), _jsx("input", { type: "number", value: build, onChange: (e) => setBuild(e.target.value), min: "1", style: inputStyle })] }), _jsxs("div", { style: { marginBottom: '24px' }, children: [_jsx("label", { style: labelStyle, children: "Release Date" }), _jsx("input", { type: "date", value: date, onChange: (e) => setDate(e.target.value), style: inputStyle })] }), _jsxs("div", { style: { display: 'flex', gap: '8px' }, children: [_jsxs("button", { onClick: handleSubmit, style: {
                            flex: 1,
                            padding: '8px 16px',
                            backgroundColor: '#000',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '14px',
                        }, children: [initialData ? 'Update' : 'Add', " Release"] }), _jsx("button", { onClick: onCancel, style: {
                            flex: 1,
                            padding: '8px 16px',
                            backgroundColor: '#fff',
                            color: '#000',
                            border: '1px solid #000',
                            cursor: 'pointer',
                            fontSize: '14px',
                        }, children: "Cancel" })] })] }));
};
// Dashboard Component
const Dashboard = () => {
    const { releases, addRelease, updateRelease, deleteRelease, exportData } = useReleases();
    const { currentUser, logout } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const handleAdd = (client, env, release) => {
        addRelease(client, env, release);
        setIsModalOpen(false);
    };
    const handleEdit = (client, env, release) => {
        updateRelease(client, env, release);
        setEditData(null);
    };
    const handleDelete = (client, env) => {
        if (window.confirm(`Delete ${client}/${env}?`)) {
            deleteRelease(client, env);
        }
    };
    const tableData = Object.entries(releases).flatMap(([client, environments]) => Object.entries(environments).map(([env, release]) => ({
        key: `${client}-${env}`,
        client,
        env,
        ...release,
    })));
    tableData.sort((a, b) => a.client.localeCompare(b.client));
    const filteredData = tableData.filter((item) => {
        if (!searchTerm)
            return true;
        const term = searchTerm.toLowerCase();
        return (item.client.toLowerCase().includes(term) ||
            item.env.toLowerCase().includes(term) ||
            item.branch.toLowerCase().includes(term) ||
            item.version.toLowerCase().includes(term));
    });
    const groupedData = new Map();
    filteredData.forEach((item) => {
        if (!groupedData.has(item.client)) {
            groupedData.set(item.client, []);
        }
        groupedData.get(item.client).push(item);
    });
    const buttonStyle = {
        padding: '8px 16px',
        backgroundColor: '#fff',
        color: '#000',
        border: '1px solid #000',
        cursor: 'pointer',
        fontSize: '14px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
    };
    const iconButtonStyle = {
        padding: '6px',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
    };
    return (_jsxs("div", { style: { minHeight: '100vh', backgroundColor: '#fff', padding: '40px 24px' }, children: [_jsxs("div", { style: { maxWidth: '1400px', margin: '0 auto' }, children: [_jsxs("div", { style: { marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }, children: [_jsxs("div", { children: [_jsx("h1", { style: { fontSize: '28px', fontWeight: 300, marginBottom: '8px', margin: 0 }, children: "Client Release Manager" }), _jsx("p", { style: { color: '#666', margin: 0, fontSize: '14px' }, children: "Manage releases across clients and environments" })] }), _jsxs("div", { style: { textAlign: 'right' }, children: [_jsx("p", { style: { margin: '0 0 8px 0', fontSize: '14px', color: '#666' }, children: currentUser }), _jsxs("button", { onClick: logout, style: buttonStyle, children: [_jsx(LogoutIcon, {}), " Logout"] })] })] }), _jsxs("div", { style: {
                            marginBottom: '24px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '16px',
                        }, children: [_jsxs("div", { style: { position: 'relative', width: '350px' }, children: [_jsx("input", { type: "text", placeholder: "Search clients, branches, versions...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), style: {
                                            width: '100%',
                                            padding: '8px 12px 8px 36px',
                                            border: '1px solid #d9d9d9',
                                            fontSize: '14px',
                                            outline: 'none',
                                        } }), _jsx("div", { style: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }, children: _jsx(SearchIcon, {}) })] }), _jsxs("div", { style: { display: 'flex', gap: '8px' }, children: [_jsxs("button", { onClick: () => setIsModalOpen(true), style: buttonStyle, children: [_jsx(PlusIcon, {}), " Add Release"] }), _jsxs("button", { onClick: exportData, style: buttonStyle, children: [_jsx(DownloadIcon, {}), " Export"] })] })] }), Array.from(groupedData.entries()).map(([client, items]) => (_jsxs("div", { style: { border: '1px solid #000', backgroundColor: '#fff', marginBottom: '24px' }, children: [_jsx("div", { style: { backgroundColor: '#000', color: '#fff', padding: '12px 16px' }, children: _jsx("h2", { style: { margin: 0, fontSize: '16px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }, children: client }) }), _jsxs("table", { style: { width: '100%', borderCollapse: 'collapse' }, children: [_jsx("thead", { children: _jsxs("tr", { style: { backgroundColor: '#f5f5f5', borderBottom: '1px solid #e8e8e8' }, children: [_jsx("th", { style: { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }, children: "Environment" }), _jsx("th", { style: { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }, children: "Branch" }), _jsx("th", { style: { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }, children: "Version" }), _jsx("th", { style: { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }, children: "Build" }), _jsx("th", { style: { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }, children: "Date" }), _jsx("th", { style: { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }, children: "Actions" })] }) }), _jsx("tbody", { children: items.map((item) => (_jsxs("tr", { style: { borderBottom: '1px solid #e8e8e8' }, children: [_jsx("td", { style: { padding: '12px 16px', fontSize: '14px' }, children: _jsx("span", { style: {
                                                            display: 'inline-block',
                                                            padding: '2px 8px',
                                                            border: '1px solid #000',
                                                            fontSize: '12px',
                                                            textTransform: 'uppercase',
                                                            backgroundColor: item.env === 'prod' ? '#000' : '#fff',
                                                            color: item.env === 'prod' ? '#fff' : '#000',
                                                        }, children: item.env }) }), _jsx("td", { style: { padding: '12px 16px', fontSize: '13px', fontFamily: 'monospace' }, children: item.branch }), _jsx("td", { style: { padding: '12px 16px', fontSize: '14px', fontWeight: 500 }, children: item.version }), _jsxs("td", { style: { padding: '12px 16px', fontSize: '14px' }, children: ["#", item.build] }), _jsx("td", { style: { padding: '12px 16px', fontSize: '14px', color: '#666' }, children: item.date }), _jsx("td", { style: { padding: '12px 16px' }, children: _jsxs("div", { style: { display: 'flex', gap: '8px' }, children: [_jsx("button", { onClick: () => setEditData({
                                                                    client: item.client,
                                                                    env: item.env,
                                                                    release: { branch: item.branch, version: item.version, build: item.build, date: item.date },
                                                                }), style: iconButtonStyle, children: _jsx(EditIcon, {}) }), _jsx("button", { onClick: () => handleDelete(item.client, item.env), style: iconButtonStyle, children: _jsx(DeleteIcon, {}) })] }) })] }, item.key))) })] })] }, client))), filteredData.length === 0 && (_jsx("div", { style: { padding: '48px', textAlign: 'center', color: '#999', border: '1px solid #e8e8e8' }, children: "No releases found. Add your first release to get started." }))] }), _jsx(Modal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false), title: "Add New Release", children: _jsx(ReleaseForm, { onSubmit: handleAdd, onCancel: () => setIsModalOpen(false) }) }), editData && (_jsx(Modal, { isOpen: !!editData, onClose: () => setEditData(null), title: "Edit Release", children: _jsx(ReleaseForm, { initialData: editData, onSubmit: handleEdit, onCancel: () => setEditData(null) }) }))] }));
};
const AppContent = () => {
    const { currentUser } = useAuth();
    if (!currentUser) {
        return _jsx(AuthScreen, {});
    }
    return _jsx(Dashboard, {});
};
const ClientReleases = () => (_jsx(AuthProvider, { children: _jsx(ReleasesProvider, { children: _jsx(AppContent, {}) }) }));
export default ClientReleases;
