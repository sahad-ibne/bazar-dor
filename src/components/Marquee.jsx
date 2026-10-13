import React, { Suspense } from 'react'
import MarqueeText from 'react-marquee-text'
import 'react-marquee-text/dist/styles.css'

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
const MarqueeContent = async () => {
  let products = [];

  try {
    const res = await fetch(
      'https://openapi.programming-hero.com/api/bazardor/products'
    );

    if (res.ok) {
      products = await res.json();
    }
  } catch (error) {
    console.error('Marquee fetch error:', error);
  }

    return (
    <div className='w-full bg-[#f8faf8] border-y border-gray-100 py-2.5 overflow-hidden text-xs'>
      <MarqueeText
        duration={10}
        direction='right'
        pauseOnHover={false}
        playOnlyInView={false}
      >
        <div className='flex items-center gap-6 pr-6'>
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
              const unitBn = getBengaliUnit(product.unit)

              return (
                <div
                  key={product.id}
                  className='flex items-center gap-2 whitespace-nowrap font-medium text-gray-800 border-r border-gray-200/60 pr-6'
                >
                  <span className='text-sm'>{product.image || '🛒'}</span>
                  <span className='font-bold text-gray-900'>
                    {product.nameBn}
                  </span>
                  <span className='text-gray-600'>
                    {toBengaliNumber(product.today)} টাকা/{unitBn}
                  </span>
                  <span
                    className={`flex items-center gap-0.5 font-semibold ${changeColor}`}
                  >
                    <span>{changeSign}</span>
                    <span>{changePct}%</span>
                  </span>
                </div>
              )
            })}
        </div>
      </MarqueeText>
    </div>
  )
};

const Marquee = () => (
  <Suspense
   fallback={<div className="w-full h-10 bg-[#f8faf8]" />}>
    <MarqueeContent />
  </Suspense>
);

export default Marquee;