import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TodoTable = ({ items, type, onItemUpdate, onItemDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const isBugs = type === "Bugs";

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (a.status !== 'completed' && b.status === 'completed') return -1;
      return 0;
    });
  }, [items]);

  const handleEdit = (item) => {
    setEditingId(item._id);
    setEditForm(item);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleInputChange = (e, field) => {
    setEditForm({ ...editForm, [field]: e.target.value });
  };

  const handleSelectChange = (value, field) => {
    setEditForm((prevForm) => ({ ...prevForm, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/todo/${editingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) {
        throw new Error('Failed to update item');
      }

      const updatedItem = await response.json();
      onItemUpdate(updatedItem);
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`/api/todo/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete item');
        }

        onItemDelete(id);
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center bg-primary-clear rounded-md shadow-md">
      <h1 className="text-primary font-semibold text-2xl">{type}</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{isBugs ? 'Bug' : 'Todo'}</TableHead>
            <TableHead>Description</TableHead>
            {isBugs && <TableHead>Path</TableHead>}
            <TableHead>Notes</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((item) => (
            <TableRow 
              key={item._id}
              className={item.status === 'completed' ? 'bg-secondary/20' : ''}
            >
              <TableCell>
                {editingId === item._id ? (
                  <Input
                    value={editForm.item}
                    onChange={(e) => handleInputChange(e, 'item')}
                  />
                ) : (
                  item.item
                )}
              </TableCell>
              <TableCell>
                {editingId === item._id ? (
                  <Input
                    value={editForm.description}
                    onChange={(e) => handleInputChange(e, 'description')}
                  />
                ) : (
                  item.description
                )}
              </TableCell>
              {isBugs && (
                <TableCell>
                  {editingId === item._id ? (
                    <Input
                      value={editForm.path}
                      onChange={(e) => handleInputChange(e, 'path')}
                    />
                  ) : (
                    item.path
                  )}
                </TableCell>
              )}
              <TableCell>
                {editingId === item._id ? (
                  <Input
                    value={editForm.notes}
                    onChange={(e) => handleInputChange(e, 'notes')}
                  />
                ) : (
                  item.notes
                )}
              </TableCell>
              <TableCell>
                {editingId === item._id ? (
                  <Select
                    value={editForm.status}
                    onValueChange={(value) => handleSelectChange(value, 'status')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className='bg-white-1'>
                      <SelectItem value="open" className='cursor-pointer'>Open</SelectItem>
                      <SelectItem value="completed" className='cursor-pointer'>Completed</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  item.status
                )}
              </TableCell>
              <TableCell>
                {editingId === item._id ? (
                  <div className="flex flex-col">
                    <button onClick={handleSave} className="btn-primary">Save</button>
                    <button className="btn-secondary my-1" onClick={handleCancel}>Cancel</button>
                    <button className="rounded-md border px-2 py-1 text-base text-secondary-tint font-semibold border-secondary-tint hover:border-transparent hover:bg-secondary hover:text-white-1 transition-all duration-75" onClick={() => handleDelete(item._id)}>Delete</button>
                  </div>
                ) : (
                  <>
                    <button className="btn-primary mr-2" onClick={() => handleEdit(item)}>Edit</button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TodoTable;