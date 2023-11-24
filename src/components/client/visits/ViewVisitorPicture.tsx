import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EyeIcon } from "lucide-react";

interface ViewVisitorPictureProps {
  assetId: string; // Change the type if assetId is not a string
}

export default function ViewVisitorPicture({ assetId }: ViewVisitorPictureProps) {

  return (
      <Dialog>
        <DialogTrigger>
          <Button variant="outline" size="sm">
            <EyeIcon className='w-6 h-6 mr-2' />
            Tashrif buyuruvchi rasmi
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tashrif buyuruvchi rasmi</DialogTitle>
          </DialogHeader>
          <img
              src={`http://25-school.uz/school/api/v1/asset/view/${assetId}`}
              alt="Visitor picture"
              className="w-full h-[500px] rounded"
          />
        </DialogContent>
      </Dialog>
  );
}
