import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userString = localStorage.getItem('user');

    if (!userString) {
      alert('No user found. Please register first.');
      return;
    }

    const storedUser = JSON.parse(userString) as { email: string; password: string };

    if (storedUser.email !== form.email) {
      alert('Email does not match.');
      return;
    }

    if (storedUser.password !== form.password) {
      alert('Password does not match.');
      return;
    }

    localStorage.setItem('isAuthenticated', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="auth-page d-flex justify-content-center align-items-center vh-100">
      <div className="card auth-card p-5 shadow-lg border-0">
        <div className="text-center mb-4">
          <i className="bi bi-person-circle text-primary" style={{ fontSize: '3.5rem' }}></i>
          <h3 className="mt-2 fw-bold text-primary">Expensy</h3>
          <p className="text-muted mb-0">Login to access your Tracker</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              name="email"
              className="form-control form-control-lg"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 position-relative">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              className="form-control form-control-lg pe-5"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <i
              className="bi bi-lock-fill position-absolute text-muted"
              style={{ right: '15px', top: '50%', transform: 'translateY(20%)' }}
            ></i>
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-100 shadow-sm mt-2">
            Login
          </button>

          <p className="text-center mt-3 mb-0">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary fw-semibold text-decoration-none">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
