'use client'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@heroui/react'
import { authClient } from '@/lib/auth-client'
import { useRouter, usePathname } from 'next/navigation'
import baseUrl from '@/bazar/baseUrl'
import Link from 'next/link'

export default function NavBar () {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = authClient.useSession()
  const [categories, setCategories] = useState([])

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in')
        }
      }
    })
  }

  const userInitial = session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U';

  useEffect(() => {
    fetch(`${baseUrl}/categories`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data)
        }
      })
      .catch(err => console.log(err))
  }, [])

  return (
    <nav className='sticky top-0 z-40 w-full border-b border-gray-200 bg-white shadow-sm'>
      <div className='mx-auto max-w-5xl px-6'>
        <header className='flex h-20 items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-3'>
              <Link href='/' className='flex items-center gap-3 text-decoration-none'>
                <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-[#008a4b] text-white shadow-sm text-xl'>
                  🛒
                </div>
                <div className='flex flex-col'>
                  <span className='text-xl font-bold text-gray-900 leading-tight'>বাজার দর</span>
                  <span className='text-xs text-gray-500 font-medium'>সোমবার, ৬ অক্টোবর, ২০২৬</span>
                </div>
              </Link>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            {session?.user ? (
              <div className='relative' ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className='flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-[#008a4b] focus:outline-none py-1.5 px-2 rounded-lg'
                >
                  <div className='w-9 h-9 rounded-full bg-[#008a4b] text-white flex items-center justify-center font-bold text-sm shadow-sm'>
                    {userInitial}
                  </div>
                  <span>{session.user.name}</span>
                </button>
                {isDropdownOpen && (
                  <div className='absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 px-4 z-50'>
                    <div className='pb-3 border-b border-gray-100'>
                      <p className='text-sm font-bold text-gray-900'>{session.user.name}</p>
                      <p className='text-xs text-gray-500 truncate'>{session.user.email}</p>
                    </div>
                    
                    <div className='py-2 flex flex-col gap-1'>
                      <Link 
                        href='/profile' 
                        onClick={() => setIsDropdownOpen(false)}
                        className='flex items-center gap-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 p-2 rounded-lg transition-colors'
                      >
                        <span className='text-base'>👤</span> আমার প্রোফাইল
                      </Link>
                      
                      <button 
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleSignOut();
                        }}
                        className='flex items-center gap-2.5 text-sm font-medium text-red-600 hover:bg-red-50 p-2 rounded-lg w-full text-left transition-colors'
                      >
                        <span className='text-base'>↩</span> সাইন আউট
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className='flex items-center gap-4'>
                <Link href='/sign-in' className='text-sm font-semibold text-gray-800 hover:text-[#008a4b] px-3 py-2'>
                  সাইন ইন
                </Link>
                <Link href='/sign-up'>
                  <Button className='bg-[#008a4b] hover:bg-[#00753f] text-white font-medium text-sm rounded-xl px-5 py-2.5 shadow-sm'>
                    সাইন আপ
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </header>

        <div className='flex items-center gap-6 pb-4 overflow-x-auto scrollbar-hide'>
          {categories.map(cat => {
            const isActive = pathname === `/category/${cat?.slug}`
            return (
              <Link 
                key={cat.id} 
                href={`/category/${cat?.slug}`} 
                className={`flex items-center gap-2 text-sm whitespace-nowrap font-medium px-4 py-2 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-[#008a4b] text-white shadow-sm' 
                    : 'text-gray-700 hover:text-[#008a4b] hover:bg-gray-50'
                }`}
              >
                <span className='text-base'>{cat.icon}</span>
                <span>{cat.nameBn}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}