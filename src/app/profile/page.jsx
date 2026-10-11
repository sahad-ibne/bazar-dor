'use client'
import React, { useState } from 'react'
import { Card, Button, Input, Label } from '@heroui/react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

const ProfilePage = () => {
  const router = useRouter()
  const { data: session, refetch } = authClient.useSession()
  
  // Input er jonno local state, jeta session theke initial value nibe
  const [name, setName] = useState(session?.user?.name || '')

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in')
        }
      }
    })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    const { data, error } = await authClient.updateUser({
      name: name,
    })
    
    if (!error) {
      refetch()
    }
  }

  // Display nam ba initial ber korar jonno
  const currentName = session?.user?.name || ''
  const userInitial = currentName ? currentName.charAt(0).toUpperCase() : 'U'

  return (
    <div className="min-h-screen bg-[#f3f6f3] flex flex-col items-center justify-start pt-12 p-4">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">আমার প্রোফাইল</h1>
          <p className="text-xs text-gray-500 mt-1">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
        </div>

        <Card className="w-full bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
          <div className="flex flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#008a4b] text-white flex items-center justify-center text-xl font-bold">
                {userInitial}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-tight">
                  {currentName || 'User Name'}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {session?.user?.email || 'user@example.com'}
                </p>
              </div>
            </div>

            <Button
              onClick={handleSignOut}
              variant="bordered"
              className="border-red-200 text-red-500 hover:bg-red-50 font-medium text-sm rounded-lg px-4 py-2 flex items-center gap-1.5"
            >
              <span>↩</span> সাইন আউট
            </Button>
          </div>
        </Card>

        <Card className="w-full bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-gray-900">তথ্য</h3>

            <form onSubmit={handleUpdate} className="flex flex-col gap-4 mt-1">
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-gray-700">নাম</Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="আপনার নাম লিখুন"
                  className="w-full bg-white border border-gray-200 rounded-lg"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#008a4b] hover:bg-[#00753f] text-white font-medium text-sm rounded-lg py-3 mt-2"
              >
                আপডেট
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ProfilePage