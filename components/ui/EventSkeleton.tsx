
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const EventSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-20" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
      </CardContent>
    </Card>
  );
};

export default EventSkeleton;
