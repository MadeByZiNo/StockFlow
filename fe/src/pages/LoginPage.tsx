import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => { 
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-2xl">
        
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-blue-600 tracking-tight">
            ERP
          </h1>
          <p className="mt-2 text-lg text-gray-500 font-medium">
            재고관리 시스템
          </p>
        </div>
        
        <LoginForm />
        
        <div className="flex justify-between text-sm">
          <a 
            href="/forgot-password" 
            className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition duration-150"
          >
            비밀번호 찾기
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;