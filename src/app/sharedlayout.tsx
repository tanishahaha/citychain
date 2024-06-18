import React from 'react';
import LeftSidebar from '@/components/LeftSidebar'; 

const SharedLayout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  return (
    <div className='w-full h-full flex justify-center items-center relative text-black font-poppins'>
      <div className='px-16 w-full h-full flex relative'>
        <LeftSidebar /> 
        {children} 
      </div>
    </div>
  );
};

export default SharedLayout;
