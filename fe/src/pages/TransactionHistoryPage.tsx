import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TransactionHistoryResponse, TransactionSearchCondition, TransactionType } from '../types/transaction';
import { PageResponse } from '../types/page';
import { transactionService } from '../services/transactionService'; 
import { RefreshCw, Search, List, Calendar } from 'lucide-react';

const TYPE_LABELS: { [key in TransactionType]: string } = {
    INBOUND: '입고',
    OUTBOUND: '출고',
    MOVEMENT: '재고 이동',
    ADJUSTMENT: '재고 조정',
};

const TransactionHistoryPage = (): React.ReactElement => {
    const [transactions, setTransactions] = useState<TransactionHistoryResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // 검색/페이지네이션 상태
    const [criteria, setCriteria] = useState<TransactionSearchCondition>({});
    const [page, setPage] = useState(0);
    const [pageSize] = useState(20); 
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // 검색 조건 입력 상태
    const [searchType, setSearchType] = useState<TransactionType | ''>('');
    const [searchItemSku, setSearchItemSku] = useState('');
    const [searchUsername, setSearchUsername] = useState('');
    const [searchFromBinCode, setSearchFromBinCode] = useState('');
    const [searchToBinCode, setSearchToBinCode] = useState('');
    const [searchStartDate, setSearchStartDate] = useState(''); // Date input string (yyyy-MM-dd)
    const [searchEndDate, setSearchEndDate] = useState('');


    // 1. 거래 이력 데이터 불러오기 함수
    const fetchHistory = useCallback(async (
        currentCriteria: TransactionSearchCondition, 
        currentPage: number
    ) => {
        setLoading(true);
        setError(null);
        try {
            const data: PageResponse<TransactionHistoryResponse> = await transactionService.searchTransactionHistory(
                currentCriteria,
                currentPage,
                pageSize
            );
            setTransactions(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
            setPage(data.number); 
        } catch (err) {
            setError('거래 이력 목록을 불러오는 데 실패했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [pageSize]);

    // 초기 로딩
    useEffect(() => {
        fetchHistory(criteria, page);
    }, [fetchHistory, criteria, page]);


    //  검색 버튼 클릭 핸들러
    const handleSearch = () => {
        const newCriteria: TransactionSearchCondition = {};
        
        if (searchType) newCriteria.type = searchType;
        if (searchItemSku) newCriteria.itemSku = searchItemSku;
        if (searchUsername) newCriteria.username = searchUsername;
        if (searchFromBinCode) newCriteria.fromLocationBinCode = searchFromBinCode;
        if (searchToBinCode) newCriteria.toLocationBinCode = searchToBinCode;

        if (searchStartDate) newCriteria.startDate = `${searchStartDate}T00:00:00`;
        if (searchEndDate) newCriteria.endDate = `${searchEndDate}T23:59:59`;
        
        setCriteria(newCriteria);
        setPage(0); 
    };
    
    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };
    
    const getTypeStyle = (type: TransactionType) => {
        switch(type) {
            case 'INBOUND': return 'bg-green-100 text-green-800';
            case 'OUTBOUND': return 'bg-red-1100 text-red-800';
            case 'MOVEMENT': return 'bg-blue-100 text-blue-800';
            case 'ADJUSTMENT': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };


    return (
        <div className="p-6 bg-gray-50 h-full flex flex-col">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2 flex items-center">
                <List size={28} className="mr-3 text-gray-600" /> 재고 이력 조회
            </h1>
            
            {/* 검색 영역 */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                    
                    {/* 거래 유형 */}
                    <div>
                        <label htmlFor="searchType" className="block text-sm font-medium text-gray-700">거래 유형</label>
                        <select
                            id="searchType"
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value as TransactionType | '')}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        >
                            <option value="">-- 전체 --</option>
                            {(Object.keys(TYPE_LABELS) as TransactionType[]).map(type => (
                                <option key={type} value={type}>{TYPE_LABELS[type]}</option>
                            ))}
                        </select>
                    </div>

                    {/* 품목 SKU */}
                    <div>
                        <label htmlFor="searchItemSku" className="block text-sm font-medium text-gray-700">품목 SKU</label>
                        <input type="text" id="searchItemSku" value={searchItemSku} onChange={(e) => setSearchItemSku(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="SKU 부분 일치" />
                    </div>

                    {/* 작업자 이름 */}
                    <div>
                        <label htmlFor="searchUsername" className="block text-sm font-medium text-gray-700">작업자 이름</label>
                        <input type="text" id="searchUsername" value={searchUsername} onChange={(e) => setSearchUsername(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="이름 부분 일치" />
                    </div>
                    
                    {/* 출발지 Bin Code */}
                    <div>
                        <label htmlFor="searchFromBinCode" className="block text-sm font-medium text-gray-700">출발 선반</label>
                        <input type="text" id="searchFromBinCode" value={searchFromBinCode} onChange={(e) => setSearchFromBinCode(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="출발 Bin Code" />
                    </div>

                    {/* 도착지 Bin Code */}
                    <div>
                        <label htmlFor="searchToBinCode" className="block text-sm font-medium text-gray-700">도착 선반</label>
                        <input type="text" id="searchToBinCode" value={searchToBinCode} onChange={(e) => setSearchToBinCode(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="도착 Bin Code" />
                    </div>
                    
                    {/* 기간 시작 */}
                    <div>
                        <label htmlFor="searchStartDate" className="block text-sm font-medium text-gray-700 flex items-center"><Calendar size={14} className="mr-1" /> 시작일</label>
                        <input type="date" id="searchStartDate" value={searchStartDate} onChange={(e) => setSearchStartDate(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>

                    {/* 기간 종료 */}
                    <div>
                        <label htmlFor="searchEndDate" className="block text-sm font-medium text-gray-700">종료일</label>
                        <input type="date" id="searchEndDate" value={searchEndDate} onChange={(e) => setSearchEndDate(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>

                    {/* 검색 버튼 */}
                    <div className='flex space-x-2 md:col-span-1 md:col-start-6'>
                        <button
                            onClick={handleSearch}
                            className="flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg hover:bg-indigo-700 w-full"
                        >
                            <Search size={20} className="mr-2" /> 검색
                        </button>
                        <button
                            onClick={() => fetchHistory(criteria, page)}
                            disabled={loading}
                            className="text-gray-600 hover:text-gray-700 disabled:opacity-50 transition duration-150 p-2 border rounded-xl"
                        >
                            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>
            </div>
            
            {/* 메인 목록 */}
            <div className="flex justify-end items-center mb-4">
                <p className="text-sm text-gray-600">총 {totalElements} 건의 거래 이력</p>
            </div>

            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">{error}</div>}
            {loading && <p className="text-center text-gray-500">데이터를 불러오는 중...</p>}

            {!loading && (
                <div className="flex-grow overflow-y-auto bg-white rounded-lg shadow-xl">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">거래 시각</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">유형</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">품목 (SKU)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">출발지 (From)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">도착지 (To)</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">수량 변화</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업자</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">비고</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">조회된 거래 이력이 없습니다.</td>
                                </tr>
                            ) : (
                                transactions.map((tx) => (
                                    <tr key={tx.transactionId} className="hover:bg-gray-50 transition duration-100">
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                            {new Date(tx.transactionDate).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeStyle(tx.type)}`}>
                                                {TYPE_LABELS[tx.type]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {tx.itemName} <span className="text-xs text-gray-500 block">({tx.itemSku})</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {tx.fromBinCode ? `${tx.fromCenterName} (${tx.fromBinCode})` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {tx.toBinCode ? `${tx.toCenterName} (${tx.toBinCode})` : '-'}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-right text-base font-bold ${tx.quantity >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                            {tx.quantity > 0 ? `+${tx.quantity.toLocaleString()}` : tx.quantity.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-700">
                                            {tx.username}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">
                                            {tx.notes || '-'}
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
        </div>
    );
};

export default TransactionHistoryPage;