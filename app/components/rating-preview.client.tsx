"use client";
import React, { useState } from "react";
import { Rating } from "@/components/ui";

export default function RatingPreview() {
  const [value, setValue] = useState(3);
  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto py-8">
      <h2 className="text-xl font-bold mb-2">Rating Component Preview</h2>
      <div className="flex flex-col gap-4">
        <div>
          <span className="block mb-1 font-medium">Default</span>
          <Rating value={value} onChange={setValue} />
        </div>
        <div>
          <span className="block mb-1 font-medium">Custom Preset (success), Size lg</span>
          <Rating value={value} onChange={setValue} preset="success" size="lg" />
        </div>
        <div>
          <span className="block mb-1 font-medium">Custom Color, Size sm, No Effects</span>
          <Rating value={value} onChange={setValue} color="#f59e42" size="sm" withEffects={false} />
        </div>
        <div>
          <span className="block mb-1 font-medium">Read Only</span>
          <Rating value={4} readOnly />
        </div>
      </div>
      <div className="mt-6">
        <span className="block text-sm text-gray-500">Current value: {value}</span>
      </div>
    </div>
  );
}
