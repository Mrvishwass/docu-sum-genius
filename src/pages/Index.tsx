import { useState } from 'react';
import { Scale, FileText, Search, MessageSquare, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DocumentUpload } from '@/components/DocumentUpload';
import { SummaryDisplay } from '@/components/SummaryDisplay';
import { CaseInfo } from '@/components/CaseInfo';
import { QASection } from '@/components/QASection';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [documentText, setDocumentText] = useState('');
  const [fileName, setFileName] = useState('');
  const [activeTab, setActiveTab] = useState('upload');

  const handleDocumentParsed = (text: string, name: string) => {
    setDocumentText(text);
    setFileName(name);
    setActiveTab('summaries');
  };

  const handleDownload = () => {
    toast({
      title: "Download feature",
      description: "PDF download functionality will be available soon."
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary-light shadow-judicial">
                <Scale className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                  Judicial Document Summarizer
                </h1>
                <p className="text-sm text-muted-foreground">
                  AI-Powered Legal Document Analysis
                </p>
              </div>
            </div>
            
            {documentText && (
              <Button
                onClick={handleDownload}
                variant="outline"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="summaries" disabled={!documentText} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Summaries</span>
            </TabsTrigger>
            <TabsTrigger value="case-info" disabled={!documentText} className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              <span className="hidden sm:inline">Case Info</span>
            </TabsTrigger>
            <TabsTrigger value="qa" disabled={!documentText} className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Q&A</span>
            </TabsTrigger>
          </TabsList>

          {fileName && (
            <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm text-muted-foreground">
                Current document: <span className="font-medium text-foreground">{fileName}</span>
              </p>
            </div>
          )}

          <TabsContent value="upload" className="mt-0">
            <DocumentUpload onDocumentParsed={handleDocumentParsed} />
          </TabsContent>

          <TabsContent value="summaries" className="mt-0">
            <SummaryDisplay documentText={documentText} />
          </TabsContent>

          <TabsContent value="case-info" className="mt-0">
            <CaseInfo documentText={documentText} />
          </TabsContent>

          <TabsContent value="qa" className="mt-0">
            <QASection documentText={documentText} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
