"use client"
import { useState, FormEvent, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function Page() {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageResult, setImageResult] = useState<{
        score: number;
        label: string;
    } | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);  // For image preview
    const [loading, setLoading] = useState<boolean>(false);

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));  // Create a local URL for preview
        }
    };

    const handleImageSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!imageFile) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', imageFile);

        try {
            const res = await fetch(`${API_URL}/tools/classify-image`, {
                method: 'POST',
                body: formData,
            });
            if (!res.ok) throw new Error('Failed to classify image');
            const data = await res.json();
            setImageResult(data);
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    // Clean up the URL object when component unmounts or file changes
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    return (
        <div className="py-24 text-center flex flex-col items-center  px-6 border-l border-black/10 h-full w-full min-h-screen">
            {/* Image Classifier */}
            <div className="w-full flex items-center flex-col">
                <h2 className=" text-5xl font-bold  text-gray-800 mb-4">Deepfake Image Classifier</h2>
                <form onSubmit={handleImageSubmit} className="flex flex-col space-y-4 items-center">
                    <input
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleImageFileChange}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <button
                        type="submit"
                        disabled={loading || !imageFile}
                        className={`py-2 px-6 rounded-full text-white w-fit font-semibold ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
                    >
                        {loading ? 'Processing...' : 'Classify Image'}
                    </button>
                </form>
                {imageResult && (
                    <div className="mt-4 text-center w-full flex items-center flex-col">
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Uploaded Image"
                                className="mt-4 w-full rounded-lg max-w-xs"
                            />
                        )}
                        <p className="text-gray-700">Score: {imageResult.score.toFixed(2)}</p>
                        <p className="text-gray-700 font-bold">Status: {imageResult.label}</p>
                    </div>
                )}
            </div>
        </div>
    );
}