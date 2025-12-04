import React, { useState, useEffect, useCallback } from 'react';
import { InventorySummaryResponse, InventorySearchCondition, AdjustmentRequest, MovementRequest } from '../types/inventory';
import { PageResponse } from '../types/page';
import { inventoryService } from '../services/inventoryService'; 
import { categoryService } from '../services/categoryService';
import { Category } from '../types/category'; 
import AdjustmentForm from '../components/inventory/AdjustmentForm'; 
import MovementForm from '../components/inventory/MovementForm';
import { Move, Edit, RefreshCw, Search, Warehouse } from 'lucide-react'; 

const InventoryPage = (): React.ReactElement => {
    const [inventoryItems, setInventoryItems] = useState<InventorySummaryResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [categories, setCategories] = useState<Category[]>([]); 
    
    const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
    const [itemToMove, setItemToMove] = useState<InventorySummaryResponse | null>(null);

    const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
    const [itemToAdjust, setItemToAdjust] = useState<InventorySummaryResponse | null>(null);
    
    const [criteria, setCriteria] = useState<InventorySearchCondition>({});
    const [page, setPage] = useState(0);
    const [pageSize] = useState(20); 
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [searchName, setSearchName] = useState('');
    const [searchSku, setSearchSku] = useState('');
    const [searchCategoryId, setSearchCategoryId] = useState<number | ''>(''); 
    const [searchCenterName, setSearchCenterName] = useState('');
    const [searchZoneCode, setSearchZoneCode] = useState('');
    const [searchBinCode, setSearchBinCode] = useState('');
    const [searchMinQuantity, setSearchMinQuantity] = useState<number | ''>('');


    const fetchInventoryStatus = useCallback(async (
        currentCriteria: InventorySearchCondition, 
        currentPage: number
    ) => {
        setLoading(true);
        setError(null);
        try {
            const data: PageResponse<InventorySummaryResponse> = await inventoryService.searchInventoryStatus(
                currentCriteria,
                currentPage,
                pageSize
            );
            setInventoryItems(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
            setPage(data.number); 
        } catch (err) {
            setError('재고 현황 목록을 불러오는 데 실패했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [pageSize]);

    const fetchCategoryOptions = useCallback(async () => {
        try {
            const loadedCategories = (await categoryService.fetchAllCategories()).content; 
            setCategories(loadedCategories);
        } catch (err) {
            console.error('카테고리 목록을 불러오는 데 실패했습니다.', err);
        }
    }, []);

    useEffect(() => {
        fetchInventoryStatus(criteria, page);
        fetchCategoryOptions(); 
    }, [fetchInventoryStatus, fetchCategoryOptions, criteria, page]);


    const handleSearch = () => {
        const newCriteria: InventorySearchCondition = {};
        
        if (searchName) newCriteria.name = searchName;
        if (searchSku) newCriteria.sku = searchSku;
        if (searchCategoryId !== '') newCriteria.categoryId = searchCategoryId as number;
        if (searchCenterName) newCriteria.centerName = searchCenterName;
        if (searchZoneCode) newCriteria.zoneCode = searchZoneCode;
        if (searchBinCode) newCriteria.binCode = searchBinCode;
        if (searchMinQuantity !== '') newCriteria.minQuantity = searchMinQuantity as number;
        
        setCriteria(newCriteria);
        setPage(0); 
    };
    

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };
    
    const handleMove = async (data: MovementRequest) => {
        setLoading(true);
        setError(null);
        try {
            await inventoryService.requestMovement(data);
            
            // 이동 성공 후 목록 새로고침
            alert(`재고 이동이 성공적으로 기록되었습니다. ${data.fromBinCode} -> ${data.toBinCode}, 수량: ${data.quantity}`);
            setIsMovementModalOpen(false);
            setItemToMove(null);
            await fetchInventoryStatus(criteria, page); 
        } catch (err: any) {
            setError(`이동 실패: ${err.response?.data?.message || '알 수 없는 오류'}`);
        } finally {
            setLoading(false);
        }
    };
    
    // 재고 이동 모달 열기
    const openMovementModal = (item: InventorySummaryResponse) => {
        // 현재 재고가 0인 경우 이동 불가능
        if (item.quantity === 0) {
            alert('현재 위치의 재고가 0이므로 이동할 수 없습니다.');
            return;
        }
        setItemToMove(item);
        setIsMovementModalOpen(true);
    };

    // 재고 조정 함수
    const handleAdjust = async (data: AdjustmentRequest) => {
        setLoading(true);
        setError(null);
        try {
            await inventoryService.requestAdjustment(data);

            alert(`재고 조정이 성공적으로 기록되었습니다. 수량: ${data.adjustmentQuantity > 0 ? '+' : ''}${data.adjustmentQuantity}`);
            setIsAdjustmentModalOpen(false);
            setItemToAdjust(null);
            await fetchInventoryStatus(criteria, page); 
        } catch (err: any) {
            setError(`조정 실패: ${err.response?.data?.message || '알 수 없는 오류'}`);
        } finally {
            setLoading(false);
        }
    };
    
    // 💡 재고 조정 모달 열기
    const openAdjustmentModal = (item: InventorySummaryResponse) => {
        setItemToAdjust(item);
        setIsAdjustmentModalOpen(true);
    };


    return (
        <div className="p-6 bg-gray-50 h-full flex flex-col">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2 flex items-center">
                상세 재고 현황 / 조정
            </h1>
            
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

                    {/* 물류 센터 */}
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
                            className="flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg hover:bg-indigo-700 w-full"
                        >
                            <Search size={20} className="mr-2" /> 검색
                        </button>
                        <button
                            onClick={() => fetchInventoryStatus(criteria, page)}
                            disabled={loading}
                            className="text-gray-600 hover:text-gray-700 disabled:opacity-50 transition duration-150 p-2 border rounded-xl"
                        >
                            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-end items-center mb-4">
                <p className="text-sm text-gray-600">총 {totalElements} 개의 재고 레코드</p>
            </div>

            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">{error}</div>}
            {loading && <p className="text-center text-gray-500">데이터를 불러오는 중...</p>}

            {!loading && (
                <div className="flex-grow overflow-y-auto bg-white rounded-lg shadow-xl">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID / SKU</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">품목명 / 카테고리</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">센터</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구역 / 선반</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">위치 재고 수량</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">재고 조정</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {inventoryItems.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">검색 결과가 없습니다.</td>
                                </tr>
                            ) : (
                                inventoryItems.map((item) => (
                                    <tr 
                                        key={item.inventoryId} 
                                        className="hover:bg-gray-50 transition duration-100"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.itemId} / <span className="text-xs text-gray-600">{item.sku}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {item.itemName} <span className="text-xs text-purple-600 block">{item.categoryName}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                            <Warehouse size={14} className="inline mr-1" /> {item.centerName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {item.zoneCode} / <span className="text-xs text-gray-500">{item.binCode}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-base font-bold text-indigo-700">
                                            {item.quantity.toLocaleString()}
                                        </td>
                                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                           <button
                                                onClick={() => openMovementModal(item)}
                                                disabled={item.quantity === 0}
                                                className="inline-flex items-center text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 disabled:opacity-50 text-xs font-semibold"
                                                title="재고 이동 기록"
                                            >
                                                <Move size={18} className="mr-1" /> 이동
                                            </button>
                                            
                                            <button
                                                onClick={() => openAdjustmentModal(item)}
                                                className="inline-flex items-center text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 text-xs font-semibold"
                                                title="재고 조정 기록"
                                            >
                                                <Edit size={18} className="mr-1" /> 조정
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            
            {/* ... 페이지네이션 (변경 없음) ... */}
            <div className="flex justify-center items-center mt-4 space-x-2">
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 0 || loading} className="px-3 py-1 text-sm text-gray-600 bg-white border rounded-lg hover:bg-gray-100 disabled:opacity-50">이전</button>
                <span className="text-sm font-medium text-gray-700">페이지 {page + 1} / {totalPages}</span>
                <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1 || loading} className="px-3 py-1 text-sm text-gray-600 bg-white border rounded-lg hover:bg-gray-100 disabled:opacity-50">다음</button>
            </div>
            
            {/* 💡 재고 이동 모달 */}
            {isMovementModalOpen && itemToMove && (
                <MovementForm
                    item={itemToMove}
                    onClose={() => setIsMovementModalOpen(false)}
                    onSave={handleMove}
                    isLoading={loading}
                />
            )}

            {/* 재고 조정 모달 */}
            {isAdjustmentModalOpen && itemToAdjust && (
                <AdjustmentForm
                    item={itemToAdjust}
                    onClose={() => setIsAdjustmentModalOpen(false)}
                    onSave={handleAdjust}
                    isLoading={loading}
                />
            )}
        </div>
    );
};

export default InventoryPage;