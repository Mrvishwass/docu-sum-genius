import { useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { parseDocument } from '@/lib/documentParser';

interface DocumentUploadProps {
  onDocumentParsed: (text: string, fileName: string) => void;
}

export const DocumentUpload = ({ onDocumentParsed }: DocumentUploadProps) => {
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|docx|txt)$/i)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOCX, or TXT file.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Processing document...",
      description: "Please wait while we extract the text."
    });

    try {
      const text = await parseDocument(file);
      onDocumentParsed(text, file.name);
      toast({
        title: "Success!",
        description: "Document uploaded and processed successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process document.",
        variant: "destructive"
      });
    }
  }, [onDocumentParsed, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="w-full max-w-xl">
        <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Upload className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          <h3 className="text-2xl font-semibold mb-2">Upload Legal Document</h3>
          <p className="text-muted-foreground mb-6">
            Upload PDF, DOCX, or TXT files for AI-powered analysis
          </p>
          
          <label className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-primary-foreground rounded-lg cursor-pointer hover:opacity-90 transition-opacity shadow-lg hover:shadow-judicial">
            <FileText className="h-5 w-5" />
            <span className="font-medium">Choose File</span>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
            />
          </label>
          
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>PDF</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>DOCX</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>TXT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
