import Link from 'next/link';
import Router from 'next/router';
import { useCallback, useRef, useState } from 'react';

export default function LoginPage() {
  const [error, setError] = useState();
  const emailRef = useRef();
  const passRef = useRef();

  const doLogin = useCallback(() => {
    const email = emailRef.current.value;
    const password = passRef.current.value;

    fetch('/api/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((userData) => {
        window.localStorage.setItem('user', JSON.stringify(userData));
        Router.push('/');
      })
      .catch((e) => {
        setError(e.toString());
      });
  }, []);

  return (
    <div className="w-full h-full">
      {error && <div className="bg-red-500">Error during login:{error}</div>}

      <div className="flex flex-col m-2">
        <input
          className="my-2 p-1 border border-1 rounded-lg"
          type="text"
          placeholder="Email"
          ref={emailRef}
        />
        <input
          className="my-2 p-1 border border-1 rounded-lg"
          type="password"
          placeholder="Password"
          ref={passRef}
        />

        <div className="flex flex-1 items-center justify-between">
          <button className="bg-blue-500 text-white p-2" onClick={doLogin}>
            Login
          </button>

          <Link href="/register">
            <a>I don't have an account</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
