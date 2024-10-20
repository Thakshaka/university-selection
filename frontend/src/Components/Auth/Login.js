import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
    
        if (!email || !password) {
          setError(t('login.errorAllFields'));
          return;
        }
    
        try {
          const response = await fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
          });
    
          const data = await response.json();
    
          if (!response.ok) {
            throw new Error(data.error || 'Login failed');
          }
    
          // Login successful
          login(data.user, data.token); // Assuming the server sends user data and a token
          navigate('/courses'); // Redirect to courses page after successful login
        } catch (err) {
          console.log(err);
          setError("Login failed");
        }
      };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">{t('login.title')}</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">{t('login.email')}</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">{t('login.password')}</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">{t('login.submit')}</button>
                </div>
              </form>
              <div className="mt-3 text-center">
                <Link to="/forgot-password">{t('login.forgotPassword')}</Link>
              </div>
              <div className="mt-3 text-center">
                {t('login.noAccount')} <Link to="/register">{t('login.register')}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;