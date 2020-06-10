import Link from 'next/link';
import Router from 'next/router';
import { useCallback, useRef, useState } from 'react';

export default function RegisterPage() {
  const [error, setError] = useState();
  const emailRef = useRef();
  const nameRef = useRef();
  const passRef = useRef();

  const doRegister = useCallback(() => {
    const email = emailRef.current.value;
    const name = nameRef.current.value;
    const password = passRef.current.value;

    fetch('/api/register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, name, password }),
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
      {error && (
        <div className="bg-red-500">Error during registration:{error}</div>
      )}

      <div className="flex flex-col m-2">
        <input
          className="my-2 p-1 border border-1 rounded-lg"
          type="text"
          placeholder="Email"
          ref={emailRef}
        />
        <input
          className="my-2 p-1 border border-1 rounded-lg"
          type="text"
          placeholder="Name"
          ref={nameRef}
        />
        <input
          className="my-2 p-1 border border-1 rounded-lg"
          type="password"
          placeholder="Password"
          ref={passRef}
        />

        <div className="flex flex-1 items-center justify-between">
          <button className="bg-blue-500 text-white p-2" onClick={doRegister}>
            Register
          </button>

          <Link href="/login">
            <a>I already have an account</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
