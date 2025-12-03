
import React, { useState, useEffect, useCallback } from 'react';
import { LocationRequest, LocationResponse } from '../../types/location';
import { locationService } from '../../services/locationService'; 


interface LocationFormProps {
    locationToEdit: LocationResponse | null;
    onClose: () => void;
    onSave: (data: LocationRequest, id?: number) => Promise<void>;
    isLoading: boolean;
}

const LocationForm = ({ 
    locationToEdit, 
    onClose, 
    onSave, 
    isLoading 
}: LocationFormProps): React.ReactElement => {
    const isEditing = !!locationToEdit;
    
    // 🎯 드롭다운 목록 상태
    const [centerNames, setCenterNames] = useState<string[]>([]);
    const [zonesByCenter, setZonesByCenter] = useState<string[]>([]);

    const [formData, setFormData] = useState<LocationRequest>({
        centerName: '',
        zone: '',
        binCode: '',
        isActive: true,
    });
    

    // 모든 센터 이름을 불러오는 함수
    const fetchCenterNames = useCallback(async () => {
        try {
            const names = await locationService.fetchAllCenterNames();
            setCenterNames(names);
        } catch (err) {
            console.error("센터 목록 로드 실패:", err);
        }
    }, []);

    // 특정 센터의 구역 목록을 불러오는 함수
    const fetchZones = useCallback(async (selectedCenter: string) => {
        if (!selectedCenter) {
            setZonesByCenter([]);
            return;
        }
        try {
            const zones = await locationService.fetchZonesByCenterName(selectedCenter);
            setZonesByCenter(zones);
        } catch (err) {
            console.error("구역 목록 로드 실패:", err);
            setZonesByCenter([]);
        }
    }, []);

    useEffect(() => {
        fetchCenterNames();
    }, [fetchCenterNames]);

    useEffect(() => {
        if (locationToEdit) {
            setFormData({
                centerName: locationToEdit.centerName,
                zone: locationToEdit.zone,
                binCode: locationToEdit.binCode,
                isActive: locationToEdit.active, 
            });
            fetchZones(locationToEdit.centerName);
        }
    }, [locationToEdit, fetchZones]);
    useEffect(() => {
        if (formData.centerName && !isEditing) {
            fetchZones(formData.centerName);
            setFormData(prev => ({
                ...prev,
                zone: '', 
            }));
        } else if (!isEditing) {
            setZonesByCenter([]);
            setFormData(prev => ({
                ...prev,
                zone: '', 
            }));
        }
    }, [formData.centerName, isEditing, fetchZones]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (name === 'centerName') {
            fetchZones(value);
            setFormData(prev => ({
                ...prev,
                zone: '',
                centerName: value,
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.centerName || !formData.zone || !formData.binCode || formData.isActive === undefined) {
            alert('필수 입력 항목을 모두 채워주세요.');
            return;
        }
        await onSave(formData, locationToEdit?.id);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">{isEditing ? '위치 수정' : '새 위치 등록'}</h3>
                <form onSubmit={handleSubmit}>
                    
                    {/* 센터 이름 드롭다운 */}
                    <div className="mb-4">
                        <label htmlFor="centerName" className="block text-sm font-medium text-gray-700">센터 이름</label>
                        <select
                            id="centerName"
                            name="centerName"
                            value={formData.centerName}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                            disabled={isLoading}
                        >
                            <option value="" disabled>센터를 선택하세요</option>
                            {centerNames.map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>

                    {/* 구역 드롭다운 */}
                    <div className="mb-4">
                        <label htmlFor="zone" className="block text-sm font-medium text-gray-700">구역 (Zone)</label>
                        <select
                            id="zone"
                            name="zone"
                            value={formData.zone}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                            disabled={!formData.centerName || isLoading}
                        >
                            <option value="" disabled>구역을 선택하세요</option>
                            {zonesByCenter.map(zone => (
                                <option key={zone} value={zone}>{zone}</option>
                            ))}
                        </select>
                        {!formData.centerName && (
                            <p className="text-xs text-gray-500 mt-1">센터를 먼저 선택해야 구역 목록이 표시됩니다.</p>
                        )}
                    </div>
                    
                    {/* 선반 코드 입력 */}
                    <div className="mb-4">
                        <label htmlFor="binCode" className="block text-sm font-medium text-gray-700">선반 코드 (Bin Code)</label>
                        <input
                            type="text"
                            id="binCode"
                            name="binCode"
                            value={formData.binCode}
                            onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* 활성화 상태 체크박스 */}
                    <div className="mb-4 flex items-center">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            disabled={isLoading}
                        />
                        <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">활성화 상태</label>
                    </div>
                    
                    <div className="flex justify-end space-x-3 mt-6">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                            disabled={isLoading}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? '저장 중...' : isEditing ? '수정' : '등록'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LocationForm;