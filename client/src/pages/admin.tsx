import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Settings, Database, Users, BookText, Tag, FolderTree, Newspaper, FileText, FileVideo, FileAudio, FileIcon, MessageSquare, Mail } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function AdminPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("categories");
  
  // Load categories
  const categoriesQuery = useQuery({
    queryKey: ['/api/categories'],
    enabled: activeTab === "categories",
  });
  
  // Load articles
  const articlesQuery = useQuery({
    queryKey: ['/api/articles'],
    enabled: activeTab === "articles",
  });
  
  // Load media files
  const mediaQuery = useQuery({
    queryKey: ['/api/media'],
    enabled: activeTab === "media",
  });
  
  // Load resources
  const resourcesQuery = useQuery({
    queryKey: ['/api/resources'],
    enabled: activeTab === "resources",
  });
  
  // Load content sections
  const sectionsQuery = useQuery({
    queryKey: ['/api/sections'],
    enabled: activeTab === "sections",
  });
  
  // Load contacts
  const contactsQuery = useQuery({
    queryKey: ['/api/contacts'],
    enabled: activeTab === "contacts",
  });
  
  // Load subscribers
  const subscribersQuery = useQuery({
    queryKey: ['/api/subscribers'],
    enabled: activeTab === "subscribers",
  });
  
  const refreshCategories = () => {
    categoriesQuery.refetch();
  };
  
  const refreshArticles = () => {
    articlesQuery.refetch();
  };
  
  const refreshMedia = () => {
    mediaQuery.refetch();
  };
  
  const refreshResources = () => {
    resourcesQuery.refetch();
  };
  
  const refreshSections = () => {
    sectionsQuery.refetch();
  };
  
  const refreshContacts = () => {
    contactsQuery.refetch();
  };
  
  const refreshSubscribers = () => {
    subscribersQuery.refetch();
  };
  
  // Category column definitions for DataTable
  const categoryColumns = [
    { key: "name", title: "Name", type: "text" as const },
    { key: "slug", title: "Slug", type: "text" as const },
    { key: "description", title: "Description", type: "textarea" as const },
    { key: "icon", title: "Icon", type: "text" as const }
  ];
  
  // Article column definitions for DataTable
  const articleColumns = [
    { key: "title", title: "Title *", type: "text" as const, width: "200px" },
    { key: "slug", title: "Slug * (URL-friendly)", type: "text" as const, width: "180px" },
    { key: "excerpt", title: "Excerpt * (Plain text)", type: "textarea" as const },
    { key: "featuredImage", title: "Featured Image *", type: "text" as const },
    { key: "categoryId", title: "Category ID", type: "number" as const },
    { key: "status", title: "Status", type: "text" as const },
    { key: "featured", title: "Featured", type: "boolean" as const },
    { key: "publishedDate", title: "Publish Date", type: "date" as const },
    { key: "content", title: "Content", type: "textarea" as const }
  ];
  
  // Media column definitions for DataTable
  const mediaColumns = [
    { key: "title", title: "Title", type: "text" as const },
    { key: "type", title: "Type", type: "text" as const },
    { key: "url", title: "URL", type: "text" as const },
    { key: "articleId", title: "Article ID", type: "number" as const },
    { key: "description", title: "Description", type: "textarea" as const },
    { key: "thumbnail", title: "Thumbnail", type: "text" as const },
    { key: "duration", title: "Duration", type: "text" as const }
  ];
  
  // Resource column definitions for DataTable
  const resourceColumns = [
    { key: "title", title: "Title", type: "text" as const },
    { key: "type", title: "Type", type: "text" as const },
    { key: "url", title: "URL", type: "text" as const },
    { key: "articleId", title: "Article ID", type: "number" as const },
    { key: "description", title: "Description", type: "textarea" as const }
  ];
  
  // Section column definitions for DataTable
  const sectionColumns = [
    { key: "title", title: "Title", type: "text" as const },
    { key: "content", title: "Content", type: "textarea" as const },
    { key: "order", title: "Order", type: "number" as const },
    { key: "articleId", title: "Article ID", type: "number" as const }
  ];
  
  // Contact column definitions for DataTable
  const contactColumns = [
    { key: "name", title: "Name", type: "text" as const },
    { key: "email", title: "Email", type: "text" as const },
    { key: "message", title: "Message", type: "textarea" as const, editable: false },
    { key: "status", title: "Status", type: "text" as const },
    { key: "createdAt", title: "Created At", type: "date" as const, editable: false }
  ];
  
  // Subscriber column definitions for DataTable
  const subscriberColumns = [
    { key: "email", title: "Email", type: "text" as const },
    { key: "name", title: "Name", type: "text" as const },
    { key: "status", title: "Status", type: "text" as const },
    { key: "consent", title: "Consent", type: "boolean" as const },
    { key: "createdAt", title: "Created At", type: "date" as const, editable: false }
  ];
  
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Site
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-1" />
          Settings
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
          <CardDescription>
            Manage all content for the Invisibuilder website. Edit, add, or delete items directly using the spreadsheet-like interface.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-7 h-auto">
              <TabsTrigger value="categories" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">
                <FolderTree className="h-4 w-4 mr-1" />
                Categories
              </TabsTrigger>
              <TabsTrigger value="articles" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">
                <Newspaper className="h-4 w-4 mr-1" />
                Articles
              </TabsTrigger>
              <TabsTrigger value="sections" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">
                <FileText className="h-4 w-4 mr-1" />
                Sections
              </TabsTrigger>
              <TabsTrigger value="media" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">
                <FileVideo className="h-4 w-4 mr-1" />
                Media
              </TabsTrigger>
              <TabsTrigger value="resources" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">
                <FileIcon className="h-4 w-4 mr-1" />
                Resources
              </TabsTrigger>
              <TabsTrigger value="contacts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">
                <MessageSquare className="h-4 w-4 mr-1" />
                Contacts
              </TabsTrigger>
              <TabsTrigger value="subscribers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">
                <Mail className="h-4 w-4 mr-1" />
                Subscribers
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="categories" className="space-y-4">
              <div className="border rounded-md">
                {categoriesQuery.isLoading ? (
                  <div className="p-8 text-center">Loading categories...</div>
                ) : categoriesQuery.isError ? (
                  <div className="p-8 text-center text-red-500">
                    Error loading categories. 
                    <Button variant="link" onClick={() => refreshCategories()}>Try again</Button>
                  </div>
                ) : (
                  <DataTable 
                    data={categoriesQuery.data || []}
                    columns={categoryColumns}
                    endpoint="/api/categories"
                    onRefresh={refreshCategories}
                    idField="id"
                    addNewEnabled={true}
                    deletionEnabled={true}
                  />
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="articles" className="space-y-4">
              <Alert className="mb-4 bg-blue-50">
                <AlertTitle className="flex items-center gap-2">
                  <InfoIcon className="h-4 w-4" />
                  Article Creation Help
                </AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li><strong>Fields marked with * are required</strong></li>
                    <li><strong>Slug format:</strong> lowercase letters, numbers, and hyphens only (e.g., "my-first-article")</li>
                    <li><strong>Excerpt:</strong> Enter plain text only (no HTML or Markdown)</li>
                    <li><strong>Featured Image:</strong> Enter the URL of an image</li>
                  </ul>
                </AlertDescription>
              </Alert>
              
              <div className="border rounded-md">
                {articlesQuery.isLoading ? (
                  <div className="p-8 text-center">Loading articles...</div>
                ) : articlesQuery.isError ? (
                  <div className="p-8 text-center text-red-500">
                    Error loading articles. 
                    <Button variant="link" onClick={() => refreshArticles()}>Try again</Button>
                  </div>
                ) : (
                  <DataTable 
                    data={articlesQuery.data || []}
                    columns={articleColumns}
                    endpoint="/api/articles"
                    onRefresh={refreshArticles}
                    idField="id"
                    addNewEnabled={true}
                    deletionEnabled={true}
                  />
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="media" className="space-y-4">
              <div className="border rounded-md">
                {mediaQuery.isLoading ? (
                  <div className="p-8 text-center">Loading media files...</div>
                ) : mediaQuery.isError ? (
                  <div className="p-8 text-center text-red-500">
                    Error loading media files. 
                    <Button variant="link" onClick={() => refreshMedia()}>Try again</Button>
                  </div>
                ) : (
                  <DataTable 
                    data={mediaQuery.data || []}
                    columns={mediaColumns}
                    endpoint="/api/media"
                    onRefresh={refreshMedia}
                    idField="id"
                    addNewEnabled={true}
                    deletionEnabled={true}
                  />
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="resources" className="space-y-4">
              <div className="border rounded-md">
                {resourcesQuery.isLoading ? (
                  <div className="p-8 text-center">Loading resources...</div>
                ) : resourcesQuery.isError ? (
                  <div className="p-8 text-center text-red-500">
                    Error loading resources. 
                    <Button variant="link" onClick={() => refreshResources()}>Try again</Button>
                  </div>
                ) : (
                  <DataTable 
                    data={resourcesQuery.data || []}
                    columns={resourceColumns}
                    endpoint="/api/resources"
                    onRefresh={refreshResources}
                    idField="id"
                    addNewEnabled={true}
                    deletionEnabled={true}
                  />
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="sections" className="space-y-4">
              <div className="border rounded-md">
                {sectionsQuery.isLoading ? (
                  <div className="p-8 text-center">Loading content sections...</div>
                ) : sectionsQuery.isError ? (
                  <div className="p-8 text-center text-red-500">
                    Error loading content sections. 
                    <Button variant="link" onClick={() => refreshSections()}>Try again</Button>
                  </div>
                ) : (
                  <DataTable 
                    data={sectionsQuery.data || []}
                    columns={sectionColumns}
                    endpoint="/api/sections"
                    onRefresh={refreshSections}
                    idField="id"
                    addNewEnabled={true}
                    deletionEnabled={true}
                  />
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="contacts" className="space-y-4">
              <div className="border rounded-md">
                {contactsQuery.isLoading ? (
                  <div className="p-8 text-center">Loading contacts...</div>
                ) : contactsQuery.isError ? (
                  <div className="p-8 text-center text-red-500">
                    Error loading contacts. 
                    <Button variant="link" onClick={() => refreshContacts()}>Try again</Button>
                  </div>
                ) : (
                  <DataTable 
                    data={contactsQuery.data || []}
                    columns={contactColumns}
                    endpoint="/api/contacts"
                    onRefresh={refreshContacts}
                    idField="id"
                    addNewEnabled={false}
                    deletionEnabled={true}
                  />
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="subscribers" className="space-y-4">
              <div className="border rounded-md">
                {subscribersQuery.isLoading ? (
                  <div className="p-8 text-center">Loading subscribers...</div>
                ) : subscribersQuery.isError ? (
                  <div className="p-8 text-center text-red-500">
                    Error loading subscribers. 
                    <Button variant="link" onClick={() => refreshSubscribers()}>Try again</Button>
                  </div>
                ) : (
                  <DataTable 
                    data={subscribersQuery.data || []}
                    columns={subscriberColumns}
                    endpoint="/api/subscribers"
                    onRefresh={refreshSubscribers}
                    idField="id"
                    addNewEnabled={true}
                    deletionEnabled={true}
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}