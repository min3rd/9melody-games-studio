"use client";
import React, { useEffect } from 'react';
import { setClientLanguage } from '@/lib/i18n';
import { Editor3DLayout } from '@/components/editor3d';
import i18n from '@/lib/i18n';

export default function Editor3DPreviewPage() {
  useEffect(() => {
    setClientLanguage();
  }, []);

  // Get translations from i18n
  const t = (key: string) => i18n.t(key, { ns: 'editor3d' });

  const translations = {
    viewport: {
      title: t('viewport.title'),
      controls: {
        rotate: t('viewport.controls.rotate'),
        pan: t('viewport.controls.pan'),
        zoom: t('viewport.controls.zoom'),
      },
    },
    hierarchy: {
      title: t('hierarchy.title'),
      addObject: t('hierarchy.addObject'),
      addLight: t('hierarchy.addLight'),
      addGroup: t('hierarchy.addGroup'),
      noObjects: t('hierarchy.noObjects'),
      delete: t('hierarchy.delete'),
      rename: t('hierarchy.rename'),
    },
    properties: {
      title: t('properties.title'),
      noSelection: t('properties.noSelection'),
      selectObject: t('properties.selectObject'),
      transform: t('properties.transform'),
      position: t('properties.position'),
      rotation: t('properties.rotation'),
      scale: t('properties.scale'),
      appearance: t('properties.appearance'),
      color: t('properties.color'),
      wireframe: t('properties.wireframe'),
      lightSettings: t('properties.lightSettings'),
      intensity: t('properties.intensity'),
    },
    assets: {
      title: t('assets.title'),
      search: t('assets.search'),
      newFolder: t('assets.newFolder'),
      upload: t('assets.upload'),
      refresh: t('assets.refresh'),
      grid: t('assets.grid'),
      list: t('assets.list'),
      noAssets: t('assets.noAssets'),
      dragDrop: t('assets.dragDrop'),
    },
  };

  return (
    <div className="min-h-screen">
      <div className="bg-neutral-100 dark:bg-neutral-900 p-4">
        <h1 className="text-2xl font-bold mb-2">3D Editor Layout Preview</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          This is a preview of the 3D Editor layout with 4 main functional areas.
        </p>
      </div>
      <Editor3DLayout translations={translations} />
    </div>
  );
}
