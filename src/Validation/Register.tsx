import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      alert('Passwords do not match!');
      return;
    }

    const user = { email: form.email, password: form.password };
    localStorage.setItem('user', JSON.stringify(user));

    alert('Registration successful! Please login.');
    navigate('/login');
  };

  return (
    <div className="auth-page auth-page-register d-flex justify-content-center align-items-center vh-100">
      <div className="card auth-card p-5 shadow-lg border-0">
        <div className="text-center mb-4">
          <i className="bi bi-person-plus-fill text-primary" style={{ fontSize: '3.5rem' }}></i>
          <h3 className="mt-2 fw-bold text-primary">Create Account</h3>
          <p className="text-muted mb-0">Register to get started</p>
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

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              className="form-control form-control-lg"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Confirm Password</label>
            <input
              type="password"
              name="confirm"
              className="form-control form-control-lg"
              placeholder="Re-enter your password"
              value={form.confirm}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-100 shadow-sm mt-2">
            Register
          </button>

          <p className="text-center mt-3 mb-0">
            Already have an account?{' '}
            <Link to="/login" className="text-primary fw-semibold text-decoration-none">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
