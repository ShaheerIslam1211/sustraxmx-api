'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Row, Col, message, Button } from 'antd';
import img1 from '../../../assets/undraw_file_sync_ot38.svg';
import createUser from '../../../firebase/auth.register';
import './index.css';
import texts from '../../../mockData/texts';

const SignUp: React.FC = () => {
  const router = useRouter();
  const [username, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault(); // Prevent default form submission behavior
    }

    if (!username || !email || !password) {
      message.error('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await createUser(username, email, password);
      router.push('/');
      message.success('Registration successful');
    } catch (error: any) {
      console.error('Registration error:', error);
      message.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-container">
      <Row
        className="loginMainRow"
        align="middle"
        justify="center"
        gutter={[16, 16]}
      >
        <Col xs={24} md={24} xl={12} className="image-column">
          <figure>
            <img src={img1} alt="Registration Visual" className="login-image" />
          </figure>
        </Col>
        <Col xs={24} md={24} xl={12} className="formContainer">
          <section>
            <header className="loginTextContainer">
              <h1 className="loginText">
                Register to{' '}
                <span className="loginSustraxApiTxt">SustraxAPI</span>
              </h1>
              <span className="loginDescription">
                {texts.signup.signupDescription}
              </span>
            </header>
            <form className="formInputs" onSubmit={handleSubmit}>
              <input
                aria-label="username"
                placeholder="Username"
                type="text"
                className="formInput"
                value={username}
                onChange={e => setUserName(e.target.value)}
              />
              <input
                aria-label="Email"
                placeholder="email..."
                type="email"
                className="formInput"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <input
                aria-label="Password"
                placeholder="password..."
                type="password"
                className="formInput"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Button
                className="loginBtn"
                type="primary"
                onClick={handleSubmit}
                loading={loading}
              >
                {loading ? `${texts.signup.signupBtnTxt}ing` : 'Register'}
              </Button>
            </form>
            <div className="registerLink">
              <Link className="linkText" href="/login">
                Already have an account? Login
              </Link>
            </div>
          </section>
        </Col>
      </Row>
    </main>
  );
};

export default SignUp;
