import baseUrl from '@/bazar/baseUrl';
import Link from 'next/link';
import React, { Suspense } from 'react';
const toBengaliNumber = (num) => {
    if (num === undefined || num === null) return '';
    const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num
        .toString()
        .replace(/\./g, '.')
        .replace(/\d/g, (x) => bengaliDigits[englishDigits.indexOf(x)] ?? x);
};
const getBengaliUnit = (unit) => {
    if (!unit) return 'কেজি';
    const u = unit.toLowerCase().trim();
    if (u === 'kg' || u === 'কেজি') return 'কেজি';
    if (u === 'litre' || u === 'liter' || u === 'লিটার') return 'লিটার';
    if (u === 'dozen' || u === 'ডজন') return 'ডজন';
    if (u === 'pcs' || u === 'piece' || u === 'পিস') return 'পিস';
    if (u === 'gm' || u === 'gram' || u === 'গ্রাম') return 'গ্রাম';
    return unit;
};

const getCategoryProducts = async (categorySlug) => {
    try {
        const res = await fetch(`${baseUrl}/products?category=${categorySlug}`, { cache: 'no-store' });
        if (!res.ok) return [];
        return await res.json();
    } catch (err) {
        return [];
    }
}

const CategoryProductContent = async ({ params }) => {
    const { categorySlug } = await params;
    const categoryProducts = await getCategoryProducts(categorySlug);
    if (!Array.isArray(categoryProducts) || categoryProducts.length === 0) {
        return (
            <div className="min-h-[70vh] bg-[#f3f6f3] flex items-center justify-center py-12 px-6">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 text-center max-w-md w-full flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-2xl font-bold">
                        🔍
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">কোনো পণ্য পাওয়া যায়নি</h2>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        দুঃখিত, এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য খুঁজে পাওয়া যায়নি অথবা লিংকটি সঠিক নয়।
                    </p>
                    <Link href="/">
                        <button className="mt-2 bg-[#008a4b] hover:bg-[#00753f] text-white text-xs font-semibold px-6 py-3 rounded-xl transition-all shadow-sm">
                            হোম পেজে ফিরে যান
                        </button>
                    </Link>
                </div>
            </div>
        );
    }
    
    const firstProduct = categoryProducts[0];
    const categoryNameBn = firstProduct?.categoryNameBn || categorySlug;
    const categoryIcon = firstProduct?.categoryIcon || '📦';
    const totalProducts = categoryProducts.length;

    return (
        <div className="min-h-screen bg-[#f3f6f3] py-8">
            <div className="max-w-5xl mx-auto px-6 flex flex-col gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#f0fdf4] text-2xl flex items-center justify-center">
                        {categoryIcon}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{categoryNameBn}</h1>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {toBengaliNumber(totalProducts)}টি পণ্যের আজকের দাম ও পরিবর্তন
                        </p>
                    </div>
                </div>
                <p className="text-xs text-gray-500 font-medium">
                    মোট {toBengaliNumber(totalProducts)}টি পণ্য দেখানো হচ্ছে
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {categoryProducts.map((product) => {
                        const isUp = product?.change?.dir === 'up';
                        const isDown = product?.change?.dir === 'down';
                        const changeColor = isUp ? 'text-red-500' : isDown ? 'text-green-600' : 'text-gray-500';
                        const changeSign = isUp ? '▲' : isDown ? '▼' : '—';
                        const changePct = toBengaliNumber(product?.change?.pct ?? 0);
                        const unitBn = getBengaliUnit(product.unit);

                        return (
                            <Link 
                                href={`/product/${product.slug || product.id}`} 
                                key={product.id}
                                className="h-full"
                            >
                                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between gap-4 hover:shadow-md transition-shadow cursor-pointer h-full">
                                    <div className="flex items-start gap-3">
                                        <div className="w-11 h-11 rounded-xl bg-[#f9fafb] border border-gray-100 flex items-center justify-center text-xl shrink-0">
                                            {product.image || '🛒'}
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-base text-gray-900 leading-snug">{product.nameBn}</h2>
                                            <p className="text-xs text-gray-400 mt-0.5">প্রতি {unitBn}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-end justify-between pt-3 border-t border-gray-50">
                                        <div>
                                            <p className="text-[11px] text-gray-400 font-medium">আজকের দাম</p>
                                            <p className="text-lg font-bold text-gray-900 mt-0.5">{toBengaliNumber(product.today)} টাকা</p>
                                        </div>
                                        <div className={`text-xs font-semibold flex items-center gap-1 ${changeColor}`}>
                                            <span>{changeSign}</span>
                                            <span>{changePct}%</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
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