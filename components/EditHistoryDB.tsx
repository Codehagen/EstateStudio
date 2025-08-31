'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Download, DollarSign } from 'lucide-react';
import { downloadImage } from '@/lib/image-utils';
import { getProjectEdits } from '@/actions/photo-actions';

interface EditHistoryDBProps {
  workspaceId: string;
  projectId?: string;
  onSelectHistory: (item: any) => void;
}

export function EditHistoryDB({ workspaceId, projectId, onSelectHistory }: EditHistoryDBProps) {
  const [edits, setEdits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEdits = async () => {
      setIsLoading(true);
      try {
        const result = await getProjectEdits(workspaceId, projectId);
        if (result.success) {
          setEdits(result.edits || []);
        }
      } catch (error) {
        console.error('Failed to fetch edit history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEdits();
  }, [workspaceId, projectId]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading edit history...</p>
        </CardContent>
      </Card>
    );
  }

  if (edits.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            No edit history yet. Start editing photos to see them here!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit History</CardTitle>
        <p className="text-sm text-muted-foreground">
          {edits.length} edit{edits.length !== 1 ? 's' : ''} in this {projectId ? 'project' : 'workspace'}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {edits.map((edit) => (
            <div
              key={edit.id}
              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => onSelectHistory(edit)}
            >
              <div className="flex items-start gap-4">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={edit.editedUrl}
                    alt="Edited"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium line-clamp-2">
                    {edit.prompt.replace('Edit this real estate photo: ', '').replace('. Maintain photorealistic quality, proper lighting, and professional real estate photography standards. Keep the original architecture and layout intact while making the requested improvements.', '')}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(edit.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      ${edit.cost.toFixed(3)}
                    </span>
                    {edit.photo?.filename && (
                      <span className="truncate max-w-[150px]">
                        {edit.photo.filename}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadImage(edit.editedUrl, `edit-${edit.id}.jpg`);
                  }}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}