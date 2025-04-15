import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

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
  addNewEnabled = true,
  deletionEnabled = true,
}: DataTableProps<T>) {
  const [editingRows, setEditingRows] = useState<Record<string | number, T>>({});
  const [isSaving, setIsSaving] = useState<Record<string | number, boolean>>({});
  const [isDeleting, setIsDeleting] = useState<Record<string | number, boolean>>({});
  const [newRow, setNewRow] = useState<Partial<T> | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  const { toast } = useToast();
  
  // Initialize new row template when columns change
  useEffect(() => {
    if (columns) {
      const template: Partial<T> = {} as Partial<T>;
      columns.forEach(column => {
        if (column.type === 'boolean') {
          template[column.key as keyof T] = false as any;
        } else if (column.type === 'number') {
          template[column.key as keyof T] = 0 as any;
        } else {
          template[column.key as keyof T] = '' as any;
        }
      });
      setNewRow(template);
    }
  }, [columns]);

  const handleEditRow = (row: T) => {
    setEditingRows(prev => ({
      ...prev,
      [row[idField]]: { ...row }
    }));
  };

  const handleCancelEdit = (id: string | number) => {
    setEditingRows(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const handleSaveRow = async (id: string | number) => {
    try {
      setIsSaving(prev => ({ ...prev, [id]: true }));
      const rowToSave = editingRows[id];

      // Use PATCH for updates to existing records
      await apiRequest(`${endpoint}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rowToSave)
      });

      // Success handling
      toast({
        title: "Saved successfully",
        description: "Your changes have been saved.",
      });
      
      // Update the UI
      handleCancelEdit(id);
      onRefresh();
    } catch (error) {
      console.error("Error saving row:", error);
      toast({
        title: "Error saving changes",
        description: "There was a problem saving your changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleDeleteRow = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
      return;
    }
    
    try {
      setIsDeleting(prev => ({ ...prev, [id]: true }));

      // DELETE request to remove the record
      await apiRequest(`${endpoint}/${id}`, {
        method: 'DELETE'
      });

      // Success handling
      toast({
        title: "Deleted successfully",
        description: "The item has been removed.",
      });
      
      // Update the UI
      onRefresh();
    } catch (error) {
      console.error("Error deleting row:", error);
      toast({
        title: "Error deleting item",
        description: "There was a problem deleting this item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleAddNew = async () => {
    if (!newRow) return;
    
    try {
      setIsAddingNew(true);
      
      // POST request to create a new record
      await apiRequest(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRow)
      });

      // Success handling
      toast({
        title: "Added successfully",
        description: "New item has been added.",
      });
      
      // Reset the new row form and refresh data
      const template: Partial<T> = {} as Partial<T>;
      columns.forEach(column => {
        if (column.type === 'boolean') {
          template[column.key as keyof T] = false as any;
        } else if (column.type === 'number') {
          template[column.key as keyof T] = 0 as any;
        } else {
          template[column.key as keyof T] = '' as any;
        }
      });
      setNewRow(template);
      onRefresh();
    } catch (error) {
      console.error("Error adding new row:", error);
      toast({
        title: "Error adding item",
        description: "There was a problem adding this item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingNew(false);
    }
  };

  const handleInputChange = (
    id: string | number, 
    key: string, 
    value: any, 
    type: string = 'text'
  ) => {
    setEditingRows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: type === 'number' ? Number(value) : value
      }
    }));
  };

  const handleNewRowChange = (
    key: string, 
    value: any, 
    type: string = 'text'
  ) => {
    if (!newRow) return;
    
    setNewRow(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [key]: type === 'number' ? Number(value) : value
      };
    });
  };

  const renderCellContent = (row: T, column: typeof columns[0]) => {
    const isEditing = editingRows[row[idField]];
    const editingRow = editingRows[row[idField]];
    
    if (isEditing && column.editable !== false) {
      switch (column.type) {
        case 'boolean':
          return (
            <Checkbox 
              checked={editingRow[column.key]} 
              onCheckedChange={(checked) => handleInputChange(row[idField], column.key, checked)} 
            />
          );
        case 'textarea':
          return (
            <textarea
              className="w-full p-2 border rounded"
              value={editingRow[column.key] || ''} 
              onChange={(e) => handleInputChange(row[idField], column.key, e.target.value)}
            />
          );
        case 'number':
          return (
            <Input 
              type="number" 
              value={editingRow[column.key] || ''} 
              onChange={(e) => handleInputChange(row[idField], column.key, e.target.value, 'number')} 
            />
          );
        case 'date':
          return (
            <Input 
              type="date" 
              value={editingRow[column.key] ? new Date(editingRow[column.key]).toISOString().split('T')[0] : ''} 
              onChange={(e) => handleInputChange(row[idField], column.key, e.target.value)} 
            />
          );
        default:
          return (
            <Input 
              type="text" 
              value={editingRow[column.key] || ''} 
              onChange={(e) => handleInputChange(row[idField], column.key, e.target.value)} 
            />
          );
      }
    } else {
      // Display mode
      if (column.type === 'boolean') {
        return <Checkbox checked={row[column.key]} disabled />;
      } else if (column.type === 'date' && row[column.key]) {
        return new Date(row[column.key]).toLocaleDateString();
      } else {
        return String(row[column.key] ?? '');
      }
    }
  };
  
  const renderNewRowCell = (column: typeof columns[0]) => {
    if (!newRow) return null;
    
    switch (column.type) {
      case 'boolean':
        return (
          <Checkbox 
            checked={newRow[column.key as keyof T] as boolean} 
            onCheckedChange={(checked) => handleNewRowChange(column.key, checked)} 
          />
        );
      case 'textarea':
        return (
          <textarea
            className="w-full p-2 border rounded"
            value={newRow[column.key as keyof T] as string || ''} 
            onChange={(e) => handleNewRowChange(column.key, e.target.value)}
            placeholder={`Enter ${column.title.toLowerCase()}`}
          />
        );
      case 'number':
        return (
          <Input 
            type="number" 
            value={newRow[column.key as keyof T] as number || ''} 
            onChange={(e) => handleNewRowChange(column.key, e.target.value, 'number')} 
            placeholder={`Enter ${column.title.toLowerCase()}`}
          />
        );
      case 'date':
        return (
          <Input 
            type="date" 
            value={newRow[column.key as keyof T] as string || ''} 
            onChange={(e) => handleNewRowChange(column.key, e.target.value)} 
          />
        );
      default:
        return (
          <Input 
            type="text" 
            value={newRow[column.key as keyof T] as string || ''} 
            onChange={(e) => handleNewRowChange(column.key, e.target.value)} 
            placeholder={`Enter ${column.title.toLowerCase()}`}
          />
        );
    }
  };

  return (
    <div className="w-full overflow-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} style={{ width: column.width }}>
                {column.title}
              </TableHead>
            ))}
            <TableHead style={{ width: '150px' }}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {addNewEnabled && (
            <TableRow className="bg-slate-50">
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {renderNewRowCell(column)}
                </TableCell>
              ))}
              <TableCell>
                <Button 
                  onClick={handleAddNew} 
                  disabled={isAddingNew}
                  size="sm"
                >
                  {isAddingNew ? (
                    <>
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Adding
                    </>
                  ) : (
                    <>
                      <Plus className="mr-1 h-4 w-4" /> Add
                    </>
                  )}
                </Button>
              </TableCell>
            </TableRow>
          )}
          {data.map((row) => (
            <TableRow key={row[idField]}>
              {columns.map((column) => (
                <TableCell key={`${row[idField]}-${column.key}`}>
                  {renderCellContent(row, column)}
                </TableCell>
              ))}
              <TableCell>
                {editingRows[row[idField]] ? (
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handleSaveRow(row[idField])} 
                      size="sm"
                      disabled={isSaving[row[idField]]}
                    >
                      {isSaving[row[idField]] ? (
                        <>
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Saving
                        </>
                      ) : (
                        <>
                          <Save className="mr-1 h-4 w-4" /> Save
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={() => handleCancelEdit(row[idField])} 
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handleEditRow(row)} 
                      variant="outline"
                      size="sm"
                    >
                      Edit
                    </Button>
                    {deletionEnabled && (
                      <Button 
                        onClick={() => handleDeleteRow(row[idField])} 
                        variant="outline"
                        size="sm"
                        disabled={isDeleting[row[idField]]}
                      >
                        {isDeleting[row[idField]] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-500" />
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && !addNewEnabled && (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="text-center py-4">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}