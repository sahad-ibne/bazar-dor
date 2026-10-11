"use client";
import React from 'react';
import {
    Button,
    FieldError,
    FieldGroup,
    Fieldset,
    Form,
    Input,
    Label,
    TextField,
} from "@heroui/react";
import { authClient } from '@/lib/auth-client';

const SignUpPage = () => {
    const onSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value.toString();
        });

        const { data: signUpData, error } = await authClient.signUp.email({
            name: data.name,
            email: data.email,
            password: data.password,
            callbackURL: "/sign-in",
        });

        console.log(signUpData, error);
    };

    return (
        <div className="min-h-screen bg-[#f3f6f3] flex items-center justify-center p-4">
            <div className="w-full max-w-md p-6 bg-white shadow-sm border-none rounded-2xl">
                <div className="flex flex-col items-center gap-1 text-center pb-6">
                    <h1 className="text-2xl font-bold text-gray-900">অ্যাকাউন্ট তৈরি করুন</h1>
                    <p className="text-xs text-gray-500">বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।</p>
                </div>

                <Form className="w-full" onSubmit={onSubmit}>
                    <Fieldset className="w-full">
                        <FieldGroup className="flex flex-col gap-4">
                            <TextField isRequired name="name">
                                <Label className="text-sm font-semibold text-gray-700">নাম</Label>
                                <Input placeholder="যেমন: রহিম উদ্দিন" className="w-full" />
                                <FieldError className="text-xs text-red-500 mt-1" />
                            </TextField>
                            <TextField isRequired name="email" type="email">
                                <Label className="text-sm font-semibold text-gray-700">ইমেইল</Label>
                                <Input placeholder="you@example.com" className="w-full" />
                                <FieldError className="text-xs text-red-500 mt-1" />
                            </TextField>
                            <TextField isRequired minLength={8} name="password" type="password">
                                <Label className="text-sm font-semibold text-gray-700">পাসওয়ার্ড</Label>
                                <Input placeholder="কমপক্ষে ৮ অক্ষর" className="w-full" />
                                <FieldError className="text-xs text-red-500 mt-1" />
                            </TextField>
                            <TextField isRequired minLength={8} name="confirmPassword" type="password">
                                <Label className="text-sm font-semibold text-gray-700">পাসওয়ার্ড নিশ্চিত করুন</Label>
                                <Input placeholder="আবার লিখুন" className="w-full" />
                                <FieldError className="text-xs text-red-500 mt-1" />
                            </TextField>

                        </FieldGroup>

                        <Fieldset.Actions className="flex flex-col gap-2 mt-6">
                            <Button 
                                type="submit" 
                                className="w-full bg-[#008a4b] hover:bg-[#00753f] text-white font-medium text-base rounded-md py-6"
                            >
                                অ্যাকাউন্ট তৈরি করুন
                            </Button>
                        </Fieldset.Actions>
                    </Fieldset>
                </Form>
            </div>
        </div>
    );
};

export default SignUpPage;