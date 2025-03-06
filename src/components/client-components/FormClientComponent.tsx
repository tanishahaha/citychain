"use client";

import { PostgrestError } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { BiPlus } from 'react-icons/bi';
import ImageUploadPage from './ImageUploadPage';
import CategorySelector from './CategorySelector';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";

type FormClientComponentProps = {
  serverAction: any,
};

const FormClientComponent = ({ serverAction }: FormClientComponentProps) => {

  const handleSubmitIssue = async (data: any) => {
    if (!title || !inputFieldValue) return;
    const formData = new FormData();
    formData.append("issue", inputFieldValue);
    formData.append("category", categoryValue);
    formData.append("title", title);


    imageUrls.forEach((url) => formData.append("imageUrls[]", url));

    if (selectedLocation) {
      formData.append("latitude", selectedLocation.lat.toString());
      formData.append("longitude", selectedLocation.lng.toString());
    }

    if (locationName) {
      formData.append("locationName", locationName)
    }

    try {
      const res = await serverAction(formData);
      if (res?.error) {
        return toast.error(res.error.message);
      }
      setInputFieldValue('');
      setCategoryValue('');
      setSelectedLocation(null);
      setLocationName(null);
      window.location.href = "/";
      return toast.success("Issue raised successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategorySelected = (selectedCategory: string) => {
    setCategoryValue(selectedCategory);
  };

  const handleImageUrls = (urls: any) => {
    setImageUrls(urls);
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedLocation({
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

  const customIcon: L.Icon<any> = L.icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  const getLocationName = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);

      const data = await res.json();
      if (data && data.display_name) {
        setLocationName(data.display_name);
      } else {
        setLocationName("Unknown Location")
      }
    } catch (error) {
      console.log("error fetching location name")
      setLocationName("failed to fetch location")
    }
  }



  const LocationPicker = ({ selectedLocation, setSelectedLocation }: { selectedLocation: any, setSelectedLocation: any }) => {
    const map = useMap();

    useEffect(() => {
      if (selectedLocation) {
        map.setView(selectedLocation, 14);
      }
    }, [selectedLocation, map]);

    useMapEvents({
      click(event: L.LeafletMouseEvent) {
        const newLocation = {
          lat: event.latlng.lat,
          lng: event.latlng.lng,
        };
        setSelectedLocation(newLocation);
        getLocationName(newLocation.lat, newLocation.lng); // Fetch location name

      },
    });


    return selectedLocation ? (
      <Marker position={selectedLocation} icon={customIcon as L.Icon<any>} />
    ) : null;

  };


  const [inputFieldValue, setInputFieldValue] = useState('');
  const [categoryValue, setCategoryValue] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [isLocationDetected, setIsLocationDetected] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (selectedLocation) {
      getLocationName(selectedLocation.lat, selectedLocation.lng);
    }
  }, [selectedLocation]);

  return (
    <>
      <Toaster />
      <Dialog>
        <DialogTrigger asChild>
          <div className='flex gap-2 items-center cursor-pointer'>
            <div className='w-7 h-7 text-white bg-primary rounded-lg flex text-center justify-center items-center'>
              <BiPlus size={24} />
            </div>
            <p className='flex gap-2'>Compose an issue</p>
          </div>
        </DialogTrigger>
        <DialogContent className='max-w-2xl h-[500px] overflow-hidden'>
          <div className='overflow-y-auto max-h-[450px] p-2 scrollbar-hide'>
            <form className='flex flex-col w-full px-2 py-8'>
              <input
                type="text"
                name="title"
                placeholder="Issue Name(2-4 words long)"
                className='w-full text-base bg-transparent border-none outline-none my-2 mb-2'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <input
                type="text"
                name="issue"
                placeholder="Describe the issue in detail..."
                className='w-full text-base bg-transparent border-none outline-none'
                value={inputFieldValue}
                onChange={(e) => setInputFieldValue(e.target.value)}
                required
              />

              <div>
                <ImageUploadPage onImageUrls={handleImageUrls} />
                <CategorySelector onCategorySelect={handleCategorySelected} />
              </div>
              <div className='flex my-4'>

                <button
                  type='button'
                  onClick={detectLocation}
                  className={`${isLocationDetected ? 'bg-green-400' : 'bg-gray-200'} px-3 py-1 rounded `}
                >
                  Detect Location
                </button>
              </div>


              <MapContainer style={{ height: "300px", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} />
              </MapContainer>

              {locationName && (
                <p className="text-sm mt-2">Selected Location: {locationName}</p>
              )}


              <div className='w-full justify-center mt-4 items-center flex'>
                <button
                  type='submit'
                  className='rounded-full text-white tracking-wider bg-primary px-4 py-1 text-base hover:scale-95 transition duration-300'
                  onClick={handleSubmitIssue}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FormClientComponent;
