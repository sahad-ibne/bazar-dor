'use client'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import React from 'react'
import { useRouter } from 'next/navigation'
import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
  Card
} from '@heroui/react'
import { authClient } from '@/lib/auth-client'
import Link from 'next/link'

const SignUpPage = () => {
  const router = useRouter()

  const onSubmit = async e => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {}
    formData.forEach((value, key) => {
      data[key] = value.toString()
    })

    if (data.password !== data.confirmPassword) return

    const { data: signUpData, error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      callbackURL: '/'
    })

    if (!error && signUpData) {
      router.push('/')
    }
  }

  const GsignIn = async () => {
    await authClient.signIn.social({
      provider: 'google'
    })
  }

  const GHsignIn = async () => {
    await authClient.signIn.social({
      provider: 'github'
    })
  }

  return (
    <div className='min-h-screen bg-[#f3f6f3] flex flex-col items-center justify-center p-4'>
      <div className='flex flex-col items-center gap-1 text-center pb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>
          অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className='text-xs text-gray-500'>
          বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>
      </div>
      <Card className='w-full max-w-md p-6 bg-white shadow-sm border-none rounded-2xl'>
        <Form className='flex w-full flex-col gap-4' onSubmit={onSubmit}>
          <TextField
            isRequired
            name='name'
            validate={value => {
              if (value.length < 3) {
                return 'Name must be at least 3 characters'
              }
              return null
            }}
          >
            <Label className='text-sm font-semibold text-gray-700'>নাম</Label>
            <Input placeholder='যেমন: রহিম উদ্দিন' className='w-full' />
            <FieldError className='text-xs text-red-500 mt-1' />
          </TextField>
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
            <Label className='text-sm font-semibold text-gray-700'>ইমেইল</Label>
            <Input placeholder='you@example.com' className='w-full' />
            <FieldError className='text-xs text-red-500 mt-1' />
          </TextField>
          <TextField
            isRequired
            minLength={8}
            name='password'
            type='password'
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
            <Input placeholder='কমপক্ষে ৮ অক্ষর' className='w-full' />
            <FieldError className='text-xs text-red-500 mt-1' />
          </TextField>
          <TextField
            isRequired
            minLength={8}
            name='confirmPassword'
            type='password'
          >
            <Label className='text-sm font-semibold text-gray-700'>
              পাসওয়ার্ড নিশ্চিত করুন
            </Label>
            <Input placeholder='আবার লিখুন' className='w-full' />
            <FieldError className='text-xs text-red-500 mt-1' />
          </TextField>
          <div className='flex flex-col gap-2 mt-2'>
            <Button
              type='submit'
              className='w-full bg-[#008a4b] hover:bg-[#00753f] text-white font-medium text-base rounded-md py-6'
            >
              অ্যাকাউন্ট তৈরি করুন
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
            অ্যাকাউন্ট আছে?{' '}
            <Link
              href='/sign-in'
              className='text-[#008a4b] font-semibold hover:underline'
            >
              সাইন ইন করুন
            </Link>
          </div>
        </Form>
      </Card>
      <Link href='/sign-in' className='mt-6 text-xs text-gray-500 hover:text-gray-700'>
        ← হোম পেজে ফিরে যান
      </Link>
    </div>
  )
}

export default SignUpPage
