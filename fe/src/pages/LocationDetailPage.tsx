
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom'; 
import { LocationDetailResponse, ItemInLocationResponse } from '../types/location';
import { locationService } from '../services/locationService';
import { Warehouse, MapPin, Tag, Box, CheckCircle, XCircle, Loader } from 'lucide-react';

const LocationDetailPage = (): React.ReactElement => {
    const { id } = useParams<{ id: string }>(); 
    const locationId = id ? parseInt(id) : null;

    const [locationDetail, setLocationDetail] = useState<LocationDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLocationDetail = useCallback(async (locationId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await locationService.getLocationDetail(locationId);
            setLocationDetail(data);
        } catch (err: any) {
            console.error(err);
            setError(`위치 상세 정보 (${locationId})를 불러오는 데 실패했습니다.`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (locationId === null || isNaN(locationId)) {
            setError("잘못된 위치 ID입니다.");
            setLoading(false);
            return;
        }
        fetchLocationDetail(locationId);
    }, [locationId, fetchLocationDetail]);


    if (loading) {
        return (
            <div className="p-8 text-center text-gray-600">
                <Loader size={40} className="mx-auto animate-spin mb-3" />
                <p>위치 상세 정보를 불러오는 중...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold">오류 발생</h2>
                <p>{error}</p>
            </div>
        );
    }

    if (!locationDetail) {
        return (
            <div className="p-8 text-center text-gray-500">
                <p>요청하신 위치 정보를 찾을 수 없습니다.</p>
            </div>
        );
    }

    const { centerName, zone, binCode, active, inventoryList } = locationDetail;

    // --- 렌더링 ---

    return (
        <div className="p-6 bg-gray-50 h-full overflow-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2 flex items-center">
                <Warehouse size={28} className="mr-3 text-blue-600" /> 
                위치 상세 정보: {binCode}
            </h1>

            {/* 1. 기본 위치 정보 카드 */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center">
                    <MapPin size={20} className="mr-2 text-red-500" /> 기본 정보
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="p-3 bg-gray-50 rounded-md">
                        <span className="block font-medium text-gray-500">센터 이름</span>
                        <span className="block text-gray-900 text-lg">{centerName}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-md">
                        <span className="block font-medium text-gray-500">구역 (Zone)</span>
                        <span className="block text-gray-900 text-lg">{zone}</span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-md">
                        <span className="block font-medium text-gray-500">활성화 상태</span>
                        <span className={`block text-lg font-bold flex items-center ${active ? 'text-green-600' : 'text-red-600'}`}>
                            {active ? <CheckCircle size={20} className="mr-1" /> : <XCircle size={20} className="mr-1" />}
                            {active ? '활성화됨' : '비활성화됨'}
                        </span>
                    </div>
                </div>
            </div>

            {/* 2. 재고 목록 테이블 */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Box size={24} className="mr-2 text-indigo-600" /> 
                보관된 재고 목록 ({inventoryList.length}개 품목)
            </h2>
            
            {inventoryList.length === 0 ? (
                <div className="p-10 bg-yellow-50 text-center rounded-xl border border-yellow-200 text-gray-600">
                    <p>현재 이 위치 ({binCode})에는 보관된 재고가 없습니다.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <Tag size={14} className="inline mr-1" /> 품목 ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    품목명
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    SKU
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    재고 수량
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {inventoryList.map((item) => (
                                <tr key={item.itemId} className="hover:bg-gray-50 transition duration-100">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {item.itemId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {item.itemName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.itemSku}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-semibold text-indigo-700">
                                        {item.quantity.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default LocationDetailPage;