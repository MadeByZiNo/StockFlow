import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/LoginPage';
import CategoryPage from './pages/CategoryPage';
import LocationPage from './pages/LocationPage';
import LocationDetailPage from './pages/LocationDetailPage';
import ItemPage from './pages/ItemPage';
import InventoryPage from './pages/InventoryPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />  
        <Route path="/login" element={<LoginPage />} /> 

        <Route element={<MainLayout />}>
          {/* 메뉴 아이템에 해당하는 모든 경로 설정 */}
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/locations" element={<LocationPage />} />
          <Route path="/location/:id" element={<LocationDetailPage />} />
          <Route path="/items" element={<ItemPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/transactions" element={<TransactionHistoryPage />} />
        </Route>
        
        <Route path="*" element={
          <div className="flex items-center justify-center min-h-screen text-4xl font-bold text-gray-500">
            404 - 페이지를 찾을 수 없습니다.
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;