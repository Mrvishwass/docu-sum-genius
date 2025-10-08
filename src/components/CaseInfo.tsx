import { useState, useEffect } from 'react';
import { Loader2, Scale, MapPin, Building, User, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { extractKeyPoints, explainLawSections } from '@/lib/gemini';

interface CaseInfoProps {
  documentText: string;
}

export const CaseInfo = ({ documentText }: CaseInfoProps) => {
  const [loading, setLoading] = useState(true);
  const [keyPoints, setKeyPoints] = useState<{
    clauses: string[];
    legalSections: string[];
    names: string[];
    organizations: string[];
    locations: string[];
  }>({
    clauses: [],
    legalSections: [],
    names: [],
    organizations: [],
    locations: []
  });
  const [sectionExplanations, setSectionExplanations] = useState<Record<string, string>>({});

  useEffect(() => {
    const analyzeDocument = async () => {
      if (!documentText) return;
      
      setLoading(true);
      try {
        const points = await extractKeyPoints(documentText);
        setKeyPoints(points);
        
        if (points.legalSections.length > 0) {
          const explanations = await explainLawSections(points.legalSections);
          setSectionExplanations(explanations);
        }
      } catch (error) {
        console.error('Error analyzing document:', error);
      } finally {
        setLoading(false);
      }
    };

    analyzeDocument();
  }, [documentText]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Extracting case information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
          Case Information
        </h2>
        <p className="text-muted-foreground mt-1">
          Key details and legal references extracted from the document
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Legal Sections
            </CardTitle>
            <CardDescription>Referenced laws and statutes</CardDescription>
          </CardHeader>
          <CardContent>
            {keyPoints.legalSections.length > 0 ? (
              <div className="space-y-4">
                {keyPoints.legalSections.map((section, idx) => (
                  <div key={idx} className="space-y-2">
                    <Badge variant="outline" className="text-sm font-medium">
                      {section}
                    </Badge>
                    {sectionExplanations[section] && (
                      <p className="text-sm text-muted-foreground pl-2 border-l-2 border-primary/30">
                        {sectionExplanations[section]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No legal sections found</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Names
            </CardTitle>
            <CardDescription>Individuals mentioned in the document</CardDescription>
          </CardHeader>
          <CardContent>
            {keyPoints.names.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {keyPoints.names.map((name, idx) => (
                  <Badge key={idx} variant="secondary">
                    {name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No names found</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Organizations
            </CardTitle>
            <CardDescription>Companies and institutions</CardDescription>
          </CardHeader>
          <CardContent>
            {keyPoints.organizations.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {keyPoints.organizations.map((org, idx) => (
                  <Badge key={idx} variant="secondary">
                    {org}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No organizations found</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Locations
            </CardTitle>
            <CardDescription>Places mentioned in the document</CardDescription>
          </CardHeader>
          <CardContent>
            {keyPoints.locations.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {keyPoints.locations.map((location, idx) => (
                  <Badge key={idx} variant="secondary">
                    {location}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No locations found</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Important Clauses
          </CardTitle>
          <CardDescription>Key provisions and clauses</CardDescription>
        </CardHeader>
        <CardContent>
          {keyPoints.clauses.length > 0 ? (
            <div className="space-y-3">
              {keyPoints.clauses.map((clause, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm">{clause}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No important clauses found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
