import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Query } from "@shared/schema";

export function useAIQuery() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get query history
  const { data: queries, isLoading: isLoadingHistory } = useQuery<Query[]>({
    queryKey: ["/api/queries"],
  });

  // Submit AI query mutation
  const aiQueryMutation = useMutation({
    mutationFn: async ({ question, type, imageUrl }: { 
      question: string; 
      type: 'text' | 'voice' | 'image'; 
      imageUrl?: string 
    }) => {
      const response = await apiRequest("POST", "/api/queries/ai", {
        question,
        type,
        imageUrl
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Update query cache
      queryClient.invalidateQueries({ queryKey: ["/api/queries"] });
      
      toast({
        title: "Query processed successfully",
        description: "Your agricultural question has been answered by AI",
      });
    },
    onError: (error) => {
      console.error("AI query error:", error);
      toast({
        title: "Query failed",
        description: "Failed to process your query. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Rate query mutation
  const rateQueryMutation = useMutation({
    mutationFn: async ({ queryId, rating }: { queryId: string; rating: 'helpful' | 'not-helpful' }) => {
      const response = await apiRequest("PATCH", `/api/queries/${queryId}`, {
        rating
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/queries"] });
      
      toast({
        title: "Thank you for your feedback",
        description: "Your rating helps us improve our responses",
      });
    },
    onError: (error) => {
      console.error("Rating error:", error);
      toast({
        title: "Rating failed",
        description: "Failed to save your rating. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    queries: queries || [],
    isLoadingHistory,
    aiQueryMutation,
    rateQueryMutation,
    isSubmitting: aiQueryMutation.isPending,
  };
}