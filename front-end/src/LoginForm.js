import React from "react";

export function LoginForm({ login, credentials, setCredentials, currentUser }) {
  if (currentUser) {
    return (
      <div>
        <span>Logged in as: {currentUser.user}</span>
        <button onClick={login}>Logout</button>
      </div>
    );
  }
  return (
    <form onSubmit={e => { e.preventDefault(); login(); }}>
      <input
        type="text"
        placeholder="User"
        value={credentials.user}
        onChange={e => setCredentials(c => ({ ...c, user: e.target.value }))}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={e => setCredentials(c => ({ ...c, password: e.target.value }))}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}
