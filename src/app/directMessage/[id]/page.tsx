"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { DirectMessage, User } from "../../../../types/app";
import { BiArrowBack } from "react-icons/bi";
import { getSpecificUser } from "@/actions/get-specific-user";
import TextEditor from "@/components/client-components/TextEditor";

const chatPage = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const [messages, setMessages] = useState<DirectMessage[]>([]);
    const [userData, setUserData] = useState<User | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            const user = await getSpecificUser(params.id);
            setUserData(user);
        }
        fetchDetails();
    }, [])

    return (
        <section className='ml-[275px] py-4 px-6 border-l  border-black/10 h-full w-full min-h-screen'>
            <div className='flex w-full items-center gap-2 text-xl '>
                <BiArrowBack className='text-xl cursor-pointer' size={24} onClick={() => router.back()} />
                <h2 className=''>{userData?.username}</h2>

            </div>
            <TextEditor />
        </section>
    )

}

export default chatPage;