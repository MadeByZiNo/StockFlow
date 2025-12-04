
import React, { useState, useEffect } from 'react'; 
import { MovementRequest, InventorySummaryResponse } from '../../types/inventory';
import { X, ArrowRight, Warehouse } from 'lucide-react';
import { Location } from '../../types/location';
import { locationService } from '../../services/locationService'; 


export interface LocationSearchCriteria {
    centerName?: string;
    zone?: string;
}

interface MovementFormProps {
    item: InventorySummaryResponse; 
    onClose: () => void;
    onSave: (data: MovementRequest) => Promise<void>;
    isLoading: boolean;
}

const MovementForm: React.FC<MovementFormProps> = ({ item, onClose, onSave, isLoading }): React.ReactElement => {
    const [itemId] = useState<number>(item.itemId); // Item ID는 고정
    const [fromBinCode] = useState<string>(item.binCode); // 출발지 고정
    const [quantity, setQuantity] = useState<number | ''>('');
    const [notes, setNotes] = useState('');
    
    const [toBinCode, setToBinCode] = useState<string>('');
    const [locations, setLocations] = useState<Location[]>([]);
    const [locationLoading, setLocationLoading] = useState(false);

    const currentCriteria: LocationSearchCriteria = {
            centerName: item.centerName,
            zone: item.zoneCode 
    };

    useEffect(() => {
        const fetchLocations = async () => {
            setLocationLoading(true);
            try {
                const data = await locationService.getLocationsBinCode(currentCriteria);
                setLocations(data.content); 
            } catch (err) {
                console.error("위치 목록 로드 실패:", err);
            } finally {
                setLocationLoading(false);
            }
        };
        fetchLocations();
    }, [item.centerName, item.zoneCode]);

    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const moveQuantity = quantity === '' ? 0 : quantity;
        const currentStock = item.quantity;
        
        // 필수 필드 유효성 검사
        if (!itemId || !fromBinCode || !toBinCode || moveQuantity <= 0) {
            alert('품목, 출발지, 도착지, 수량(0 초과)은 필수 입력 항목입니다.');
            return;
        }
        
        // 🟢 [추가] 재고 부족 검증 (현재 위치 재고 초과 여부)
        if (moveQuantity > currentStock) {
            alert(`이동 수량(${moveQuantity.toLocaleString()})이 현재 위치 재고(${currentStock.toLocaleString()})를 초과할 수 없습니다.`);
            return;
        }

        if (fromBinCode === toBinCode) {
            alert('출발지와 도착지는 동일할 수 없습니다.');
            return;
        }

        const requestData: MovementRequest = {
            itemId: itemId,
            fromBinCode: fromBinCode,
            toBinCode: toBinCode,
            quantity: moveQuantity,
            notes: notes.trim(),
        };
        
        await onSave(requestData);
    };

    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-xl font-bold text-blue-600 flex items-center">
                        재고 이동 기록
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">
                    품목: {item.itemName} ({item.sku}) <br/>
                    현재 위치 재고: {item.quantity.toLocaleString()} (위치: {item.binCode})
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* 품목 ID (읽기 전용) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">품목 ID</label>
                        <input type="text" value={itemId} readOnly 
                               className="mt-1 block w-full p-2 bg-gray-100 border border-gray-300 rounded-md" />
                    </div>

                    {/* 이동 경로 */}
                    <div className="flex items-center space-x-2">
                        {/* 출발지 (From Bin) */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">출발지 (From Bin)</label>
                            <input
                                type="text"
                                value={fromBinCode}
                                readOnly 
                                className="mt-1 block w-full p-2 bg-gray-100 border border-gray-300 rounded-md"
                            />
                            <p className="text-xs text-gray-500 mt-1">센터: {item.centerName}</p>
                        </div>
                        <ArrowRight size={24} className="mt-6 text-gray-500" />
                        
                        <div className="flex-1">
                            <label htmlFor="toBinCode" className="block text-sm font-medium text-gray-700">도착지 (To Bin)</label>
                            {locationLoading ? (
                                <p className="mt-1 p-2 text-sm text-gray-500 border rounded-md">위치 로드 중...</p>
                            ) : (
                                <select
                                    id="toBinCode"
                                    value={toBinCode}
                                    onChange={(e) => setToBinCode(e.target.value)}
                                    required
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="" disabled>-- 도착 위치 선택 --</option>
                                    {locations
                                        .filter(loc => loc.binCode !== fromBinCode) // 출발지와 동일한 위치 제외
                                        .map(loc => (
                                        <option key={loc.id} value={loc.binCode}>
                                            {loc.centerName} ({loc.binCode})
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                    
                    {/* 이동 수량 */}
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">이동 수량 (필수)</label>
                        <input
                            id="quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || '')}
                            min="1"
                            max={item.quantity} 
                            required
                            placeholder={`1 ~ ${item.quantity.toLocaleString()}`}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        <p className="text-xs text-gray-500 mt-1">현재 재고 ({item.quantity.toLocaleString()}) 내에서 입력해주세요.</p>
                    </div>

                    {/* 비고 */}
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">비고 (옵션)</label>
                        <textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={2}
                            placeholder="예: 공간 효율을 위한 이동"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading || locationLoading}
                        className={`w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white ${
                            (isLoading || locationLoading) ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {isLoading ? '이동 기록 중...' : '재고 이동 기록'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MovementForm;