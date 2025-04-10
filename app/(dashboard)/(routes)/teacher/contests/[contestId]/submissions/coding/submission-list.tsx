'use client';

import { Submission } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface SubmissionWithDetails extends Submission {
  user: {
    name: string | null;
  } | null;
  problem: {
    title: string;
  };
}

interface SubmissionsListProps {
  submissions: SubmissionWithDetails[];
}

const downloadCode = (code: string, filename: string, language: string) => {
  const getFileExtension = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'python': return '.py';
      case 'javascript': return '.js';
      case 'typescript': return '.ts';
      case 'java': return '.java';
      case 'c++': return '.cpp';
      case 'c': return '.c';
      default: return '.txt';
    }
  };

  const extension = getFileExtension(language);
  const blob = new Blob([code], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}${extension}`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export function SubmissionsList({ submissions }: SubmissionsListProps) {
  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <Card key={submission.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {submission.problem.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={submission.status === 'Accepted' ? 'default' : 'destructive'}>
                  {submission.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(submission.submittedAt), 'dd/MM/yyyy HH:mm:ss', { locale: vi })}
                </span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Người nộp: {submission.user?.name || 'Unknown'}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {submission.language}
                  </Badge>
                  <Badge variant="outline">
                    Điểm: {submission.score || 0}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadCode(
                    submission.code,
                    `${submission.user?.name}_${format(new Date(submission.submittedAt), 'yyyyMMdd_HHmmss')}`,
                    submission.language
                  )}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Code
                </Button>
              </div>
              <div className="rounded-md bg-muted p-4">
                <pre className="whitespace-pre-wrap break-words">
                  {submission.code}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}