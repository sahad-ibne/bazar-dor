'use client'

import { use, useEffect, useState, useMemo } from 'react'
import baseUrl from '@/bazar/baseUrl'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'

const toBengaliNumber = num => {
  if (num === undefined || num === null) return ''
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
  return String(num).replace(/\d/g, digit => bengaliDigits[Number(digit)])
}

const getBengaliUnit = unit => {
  if (!unit) return 'কেজি'
  const u = String(unit).toLowerCase().trim()
  if (u === 'kg' || u === 'কেজি') return 'কেজি'
  if (u === 'litre' || u === 'liter' || u === 'লিটার') return 'লিটার'
  if (u === 'dozen' || u === 'ডজন') return 'ডজন'
  if (u === 'pcs' || u === 'piece' || u === 'পিস') return 'পিস'
  if (u === 'gm' || u === 'gram' || u === 'গ্রাম') return 'গ্রাম'
  return unit
}

const getPrice = product => {
  const price = Number(product?.today)
  return Number.isFinite(price) ? price : 0
}
const CategoryLoading = () => (
  <div className='min-h-screen bg-[#f3f6f3] py-8'>
    <div className='max-w-5xl mx-auto px-6 flex flex-col gap-6 animate-pulse'>
      <div className='bg-white rounded-2xl p-6 border border-gray-100 flex items-center gap-4'>
        <div className='w-14 h-14 rounded-2xl bg-gray-200' />
        <div className='flex-1 space-y-2'>
          <div className='h-5 bg-gray-200 rounded w-32' />
          <div className='h-3 bg-gray-100 rounded w-48' />
        </div>
      </div>

      <div className='h-10 bg-gray-200 rounded-xl w-full md:w-64' />

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {[1, 2, 3, 4, 5, 6].map(item => (
          <div key={item} className='bg-white p-5 rounded-2xl border border-gray-100 space-y-5'>
            <div className='flex items-center gap-3'>
              <div className='w-11 h-11 bg-gray-200 rounded-xl' />
              <div className='flex-1 space-y-2'>
                <div className='h-4 bg-gray-200 rounded w-24' />
                <div className='h-3 bg-gray-100 rounded w-16' />
              </div>
            </div>
            <div className='border-t border-gray-100 pt-4 flex justify-between'>
              <div className='space-y-2'>
                <div className='h-3 bg-gray-100 rounded w-16' />
                <div className='h-5 bg-gray-200 rounded w-24' />
              </div>
              <div className='h-4 bg-gray-100 rounded w-12' />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default function CategoryProduct({ params }) {
  const { categorySlug } = use(params)
  const [categoryProducts, setCategoryProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('default')
  const { data: session } = authClient.useSession()

  useEffect(() => {
    if (!categorySlug) return

    const loadProducts = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${baseUrl}/products?category=${encodeURIComponent(categorySlug)}`)
        const data = await res.json()
        setCategoryProducts(Array.isArray(data) ? data : data?.products || [])
      } catch (err) {
        console.error('Failed to fetch:', err)
        setCategoryProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [categorySlug])

  const sortedProducts = useMemo(() => {
    const products = [...categoryProducts]

    if (sort === 'price-asc') {
      products.sort((a, b) => getPrice(a) - getPrice(b))
    } else if (sort === 'price-desc') {
      products.sort((a, b) => getPrice(b) - getPrice(a))
    }

    return products
  }, [categoryProducts, sort])

  if (loading) {
    return <CategoryLoading />
  }

  if (categoryProducts.length === 0) {
    return (
      <div className='min-h-[70vh] bg-[#f3f6f3] flex items-center justify-center py-12 px-6'>
        <div className='bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 text-center max-w-md w-full flex flex-col items-center gap-4'>
          <div className='w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-2xl'>
            🔍
          </div>
          <h2 className='text-xl font-bold text-gray-900'>কোনো পণ্য পাওয়া যায়নি</h2>
          <Link
            href='/'
            className='mt-2 inline-flex items-center justify-center bg-[#008a4b] hover:bg-[#00753f] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm'
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    )
  }

  const firstProduct = categoryProducts[0]
  const categoryNameBn = firstProduct?.categoryNameBn || categorySlug
  const categoryIcon = firstProduct?.categoryIcon || '📦'

  return (
    <div className='min-h-screen bg-[#f3f6f3] py-8'>
      <div className='max-w-5xl mx-auto px-6 flex flex-col gap-6'>
        <div className='bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4'>
          <div className='w-14 h-14 rounded-2xl bg-[#f0fdf4] text-2xl flex items-center justify-center'>
            {categoryIcon}
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-900'>{categoryNameBn}</h1>
            <p className='text-xs text-gray-500 mt-0.5'>
              {toBengaliNumber(categoryProducts.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </div>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
          <p className='text-sm text-gray-500 font-medium'>
            মোট {toBengaliNumber(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে
          </p>

          <div className='flex items-center gap-2'>
            <label htmlFor='sort' className='text-sm text-gray-600 whitespace-nowrap font-medium'>
              সাজান:
            </label>
            <div className='relative'>
              <select
                id='sort'
                value={sort}
                onChange={event => setSort(event.target.value)}
                className='w-full sm:w-auto rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 pr-8 text-sm text-gray-700 outline-none focus:border-[#008a4b] focus:ring-2 focus:ring-green-100 cursor-pointer appearance-none'
              >
                <option value='default'>ডিফল্ট</option>
                <option value='price-asc'>দাম: কম থেকে বেশি</option>
                <option value='price-desc'>দাম: বেশি থেকে কম</option>
              </select>
              <span className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs'>
                ▼
              </span>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {sortedProducts.map((product) => {
            const isUp = product?.change?.dir === 'up'
            const isDown = product?.change?.dir === 'down'
            const changeColor = isUp ? 'text-red-500' : isDown ? 'text-green-600' : 'text-gray-500'
            const changeSign = isUp ? '▲' : isDown ? '▼' : '—'
            const changePct = toBengaliNumber(product?.change?.pct ?? 0)
            const unitBn = getBengaliUnit(product.unit)
            const targetLink = session?.user 
              ? `/product/${product.slug || product.id}` 
              : `/sign-in?callbackUrl=/product/${product.slug || product.id}`

            return (
              <Link
                href={targetLink}
                key={product.id || product.slug}
                className='h-full'
              >
                <div className='bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between gap-4 hover:shadow-md transition-shadow cursor-pointer h-full'>
                  <div className='flex items-start gap-3'>
                    <div className='w-11 h-11 rounded-xl bg-[#f9fafb] border border-gray-100 flex items-center justify-center text-xl shrink-0'>
                      {product.image || '🛒'}
                    </div>
                    <div>
                      <h2 className='font-bold text-base text-gray-900 leading-snug'>
                        {product.nameBn}
                      </h2>
                      <p className='text-xs text-gray-400 mt-0.5'>
                        প্রতি {unitBn}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-end justify-between pt-3 border-t border-gray-50'>
                    <div>
                      <p className='text-[11px] text-gray-400 font-medium'>আজকের দাম</p>
                      <p className='text-lg font-bold text-gray-900 mt-0.5'>
                        {toBengaliNumber(product.today)} টাকা
                      </p>
                    </div>
                    <div className={`text-xs font-semibold flex items-center gap-1 ${changeColor}`}>
                      <span>{changeSign}</span>
                      <span>{changePct}%</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

      </div>
    </div>
  )
}