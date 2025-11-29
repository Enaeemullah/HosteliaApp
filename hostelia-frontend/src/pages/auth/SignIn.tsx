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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in to manage your hostels.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              {...register('email')}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              {...register('password')}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:ring-primary"
              required
            />
          </div>
          <button className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white shadow-lg hover:bg-primary/90" type="submit">
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          New to Hostelia?{' '}
          <Link to="/signup" className="font-semibold text-primary">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
