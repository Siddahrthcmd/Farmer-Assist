import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Mic, Camera, Send, Bot, User, ThumbsUp, ThumbsDown, MoreHorizontal, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAIQuery } from "@/hooks/use-ai-query";
import VoiceInput from "./VoiceInput";
import ImageUpload from "./ImageUpload";

export default function QueryInterface() {
  const { queries, isLoadingHistory, aiQueryMutation, rateQueryMutation, isSubmitting } = useAIQuery();
  const [activeTab, setActiveTab] = useState('text');
  const [textQuery, setTextQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [queries]);

  const handleSubmit = async () => {
    if (!textQuery.trim() || isSubmitting) return;
    
    await aiQueryMutation.mutateAsync({
      question: textQuery,
      type: 'text'
    });
    setTextQuery('');
  };

  const handleVoiceTranscription = async (text: string, language: string) => {
    await aiQueryMutation.mutateAsync({
      question: text,
      type: 'voice'
    });
  };

  const handleImageUpload = async (file: File, preview: string) => {
    // For now, we'll just use the filename as the question
    // In a full implementation, you'd upload the image and get analysis
    await aiQueryMutation.mutateAsync({
      question: `Image analysis request: ${file.name}`,
      type: 'image',
      imageUrl: preview
    });
  };

  const handleRating = (queryId: string, rating: 'helpful' | 'not-helpful') => {
    rateQueryMutation.mutate({ queryId, rating });
  };

  // Convert queries to message format for display
  const messages = queries.flatMap(query => [
    {
      id: `${query.id}-user`,
      type: 'user' as const,
      content: query.question,
      language: query.language,
      timestamp: query.createdAt,
      imageUrl: query.imageUrl,
      isAudio: query.type === 'voice'
    },
    ...(query.answer ? [{
      id: `${query.id}-assistant`,
      type: 'assistant' as const,
      content: query.answer,
      language: query.language,
      timestamp: query.createdAt,
      queryId: query.id,
      rating: query.rating
    }] : [])
  ]).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Chat Messages */}
      <Card className="min-h-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            AI Agricultural Assistant
          </CardTitle>
          <CardDescription>
            Ask questions about farming in your preferred language
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[500px] overflow-y-auto" data-testid="chat-messages">
            {isLoadingHistory ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading chat history...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bot className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Welcome to FarmerAssist! Ask your farming questions in any language.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    
                    <div className={`rounded-lg p-3 ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <div className="space-y-2">
                        {message.imageUrl && (
                          <img 
                            src={message.imageUrl} 
                            alt="Query image" 
                            className="rounded-md max-w-xs"
                          />
                        )}
                        <p className="text-sm whitespace-pre-wrap" data-testid={`message-${message.id}`}>
                          {message.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs opacity-70">
                              {formatTime(new Date(message.timestamp))}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {message.language}
                            </Badge>
                            {message.isAudio && (
                              <Badge variant="outline" className="text-xs">
                                Voice
                              </Badge>
                            )}
                          </div>
                          
                          {message.type === 'assistant' && 'queryId' in message && (
                            <div className="flex gap-1">
                              <Button 
                                size="icon" 
                                variant={message.rating === 'helpful' ? 'default' : 'ghost'} 
                                className="h-6 w-6" 
                                data-testid="button-thumbs-up"
                                onClick={() => handleRating(message.queryId, 'helpful')}
                                disabled={rateQueryMutation.isPending}
                              >
                                <ThumbsUp className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant={message.rating === 'not-helpful' ? 'default' : 'ghost'} 
                                className="h-6 w-6" 
                                data-testid="button-thumbs-down"
                                onClick={() => handleRating(message.queryId, 'not-helpful')}
                                disabled={rateQueryMutation.isPending}
                              >
                                <ThumbsDown className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {/* Loading indicator for new AI response */}
            {isSubmitting && (
              <div className="flex gap-3 justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-lg p-3 bg-muted">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        AI is analyzing your question...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Input Interface */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text" className="gap-2" data-testid="tab-text">
                <MessageSquare className="h-4 w-4" />
                Text
              </TabsTrigger>
              <TabsTrigger value="voice" className="gap-2" data-testid="tab-voice">
                <Mic className="h-4 w-4" />
                Voice
              </TabsTrigger>
              <TabsTrigger value="image" className="gap-2" data-testid="tab-image">
                <Camera className="h-4 w-4" />
                Image
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="Ask your farming question in Malayalam, Hindi, Tamil, or English..."
                  value={textQuery}
                  onChange={(e) => setTextQuery(e.target.value)}
                  className="min-h-[100px]"
                  data-testid="textarea-query"
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    Tip: Be specific about your crop, location, and symptoms
                  </p>
                  <Button 
                    onClick={handleSubmit}
                    disabled={!textQuery.trim() || isSubmitting}
                    data-testid="button-submit-text"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Sending...' : 'Send'}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="voice" className="mt-6">
              <VoiceInput onTranscription={handleVoiceTranscription} />
            </TabsContent>

            <TabsContent value="image" className="mt-6">
              <ImageUpload onImageUpload={handleImageUpload} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}