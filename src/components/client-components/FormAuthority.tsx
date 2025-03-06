"use client";

import { toast, Toaster } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client"; // Import client-side Supabase

type FormAuthorityProps = {
    serverAction: (formData: FormData) => Promise<any>;
};

const FormAuthority = ({ serverAction }: FormAuthorityProps) => {
    const [fullname, setFullname] = useState('');
    const [organizationName, setOrganizationName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [designation, setDesignation] = useState('');
    const [documentUrl, setDocumentUrl] = useState<string>('');
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isLocationDetected, setIsLocationDetected] = useState(false);
    const [contact, setContact] = useState('');
    const [isAgreed, setIsAgreed] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);

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
            alert("Geolocation not supported");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const file = imageInputRef.current?.files?.[0];
        if (!file) {
            toast.error("Please upload a document");
            return;
        }

        const supabase = createClient();
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("authorityDocs") // Your bucket name
            .upload(`documents/${Date.now()}-${file.name}`, file);

        if (uploadError) {
            toast.error("Failed to upload document");
            console.log(uploadError);
            return;
        }

        const documentUrl = supabase.storage
            .from("authorityDocs")
            .getPublicUrl(uploadData.path).data.publicUrl;

        const formData = new FormData();
        formData.append("fullname", fullname);
        formData.append("organizationName", organizationName);
        formData.append("officialEmail", emailAddress);
        formData.append("designation", designation);
        formData.append("documentUrl", documentUrl);
        formData.append("contact", contact);
        if (location) {
            formData.append("latitude", location.lat.toString());
            formData.append("longitude", location.lng.toString());
        }

        try {
            const res = await serverAction(formData);
            if (res?.error) {
                toast.error(res.error.message);
                return;
            }

            // Reset form
            setFullname('');
            setOrganizationName('');
            setDesignation('');
            setContact('');
            setDocumentUrl('');
            setEmailAddress('');
            setIsLocationDetected(false);
            setIsAgreed(false);
            if (imageInputRef.current) imageInputRef.current.value = '';

            toast.success("Authority created successfully");
            window.location.href = '/';
        } catch (error) {
            console.log(error);
            toast.error("An error occurred");
        }
    };

    return (
        <>
            <Toaster />
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="rounded-3xl">Register as an Authority</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl h-[500px] overflow-hidden">
                    <div className="overflow-y-auto max-h-[450px] p-2 scrollbar-hide">
                        <form onSubmit={handleSubmit} className="flex flex-col w-full px-2 py-8 gap-4">
                            {/* Form fields unchanged except for styling */}
                            <input
                                type="text"
                                name="fullname"
                                placeholder="Enter your full name as it appears on official documents."
                                className="w-full text-base bg-transparent border-none outline-none my-2"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                name="organizationName"
                                placeholder="Enter the name of your organization or authority."
                                className="w-full text-base bg-transparent border-none outline-none"
                                value={organizationName}
                                onChange={(e) => setOrganizationName(e.target.value)}
                                required
                            />
                            <input
                                type="email"
                                name="emailAddress"
                                value={emailAddress}
                                placeholder="Provide an official email address for verification."
                                className="w-full text-base bg-transparent outline-none border-none"
                                onChange={(e) => setEmailAddress(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                name="designation"
                                placeholder="What is your role or designation?"
                                className="w-full text-base bg-transparent border-none outline-none"
                                value={designation}
                                onChange={(e) => setDesignation(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                name="contact"
                                placeholder="Provide a contact number"
                                className="w-full text-base bg-transparent border-none outline-none"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={detectLocation}
                                className={`${isLocationDetected ? 'bg-green-400' : 'bg-gray-200'} px-3 py-1 rounded mt-4`}
                            >
                                Detect Location
                            </button>
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                ref={imageInputRef}
                                className="hidden"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const url = URL.createObjectURL(file);
                                        setDocumentUrl(url);
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => imageInputRef.current?.click()}
                                className="bg-gray-200 px-3 py-1 rounded"
                            >
                                Upload proof of authority
                            </button>
                            {documentUrl && (
                                <div className="mt-2">
                                    <Image
                                        src={documentUrl}
                                        width={150}
                                        height={150}
                                        alt="uploaded document preview"
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex mt-4">
                                <input
                                    type="checkbox"
                                    id="agreement"
                                    checked={isAgreed}
                                    onChange={(e) => setIsAgreed(e.target.checked)}
                                    className="mr-2"
                                />
                                <label htmlFor="agreement" className="text-sm">
                                    I agree to address reported issues in a timely and transparent manner.
                                </label>
                            </div>
                            <button
                                type="submit"
                                disabled={!isAgreed || !fullname || !organizationName || !emailAddress || !designation || !documentUrl || !isLocationDetected}
                                className={`mt-4 px-4 py-2 rounded ${isAgreed && fullname && organizationName && emailAddress && designation && documentUrl && isLocationDetected
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                Submit Registration
                            </button>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default FormAuthority;