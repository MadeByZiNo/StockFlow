// src/pages/ItemPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemSummaryResponse, ItemRegistrationRequest, ItemSearchCondition,ItemResponse} from '../types/item';
import { PageResponse } from '../types/page';
import ItemForm from '../components/item/ItemForm'; 
import { itemService } from '../services/itemService';
import { categoryService } from '../services/categoryService';
import { Category } from '../types/category'; 
import { Plus, Edit, RefreshCw, Search, Box, X, DollarSign } from 'lucide-react';

const ItemPage = (): React.ReactElement => {
    const navigate = useNavigate();
    const [items, setItems] = useState<ItemSummaryResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [categories, setCategories] = useState<Category[]>([]); 
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ItemResponse | null>(null);

    // 검색/페이지네이션 상태
    const [criteria, setCriteria] = useState<ItemSearchCondition>({});
    const [page, setPage] = useState(0);
    const [pageSize] = useState(10); 
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // 검색 조건 입력 상태 (ItemSearchCondition 필드 전체 반영)
    const [searchName, setSearchName] = useState('');
    const [searchMinPrice, setSearchMinPrice] = useState<number | ''>('');
    const [searchMaxPrice, setSearchMaxPrice] = useState<number | ''>('');
    const [searchSku, setSearchSku] = useState('');
    const [searchCategoryId, setSearchCategoryId] = useState<number | ''>(''); // 드롭다운
    const [searchCenterName, setSearchCenterName] = useState('');
    const [searchZoneCode, setSearchZoneCode] = useState('');
    const [searchBinCode, setSearchBinCode] = useState('');
    const [searchMinQuantity, setSearchMinQuantity] = useState<number | ''>('');


    // 1. 주 목록 데이터 불러오기 함수
    const fetchItems = useCallback(async (
        currentCriteria: ItemSearchCondition, 
        currentPage: number
    ) => {
        setLoading(true);
        setError(null);
        try {
            const data: PageResponse<ItemSummaryResponse> = await itemService.searchItems(
                currentCriteria,
                currentPage,
                pageSize
            );
            setItems(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
            setPage(data.number); 
        } catch (err) {
            setError('품목 목록을 불러오는 데 실패했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [pageSize]);

    // 2. 카테고리 목록 로드 (필터 드롭다운용)
    const fetchCategoryOptions = useCallback(async () => {
        try {
            // NOTE: categoryService.fetchAllCategories()가 PageResponse를 반환한다고 가정했으므로 .content 사용
            const loadedCategories = (await categoryService.fetchAllCategories()).content; 
            setCategories(loadedCategories);
        } catch (err) {
            console.error('카테고리 목록을 불러오는 데 실패했습니다.', err);
        }
    }, []);

    // 초기 로딩
    useEffect(() => {
        fetchItems(criteria, page);
        fetchCategoryOptions(); 
    }, [fetchItems, fetchCategoryOptions, criteria, page]);


    // 🎯 검색 버튼 클릭 핸들러 (ItemSearchCondition 구성)
    const handleSearch = () => {
        const newCriteria: ItemSearchCondition = {};
        
        if (searchName) newCriteria.name = searchName;
        if (searchSku) newCriteria.sku = searchSku;
        if (searchCategoryId !== '') newCriteria.categoryId = searchCategoryId as number;
        if (searchMinPrice !== '') newCriteria.minPrice = searchMinPrice as number;
        if (searchMaxPrice !== '') newCriteria.maxPrice = searchMaxPrice as number;
        if (searchCenterName) newCriteria.centerName = searchCenterName;
        if (searchZoneCode) newCriteria.zoneCode = searchZoneCode;
        if (searchBinCode) newCriteria.binCode = searchBinCode;
        if (searchMinQuantity !== '') newCriteria.minQuantity = searchMinQuantity as number;
        
        setCriteria(newCriteria);
        setPage(0); 
    };
    

    const handleRowClick = (itemId: number) => {
        navigate(`/item/${itemId}/inventory`); 
    };
    
    const handleDelete = async (itemId: number) => {
        if (!window.confirm(`품목 ID ${itemId}를 정말로 삭제하시겠습니까?`)) {
            return;
        }

        setLoading(true);
        try {
            await itemService.deleteItem(itemId);
            await fetchItems(criteria, page);
        } catch (err: any) {
             setError(`삭제 실패: ${err.response?.data?.message || '알 수 없는 오류'}`);
        } finally {
            setLoading(false);
        }
    };
    
    // 폼 저장 로직
    const handleSave = async (data: ItemRegistrationRequest, id?: number) => {
        setLoading(true);
        try {
            if (id) {
                await itemService.updateItem(id, data);
            } else {
                await itemService.registerItem(data);
            }
            setIsModalOpen(false);
            setEditingItem(null);
            await fetchItems(criteria, page); 
        } catch (err: any) {
            setError(`작업 실패: ${err.response?.data?.message || '알 수 없는 오류'}`);
        } finally {
            setLoading(false);
        }
    };
    
    const openModalForEdit = async (itemId: number) => {
        setLoading(true); 
        setError(null);
        try {
            const detailResponse: ItemResponse = await itemService.getItem(itemId);
            
            setEditingItem(detailResponse);
            setIsModalOpen(true);
        } catch (err: any) {
            console.error(`품목 상세 정보 로드 실패 (ID: ${itemId}):`, err);
            setError(`수정할 품목 정보를 불러오는 데 실패했습니다: ${err.response?.data?.message || '네트워크 오류'}`);
        } finally {
            setLoading(false); 
        }
    };


    const openModalForCreate = () => {
        setEditingItem(null); 
        setIsModalOpen(true);
    };


    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };


    return (
        <div className="p-6 bg-gray-50 h-full flex flex-col">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">품목 관리</h1>
            
            {/* 🎯 검색 영역: ItemSearchCondition 필드 전체 적용 */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    
                    {/* 카테고리 ID */}
                    <div>
                        <label htmlFor="searchCategoryId" className="block text-sm font-medium text-gray-700">카테고리</label>
                        <select
                            id="searchCategoryId"
                            value={searchCategoryId}
                            onChange={(e) => setSearchCategoryId(parseInt(e.target.value) || '')}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        >
                            <option value="">-- 전체 --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name} ({cat.code})</option>
                            ))}
                        </select>
                    </div>

                    {/* 품목 이름 */}
                    <div>
                        <label htmlFor="searchName" className="block text-sm font-medium text-gray-700">품목 이름</label>
                        <input type="text" id="searchName" value={searchName} onChange={(e) => setSearchName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="이름 부분 일치" />
                    </div>

                    {/* SKU */}
                    <div>
                        <label htmlFor="searchSku" className="block text-sm font-medium text-gray-700">SKU</label>
                        <input type="text" id="searchSku" value={searchSku} onChange={(e) => setSearchSku(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="SKU 부분 일치" />
                    </div>

                    {/* 최소 가격 */}
                    <div>
                        <label htmlFor="searchMinPrice" className="block text-sm font-medium text-gray-700">최소 가격</label>
                        <input type="number" id="searchMinPrice" value={searchMinPrice} onChange={(e) => setSearchMinPrice(parseInt(e.target.value) || '')}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" min="0" />
                    </div>
                    
                    {/* 최대 가격 */}
                    <div>
                        <label htmlFor="searchMaxPrice" className="block text-sm font-medium text-gray-700">최대 가격</label>
                        <input type="number" id="searchMaxPrice" value={searchMaxPrice} onChange={(e) => setSearchMaxPrice(parseInt(e.target.value) || '')}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" min="0" />
                    </div>

                    {/* 센터 이름 */}
                    <div>
                        <label htmlFor="searchCenterName" className="block text-sm font-medium text-gray-700">물류 센터</label>
                        <input type="text" id="searchCenterName" value={searchCenterName} onChange={(e) => setSearchCenterName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="센터 이름" />
                    </div>

                    {/* 구역 코드 */}
                    <div>
                        <label htmlFor="searchZoneCode" className="block text-sm font-medium text-gray-700">구역 코드</label>
                        <input type="text" id="searchZoneCode" value={searchZoneCode} onChange={(e) => setSearchZoneCode(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="구역 코드" />
                    </div>

                    {/* 선반 코드 */}
                    <div>
                        <label htmlFor="searchBinCode" className="block text-sm font-medium text-gray-700">선반 코드</label>
                        <input type="text" id="searchBinCode" value={searchBinCode} onChange={(e) => setSearchBinCode(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="선반 코드" />
                    </div>

                    {/* 최소 재고 수량 */}
                    <div>
                        <label htmlFor="searchMinQuantity" className="block text-sm font-medium text-gray-700">최소 재고 수량</label>
                        <input type="number" id="searchMinQuantity" value={searchMinQuantity} onChange={(e) => setSearchMinQuantity(parseInt(e.target.value) || '')}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" min="0" />
                    </div>
                    
                    {/* 검색 버튼 */}
                    <div className='flex space-x-2 md:col-span-1 md:col-start-5'>
                        <button
                            onClick={handleSearch}
                            className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-xl shadow-lg hover:bg-green-700 w-full"
                        >
                            <Search size={20} className="mr-2" /> 검색
                        </button>
                        <button
                            onClick={() => fetchItems(criteria, page)}
                            disabled={loading}
                            className="text-gray-600 hover:text-gray-700 disabled:opacity-50 transition duration-150 p-2 border rounded-xl"
                        >
                            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>
            </div>
            
            {/* 메인 액션 및 목록 */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={openModalForCreate} // 🎯 수정된 함수 호출
                    className="flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-lg hover:bg-blue-700"
                >
                    <Plus size={20} className="mr-2" /> 새 품목 등록
                </button>
                <p className="text-sm text-gray-600">총 {totalElements} 개의 품목</p>
            </div>

            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">{error}</div>}
            {loading && <p className="text-center text-gray-500">데이터를 불러오는 중...</p>}

            {!loading && (
                <div className="flex-grow overflow-y-auto bg-white rounded-lg shadow-xl">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID / SKU</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">품목명</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">단가</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">총 재고 수량</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">검색 결과가 없습니다.</td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <tr 
                                        key={item.itemId} 
                                        className="hover:bg-gray-50 transition duration-100 cursor-pointer"
                                        onClick={() => handleRowClick(item.itemId)} // 상세 페이지 이동
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.itemId} / <span className="text-xs text-gray-600">{item.sku}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.itemName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600">{item.categoryName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">{item.price.toLocaleString()}원</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-base font-bold text-indigo-700">
                                            {item.quantity.toLocaleString()}
                                            {item.quantity === 0 && <span className="text-red-500 ml-1">(품절)</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => openModalForEdit(item.itemId)} // ID로 수정 모달 열기
                                                className="text-blue-600 hover:text-blue-900 mr-3 p-1 rounded-full hover:bg-blue-100"
                                                title="수정"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.itemId)}
                                                className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
                                                title="삭제"
                                            >
                                                <X size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            
            {/* 페이지네이션 */}
            <div className="flex justify-center items-center mt-4 space-x-2">
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 0 || loading} className="px-3 py-1 text-sm text-gray-600 bg-white border rounded-lg hover:bg-gray-100 disabled:opacity-50">이전</button>
                <span className="text-sm font-medium text-gray-700">페이지 {page + 1} / {totalPages}</span>
                <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1 || loading} className="px-3 py-1 text-sm text-gray-600 bg-white border rounded-lg hover:bg-gray-100 disabled:opacity-50">다음</button>
            </div>


            {/* 등록/수정 모달 */}
            {isModalOpen && (
                <ItemForm
                    itemToEdit={editingItem}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    isLoading={loading}
                />
            )}
        </div>
    );
};

export default ItemPage;