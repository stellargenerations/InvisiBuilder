import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { Edit, Save, Trash, Plus } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

interface DataTableProps<T> {
  data: T[];
  columns: { 
    key: string; 
    title: string; 
    type: 'text' | 'number' | 'boolean' | 'date' | 'textarea'; 
    editable?: boolean;
    width?: string;
  }[];
  endpoint: string;
  onRefresh: () => void;
  idField?: string;
  addNewEnabled?: boolean;
  deletionEnabled?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  endpoint,
  onRefresh,
  idField = 'id',
  addNewEnabled = false,
  deletionEnabled = false
}: DataTableProps<T>) {
  const { toast } = useToast();
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Record<string, any>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newRowData, setNewRowData] = useState<Record<string, any>>({});

  const handleEditRow = (row: T) => {
    setEditRowId(row[idField]);
    setEditData(row);
  };

  const handleSaveRow = async () => {
    try {
      if (!editRowId) return;

      await apiRequest(`${endpoint}/${editRowId}`, {
        method: 'PUT',
        body: JSON.stringify(editData)
      });

      toast({
        title: "Success",
        description: "Row updated successfully.",
      });

      setEditRowId(null);
      setEditData({});
      onRefresh();
    } catch (error) {
      console.error('Error updating row:', error);
      toast({
        title: "Error",
        description: "Failed to update row. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRow = async (id: number) => {
    try {
      if (!deletionEnabled) return;

      if (!confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
        return;
      }

      await apiRequest(`${endpoint}/${id}`, {
        method: 'DELETE'
      });

      toast({
        title: "Success",
        description: "Item deleted successfully.",
      });

      onRefresh();
    } catch (error) {
      console.error('Error deleting row:', error);
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddNew = () => {
    // Initialize with empty values for all columns
    const initialData: Record<string, any> = {};
    columns.forEach(column => {
      if (column.key === 'featured') {
        initialData[column.key] = false;
      } else if (column.key === 'status') {
        initialData[column.key] = 'published';
      } else if (column.type === 'boolean') {
        initialData[column.key] = false;
      } else if (column.type === 'number') {
        initialData[column.key] = 0;
      } else if (column.type === 'date') {
        initialData[column.key] = new Date().toISOString().split('T')[0];
      } else if (column.key === 'tags') {
        initialData[column.key] = [];
      } else {
        initialData[column.key] = '';
      }
    });
    
    // If it's articles, set some defaults
    if (endpoint === '/api/articles') {
      initialData.featured = false;
      initialData.status = 'published';
      initialData.content = '';
      initialData.readTime = '5 min';
    }
    
    setNewRowData(initialData);
    setIsAdding(true);
  };

  const handleSaveNewRow = async () => {
    try {
      // Check required fields for articles
      if (endpoint === '/api/articles') {
        const requiredFields = ['title', 'slug', 'excerpt', 'featuredImage'];
        const missingFields = requiredFields.filter(field => !newRowData[field]);
        
        if (missingFields.length > 0) {
          toast({
            title: "Validation Error",
            description: `Please fill in all required fields: ${missingFields.join(', ')}`,
            variant: "destructive",
          });
          return;
        }
        
        // Check slug format
        const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        if (newRowData.slug && !slugRegex.test(newRowData.slug)) {
          toast({
            title: "Invalid Slug Format",
            description: "Slug must be lowercase with hyphens between words, no special characters",
            variant: "destructive",
          });
          return;
        }
      }
      
      const response = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(newRowData)
      });

      toast({
        title: "Success",
        description: "New item added successfully.",
      });

      setIsAdding(false);
      setNewRowData({});
      onRefresh();
    } catch (error: any) {
      console.error('Error adding new row:', error);
      
      // Attempt to parse error message if it's from our API
      let errorMessage = "Failed to add new item. Please try again.";
      try {
        if (error.message && typeof error.message === 'string') {
          const parsed = JSON.parse(error.message);
          if (parsed && parsed.message) {
            errorMessage = parsed.message;
          }
        }
      } catch (e) {
        // If parsing fails, use generic message
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewRowData({});
  };

  const handleInputChange = (
    key: string, 
    value: string | number | boolean | null | undefined, 
    isNewRow: boolean = false
  ) => {
    if (isNewRow) {
      setNewRowData(prev => ({ ...prev, [key]: value }));
    } else {
      setEditData(prev => ({ ...prev, [key]: value }));
    }
  };

  const renderCellContent = (row: T, column: typeof columns[0]) => {
    const isEditing = editRowId === row[idField];
    const value = row[column.key];
    const editable = column.editable !== false;
    
    if (isEditing && editable) {
      if (column.type === 'text') {
        return (
          <Input 
            value={editData[column.key] || ''}
            onChange={(e) => handleInputChange(column.key, e.target.value)}
            className="w-full"
          />
        );
      } else if (column.type === 'textarea') {
        return (
          <Textarea 
            value={editData[column.key] || ''}
            onChange={(e) => handleInputChange(column.key, e.target.value)}
            className="w-full min-h-[100px]"
          />
        );
      } else if (column.type === 'number') {
        return (
          <Input 
            type="number"
            value={editData[column.key] || 0}
            onChange={(e) => handleInputChange(column.key, Number(e.target.value))}
            className="w-full"
          />
        );
      } else if (column.type === 'boolean') {
        return (
          <Checkbox 
            checked={!!editData[column.key]}
            onCheckedChange={(checked) => handleInputChange(column.key, !!checked)}
          />
        );
      } else if (column.type === 'date') {
        return (
          <Input 
            type="date"
            value={editData[column.key] ? new Date(editData[column.key]).toISOString().split('T')[0] : ''}
            onChange={(e) => handleInputChange(column.key, e.target.value)}
            className="w-full"
          />
        );
      }
    }
    
    // Display mode
    if (column.type === 'boolean') {
      return <Checkbox checked={!!value} disabled />;
    } else if (column.type === 'date' && value) {
      return value ? format(new Date(value), 'MMM dd, yyyy') : '';
    } else if (column.type === 'textarea') {
      return (
        <div className="max-h-[100px] overflow-auto text-sm">
          {typeof value === 'object' 
            ? (value === null ? '' : JSON.stringify(value, null, 2))
            : (value || '')}
        </div>
      );
    } else {
      // Handle different value types to prevent React errors
      if (value === null || value === undefined) {
        return '';
      } else if (typeof value === 'object') {
        if (Array.isArray(value)) {
          return value.join(', ');
        } else {
          // Handle Sanity style objects like {_type: "slug", current: "value"}
          if (value._type === 'slug' && value.current) {
            return value.current;
          } else if (value._id) {
            return `ID: ${value._id}`;
          } else {
            // Convert object to JSON string
            try {
              return JSON.stringify(value);
            } catch (e) {
              return '[Object]';
            }
          }
        }
      } else {
        return String(value);
      }
    }
  };

  const renderNewRowInputs = () => {
    return (
      <TableRow className="bg-gray-50">
        {columns.map((column, colIndex) => (
          <TableCell key={colIndex}>
            {column.type === 'text' && (
              <Input 
                value={newRowData[column.key] || ''}
                onChange={(e) => handleInputChange(column.key, e.target.value, true)}
                className="w-full"
                placeholder={column.title}
              />
            )}
            {column.type === 'textarea' && (
              <Textarea 
                value={newRowData[column.key] || ''}
                onChange={(e) => handleInputChange(column.key, e.target.value, true)}
                className="w-full min-h-[100px]"
                placeholder={column.title}
              />
            )}
            {column.type === 'number' && (
              <Input 
                type="number"
                value={newRowData[column.key] || 0}
                onChange={(e) => handleInputChange(column.key, Number(e.target.value), true)}
                className="w-full"
                placeholder={column.title}
              />
            )}
            {column.type === 'boolean' && (
              <Checkbox 
                checked={!!newRowData[column.key]}
                onCheckedChange={(checked) => handleInputChange(column.key, !!checked, true)}
              />
            )}
            {column.type === 'date' && (
              <Input 
                type="date"
                value={newRowData[column.key] || ''}
                onChange={(e) => handleInputChange(column.key, e.target.value, true)}
                className="w-full"
              />
            )}
          </TableCell>
        ))}
        <TableCell>
          <div className="flex space-x-2">
            <Button size="sm" onClick={handleSaveNewRow}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancelAdd}>
              Cancel
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="rounded-md border">
      <div className="p-2">
        {addNewEnabled && !isAdding && (
          <Button size="sm" onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-1" />
            Add New
          </Button>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index} style={column.width ? { width: column.width } : undefined}>
                {column.title}
              </TableHead>
            ))}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isAdding && renderNewRowInputs()}
          
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="text-center py-6 text-gray-500">
                No items found
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>
                    {renderCellContent(row, column)}
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {editRowId === row[idField] ? (
                      <Button size="sm" onClick={handleSaveRow}>
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleEditRow(row)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                    
                    {deletionEnabled && (
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDeleteRow(row[idField])}
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}