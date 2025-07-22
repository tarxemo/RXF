import { useMutation } from '@apollo/client';
import { LOGIN } from '../api/mutations';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';

export const LoginPage = () => {
  const [executeLoginMutation] = useMutation(LOGIN);
  const { login } = useAuth(); // ✅ now safe to use this
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
        const { data } = await executeLoginMutation({
          variables: {
            input: {
              phone: formData.get('phone'),
              password: formData.get('password')
            }
          }
        });
      login(data.login.user, {
        accessToken: data.login.token,
        refreshToken: data.login.refreshToken
      });
    navigate('/dashboard');

    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 rounded-lg shadow bg-gray-800">
        <h2 className="text-3xl font-bold text-center text-green-600">Farm Management Login</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-200">
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};