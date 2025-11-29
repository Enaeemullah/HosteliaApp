import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext';
const SignIn = () => {
    const { register, handleSubmit } = useForm();
    const { signin } = useAuth();
    const navigate = useNavigate();
    const onSubmit = async (values) => {
        await signin(values);
        navigate('/dashboard');
    };
    return (_jsx("div", { className: "mono-auth", children: _jsxs("div", { className: "mono-auth__card mono-stack", children: [_jsxs("div", { style: { textAlign: 'center' }, children: [_jsx("p", { className: "mono-label", children: "Hostelia" }), _jsx("h1", { className: "mono-title", children: "Welcome back" }), _jsx("p", { className: "mono-subtitle", children: "Sign in to manage your hostels." })] }), _jsxs("form", { className: "mono-stack mono-stack--tight", onSubmit: handleSubmit(onSubmit), children: [_jsxs("div", { className: "mono-field", children: [_jsx("label", { className: "mono-label", children: "Email" }), _jsx("input", { type: "email", ...register('email'), className: "mono-input", required: true })] }), _jsxs("div", { className: "mono-field", children: [_jsx("label", { className: "mono-label", children: "Password" }), _jsx("input", { type: "password", ...register('password'), className: "mono-input", required: true })] }), _jsx("button", { className: "mono-button mono-button--solid", style: { width: '100%', justifyContent: 'center' }, type: "submit", children: "Sign in" })] }), _jsxs("p", { className: "mono-subtitle", style: { textAlign: 'center' }, children: ["New to Hostelia?", ' ', _jsx(Link, { to: "/signup", style: { textDecoration: 'underline' }, children: "Create an account" })] })] }) }));
};
export default SignIn;
