import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const Register = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
  

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !email || !password || !confirmPassword) {
        setError(t('register.errorAllFields'));
        return;
        }

        if (password !== confirmPassword) {
        setError(t('register.errorPasswordMismatch'));
        return;
        }

        try {
        const response = await fetch('http://localhost:8080/api/register', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }

        // Registration successful
        navigate('/login');
        } catch (err) {
        console.log(err);
        setError("Registration failed");    
        }
    };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">{t('register.title')}</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">{t('register.name')}</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">{t('register.email')}</label>
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
                  <label htmlFor="password" className="form-label">{t('register.password')}</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">{t('register.confirmPassword')}</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">{t('register.submit')}</button>
                </div>
              </form>
              <div className="mt-3 text-center">
                {t('register.haveAccount')} <Link to="/login">{t('register.login')}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;