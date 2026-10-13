import baseUrl from '@/bazar/baseUrl';
import React, { Suspense } from 'react';

const getCategoryProducts = async (categorySlug) => {
    const res = await fetch(`${baseUrl}/products?category=${categorySlug}`, { cache: 'no-store' });
    return res.json();
}

const CategoryProductContent = async ({ params }) => {
    const { categorySlug } = await params;
    const categoryProducts = await getCategoryProducts(categorySlug);
    
    const firstProduct = categoryProducts?.[0];
    const categoryNameBn = firstProduct?.categoryNameBn || categorySlug;
    const categoryIcon = firstProduct?.categoryIcon || '📦';
    const totalProducts = categoryProducts?.length || 0;

    return (
        <div className="min-h-screen bg-[#f3f6f3] py-8">
            <div className="max-w-5xl mx-auto px-6 flex flex-col gap-6">
                
                {/* টপ ব্যানার কার্ড */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#f0fdf4] text-2xl flex items-center justify-center">
                        {categoryIcon}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{categoryNameBn}</h1>
                        <p className="text-xs text-gray-500 mt-0.5">{totalProducts}টি পণ্যের আজকের দাম ও পরিবর্তন</p>
                    </div>
                </div>

                {/* সাব-হেডিং কাউন্ট */}
                <p className="text-xs text-gray-500 font-medium">মোট {totalProducts}টি পণ্য দেখানো হচ্ছে</p>

                {/* প্রোডাক্ট কার্ড গ্রিড */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.isArray(categoryProducts) && categoryProducts.map((product) => {
                        const isUp = product?.change?.dir === 'up';
                        const isDown = product?.change?.dir === 'down';
                        const changeColor = isUp ? 'text-red-500' : isDown ? 'text-green-600' : 'text-gray-500';
                        const changeSign = isUp ? '▲' : isDown ? '▼' : '—';
                        const changePct = product?.change?.pct ?? 0;

                        return (
                            <div key={product.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between gap-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-3">
                                    <div className="w-11 h-11 rounded-xl bg-[#f9fafb] border border-gray-100 flex items-center justify-center text-xl shrink-0">
                                        {product.image || '🛒'}
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-base text-gray-900 leading-snug">{product.nameBn}</h2>
                                        <p className="text-xs text-gray-400 mt-0.5">প্রতি {product.unit}</p>
                                    </div>
                                </div>

                                <div className="flex items-end justify-between pt-3 border-t border-gray-50">
                                    <div>
                                        <p className="text-[11px] text-gray-400 font-medium">আজকের দাম</p>
                                        <p className="text-lg font-bold text-gray-900 mt-0.5">{product.today} টাকা</p>
                                    </div>
                                    <div className={`text-xs font-semibold flex items-center gap-1 ${changeColor}`}>
                                        <span>{changeSign}</span>
                                        <span>{changePct}%</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

const CategoryProduct = ({ params }) => (
    <Suspense
        fallback={
            <div className="min-h-screen bg-[#f3f6f3] py-8">
                <div className="max-w-5xl mx-auto px-6">
                    <p className="text-sm text-gray-500">পণ্য লোড হচ্ছে...</p>
                </div>
            </div>
        }
    >
        <CategoryProductContent params={params} />
    </Suspense>
);

export default CategoryProduct;