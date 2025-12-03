import React, { useState, useEffect, useCallback } from 'react';
import { Category, CategoryRequest } from '../types/category';
import { categoryService } from '../services/categoryService';
import { Plus, Edit, RefreshCw } from 'lucide-react';
import CategoryForm from '../components/category/CategoryForm';

const CategoryPage = (): React.ReactElement => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const [page] = useState(0);
    const [size] = useState(50); 

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await categoryService.fetchAllCategories(page, size);
            setCategories(data.content);
        } catch (err) {
            setError('카테고리 목록을 불러오는 데 실패했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, size]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleSave = async (data: CategoryRequest, id?: number) => {
        setLoading(true);
        try {
            if (id) {
                await categoryService.updateCategory(id, data);
            } else {
                await categoryService.createCategory(data);
            }
            setIsModalOpen(false);
            setEditingCategory(null);
            await fetchCategories();
        } catch (err: any) {
            setError(`작업 실패: ${err.response?.data?.message || '알 수 없는 오류'}`);
        } finally {
            setLoading(false);
        }
    };
    
    const openModalForEdit = (category: Category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const openModalForCreate = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

return (
        <div className="p-6 bg-gray-50 h-full flex flex-col">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">품목 카테고리 관리</h1>
            
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={openModalForCreate}
                    className="flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/50 hover:bg-blue-700 active:scale-[0.98] transition duration-200 ease-in-out transform"
                >
                    <Plus size={20} className="mr-2" /> 새 카테고리 등록
                </button>
                <button
                    onClick={fetchCategories}
                    disabled={loading}
                    className="text-blue-600 hover:text-blue-700 disabled:opacity-50 transition duration-150"
                >
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">{error}</div>}

            {loading && <p className="text-center text-gray-500">데이터를 불러오는 중...</p>}

            {!loading && (
                <div className="flex-grow overflow-y-auto bg-white rounded-lg shadow-xl p-4 space-y-3">
                    {categories.length === 0 ? (
                        <p className="text-center text-gray-500 pt-10">등록된 카테고리가 없습니다.</p>
                    ) : (
                        categories.map((category) => (
                            <div
                                key={category.id}
                                className="flex justify-between items-center p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition duration-100"
                            >
                                <div className="flex flex-col">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-bold text-purple-600 border-r pr-2">{category.code}</span>
                                        <span className="text-lg font-semibold text-gray-800">{category.name}</span>
                                    </div>
                                    <span className="text-sm text-gray-500 mt-1">{category.description || '설명 없음'}</span>
                                </div>
                                <button
                                    onClick={() => openModalForEdit(category)}
                                    className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition duration-150"
                                >
                                    <Edit size={20} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* 등록/수정 모달 */}
            {isModalOpen && (
                <CategoryForm
                    categoryToEdit={editingCategory}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    isLoading={loading}
                />
            )}
        </div>
    );
};

export default CategoryPage;