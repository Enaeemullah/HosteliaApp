import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext';

type FormValues = { email: string; password: string };

const SignIn = () => {
  const { register, handleSubmit } = useForm<FormValues>();
  const { signin } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (values: FormValues) => {
    await signin(values);
    navigate('/dashboard');
  };

  return (
    <div className="mono-auth">
      <div className="mono-auth__card mono-stack">
        <div style={{ textAlign: 'center' }}>
          <p className="mono-label">Hostelia</p>
          <h1 className="mono-title">Welcome back</h1>
          <p className="mono-subtitle">Sign in to manage your hostels.</p>
        </div>
        <form className="mono-stack mono-stack--tight" onSubmit={handleSubmit(onSubmit)}>
          <div className="mono-field">
            <label className="mono-label">Email</label>
            <input type="email" {...register('email')} className="mono-input" required />
          </div>
          <div className="mono-field">
            <label className="mono-label">Password</label>
            <input type="password" {...register('password')} className="mono-input" required />
          </div>
          <button className="mono-button mono-button--solid" style={{ width: '100%', justifyContent: 'center' }} type="submit">
            Sign in
          </button>
        </form>
        <p className="mono-subtitle" style={{ textAlign: 'center' }}>
          New to Hostelia?{' '}
          <Link to="/signup" style={{ textDecoration: 'underline' }}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
