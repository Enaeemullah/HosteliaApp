import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext';
const SignUp = () => {
    const { register, handleSubmit } = useForm();
    const { signup } = useAuth();
    const navigate = useNavigate();
    const onSubmit = async (values) => {
        await signup(values);
        navigate('/dashboard');
    };
    return (_jsx("div", { className: "mono-auth", children: _jsxs("div", { className: "mono-auth__card mono-auth__card--wide mono-stack", children: [_jsxs("div", { children: [_jsx("p", { className: "mono-label", children: "Hostelia" }), _jsx("h1", { className: "mono-title", children: "Create your account" }), _jsx("p", { className: "mono-subtitle", children: "Sign up and onboard your first hostel in one step." })] }), _jsxs("form", { className: "grid gap-4 md:grid-cols-2", onSubmit: handleSubmit(onSubmit), children: [_jsxs("div", { className: "mono-field md:col-span-2", children: [_jsx("label", { className: "mono-label", children: "Full name" }), _jsx("input", { type: "text", ...register('name'), className: "mono-input" })] }), _jsxs("div", { className: "mono-field", children: [_jsx("label", { className: "mono-label", children: "Email" }), _jsx("input", { type: "email", ...register('email'), className: "mono-input", required: true })] }), _jsxs("div", { className: "mono-field", children: [_jsx("label", { className: "mono-label", children: "Password" }), _jsx("input", { type: "password", ...register('password'), className: "mono-input", minLength: 8, required: true })] }), _jsxs("div", { className: "mono-field", children: [_jsx("label", { className: "mono-label", children: "Hostel name" }), _jsx("input", { type: "text", ...register('hostelName'), className: "mono-input", required: true })] }), _jsxs("div", { className: "mono-field", children: [_jsx("label", { className: "mono-label", children: "Hostel address" }), _jsx("input", { type: "text", ...register('hostelAddress'), className: "mono-input", required: true })] }), _jsxs("div", { className: "mono-field md:col-span-2", children: [_jsx("label", { className: "mono-label", children: "Description" }), _jsx("textarea", { ...register('hostelDescription'), className: "mono-textarea", rows: 3 })] }), _jsx("button", { className: "mono-button mono-button--solid md:col-span-2", style: { justifyContent: 'center' }, type: "submit", children: "Sign up" })] }), _jsxs("p", { className: "mono-subtitle", style: { textAlign: 'center' }, children: ["Already have an account?", ' ', _jsx(Link, { to: "/signin", style: { textDecoration: 'underline' }, children: "Sign in" })] })] }) }));
};
export default SignUp;
