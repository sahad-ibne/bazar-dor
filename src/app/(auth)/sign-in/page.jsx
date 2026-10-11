'use client'
import React from 'react'
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

const SignInPage = () => {
  const onSubmit = async(e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {}
    formData.forEach((value, key) => {
      data[key] = value.toString()
    });

    const { data:signInData, error } = await authClient.signIn.email({
      email: data.email, 
      password: data.password, 
      rememberMe: true, 
      callbackURL: "/",
    });
  }

  return (
    <div className="min-h-screen bg-[#f3f6f3] flex flex-col items-center justify-center p-4">

      <div className="flex flex-col items-center gap-1 text-center pb-6">
        <h1 className="text-2xl font-bold text-gray-900">সাইন ইন</h1>
        <p className="text-xs text-gray-500">বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।</p>
      </div>

      <Card className="w-full max-w-md p-6 bg-white shadow-sm border-none rounded-2xl">
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
            <Label className="text-sm font-semibold text-gray-700">ইমেইল</Label>
            <Input placeholder='you@example.com' className='w-full' />
            <FieldError className="text-xs text-red-500 mt-1" />
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
            <Label className="text-sm font-semibold text-gray-700">পাসওয়ার্ড</Label>
            <Input placeholder='কমপক্ষে ৮ অক্ষর' className='w-full' />
            <FieldError className="text-xs text-red-500 mt-1" />
          </TextField>

          <div className='flex flex-col gap-2 mt-4'>
            <Button 
              type='submit'
              className="w-full bg-[#008a4b] hover:bg-[#00753f] text-white font-medium text-base rounded-md py-6"
            >
              সাইন ইন
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}
export default SignInPage