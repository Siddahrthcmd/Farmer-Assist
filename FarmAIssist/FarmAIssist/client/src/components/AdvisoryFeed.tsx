import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Calendar, TrendingUp, Leaf, Bug, CloudRain, Sprout } from "lucide-react";
import { useState } from "react";

interface AdvisoryItem {
  id: string;
  title: string;
  titleMalayalam: string;
  description: string;
  category: 'crops' | 'pests' | 'weather' | 'soil' | 'fertilizer';
  language: string;
  tags: string[];
  views: number;
  createdAt: Date;
  trending?: boolean;
}

interface AdvisoryFeedProps {
  onSelectAdvisory?: (advisory: AdvisoryItem) => void;
}

export default function AdvisoryFeed({ 
  onSelectAdvisory = (advisory) => console.log('Advisory selected:', advisory)
}: AdvisoryFeedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  // todo: remove mock functionality
  const mockAdvisories: AdvisoryItem[] = [
    {
      id: '1',
      title: 'Best practices for rice cultivation in monsoon',
      titleMalayalam: 'മഴക്കാലത്ത് നെല്ലുകൃഷിയുടെ മികച്ച രീതികൾ',
      description: 'Essential techniques for successful rice farming during Kerala monsoon season',
      category: 'crops',
      language: 'malayalam',
      tags: ['rice', 'monsoon', 'kerala', 'cultivation'],
      views: 1250,
      createdAt: new Date('2024-01-15'),
      trending: true
    },
    {
      id: '2',
      title: 'Common coconut palm diseases and treatment',
      titleMalayalam: 'തെങ്ങിന്റെ സാധാരണ രോഗങ്ങളും ചികിത്സയും',
      description: 'Identify and treat major coconut palm diseases affecting Kerala farms',
      category: 'pests',
      language: 'malayalam',
      tags: ['coconut', 'diseases', 'treatment', 'kerala'],
      views: 890,
      createdAt: new Date('2024-01-10'),
      trending: true
    },
    {
      id: '3',
      title: 'Organic fertilizer preparation at home',
      titleMalayalam: 'വീട്ടിൽ ജൈവ വളം തയ്യാറാക്കുന്ന രീതി',
      description: 'Step-by-step guide to prepare organic compost using kitchen waste',
      category: 'fertilizer',
      language: 'malayalam',
      tags: ['organic', 'fertilizer', 'compost', 'homemade'],
      views: 567,
      createdAt: new Date('2024-01-08')
    },
    {
      id: '4',
      title: 'Spice cultivation techniques',
      titleMalayalam: 'മസാല വിളകളുടെ കൃഷി രീതികൾ',
      description: 'Modern techniques for growing cardamom, pepper, and other spices',
      category: 'crops',
      language: 'malayalam',
      tags: ['spices', 'cardamom', 'pepper', 'cultivation'],
      views: 432,
      createdAt: new Date('2024-01-05')
    },
    {
      id: '5',
      title: 'Weather-based crop planning',
      titleMalayalam: 'കാലാവസ്ഥ അടിസ്ഥാനമാക്കിയുള്ള കൃഷി ആസൂത്രണം',
      description: 'Plan your crops based on seasonal weather patterns in Kerala',
      category: 'weather',
      language: 'malayalam',
      tags: ['weather', 'planning', 'seasons', 'kerala'],
      views: 678,
      createdAt: new Date('2024-01-03')
    }
  ];

  const getCategoryIcon = (category: string) => {
    const icons = {
      crops: Sprout,
      pests: Bug,
      weather: CloudRain,
      soil: Leaf,
      fertilizer: TrendingUp
    };
    const Icon = icons[category as keyof typeof icons] || Leaf;
    return <Icon className="h-4 w-4" />;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      crops: 'bg-green-100 text-green-800',
      pests: 'bg-red-100 text-red-800',
      weather: 'bg-blue-100 text-blue-800',
      soil: 'bg-amber-100 text-amber-800',
      fertilizer: 'bg-purple-100 text-purple-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredAdvisories = mockAdvisories.filter(advisory => {
    const matchesSearch = advisory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         advisory.titleMalayalam.includes(searchQuery) ||
                         advisory.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || advisory.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'all' || advisory.language === selectedLanguage;
    
    return matchesSearch && matchesCategory && matchesLanguage;
  });

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Agricultural Advisory Feed</h1>
        <p className="text-muted-foreground">Quick access to farming knowledge and expert advice</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search advisories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48" data-testid="select-category">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="crops">Crops</SelectItem>
                <SelectItem value="pests">Pests & Diseases</SelectItem>
                <SelectItem value="weather">Weather</SelectItem>
                <SelectItem value="soil">Soil Management</SelectItem>
                <SelectItem value="fertilizer">Fertilizers</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-full lg:w-48" data-testid="select-language">
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
          </div>
        </CardContent>
      </Card>

      {/* Trending Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Trending This Week
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {filteredAdvisories.filter(a => a.trending).map((advisory) => (
            <Card key={advisory.id} className="hover-elevate cursor-pointer" onClick={() => onSelectAdvisory(advisory)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-1">
                    <CardTitle className="text-lg leading-tight" data-testid={`advisory-title-${advisory.id}`}>
                      {advisory.titleMalayalam}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {advisory.title}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className={getCategoryColor(advisory.category)}>
                    {getCategoryIcon(advisory.category)}
                    <span className="ml-1 capitalize">{advisory.category}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">
                  {advisory.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {advisory.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{advisory.views} views</span>
                    <span>{advisory.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* All Advisories */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Advisories</h2>
        <div className="space-y-4">
          {filteredAdvisories.filter(a => !a.trending).map((advisory) => (
            <Card key={advisory.id} className="hover-elevate cursor-pointer" onClick={() => onSelectAdvisory(advisory)}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={getCategoryColor(advisory.category)}>
                        {getCategoryIcon(advisory.category)}
                        <span className="ml-1 capitalize">{advisory.category}</span>
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-lg" data-testid={`advisory-title-${advisory.id}`}>
                      {advisory.titleMalayalam}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {advisory.title}
                    </p>
                    <p className="text-sm">
                      {advisory.description}
                    </p>
                    
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex gap-1">
                        {advisory.tags.slice(0, 4).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2">
                    <div className="text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {advisory.createdAt.toLocaleDateString()}
                      </div>
                      <div className="mt-1">
                        {advisory.views} views
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {filteredAdvisories.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No advisories found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}