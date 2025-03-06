"use client"
import { convertBlobUrlToFile } from "@/lib/utils";
import { uploadImage } from "@/lib/supabase/storage/client";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState, useTransition } from "react"
import { toast } from "sonner";

export default function ImageUploadPage({ onImageUrls }: any) {

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition()
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [hasFakeImages, setHasFakeImages] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);


  const API_URL = 'http://127.0.0.1:8000';

  useEffect(() => {
    return () => {
      imageUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imageUrls]);

  const checkFake = async (imageFiles: File[]): Promise<boolean> => {
    setIsChecking(true);

    for (const file of imageFiles) {
      const formData = new FormData();

      formData.append('file', file);

      try {
        const res = await fetch(`${API_URL}/tools/classify-image`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Failed to classify image');

        const data = await res.json();

        if (data.label !== 'Real') {
          console.log("contains fake images");
          toast.error("contains fake images");

          setImageUrls([]);
          setIsChecking(false);

          return true;
        }

      } catch (err) {
        toast.error("error checking image");
        setIsChecking(false);
        return true;

      }
    }

    setIsChecking(false);
    return false;

  }

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));

      const containsFake = await checkFake(filesArray);
      if (!containsFake) {
        setImageUrls([...imageUrls, ...newImageUrls])
        setHasFakeImages(false);

      } else {
        setHasFakeImages(true);
      }

      // console.log(imageUrls);
    }
  }


  const handleImageUpload = () => {

    startTransition(async () => {
      let urls = [];

      for (const url of imageUrls) {
        const imageFile = await convertBlobUrlToFile(url);

        const { imageUrl, error } = await uploadImage({
          file: imageFile,
          bucket: "issuesImages"
        })

        if (error) {
          console.log(error);
          return
        }

        urls.push(imageUrl)
      }
      onImageUrls(urls);
      console.log(urls)

      setImageUrls([]);
    })
  }

  return (
    <div className="flex flex-col  gap-4">
      {/* <Image src="https://cnhddwdahnvmgusjrgpi.supabase.co/storage/v1/object/public/issuesImages/1f65849a-5d91-4789-aa87-9c471b9a76fe.jpeg" width={300} height={300} alt="image"/> */}
      <div>

        <input type="file" multiple hidden ref={imageInputRef} onChange={handleImageChange} />

        <button className="bg-slate-200 py-1 px-4 rounded-lg mt-4" onClick={
          (e) => {
            e.preventDefault()
            imageInputRef.current?.click()
          }
        } disabled={isPending}>Select Images</button>

        <div className="flex gap-4 mt-2">
          {
            imageUrls.map((url, index) => (

              <Image
                key={url}
                src={url}
                width={150}
                height={150}
                alt={`image-${index}`}


              />
            )
            )
          }
        </div>
      </div>
      <div>

        <button disabled={isPending || isChecking || hasFakeImages || imageUrls.length === 0} onClick={handleImageUpload} className="bg-slate-200 py-1 px-4 rounded-lg">
          {isPending ? "Uploading..." :
            isChecking ? "Checking..." :
              "Upload images"}
        </button>
      </div>
    </div>
  )
}