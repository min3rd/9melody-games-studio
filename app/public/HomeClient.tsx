"use client";
import HomepageScene3D from '@/components/HomepageScene3D';

export default function HomeClient() {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-sky-200 to-sky-100 dark:from-sky-900 dark:to-sky-800">
      <HomepageScene3D enableControls={true} />
    </div>
  );
}
