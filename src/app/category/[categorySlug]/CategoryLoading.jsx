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

export default CategoryLoading
