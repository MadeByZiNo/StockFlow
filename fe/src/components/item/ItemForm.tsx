// src/components/item/ItemForm.tsx

import React, { useState, useEffect } from 'react';
import { ItemRegistrationRequest, ItemResponse } from '../../types/item';
import { Category } from '../../types/category'; 
import { categoryService } from '../../services/categoryService';
import { X, DollarSign, Box } from 'lucide-react';

interface ItemFormProps {
    itemToEdit: ItemResponse | null;
    onClose: () => void;
    onSave: (data: ItemRegistrationRequest, id?: number) => Promise<void>;
    isLoading: boolean;
}

const ItemForm: React.FC<ItemFormProps> = ({ itemToEdit, onClose, onSave, isLoading }): React.ReactElement => {
    const isEditing = !!itemToEdit;
    const [categories, setCategories] = useState<Category[]>([]);
    
    const [formData, setFormData] = useState<ItemRegistrationRequest>({
        name: '',
        sku: '',
        price: 0,
        safetyStock: 0,
        categoryId: 0, 
    });
    
    const [formLoading, setFormLoading] = useState(false);
    
    // --- 1. 폼 초기화 및 수정 데이터 로드 ---
    useEffect(() => {
        if (itemToEdit) {
            // 수정 모드: itemToEdit 데이터로 폼 상태 초기화
            setFormData({
                name: itemToEdit.name,
                sku: itemToEdit.sku,
                price: itemToEdit.price,
                safetyStock: itemToEdit.safetyStock,
                categoryId: itemToEdit.categoryId,
            });
        }
    }, [itemToEdit]);

    // --- 2. 카테고리 목록 로드 ---
    useEffect(() => {
        const loadCategories = async () => {
            setFormLoading(true);
            try {
                // NOTE: categoryService.fetchAllCategories()가 PageResponse를 반환한다고 가정
                const data = await categoryService.fetchAllCategories();
                const loadedCategories = data.content;
                setCategories(loadedCategories);
                
                // 등록 모드이거나 카테고리가 0으로 설정된 경우, 기본값 설정
                if (loadedCategories.length > 0 && formData.categoryId === 0) {
                    setFormData(prev => ({ 
                        ...prev, 
                        // 수정 모드일 때는 이미 itemToEdit으로 설정되었을 것이므로, 등록 모드에만 적용
                        categoryId: itemToEdit ? itemToEdit.categoryId : loadedCategories[0].id 
                    }));
                }
            } catch (err) {
                console.error("카테고리 로드 실패:", err);
            } finally {
                setFormLoading(false);
            }
        };
        loadCategories();
    }, [itemToEdit]); // itemToEdit이 변경될 때마다 카테고리 로드 후 폼 초기화

    // --- 3. 입력 변경 핸들러 ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        // 숫자 필드는 정수로 변환, 아니면 문자열로 유지
        setFormData(prev => ({
            ...prev,
            [name]: (name === 'price' || name === 'safetyStock' || name === 'categoryId') ? parseInt(value) || 0 : value
        }));
    };
    
    // --- 4. 제출 핸들러 ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // 간단한 유효성 검사
        if (!formData.name.trim() || !formData.sku.trim() || formData.categoryId === 0) {
            alert('이름, SKU, 카테고리는 필수 입력 항목입니다.');
            return;
        }
        await onSave(formData, itemToEdit?.id);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-blue-600">
                        {isEditing ? '품목 수정' : '새 품목 등록'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>
                {formLoading ? (
                    <p className="text-center text-gray-500">카테고리 정보를 불러오는 중...</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* 🎯 카테고리 선택 (수정 가능) */}
                        <div>
                            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">카테고리</label>
                            <select
                                id="categoryId"
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                // 🎯 수정 모드에서도 disabled={isLoading} 만 적용
                                disabled={isLoading} 
                            >
                                <option value={0} disabled>카테고리 선택</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name} ({cat.code})</option>
                                ))}
                            </select>
                        </div>

                        {/* SKU (식별자) */}
                        <div>
                            <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
                            <input
                                id="sku"
                                name="sku"
                                type="text"
                                value={formData.sku}
                                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                                required
                                // SKU는 등록 후에는 변경 불가능하도록 유지하는 것이 일반적
                                readOnly={isEditing} 
                                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 ${isEditing ? 'bg-gray-100' : ''}`}
                            />
                            {isEditing && <p className="text-xs text-gray-500 mt-1">SKU는 변경할 수 없습니다.</p>}
                        </div>

                        {/* 이름 */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">품목 이름</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {/* 가격 */}
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 flex items-center"><DollarSign size={14} className="mr-1" /> 가격</label>
                                <input
                                    id="price"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                                    min="0"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            {/* 안전 재고 */}
                            <div>
                                <label htmlFor="safetyStock" className="block text-sm font-medium text-gray-700 flex items-center"><Box size={14} className="mr-1" /> 안전 재고</label>
                                <input
                                    id="safetyStock"
                                    name="safetyStock"
                                    type="number"
                                    value={formData.safetyStock}
                                    onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                                    min="0"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {isLoading ? '저장 중...' : isEditing ? '수정 완료' : '등록'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ItemForm;