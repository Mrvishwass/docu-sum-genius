import { useState } from 'react';
import { Loader2, FileText, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateSummary } from '@/lib/gemini';
import { useToast } from '@/hooks/use-toast';

interface SummaryDisplayProps {
  documentText: string;
}

export const SummaryDisplay = ({ documentText }: SummaryDisplayProps) => {
  const { toast } = useToast();
  const [professionalSummary, setProfessionalSummary] = useState<string>('');
  const [simpleSummary, setSimpleSummary] = useState<string>('');
  const [detailedSummary, setDetailedSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'detailed'>('medium');

  const handleGenerateSummaries = async () => {
    setLoading(true);
    try {
      const [professional, simple, detailed] = await Promise.all([
        generateSummary(documentText, 'professional'),
        generateSummary(documentText, 'simple'),
        generateSummary(documentText, 'detailed')
      ]);
      
      setProfessionalSummary(professional);
      setSimpleSummary(simple);
      setDetailedSummary(detailed);
      
      toast({
        title: "Summaries generated",
        description: "AI analysis complete. View your summaries below."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summaries. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentSummary = (type: 'professional' | 'simple') => {
    if (type === 'professional') {
      return professionalSummary;
    }
    return simpleSummary;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            AI-Powered Analysis
          </h2>
          <p className="text-muted-foreground mt-1">
            Generate professional and simplified summaries
          </p>
        </div>
        
        <Button
          onClick={handleGenerateSummaries}
          disabled={loading || !documentText}
          size="lg"
          className="bg-gradient-to-r from-primary to-primary-light shadow-judicial"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Generate Summaries'
          )}
        </Button>
      </div>

      {professionalSummary && (
        <Tabs defaultValue="professional" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="professional" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Professional
            </TabsTrigger>
            <TabsTrigger value="simple" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Simple English
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="professional" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Professional Summary
                </CardTitle>
                <CardDescription>
                  Legal terminology for lawyers, judges, and legal professionals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                    {getCurrentSummary('professional')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="simple" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Simple English Summary
                </CardTitle>
                <CardDescription>
                  Plain language explanation for the general public
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                    {getCurrentSummary('simple')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
