import baseUrl from '@/bazar/baseUrl'
import Link from 'next/link'
import { Suspense } from 'react'
import Image from 'next/image'

const toBengaliNumber = (num) => {
  if (num === undefined || num === null) return '';
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .replace(/\d/g, (x) => bengaliDigits[englishDigits.indexOf(x)]);
};

const getProducts = async () => {
  const res = await fetch(`${baseUrl}/products`)
  return res.json()
}

export default async function HomeContent () {
  const products = await getProducts()

  const increasedProducts = Array.isArray(products)
    ? products.filter(p => p?.change?.dir === 'up').slice(0, 6)
    : []

  const decreasedProducts = Array.isArray(products)
    ? products.filter(p => p?.change?.dir === 'down').slice(0, 6)
    : []

  const totalProducts = Array.isArray(products) ? products.length : 0

  return (
    <div className='min-h-screen bg-[#f3f6f3] py-8'>
      <div className='max-w-5xl mx-auto px-6 flex flex-col gap-8'>
        <div className='bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden'>
          <div className='flex flex-col gap-3 max-w-lg'>
            <div className='inline-flex items-center gap-2 bg-[#f0fdf4] px-3 py-1 rounded-full w-max text-xs font-semibold text-[#008a4b]'>
              <span>📅</span> সোমবার, ৬ অক্টোবর, ২০২৬
            </div>
            <h1 className='text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight'>
              আজকের বাজারের দাম এক নজরে
            </h1>
            <p className='text-xs md:text-sm text-gray-500 leading-relaxed'>
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
              বিস্তারিত, গড়, সর্বনিম্ন ও সর্বোচ্চ দামের পরিবর্তন এক অধ্যায়ে।
            </p>
            <div className='pt-2'>
              <Link href='#all-products'>
                <button className='bg-[#008a4b] hover:bg-[#00753f] text-white font-medium text-sm rounded-xl px-6 py-3 shadow-sm transition-all'>
                  সব পণ্য দেখুন
                </button>
              </Link>
            </div>
          </div>

          <div className='w-36 h-36 md:w-44 md:h-44 bg-[#fef2f2] rounded-3xl flex items-center justify-center overflow-hidden shadow-inner shrink-0'>
            <Image
              src='/bazar-hero.png'
              alt='Bazar Hero'
              width={160}
              height={160}
              className='w-full h-full object-cover'
            />
          </div>
        </div>
        {increasedProducts.length > 0 && (
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
              <span className='text-red-500 text-base'>▲</span>
              <h2 className='text-base font-bold text-gray-900'>
                আজ দাম বেড়েছে
              </h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {increasedProducts.map(product => {
                const changePct = toBengaliNumber(product?.change?.pct ?? 0)
                return (
                  <div
                    key={product.id}
                    className='bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between gap-4'
                  >
                    <div className='flex items-start gap-3'>
                      <div className='w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl shrink-0'>
                        {product.image || '🛒'}
                      </div>
                      <div>
                        <h3 className='font-bold text-base text-gray-900 leading-snug'>
                          {product.nameBn}
                        </h3>
                        <p className='text-xs text-gray-400 mt-0.5'>
                          প্রতি {product.unit}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-end justify-between pt-3 border-t border-gray-50'>
                      <div>
                        <p className='text-[11px] text-gray-400 font-medium'>
                          আজকের দাম
                        </p>
                        <p className='text-lg font-bold text-gray-900 mt-0.5'>
                          {toBengaliNumber(product.today)} টাকা
                        </p>
                      </div>
                      <div className='text-xs font-semibold flex items-center gap-1 text-red-500'>
                        <span>▲</span>
                        <span>{changePct}%</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        {decreasedProducts.length > 0 && (
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
              <span className='text-green-600 text-base'>▼</span>
              <h2 className='text-base font-bold text-gray-900'>
                আজ দাম কমেছে
              </h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {decreasedProducts.map(product => {
                const changePct = toBengaliNumber(product?.change?.pct ?? 0)
                return (
                  <div
                    key={product.id}
                    className='bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between gap-4'
                  >
                    <div className='flex items-start gap-3'>
                      <div className='w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl shrink-0'>
                        {product.image || '🛒'}
                      </div>
                      <div>
                        <h3 className='font-bold text-base text-gray-900 leading-snug'>
                          {product.nameBn}
                        </h3>
                        <p className='text-xs text-gray-400 mt-0.5'>
                          প্রতি {product.unit}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-end justify-between pt-3 border-t border-gray-50'>
                      <div>
                        <p className='text-[11px] text-gray-400 font-medium'>
                          আজকের দাম
                        </p>
                        <p className='text-lg font-bold text-gray-900 mt-0.5'>
                          {toBengaliNumber(product.today)} টাকা
                        </p>
                      </div>
                      <div className='text-xs font-semibold flex items-center gap-1 text-green-600'>
                        <span>▼</span>
                        <span>{changePct}%</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        <div id='all-products' className='flex flex-col gap-4 scroll-mt-24'>
          <div>
            <h2 className='text-base font-bold text-gray-900'>সব পণ্য</h2>
            <p className='text-xs text-gray-500 mt-0.5'>
              মোট {toBengaliNumber(totalProducts)}টি পণ্য দেখানো হচ্ছে
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {Array.isArray(products) &&
              products.map(product => {
                const isUp = product?.change?.dir === 'up'
                const isDown = product?.change?.dir === 'down'
                const changeColor = isUp
                  ? 'text-red-500'
                  : isDown
                  ? 'text-green-600'
                  : 'text-gray-500'
                const changeSign = isUp ? '▲' : isDown ? '▼' : '—'
                const changePct = toBengaliNumber(product?.change?.pct ?? 0)

                return (
                  <div
                    key={product.id}
                    className='bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between gap-4 hover:shadow-md transition-shadow'
                  >
                    <div className='flex items-start gap-3'>
                      <div className='w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl shrink-0'>
                        {product.image || '🛒'}
                      </div>
                      <div>
                        <h3 className='font-bold text-base text-gray-900 leading-snug'>
                          {product.nameBn}
                        </h3>
                        <p className='text-xs text-gray-400 mt-0.5'>
                          প্রতি {product.unit}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-end justify-between pt-3 border-t border-gray-50'>
                      <div>
                        <p className='text-[11px] text-gray-400 font-medium'>
                          আজকের দাম
                        </p>
                        <p className='text-lg font-bold text-gray-900 mt-0.5'>
                          {toBengaliNumber(product.today)} টাকা
                        </p>
                      </div>
                      <div
                        className={`text-xs font-semibold flex items-center gap-1 ${changeColor}`}
                      >
                        <span>{changeSign}</span>
                        <span>{changePct}%</span>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}