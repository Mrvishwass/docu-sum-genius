import { useState } from 'react';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { answerQuestion } from '@/lib/gemini';
import { useToast } from '@/hooks/use-toast';

interface QASectionProps {
  documentText: string;
}

export const QASection = ({ documentText }: QASectionProps) => {
  const { toast } = useToast();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [qaHistory, setQaHistory] = useState<Array<{ question: string; answer: string }>>([]);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    const currentQuestion = question;
    setQuestion('');

    try {
      const answer = await answerQuestion(currentQuestion, documentText);
      setQaHistory(prev => [...prev, { question: currentQuestion, answer }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get answer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
          Ask the AI
        </h2>
        <p className="text-muted-foreground mt-1">
          Ask questions about the document and get AI-powered answers
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Question & Answer
          </CardTitle>
          <CardDescription>
            The AI will answer based on the uploaded document content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask a question about the document..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading || !documentText}
            />
            <Button
              onClick={handleAskQuestion}
              disabled={loading || !question.trim() || !documentText}
              className="bg-gradient-to-r from-primary to-primary-light"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {qaHistory.length > 0 && (
            <div className="space-y-4 mt-6">
              {qaHistory.map((qa, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-sm font-medium text-primary mb-1">Question:</p>
                    <p className="text-sm">{qa.question}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm font-medium text-accent mb-1">Answer:</p>
                    <p className="text-sm whitespace-pre-wrap">{qa.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
