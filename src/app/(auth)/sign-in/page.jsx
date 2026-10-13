'use client'
import React, { Suspense } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
  Card
} from '@heroui/react'
import { authClient } from '@/lib/auth-client'

const SignInLoading = () => (
  <div className="min-h-screen bg-[#f3f6f3] flex flex-col items-center justify-center p-4 animate-pulse">
    <div className="flex flex-col items-center gap-2 text-center pb-6">
      <div className="h-8 bg-gray-200 rounded-lg w-28" />
      <div className="h-3.5 bg-gray-100 rounded-lg w-64" />
    </div>
    <div className="w-full max-w-md p-6 bg-white shadow-sm border border-gray-100 rounded-2xl space-y-5">

      <div className="space-y-2">
        <div className="h-3.5 bg-gray-200 rounded w-12" />
        <div className="h-11 bg-gray-100 rounded-xl w-full" />
      </div>
      <div className="space-y-2">
        <div className="h-3.5 bg-gray-200 rounded w-16" />
        <div className="h-11 bg-gray-100 rounded-xl w-full" />
      </div>
      <div className="h-12 bg-gray-200 rounded-xl w-full mt-2" />
      <div className="relative flex items-center justify-center my-2">
        <div className="border-t border-gray-100 w-full" />
        <div className="bg-white px-3 w-10 h-3 bg-gray-100 rounded absolute" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-12 bg-gray-100 rounded-xl w-full" />
        <div className="h-12 bg-gray-100 rounded-xl w-full" />
      </div>
      <div className="flex justify-center pt-2">
        <div className="h-3.5 bg-gray-100 rounded w-36" />
      </div>
    </div>
    <div className="mt-6">
      <div className="h-3.5 bg-gray-200 rounded w-32" />
    </div>
  </div>
);

const SignInContent = () => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

const onSubmit = async e => {
  e.preventDefault()

  const formData = new FormData(e.currentTarget)
  const data = {}

  formData.forEach((value, key) => {
    data[key] = value.toString()
  })

  const loadingToast = toast.loading('সাইন ইন হচ্ছে...')

  try {
    const { data: signInData, error } =
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: true,
        callbackURL: callbackUrl
      })

    if (error) {
      toast.dismiss(loadingToast)
      toast.error(
        error.message || 'সাইন ইন ব্যর্থ হয়েছে!',
        { id: 'signin-error' }
      )
      return
    }

    toast.dismiss(loadingToast)
    toast.success('সফলভাবে সাইন ইন হয়েছে!')
  } catch (err) {
    toast.dismiss(loadingToast)
    toast.error('একটি সমস্যা হয়েছে। আবার চেষ্টা করুন!')
    console.error('Sign-in error:', err)
  }
}

  const GsignIn = async () => {
    const { error } = await authClient.signIn.social({
      provider: 'google',
      callbackURL: callbackUrl
    })
  }

  const GHsignIn = async () => {
    const { error } = await authClient.signIn.social({
      provider: 'github',
      callbackURL: callbackUrl
    })
  }

  return (
    <div className='min-h-screen bg-[#f3f6f3] flex flex-col items-center justify-center p-4'>
      <div className='flex flex-col items-center gap-1 text-center pb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>
          সাইন ইন
        </h1>

        <p className='text-xs text-gray-500'>
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
        </p>
      </div>

      <Card className='w-full max-w-md p-6 bg-white shadow-sm border-none rounded-2xl'>
        <Form className='flex w-full flex-col gap-4' onSubmit={onSubmit}>
          <TextField
            isRequired
            name='email'
            type='email'
            validate={value => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return 'Please enter a valid email address'
              }

              return null
            }}
          >
            <Label className='text-sm font-semibold text-gray-700'>
              ইমেইল
            </Label>

            <Input
              name='email'
              type='email'
              placeholder='you@example.com'
              className='w-full'
            />

            <FieldError className='text-xs text-red-500 mt-1' />
          </TextField>

          <TextField
            isRequired
            name='password'
            type='password'
            minLength={8}
            validate={value => {
              if (value.length < 8) {
                return 'Password must be at least 8 characters'
              }

              if (!/[A-Z]/.test(value)) {
                return 'Password must contain at least one uppercase letter'
              }

              if (!/[0-9]/.test(value)) {
                return 'Password must contain at least one number'
              }

              return null
            }}
          >
            <Label className='text-sm font-semibold text-gray-700'>
              পাসওয়ার্ড
            </Label>

            <Input
              name='password'
              type='password'
              placeholder='কমপক্ষে ৮ অক্ষর'
              className='w-full'
            />

            <FieldError className='text-xs text-red-500 mt-1' />
          </TextField>

          <div className='flex flex-col gap-2 mt-2'>
            <Button
              type='submit'
              className='w-full bg-[#008a4b] hover:bg-[#00753f] text-white font-medium text-base rounded-md py-6'
            >
              সাইন ইন
            </Button>
          </div>

          <div className='relative flex items-center justify-center my-2'>
            <div className='border-t border-gray-200 w-full'></div>

            <span className='bg-white px-3 text-xs text-gray-400 absolute'>
              অথবা
            </span>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <Button
              type='button'
              onClick={GsignIn}
              variant='flat'
              className='w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-xs rounded-xl py-5 flex items-center justify-center gap-2'
            >
              <FcGoogle className='w-4 h-4' />
              Google দিয়ে চালিয়ে যান
            </Button>

            <Button
              type='button'
              onClick={GHsignIn}
              variant='flat'
              className='w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-xs rounded-xl py-5 flex items-center justify-center gap-2'
            >
              <FaGithub className='w-4 h-4 text-gray-900' />
              GitHub দিয়ে চালিয়ে যান
            </Button>
          </div>

          <div className='text-center text-xs text-gray-500 mt-2'>
            অ্যাকাউন্ট নেই?{' '}

            <Link
              href='/sign-up'
              className='text-[#008a4b] font-semibold hover:underline'
            >
              সাইন আপ করুন
            </Link>
          </div>
        </Form>
      </Card>

      <Link
        href='/'
        className='mt-6 text-xs text-gray-500 hover:text-gray-700'
      >
        ← হোম পেজে ফিরে যান
      </Link>
    </div>
  )
}
export default function SignInPage() {
  return (
    <Suspense fallback={<SignInLoading />}>
      <SignInContent />
    </Suspense>
  )
}
