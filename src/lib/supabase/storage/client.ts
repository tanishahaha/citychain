import { v4 as uuidv4 } from "uuid"
import imageCompression from "browser-image-compression"
import { createClient } from "@/utils/supabase/client";

type uploadProps = {
    file: File,
    bucket: string,
    folder?: string;
  }
  
  export async function uploadImage({file,bucket,folder} : uploadProps) {
    const fileName = file.name
    const fileExt = fileName.slice(fileName.lastIndexOf(".") + 1)
    const path = `${folder ? folder + "/" : ""}${uuidv4()}.${fileExt}`
    
    try {
      file = await imageCompression(file, {
      maxSizeMB:1
    })
    } catch (error) {
      console.log(error)
      return {imageUrl:"", error:"compression failed"}
    }
  
    const storage = getStorage();
    const { data, error } = await storage.from(bucket).upload(path, file)
    
    if (error) {
      return { imageUrl:"", error:"image upload failed"}
    }
    
    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${bucket}/${data?.path}`
    
    return {imageUrl, error:""}
  
  }
  
  function getStorage() {
    const { storage } = createClient();
    return storage;
  }
  