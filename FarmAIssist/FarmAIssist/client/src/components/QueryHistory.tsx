import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Filter, Download, Clock, MessageSquare, Bot, User, MoreHorizontal, FileImage, Mic } from "lucide-react";
import { useState } from "react";

interface QueryHistoryItem {
  id: string;
  question: string;
  answer: string;
  language: string;
  type: 'text' | 'voice' | 'image';
  category: string;
  timestamp: Date;
  rating?: 'helpful' | 'not-helpful';
  imageUrl?: string;
}

interface QueryHistoryProps {
  onViewQuery?: (query: QueryHistoryItem) => void;
  onDeleteQuery?: (queryId: string) => void;
  onExportHistory?: () => void;
}

export default function QueryHistory({ 
  onViewQuery = (query) => console.log('Viewing query:', query),
  onDeleteQuery = (id) => console.log('Deleting query:', id),
  onExportHistory = () => console.log('Exporting history')
}: QueryHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // todo: remove mock functionality
  const mockHistory: QueryHistoryItem[] = [
    {
      id: '1',
      question: 'എന്റെ നെല്ലിന് ഇലകൾ മഞ്ഞയായി മാറുന്നു. എന്താകാം കാരണം?',
      answer: 'നെല്ലിന്റെ ഇലകൾ മഞ്ഞയാകാനുള്ള പ്രധാന കാരണങ്ങൾ: പോഷകക്കുറവ്, രോഗങ്ങൾ, കീടങ്ങൾ, ജല പ്രശ്നങ്ങൾ...',
      language: 'malayalam',
      type: 'text',
      category: 'crops',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      rating: 'helpful'
    },
    {
      id: '2',
      question: 'How to prepare organic fertilizer at home?',
      answer: 'To prepare organic fertilizer at home: 1. Collect kitchen waste 2. Add brown materials like dry leaves 3. Layer in compost bin...',
      language: 'english',
      type: 'voice',
      category: 'fertilizer',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      rating: 'helpful'
    },
    {
      id: '3',
      question: 'What disease is affecting my coconut palm?',
      answer: 'Based on the image, this appears to be Coconut Root Wilt disease. Treatment includes: soil fumigation, balanced fertilization...',
      language: 'english',
      type: 'image',
      category: 'pests',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=150&fit=crop',
      rating: 'helpful'
    },
    {
      id: '4',
      question: 'मानसून के लिए धान की खेती की तैयारी कैसे करें?',
      answer: 'मानसून धान की खेती की तैयारी: 1. खेत की जुताई 2. बीज का चयन 3. नर्सरी तैयारी...',
      language: 'hindi',
      type: 'text',
      category: 'crops',
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    },
    {
      id: '5',
      question: 'When is the best time to plant cardamom?',
      answer: 'The best time to plant cardamom in Kerala is during the monsoon season (June-July). Plant during early monsoon for better establishment...',
      language: 'english',
      type: 'text',
      category: 'crops',
      timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      rating: 'not-helpful'
    }
  ];

  const getTypeIcon = (type: string) => {
    const icons = {
      text: MessageSquare,
      voice: Mic,
      image: FileImage
    };
    const Icon = icons[type as keyof typeof icons] || MessageSquare;
    return <Icon className="h-3 w-3" />;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      text: 'bg-blue-100 text-blue-800',
      voice: 'bg-green-100 text-green-800',
      image: 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRatingColor = (rating?: string) => {
    const colors = {
      helpful: 'text-green-600',
      'not-helpful': 'text-red-600'
    };
    return colors[rating as keyof typeof colors] || 'text-muted-foreground';
  };

  const filteredHistory = mockHistory.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = selectedLanguage === 'all' || item.language === selectedLanguage;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesLanguage && matchesType && matchesCategory;
  });

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Query History</h1>
          <p className="text-muted-foreground">View and manage your past questions and responses</p>
        </div>
        <Button onClick={onExportHistory} className="gap-2" data-testid="button-export">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your queries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-full lg:w-40" data-testid="select-language">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="malayalam">മലയാളം</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="hindi">हिंदी</SelectItem>
                <SelectItem value="tamil">தமிழ்</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full lg:w-32" data-testid="select-type">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="voice">Voice</SelectItem>
                <SelectItem value="image">Image</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-40" data-testid="select-category">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="crops">Crops</SelectItem>
                <SelectItem value="pests">Pests & Diseases</SelectItem>
                <SelectItem value="fertilizer">Fertilizers</SelectItem>
                <SelectItem value="weather">Weather</SelectItem>
                <SelectItem value="soil">Soil</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Query History List */}
      <div className="space-y-4">
        {filteredHistory.map((item) => (
          <Card key={item.id} className="hover-elevate cursor-pointer" onClick={() => onViewQuery(item)}>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getTypeColor(item.type)}>
                      {getTypeIcon(item.type)}
                      <span className="ml-1 capitalize">{item.type}</span>
                    </Badge>
                    <Badge variant="secondary">
                      {item.category}
                    </Badge>
                    <Badge variant="outline">
                      {item.language}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatRelativeTime(item.timestamp)}</span>
                  </div>
                </div>

                {/* Question */}
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        <User className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm" data-testid={`question-${item.id}`}>
                          {item.question}
                        </p>
                        {item.imageUrl && (
                          <img 
                            src={item.imageUrl} 
                            alt="Query image" 
                            className="mt-2 rounded-md max-w-xs h-24 object-cover"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Answer */}
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs bg-accent">
                        <Bot className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-accent/20 p-3 rounded-lg">
                        <p className="text-sm" data-testid={`answer-${item.id}`}>
                          {item.answer.length > 150 ? `${item.answer.substring(0, 150)}...` : item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-4">
                    {item.rating && (
                      <div className={`text-xs ${getRatingColor(item.rating)}`}>
                        {item.rating === 'helpful' ? '👍 Helpful' : '👎 Not helpful'}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-6 w-6" data-testid={`button-more-${item.id}`}>
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHistory.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No queries found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? 'Try adjusting your search terms or filters' : 'Start asking questions to see your history here'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}