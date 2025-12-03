
import React, { useState, FormEvent, useEffect } from 'react'; 
import { Category, CategoryRequest } from '../../types/category';
import { X } from 'lucide-react';

interface CategoryFormProps {
    categoryToEdit: Category | null;
    onClose: () => void;
    onSave: (data: CategoryRequest, id?: number) => Promise<void>; 
    isLoading: boolean;
}

const CategoryForm = ({ categoryToEdit, onClose, onSave, isLoading }: CategoryFormProps): React.ReactElement => {
    const isEditMode = categoryToEdit !== null;
    const [name, setName] = useState(categoryToEdit?.name || '');
    const [description, setDescription] = useState(categoryToEdit?.description || '');
    const [code, setCode] = useState(categoryToEdit?.code || '');

    // 수정 모드일 때 categoryToEdit 데이터가 비동기적으로 로드된 후 폼을 업데이트합니다.
    useEffect(() => {
        if (categoryToEdit) {
            setName(categoryToEdit.name);
            setDescription(categoryToEdit.description);
            setCode(categoryToEdit.code); 
        }
    }, [categoryToEdit]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const data: CategoryRequest = { name, description, code };
        
        if (!name.trim() || !code.trim()) {
            console.error("이름과 코드는 필수입니다.");
            return;
        }

        if (isEditMode && categoryToEdit) {
            onSave(data, categoryToEdit.id);
        } else {
            onSave(data);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-blue-600">
                        {isEditMode ? '카테고리 수정' : '새 카테고리 등록'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700">코드 (3자리 영어)</label>
                        <input
                            id="code"
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 3))} // 대문자 3자리 제한
                            required
                            readOnly={isEditMode} // 수정 모드에서는 코드 변경 불가
                            className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 ${
                                isEditMode ? 'bg-gray-100' : 'focus:ring-blue-500 focus:border-blue-500'
                            }`}
                        />
                        {isEditMode && <p className="text-xs text-gray-500 mt-1">코드는 수정할 수 없습니다.</p>}
                    </div>
                    
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">이름</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">설명</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                            isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150`}
                    >
                        {isLoading ? '저장 중...' : isEditMode ? '수정 완료' : '등록'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CategoryForm;