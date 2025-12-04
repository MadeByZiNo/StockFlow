import React, { useState } from 'react';
import { AdjustmentRequest, InventorySummaryResponse } from '../../types/inventory';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

interface AdjustmentFormProps {
    item: InventorySummaryResponse; 
    onClose: () => void;
    onSave: (data: AdjustmentRequest) => Promise<void>;
    isLoading: boolean;
}

const AdjustmentForm: React.FC<AdjustmentFormProps> = ({ item, onClose, onSave, isLoading }): React.ReactElement => {
    const [adjustmentQuantity, setAdjustmentQuantity] = useState<number | ''>('');
    const [notes, setNotes] = useState('');
    
    const isNumber = typeof adjustmentQuantity === 'number';
    const isPositive = isNumber && adjustmentQuantity > 0;
    const isNegative = isNumber && adjustmentQuantity < 0; 
    
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
            setAdjustmentQuantity('');
        } else {
            const numValue = parseInt(value, 10);
            setAdjustmentQuantity(isNaN(numValue) ? '' : numValue);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const quantity = adjustmentQuantity === '' ? 0 : adjustmentQuantity;
        if (quantity === 0) {
            alert('조정 수량은 0이 될 수 없습니다.');
            return;
        }
        if (!notes.trim()) {
            alert('조정 사유는 필수입니다.');
            return;
        }
  
        const requestData: AdjustmentRequest = {
            inventoryId: item.inventoryId,
            adjustmentQuantity: quantity,
            notes: notes.trim(),
        };
        
        await onSave(requestData);
    };

    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-xl font-bold text-red-600 flex items-center">
                        재고 조정 ({item.zoneCode} / {item.binCode})
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">
                    품목: ({item.itemName}) <br/>
                    현재 재고: {item.quantity.toLocaleString()}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">조정 수량</label>
                        <div className={`mt-1 flex rounded-md shadow-sm border ${isPositive ? 'border-green-500' : isNegative ? 'border-red-500' : 'border-gray-300'}`}>
                            <span className={`inline-flex items-center px-3 border-r border-gray-300 bg-gray-50 text-gray-500 sm:text-sm ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : ''}`}>
                                {isPositive ? <TrendingUp size={18} /> : isNegative ? <TrendingDown size={18} /> : '#'}
                            </span>
                            <input
                                id="quantity"
                                type="number"
                                value={adjustmentQuantity}
                                onChange={handleQuantityChange} 
                                required
                                placeholder="+10 (추가) 또는 -5 (차감)"
                                className="block w-full p-2 rounded-r-md"
                            />
                        </div>
                    </div>

                    {/* 사유 */}
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">조정 사유 (필수)</label>
                        <textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            required
                            placeholder="예: 입고 수량 오기재 수정, 재고 조사 중 발견된 분실"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white ${
                            isLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                        }`}
                    >
                        {isLoading ? '조정 기록 중...' : '재고 조정 기록'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdjustmentForm;