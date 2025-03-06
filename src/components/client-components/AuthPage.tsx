"use client"
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { createClient } from '@/utils/supabase/client';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';

const AuthPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const supabase = createClient();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [full_name, setFullName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [actionToPerform, setActionToPerform] = useState("");


    async function handleLogout() {
        await supabase.auth.signOut();
    }

    const router = useRouter();

    useEffect(() => {

        supabase.auth.getSession().then((res) => {
            if (!res.data.session) {

                // setIsOpen(true);
                setActionToPerform("Login")

            } else {
                setActionToPerform("Logout")
            }

        })
    }, []);

    const handleLogin = async (state: boolean) => {
        setIsLoggedIn(state);
    }

    const checkUsername = async () => {
        const { data, error } = await supabase.from("profiles").select().eq("username", username.trim());

        if (data && data?.length > 0) {
            console.log(data);
            return toast.error("Username already exists, Please use another one");
        }
    }

    const checkEmail = async () => {
        const { data, error } = await supabase.from("profiles").select().eq("email", email.trim());

        if (data && data?.length > 0) {
            console.log(data);
            if (isLoggedIn) {
                return
            }
            return toast.error("Email already exists, Please use another one");
        }
        checkUsername();

    }

    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [isLocationDetected, setIsLocationDetected] = useState(false);

    const detectLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    setIsLocationDetected(true);
                },
                (error) => {
                    console.log(error);
                }
            );
        } else {
            alert("geolocation not supported");
        }
    }


    return (
        <>
            <Toaster />


            <form onSubmit={async (e) => {
                e.preventDefault();
                setIsLoading(true);

                checkEmail();

                await supabase.auth.signInWithOtp({
                    email: email.trim(),
                    options: {
                        data: {
                            username,
                            email,
                            full_name,
                            latitude: location ? parseFloat(location.lat.toString()) : null,
                            longitude: location ? parseFloat(location.lng.toString()) : null,
                        }
                    }
                })
                console.log("sjfo")

                setIsLoading(false);
                // window.location.href = "/";
                toast.success("magic link sent successfully")

            }}>
                {isLoggedIn ? (
                    <>
                        <p className='mt-8 text-primary font-semibold tracking-wider text-xl'>Welcome Back!</p>


                        <Input type='email' placeholder='mail@gmail.com' className='mt-4' onChange={e => setEmail(e.target.value)} />

                        <p className='mt-4 text-slate-600 tracking-wide text-sm'>You will recieve a magic link on the provided email.</p>

                        <div className='flex w-full justify-center mt-8'>
                            <Button disabled={isLoading}>Login</Button>
                        </div>

                        <p className='mt-2 flex w-full justify-center text-red-600 tracking-wide text-sm'>New User? <span className='ml-1 font-semibold cursor-pointer' onClick={() => {
                            handleLogin(false);
                        }}> Sign Up</span></p>
                    </>
                ) : (
                    <>
                        <p className='mt-8 text-primary font-semibold tracking-wider text-xl'>Hello New User!</p>

                        <Input type='text' placeholder='Full Name' className='mt-4' onChange={e => setFullName(e.target.value)} />

                        <Input type='email' placeholder='mail@gmail.com' className='mt-4' onChange={e => setEmail(e.target.value)} />

                        <Input type='text' placeholder='username' className='mt-4' onChange={e => setUsername(e.target.value)} />

                        <button
                            type='button'
                            onClick={detectLocation}
                            className={`${isLocationDetected ? 'bg-green-400' : 'bg-gray-200'} px-3 py-1 rounded mt-4`}
                        >
                            Detect Location
                        </button>


                        <p className='mt-4 text-slate-600 tracking-wide text-sm'>You will recieve a magic link on the provided email.</p>

                        <div className='flex w-full justify-center mt-8'>
                            <Button disabled={!isLocationDetected || isLoading}>Sign Up</Button>
                        </div>

                        <p className='mt-2 flex w-full justify-center text-red-600 tracking-wide text-sm'>Already a user? <span className='ml-1 font-semibold cursor-pointer' onClick={() => {
                            handleLogin(true);
                        }}> Login</span></p>
                    </>
                )}

            </form>

        </>
    )
}

export default AuthPage