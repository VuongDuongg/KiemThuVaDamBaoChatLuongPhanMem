import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';

function Dashboard() {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-green-600">🎉 Chào mừng đến với hệ thống HIS!</h1>
      {user && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow max-w-md">
          <p>
            <b>Họ tên:</b> {user.fullName}
          </p>
          <p>
            <b>Chức vụ / Vai trò:</b>{' '}
            <span className="text-blue-600 font-semibold">{user.role}</span>
          </p>
        </div>
      )}
      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Đăng xuất
      </button>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Khi truy cập trang chủ ( / ), tự động chuyển hướng sang /login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Đường dẫn tới trang Đăng nhập */}
        <Route path="/login" element={<Login />} />

        {/* Đường dẫn tới trang Dashboard sau khi đăng nhập */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
