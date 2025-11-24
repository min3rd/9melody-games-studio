"use client";
import React, { useState } from "react";
import { Select } from "@/components/ui";

const options = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
  { label: "Disabled", value: "disabled", disabled: true },
];

export default function SelectPreview() {
  const [value, setValue] = useState("1");
  return (
    <div className="space-y-4 bg-white dark:bg-neutral-800 rounded-lg shadow text-neutral-900 dark:text-neutral-100 p-4">
      <div className="flex flex-col gap-4">
        <div>
          <span className="block mb-1 font-medium">Default</span>
          <Select options={options} value={value} onValueChange={setValue} />
        </div>
        <div>
          <span className="block mb-1 font-medium">Custom Preset (success), Size lg</span>
          <Select options={options} value={value} onValueChange={setValue} preset="success" size="lg" />
        </div>
        <div>
          <span className="block mb-1 font-medium">Custom Color, Size sm, No Effects</span>
          <Select options={options} value={value} onValueChange={setValue} color="#f59e42" size="sm" withEffects={false} />
        </div>
        <div>
          <span className="block mb-1 font-medium">Disabled</span>
          <Select options={options} value={value} disabled />
        </div>
      </div>
      <div>
        <span className="block text-sm text-gray-500 dark:text-gray-400">Current value: {value}</span>
      </div>
    </div>
  );
}
