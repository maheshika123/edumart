"use client";

import { useState } from "react";
import { answerFaq } from "@/ai/flows/faq-answer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";

export default function FaqPage() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setAnswer("");
    setError(null);

    try {
      const result = await answerFaq({ query });
      setAnswer(result.answer);
    } catch (err) {
      setError("Sorry, an error occurred while fetching the answer. Please try again.");
      console.error(err);
    }

    setIsLoading(false);
  };

  const exampleQuestions = [
    "How do I register for a class?",
    "What subjects do you offer?",
    "What are the payment methods?",
    "Where can I find the schedule?"
  ];

  const handleExampleClick = (question: string) => {
    setQuery(question);
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Smart FAQ</h1>
        <p className="text-muted-foreground mt-2">
          Have a question? Ask our AI assistant for a quick answer.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ask a Question</CardTitle>
          <CardDescription>
            Enter your question below. Or try one of the examples.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="e.g., What subjects are available for K-12 students?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-[100px]"
              disabled={isLoading}
            />
            <div className="flex flex-wrap gap-2">
              {exampleQuestions.map(q => (
                <Button key={q} type="button" variant="outline" size="sm" onClick={() => handleExampleClick(q)} disabled={isLoading}>
                  {q}
                </Button>
              ))}
            </div>
            <Button type="submit" disabled={isLoading || !query.trim()} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Answer...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get Answer
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {(isLoading || answer || error) && (
        <Card>
          <CardHeader>
            <CardTitle>Answer</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Thinking...</span>
              </div>
            )}
            {error && <p className="text-destructive">{error}</p>}
            {answer && <p className="leading-relaxed whitespace-pre-wrap">{answer}</p>}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
