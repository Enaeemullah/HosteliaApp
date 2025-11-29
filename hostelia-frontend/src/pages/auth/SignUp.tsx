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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-slate-900">Create your Hostelia account</h1>
        <p className="mt-2 text-sm text-slate-500">Sign up and onboard your first hostel in one step.</p>
        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Full name</label>
            <input
              type="text"
              {...register('name')}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:ring-primary"
            />
          </div>
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
              minLength={8}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Hostel name</label>
            <input
              type="text"
              {...register('hostelName')}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Hostel address</label>
            <input
              type="text"
              {...register('hostelAddress')}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:ring-primary"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea
              {...register('hostelDescription')}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:ring-primary"
              rows={3}
            />
          </div>
          <button className="md:col-span-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white shadow-lg hover:bg-primary/90" type="submit">
            Sign up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/signin" className="font-semibold text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
