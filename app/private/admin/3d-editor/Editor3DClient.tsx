"use client";
import React, { useEffect } from 'react';
import i18n from '@/lib/i18n';
import { setClientLanguage } from '@/lib/i18n';
import { Editor3DLayout } from '@/components/editor3d';

export default function Editor3DClient() {
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

  return <Editor3DLayout translations={translations} />;
}
