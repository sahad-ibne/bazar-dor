'use client'

import React, { useEffect, useState } from 'react'
import { Card, Button, Input, Label } from '@heroui/react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'



import toast from 'react-hot-toast'


const ProfileLoading = () => (
  <div className="min-h-screen bg-[#f3f6f3] py-12 px-6 flex items-center justify-center">
    <div className="bg-white p-8 rounded-3xl border border-gray-100 max-w-md w-full animate-pulse space-y-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-gray-200 rounded w-32" />
          <div className="h-3 bg-gray-100 rounded w-48" />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div className="space-y-1.5">
          <div className="h-3 bg-gray-100 rounded w-16" />
          <div className="h-11 bg-gray-200 rounded-xl w-full" />
        </div>
      </div>

      <div className="h-12 bg-gray-200 rounded-xl w-full" />
    </div>
  </div>
)

const ProfilePage = () => {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const [name, setName] = useState('')
  const [updating, setUpdating] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name)
    }
  }, [session?.user?.name])

  if (isPending) {
    return <ProfileLoading />
  }

  if (!session?.user) {
    router.replace('/sign-in')
    return <ProfileLoading />
  }

  const userInitial = session.user.name
    ? session.user.name.charAt(0).toUpperCase()
    : 'U'
 const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success('সফলভাবে সাইন আউট করা হয়েছে!')
            router.replace('/sign-in')
          },
        },
      })
    } catch (error) {
      toast.error('সাইন আউট করা যায়নি। আবার চেষ্টা করুন।')
    }
  }
  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setErrorMessage('নাম খালি রাখা যাবে না।')
      setMessage('')
      return
    }

    setUpdating(true)
    setMessage('')
    setErrorMessage('')

    const { error } = await authClient.updateUser({ name: name.trim() })

    if (error) {
      setErrorMessage(error.message || 'নাম আপডেট করা যায়নি।')
    } else {
      setMessage('আপনার নাম সফলভাবে আপডেট হয়েছে!')
    }

    setUpdating(false)
  }

  return (
    <div className="min-h-screen bg-[#f3f6f3] flex flex-col items-center justify-start pt-12 p-4">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            আমার প্রোফাইল
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>
        <Card className="w-full bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
          <div className="flex flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-14 h-14 rounded-full bg-[#008a4b] text-white flex items-center justify-center text-xl font-bold shrink-0">
                {userInitial}
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-bold text-gray-900 leading-tight">
                  {session.user.name || 'User Name'}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5 break-all">
                  {session.user.email}
                </p>
              </div>
            </div>

            <Button
              onPress={handleSignOut}
              variant="bordered"
              className="border-red-200 text-red-500 hover:bg-red-50 font-medium text-sm rounded-lg px-4 py-2 shrink-0 cursor-pointer"
            >
              ↩ সাইন আউট
            </Button>
          </div>
        </Card>
        <Card className="w-full bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-gray-900">
              তথ্য
            </h3>

            <form onSubmit={handleUpdate} className="flex flex-col gap-4 mt-1">
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-gray-700">
                  নাম
                </Label>

                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="আপনার নাম লিখুন"
                  className="w-full bg-white border border-gray-200 rounded-lg"
                />
              </div>

              {message && (
                <p className="text-xs text-green-600 font-medium">{message}</p>
              )}

              {errorMessage && (
                <p className="text-xs text-red-500 font-medium">{errorMessage}</p>
              )}

              <Button
                type="submit"
                isLoading={updating}
                className="w-full bg-[#008a4b] hover:bg-[#00753f] text-white font-medium text-sm rounded-lg py-3 mt-2 cursor-pointer"
              >
                {updating ? 'আপডেট হচ্ছে...' : 'আপডেট'}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ProfilePage