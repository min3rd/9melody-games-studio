"use client";
import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, CardTitle, CardThumbnail } from '@/components/ui/Card';
import { Button } from '@/components/ui';

export default function CardPreview() {
  return (
    <div className="space-y-4">
      <section>
        <Card className="max-w-md">
          <CardThumbnail src="/next.svg" alt="Thumbnail" />
          <CardHeader heading={<CardTitle>Card Title</CardTitle>} subtitle={"Subtitle text"} actions={<Button variant="ghost">Action</Button>} />
          <CardBody>
            <p className="text-sm text-neutral-700 dark:text-neutral-200">This is a card body. It can hold text, lists, or other elements.</p>
          </CardBody>
          <CardFooter>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost">Cancel</Button>
              <Button>Confirm</Button>
            </div>
          </CardFooter>
        </Card>
      </section>

      <section>
        <Card className="max-w-sm" elevation="lg" withEffects rounded>
          <CardHeader heading={<CardTitle>Compact Card</CardTitle>} />
          <CardBody>
            <p className="text-sm">Compact body content. Multiple components can be placed inside.</p>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
