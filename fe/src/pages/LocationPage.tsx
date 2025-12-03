// src/pages/LocationPage.tsx (수정된 최종 버전)

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { LocationResponse, LocationRequest, } from '../types/location';
import { PageResponse } from '../types/page';
import { locationService, LocationSearchCriteria } from '../services/locationService';
import { Plus, Edit, RefreshCw, Search, CheckCircle, XCircle } from 'lucide-react';
import LocationForm from '../components/location/LocationForm'; 

const LocationPage = (): React.ReactElement => {
    // 👈 2. useNavigate 훅 사용
    const navigate = useNavigate();

    const [locations, setLocations] = useState<LocationResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // 🎯 필터 목록 상태 추가
    const [centerNames, setCenterNames] = useState<string[]>([]);
    const [zones, setZones] = useState<string[]>([]); 
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState<LocationResponse | null>(null);

    // 검색/페이지네이션 상태
    const [criteria, setCriteria] = useState<LocationSearchCriteria>({});
    const [page, setPage] = useState(0);
    const [pageSize] = useState(10); 
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // 검색 조건 입력 상태 (드롭다운이므로 기본값은 'all'로 설정)
    const [searchCenterName, setSearchCenterName] = useState('all');
    const [searchZone, setSearchZone] = useState('all');
    const [searchIsActive, setSearchIsActive] = useState<'all' | 'true' | 'false'>('all');


    // 1. 주 목록 데이터 불러오기 함수
    const fetchLocations = useCallback(async (
        currentCriteria: LocationSearchCriteria, 
        currentPage: number
    ) => {
        setLoading(true);
        setError(null);
        try {
            const data: PageResponse<LocationResponse> = await locationService.searchLocations(
                currentCriteria,
                currentPage,
                pageSize
            );
            setLocations(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
            setPage(data.number); 
        } catch (err) {
            setError('위치 목록을 불러오는 데 실패했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [pageSize]);

    // 2. 센터 목록만 로드하는 함수
    const fetchCenterOptions = useCallback(async () => {
        try {
            const names = await locationService.fetchAllCenterNames();
            setCenterNames(names);
        } catch (err) {
            console.error('센터 목록을 불러오는 데 실패했습니다.', err);
        }
    }, []);

    // 3. 특정 센터의 구역 목록을 로드하는 함수
    const fetchZonesByCenter = useCallback(async (centerName: string) => {
        if (centerName === 'all') {
            setZones([]);
            return;
        }
        try {
            const zoneList = await locationService.fetchZonesByCenterName(centerName);
            setZones(zoneList);
        } catch (err) {
            console.error(`${centerName}의 구역 목록을 불러오는 데 실패했습니다.`, err);
            setZones([]);
        }
    }, []);

    // A. 초기 로딩 및 검색 조건 변경 시 주 목록 로드
    useEffect(() => {
        fetchLocations(criteria, page);
        fetchCenterOptions(); 
    }, [fetchLocations, fetchCenterOptions, criteria, page]);

    // B. 센터 선택이 변경될 때마다 구역 목록을 갱신하고 구역 검색 조건을 초기화
    useEffect(() => {
        fetchZonesByCenter(searchCenterName);
        setSearchZone('all'); 
    }, [searchCenterName, fetchZonesByCenter]);


    // 검색/저장/토글/페이지네이션 핸들러 (기존과 동일)
    const handleSearch = () => {
        const newCriteria: LocationSearchCriteria = {};
        if (searchCenterName !== 'all') newCriteria.centerName = searchCenterName;
        if (searchZone !== 'all') newCriteria.zone = searchZone;
        if (searchIsActive !== 'all') newCriteria.isActive = searchIsActive === 'true';
        setCriteria(newCriteria);
        setPage(0); 
    };
    
    const handleSave = async (data: LocationRequest, id?: number) => {
        setLoading(true);
        try {
            if (id) {
                await locationService.updateLocation(id, data);
            } else {
                await locationService.createLocation(data);
            }
            setIsModalOpen(false);
            setEditingLocation(null);
            await fetchLocations(criteria, page); 
            fetchCenterOptions(); 
        } catch (err: any) {
            setError(`작업 실패: ${err.response?.data?.message || '알 수 없는 오류'}`);
        } finally {
            setLoading(false);
        }
    };
    
    const handleToggleActive = async (id: number) => {
        if (window.confirm('위치의 활성화 상태를 변경하시겠습니까?')) {
            setLoading(true);
            try {
                await locationService.toggleLocationActivation(id);
                await fetchLocations(criteria, page); 
            } catch (err: any) {
                setError(`상태 토글 실패: ${err.response?.data?.message || '알 수 없는 오류'}`);
            } finally {
                setLoading(false);
            }
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    const openModalForEdit = (location: LocationResponse) => {
        setEditingLocation(location);
        setIsModalOpen(true);
    };

    const openModalForCreate = () => {
        setEditingLocation(null);
        setIsModalOpen(true);
    };
    
    // 👈 3. 상세 페이지 이동 핸들러 추가
    const handleRowClick = (locationId: number) => {
        navigate(`/location/${locationId}`); 
    };


    // --- 렌더링 ---

    return (
        <div className="p-6 bg-gray-50 h-full flex flex-col">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">창고 위치 관리</h1>
            
            {/* 검색 영역 (Select Box 적용) - 생략 */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    
                    {/* 센터 이름 Select Box */}
                    <div>
                        <label htmlFor="searchCenterName" className="block text-sm font-medium text-gray-700">센터 이름</label>
                        <select
                            id="searchCenterName"
                            value={searchCenterName}
                            onChange={(e) => setSearchCenterName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        >
                            <option value="all">-- 전체 센터 --</option>
                            {centerNames.map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>

                    {/* 구역 Select Box (센터 선택에 따라 종속) */}
                    <div>
                        <label htmlFor="searchZone" className="block text-sm font-medium text-gray-700">구역</label>
                        <select
                            id="searchZone"
                            value={searchZone}
                            onChange={(e) => setSearchZone(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            disabled={searchCenterName === 'all'} 
                        >
                            <option value="all">-- 전체 구역 --</option>
                            {zones.map(zone => (
                                <option key={zone} value={zone}>{zone}</option>
                            ))}
                        </select>
                    </div>

                    {/* 활성화 상태 Select Box */}
                    <div>
                        <label htmlFor="searchIsActive" className="block text-sm font-medium text-gray-700">활성화 상태</label>
                        <select
                            id="searchIsActive"
                            value={searchIsActive}
                            onChange={(e) => setSearchIsActive(e.target.value as 'all' | 'true' | 'false')}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        >
                            <option value="all">전체</option>
                            <option value="true">활성화</option>
                            <option value="false">비활성화</option>
                        </select>
                    </div>
                    
                    <div className='flex space-x-2'>
                        <button
                            onClick={handleSearch}
                            className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-xl shadow-lg shadow-green-500/50 hover:bg-green-700 active:scale-[0.98] transition duration-200 ease-in-out transform w-full"
                        >
                            <Search size={20} className="mr-2" /> 검색
                        </button>
                        <button
                            onClick={() => fetchLocations(criteria, page)}
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
                    onClick={openModalForCreate}
                    className="flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/50 hover:bg-blue-700 active:scale-[0.98] transition duration-200 ease-in-out transform"
                >
                    <Plus size={20} className="mr-2" /> 새 위치 등록
                </button>
                <p className="text-sm text-gray-600">총 {totalElements} 개의 위치</p>
            </div>

            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">{error}</div>}

            {loading && <p className="text-center text-gray-500">데이터를 불러오는 중...</p>}

            {!loading && (
                <div className="flex-grow overflow-y-auto bg-white rounded-lg shadow-xl">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">센터 이름</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구역</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">선반 코드</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">활성화 상태</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {locations.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                                        검색 결과가 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                locations.map((location) => (
                                    <tr 
                                        key={location.id} 
                                        className="hover:bg-gray-50 transition duration-100 cursor-pointer"
                                        onClick={() => handleRowClick(location.id)} 
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{location.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.centerName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.zone}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.binCode}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                            {location.active ? ( 
                                                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <CheckCircle size={14} className="mr-1" /> 활성화
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    <XCircle size={14} className="mr-1" /> 비활성화
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => openModalForEdit(location)}
                                                className="text-blue-600 hover:text-blue-900 mr-3 p-1 rounded-full hover:bg-blue-100 transition duration-150"
                                                title="수정"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleToggleActive(location.id)}
                                                className={`p-1 rounded-full transition duration-150 ${
                                                    location.active 
                                                        ? 'text-red-600 hover:text-red-900 hover:bg-red-100' 
                                                        : 'text-green-600 hover:text-green-900 hover:bg-green-100'
                                                }`}
                                                title={location.active ? "비활성화" : "활성화"}
                                            >
                                                <RefreshCw size={18} /> 
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            
            <div className="flex justify-center items-center mt-4 space-x-2">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0 || loading}
                    className="px-3 py-1 text-sm text-gray-600 bg-white border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                >
                    이전
                </button>
                <span className="text-sm font-medium text-gray-700">
                    페이지 {page + 1} / {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages - 1 || loading}
                    className="px-3 py-1 text-sm text-gray-600 bg-white border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                >
                    다음
                </button>
            </div>


            {/* 등록/수정 모달 */}
            {isModalOpen && (
                <LocationForm
                    locationToEdit={editingLocation}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    isLoading={loading}
                />
            )}
        </div>
    );
};

export default LocationPage;