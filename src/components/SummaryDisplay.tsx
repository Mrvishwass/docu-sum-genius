import { useState } from 'react';
import { Loader2, FileText, Users, BookOpen, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateSummary, translateText } from '@/lib/gemini';
import { useToast } from '@/hooks/use-toast';

interface SummaryDisplayProps {
  documentText: string;
}

export const SummaryDisplay = ({ documentText }: SummaryDisplayProps) => {
  const { toast } = useToast();
  const [professionalSummary, setProfessionalSummary] = useState<string>('');
  const [simpleSummary, setSimpleSummary] = useState<string>('');
  const [detailedSummary, setDetailedSummary] = useState<string>('');
  const [translatedSummary, setTranslatedSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'detailed'>('medium');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  const indianLanguages = [
    { value: 'hindi', label: 'Hindi (हिंदी)' },
    { value: 'tamil', label: 'Tamil (தமிழ்)' },
    { value: 'telugu', label: 'Telugu (తెలుగు)' },
    { value: 'kannada', label: 'Kannada (ಕನ್ನಡ)' },
    { value: 'malayalam', label: 'Malayalam (മലയാളം)' },
    { value: 'bengali', label: 'Bengali (বাংলা)' },
    { value: 'marathi', label: 'Marathi (मराठी)' },
    { value: 'gujarati', label: 'Gujarati (ગુજરાતી)' },
    { value: 'punjabi', label: 'Punjabi (ਪੰਜਾਬੀ)' },
    { value: 'urdu', label: 'Urdu (اردو)' },
  ];

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

  const handleTranslate = async (type: 'professional' | 'simple') => {
    if (!selectedLanguage) {
      toast({
        title: 'Please select a language',
        description: 'Choose a language to translate the summary',
        variant: 'destructive',
      });
      return;
    }

    setIsTranslating(true);
    try {
      const textToTranslate = getCurrentSummary(type);
      const languageLabel = indianLanguages.find(l => l.value === selectedLanguage)?.label || selectedLanguage;
      const translated = await translateText(textToTranslate, languageLabel);
      setTranslatedSummary(translated);
      toast({
        title: 'Translation complete',
        description: `Summary translated to ${languageLabel}`,
      });
    } catch (error) {
      toast({
        title: 'Translation failed',
        description: 'Failed to translate the summary. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsTranslating(false);
    }
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="professional" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Professional
            </TabsTrigger>
            <TabsTrigger value="simple" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Simple English
            </TabsTrigger>
            <TabsTrigger value="translation" className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              Translation
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

          <TabsContent value="translation" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5 text-primary" />
                  Translate Summary
                </CardTitle>
                <CardDescription>
                  Translate summaries to Indian regional languages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Select Language</label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an Indian language" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianLanguages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleTranslate('professional')}
                      disabled={isTranslating || !selectedLanguage}
                      variant="outline"
                    >
                      {isTranslating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Translate Professional'
                      )}
                    </Button>
                    <Button 
                      onClick={() => handleTranslate('simple')}
                      disabled={isTranslating || !selectedLanguage}
                      variant="outline"
                    >
                      {isTranslating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Translate Simple'
                      )}
                    </Button>
                  </div>
                </div>

                {translatedSummary && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-3">Translated Summary:</h4>
                    <div className="prose prose-sm max-w-none p-4 bg-muted/50 rounded-lg">
                      <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                        {translatedSummary}
                      </p>
                    </div>
                  </div>
                )}

                {!translatedSummary && (
                  <p className="text-muted-foreground text-center py-8 text-sm">
                    Select a language and click translate to see the summary in your chosen language
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
