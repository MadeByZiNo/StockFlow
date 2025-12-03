import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'; // 👈 useNavigate import 추가
import authService from '../../services/auth';
import type { AuthRequest } from '../../types/auth';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthRequest>();
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // 👈 useNavigate 훅 사용

  const onSubmit: SubmitHandler<AuthRequest> = async (data) => {
    setErrorMessage('');
    try {
      await authService.login(data);
      // alert('로그인 성공!'); // 알림 대신 바로 리디렉션
      
      // 🚀 로그인 성공 시 /categories 경로로 이동
      navigate('/categories'); 
      
    } catch (error) {
      // 로그인 실패 처리
      setErrorMessage('로그인에 실패했습니다. 아이디와 비밀번호를 다시 확인해주세요.');
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      
      {errorMessage && (
        <div className="p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg">
          {errorMessage}
        </div>
      )}

      <div>
        <label 
          htmlFor="loginId" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          아이디
        </label>
        <input
          id="loginId"
          type="text"
          autoComplete="username"
          {...register('loginId', { required: '아이디 입력은 필수입니다' })} 
          className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150"
          placeholder="아이디를 입력하세요"
          disabled={isSubmitting}
        />
        {errors.loginId && (
          <p className="mt-2 text-sm text-red-600">{errors.loginId.message}</p>
        )}
      </div>

      <div>
        <label 
          htmlFor="password" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register('password', { required: '비밀번호는 필수입니다' })} 
          className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150"
          placeholder="비밀번호를 입력하세요"
          disabled={isSubmitting}
        />

        {errors.password && (
          <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white transition duration-200
            ${isSubmitting 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
        >
          {isSubmitting ? '로그인 중...' : '로그인'}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;