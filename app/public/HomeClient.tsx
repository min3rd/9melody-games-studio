"use client";
import React from 'react';
import dynamic from 'next/dynamic';

const Island3D = dynamic(() => import('@/components/Island3D'), { ssr: false });

export default function HomeClient() {
  return (
    <div className="w-full h-screen">
      <Island3D />
    </div>
  );
}
