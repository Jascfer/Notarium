import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function DebugAuth() {
  const { user, login, logout } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://notarium-backend-production.up.railway.app';

  const runTests = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test 1: Backend health check
      console.log('Test 1: Backend health check');
      const healthRes = await fetch(`${API_URL}/`);
      results.healthCheck = {
        success: healthRes.ok,
        status: healthRes.status,
        statusText: healthRes.statusText
      };

      // Test 2: Auth test endpoint
      console.log('Test 2: Auth test endpoint');
      const authTestRes = await fetch(`${API_URL}/auth/test`, {
        credentials: 'include'
      });
      const authTestData = await authTestRes.json();
      results.authTest = {
        success: authTestRes.ok,
        data: authTestData
      };

      // Test 3: Auth/me endpoint
      console.log('Test 3: Auth/me endpoint');
      const meRes = await fetch(`${API_URL}/auth/me`, {
        credentials: 'include'
      });
      const meData = await meRes.json();
      results.authMe = {
        success: meRes.ok,
        status: meRes.status,
        data: meData
      };

      // Test 4: Cookies
      console.log('Test 4: Cookies');
      const cookies = document.cookie;
      results.cookies = {
        cookies: cookies,
        hasSessionCookie: cookies.includes('connect.sid')
      };

      // Test 5: Session storage
      console.log('Test 5: Session storage');
      const sessionId = sessionStorage.getItem('sessionId');
      results.sessionStorage = {
        sessionId: sessionId,
        hasSessionId: !!sessionId
      };

    } catch (error) {
      console.error('Test error:', error);
      results.error = error.message;
    }

    setTestResults(results);
    setLoading(false);
  };

  const testLogin = async () => {
    const result = await login('test@example.com', 'password123');
    console.log('Login result:', result);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Auth Debug Panel</h1>
      
      <div className="mb-4">
        <button 
          onClick={runTests}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          {loading ? 'Testing...' : 'Run Tests'}
        </button>
        
        <button 
          onClick={testLogin}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
        >
          Test Login
        </button>
        
        <button 
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Current User</h2>
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Test Results</h2>
        <pre className="bg-gray-100 p-2 rounded text-sm">
          {JSON.stringify(testResults, null, 2)}
        </pre>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Browser Info</h2>
        <div className="bg-gray-100 p-2 rounded">
          <p><strong>User Agent:</strong> {navigator.userAgent}</p>
          <p><strong>Cookies Enabled:</strong> {navigator.cookieEnabled}</p>
          <p><strong>Current URL:</strong> {window.location.href}</p>
          <p><strong>Origin:</strong> {window.location.origin}</p>
        </div>
      </div>
    </div>
  );
} 