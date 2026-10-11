'use client'
import { useState, useRef, useEffect } from 'react'
import { Link, Button } from '@heroui/react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export default function NavBar () {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const router = useRouter()
  const { data: session } = authClient.useSession()

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
  return (
    <nav className='sticky top-0 z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg'>
      <header className='mx-auto flex h-16 max-w-5xl items-center justify-between px-6'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-3'>
            <Link href='/' className='flex items-center gap-2.5 text-decoration-none'>
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-[#008a4b] text-white shadow-sm'>
                🛒
              </div>
              <div className='flex flex-col'>
                <span className='text-lg font-bold text-gray-900 leading-tight'>বাজার দর</span>
                <span className='text-[11px] text-gray-500 font-medium'>সোমবার, ১২ অক্টোবর, ২০২৬</span>
              </div>
            </Link>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          {session?.user ? (
            <div className='relative' ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className='flex items-center gap-1.5 text-sm font-semibold text-gray-800 hover:text-[#008a4b] focus:outline-none py-1.5 px-2 rounded-lg'
              >
                <div className='w-9 h-9 rounded-full bg-[#008a4b] text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-[#00753f] transition-colors'>
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
            <div className='flex items-center gap-3'>
              <Link href='/sign-in' className='text-sm font-semibold text-gray-800 hover:text-[#008a4b] px-3 py-2'>
                সাইন ইন
              </Link>
              <Link href='/sign-up'>
                <Button className='bg-[#008a4b] hover:bg-[#00753f] text-white font-medium text-sm rounded-lg px-4 py-2 shadow-sm'>
                  সাইন আপ
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>
    </nav>
  )
}