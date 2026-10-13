import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f3f6f3] flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center flex flex-col items-center gap-6">
        
        {/* ৪১০ বা 404 আইকন/ইমেজ */}
        <div className="w-24 h-24 bg-[#fef2f2] rounded-3xl flex items-center justify-center text-4xl shadow-inner">
          🛒
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900">
            পৃষ্ঠাটি পাওয়া যায়নি!
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            আপনি যে পণ্য বা ক্যাটাগরি খুঁজছেন তা হয়তো মুছে ফেলা হয়েছে অথবা লিংকটি ভুল রয়েছে।
          </p>
        </div>

        <div className="pt-2 w-full">
          <Link href="/">
            <button className="w-full bg-[#008a4b] hover:bg-[#00753f] text-white font-medium text-sm rounded-xl py-3 shadow-sm transition-all cursor-pointer">
              হোম পেজে ফিরে যান
            </button>
          </Link>
        </div>

      </div>
    </div>
  )
}