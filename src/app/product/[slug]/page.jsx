import baseUrl from '@/bazar/baseUrl'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const toBengaliNumber = num => {
  if (num === undefined || num === null) return ''
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
  return num
    .toString()
    .replace(/\./g, '.')
    .replace(/\d/g, x => bengaliDigits[englishDigits.indexOf(x)] ?? x)
}

const getBengaliUnit = unit => {
  if (!unit) return 'কেজি'
  const u = unit.toLowerCase().trim()
  if (u === 'kg' || u === 'কেজি') return 'কেজি'
  if (u === 'litre' || u === 'liter' || u === 'লিটার') return 'লিটার'
  if (u === 'dozen' || u === 'ডজন') return 'ডজন'
  if (u === 'pcs' || u === 'piece' || u === 'পিস') return 'পিস'
  if (u === 'gm' || u === 'gram' || u === 'গ্রাম') return 'গ্রাম'
  return unit
}

const getProductDetail = async slug => {
  const res = await fetch(`${baseUrl}/products`)
  if (!res.ok) return null
  const products = await res.json()

  if (Array.isArray(products)) {
    const found = products.find(
      p => p.slug === slug || p.id.toString() === slug
    )
    return found || null
  }
  return null
}

export default async function ProductDetailPage ({ params }) {
  const { slug } = await params
  const product = await getProductDetail(slug)

  if (!product) {
    notFound()
  }

  const markets = product.markets || []
  const unitBn = getBengaliUnit(product.unit)

  const minPrices = markets.map(m => m.min).filter(Boolean)
  const maxPrices = markets.map(m => m.max).filter(Boolean)

  const overallMin = minPrices.length ? Math.min(...minPrices) : product.today
  const overallMax = maxPrices.length ? Math.max(...maxPrices) : product.today

  let totalAvgSum = 0
  markets.forEach(m => {
    const rowAvg = (m.min + m.max) / 2
    totalAvgSum += rowAvg
  })

  const overallAvg =
    markets.length > 0
      ? Number((totalAvgSum / markets.length).toFixed(1))
      : product.today

  const minMarketObj = markets.find(m => m.min === overallMin)
  const maxMarketObj = markets.find(m => m.max === overallMax)

  const isUp = product?.change?.dir === 'up'
  const isDown = product?.change?.dir === 'down'
  const changeColor = isUp
    ? 'text-red-500'
    : isDown
    ? 'text-green-600'
    : 'text-gray-500'
  const changeSign = isUp ? '▲' : isDown ? '▼' : '—'
  const priceDiff = Math.abs((product.today || 0) - (product.yesterday || 0))

  return (
    <div className='min-h-screen bg-[#f0f5f0] py-5 md:py-6'>
      <div className='max-w-5xl mx-auto px-4 md:px-6 flex flex-col gap-4'>
        <div className='flex items-center gap-2 text-[11px] text-gray-500'>
          <Link href='/' className='hover:text-[#008a4b]'>
            হোম
          </Link>
          <span>›</span>
          <Link
            href={`/category/${product.category}`}
            className='hover:text-[#008a4b]'
          >
            {product.categoryNameBn || product.category}
          </Link>
          <span>›</span>
          <span className='text-gray-700 font-medium'>{product.nameBn}</span>
        </div>

        <div className='bg-white rounded-xl p-4 md:p-5 border border-[#e5ebe5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 rounded-xl bg-[#f3f6f3] border border-gray-100 flex items-center justify-center text-2xl shrink-0'>
              {product.image || '🛒'}
            </div>
            <div className='flex flex-col gap-1'>
              <h1 className='text-lg md:text-xl font-bold text-[#26332b]'>
                {product.nameBn}
              </h1>
              <p className='text-[10px] text-gray-500'>
                প্রতি {unitBn} · {product.categoryNameBn || product.category}
              </p>
              <p className='text-[10px] text-gray-500 mt-0.5'>
                গতকালকের তুলনায় আজ দাম{' '}
                {isUp ? 'বেড়েছে' : isDown ? 'কমেছে' : 'একই আছে'}{' '}
                {toBengaliNumber(priceDiff)} টাকা
              </p>
            </div>
          </div>

          <div className='bg-[#f2f6f2] border border-[#edf1ed] rounded-xl px-4 py-3 flex flex-col items-center justify-center shrink-0 min-w-[90px] md:min-w-[105px]'>
            <span className='text-[10px] text-gray-500 font-medium'>
              আজকের দাম
            </span>
            <div className='text-2xl font-extrabold text-[#26332b] leading-tight my-0.5'>
              {toBengaliNumber(product.today)}
            </div>
            <span className='text-[10px] text-gray-400'>টাকা / {unitBn}</span>
            <div
              className={`text-[10px] font-semibold flex items-center gap-1 mt-1 ${changeColor}`}
            >
              <span>{changeSign}</span>
              <span>{toBengaliNumber(product?.change?.pct ?? 0)}%</span>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-xl p-3 md:p-4 border border-[#e5ebe5] shadow-sm flex flex-col gap-3'>
          <h2 className='text-sm font-bold text-[#344138]'>দামের সারসংক্ষেপ</h2>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2'>
            <div className='bg-[#fbfdfb] border border-[#e7eee7] rounded-xl p-3 flex flex-col justify-between min-h-[60px]'>
              <span className='text-[10px] text-gray-500 font-medium'>
                সর্বনিম্ন দাম
              </span>
              <div className='text-base font-bold text-[#16a34a] my-0.5'>
                {toBengaliNumber(overallMin)} টাকা
              </div>
              <span className='text-[9px] text-gray-500'>
                {minMarketObj
                  ? `${minMarketObj.market} এর বাজার`
                  : 'সবচেয়ে কম দামের বাজার'}
              </span>
            </div>

            <div className='bg-[#fbfdfb] border border-[#e7eee7] rounded-xl p-3 flex flex-col justify-between min-h-[60px]'>
              <span className='text-[10px] text-gray-500 font-medium'>
                সর্বোচ্চ দাম
              </span>
              <div className='text-base font-bold text-[#ef4444] my-0.5'>
                {toBengaliNumber(overallMax)} টাকা
              </div>
              <span className='text-[9px] text-gray-500'>
                {maxMarketObj
                  ? `${maxMarketObj.market} এর বাজার`
                  : 'সবচেয়ে বেশি দামের বাজার'}
              </span>
            </div>

            <div className='bg-[#fbfdfb] border border-[#e7eee7] rounded-xl p-3 flex flex-col justify-between min-h-[60px]'>
              <span className='text-[10px] text-gray-500 font-medium'>
                গড় দাম
              </span>
              <div className='text-base font-bold text-[#16a34a] my-0.5'>
                {toBengaliNumber(overallAvg)} টাকা
              </div>
              <span className='text-[9px] text-gray-500'>
                প্রতি {unitBn}-এর হিসাবে
              </span>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-xl p-3 md:p-4 border border-[#e5ebe5] shadow-sm flex flex-col gap-3'>
          <h2 className='text-sm font-bold text-[#344138]'>
            বাজারভিত্তিক আজকের দাম
          </h2>

          <div className='overflow-x-auto rounded-xl border border-[#e7ece7]'>
            <table className='w-full min-w-[570px] text-left text-[10px] border-collapse'>
              <thead>
                <tr className='bg-[#fbfdfb] border-b border-[#edf0ed] text-gray-500 font-semibold'>
                  <th className='py-2.5 px-3'>বাজার</th>
                  <th className='py-2.5 px-3'>বিভাগ</th>
                  <th className='py-2.5 px-3'>সর্বনিম্ন</th>
                  <th className='py-2.5 px-3'>সর্বোচ্চ</th>
                  <th className='py-2.5 px-3 text-right'>গড়</th>
                </tr>
              </thead>

              <tbody className='divide-y divide-[#e5eae5]'>
                {markets.map((m, idx) => {
                  const exactAvg = (m.min + m.max) / 2
                  const formattedAvg = Number.isInteger(exactAvg)
                    ? exactAvg
                    : exactAvg.toFixed(2)
                  const isEven = idx % 2 === 0

                  return (
                    <tr
                      key={idx}
                      className={`transition-colors ${
                        isEven ? 'bg-[#fbfdfb]' : 'bg-[#f0f4f0]'
                      }`}
                    >
                      <td className='py-2.5 px-3 font-semibold text-gray-700 whitespace-nowrap'>
                        {m.market}
                      </td>
                      <td className='py-2.5 px-3 text-gray-500 whitespace-nowrap'>
                        {m.division}
                      </td>
                      <td className='py-2.5 px-3 font-medium text-gray-700 whitespace-nowrap'>
                        {toBengaliNumber(m.min)} টাকা
                      </td>
                      <td className='py-2.5 px-3 font-medium text-gray-700 whitespace-nowrap'>
                        {toBengaliNumber(m.max)} টাকা
                      </td>
                      <td className='py-2.5 px-3 font-semibold text-gray-800 text-right whitespace-nowrap'>
                        {toBengaliNumber(formattedAvg)} টাকা
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className='pt-2'>
          <Link href={`/category/${product.category}`}>
            <button className='bg-[#e2e8f0]/70 hover:bg-[#cbd5e1] text-gray-800 font-bold text-xs rounded-xl px-4 py-2.5 shadow-sm transition-all flex items-center gap-2 border border-gray-200/80'>
              <span>{product.categoryIcon || '🥬'}</span>
              <span>সব {product.categoryNameBn || product.category}</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
