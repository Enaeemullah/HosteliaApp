import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext';

type FormValues = {
  email: string;
  password: string;
  name?: string;
  hostelName: string;
  hostelAddress: string;
  hostelDescription?: string;
};

const SignUp = () => {
  const { register, handleSubmit } = useForm<FormValues>();
  const { signup } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (values: FormValues) => {
    await signup(values);
    navigate('/dashboard');
  };

  return (
    <div className="mono-auth">
      <div className="mono-auth__card mono-auth__card--wide mono-stack">
        <div>
          <p className="mono-label">Hostelia</p>
          <h1 className="mono-title">Create your account</h1>
          <p className="mono-subtitle">Sign up and onboard your first hostel in one step.</p>
        </div>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="mono-field md:col-span-2">
            <label className="mono-label">Full name</label>
            <input type="text" {...register('name')} className="mono-input" />
          </div>
          <div className="mono-field">
            <label className="mono-label">Email</label>
            <input type="email" {...register('email')} className="mono-input" required />
          </div>
          <div className="mono-field">
            <label className="mono-label">Password</label>
            <input type="password" {...register('password')} className="mono-input" minLength={8} required />
          </div>
          <div className="mono-field">
            <label className="mono-label">Hostel name</label>
            <input type="text" {...register('hostelName')} className="mono-input" required />
          </div>
          <div className="mono-field">
            <label className="mono-label">Hostel address</label>
            <input type="text" {...register('hostelAddress')} className="mono-input" required />
          </div>
          <div className="mono-field md:col-span-2">
            <label className="mono-label">Description</label>
            <textarea {...register('hostelDescription')} className="mono-textarea" rows={3} />
          </div>
          <button className="mono-button mono-button--solid md:col-span-2" style={{ justifyContent: 'center' }} type="submit">
            Sign up
          </button>
        </form>
        <p className="mono-subtitle" style={{ textAlign: 'center' }}>
          Already have an account?{' '}
          <Link to="/signin" style={{ textDecoration: 'underline' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
