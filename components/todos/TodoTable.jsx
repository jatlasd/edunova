// import { useState, useMemo } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// const TodoTable = ({ items, type, onItemUpdate, onItemDelete }) => {
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({});
//   const isBugs = type === "Bugs";

//   const sortedItems = useMemo(() => {
//     return [...items].sort((a, b) => {
//       if (a.status === 'completed' && b.status !== 'completed') return 1;
//       if (a.status !== 'completed' && b.status === 'completed') return -1;
//       return 0;
//     });
//   }, [items]);

//   const handleEdit = (item) => {
//     setEditingId(item._id);
//     setEditForm(item);
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditForm({});
//   };

//   const handleInputChange = (e, field) => {
//     setEditForm({ ...editForm, [field]: e.target.value });
//   };

//   const handleSelectChange = (value, field) => {
//     setEditForm((prevForm) => ({ ...prevForm, [field]: value }));
//   };

//   const handleSave = async () => {
//     try {
//       const response = await fetch(`/api/todo/${editingId}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(editForm)
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update item');
//       }

//       const updatedItem = await response.json();
//       onItemUpdate(updatedItem);
//       setEditingId(null);
//       setEditForm({});
//     } catch (error) {
//       console.error('Failed to update item:', error);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this item?')) {
//       try {
//         const response = await fetch(`/api/todo/${id}`, {
//           method: 'DELETE',
//         });

//         if (!response.ok) {
//           throw new Error('Failed to delete item');
//         }

//         onItemDelete(id);
//       } catch (error) {
//         console.error('Failed to delete item:', error);
//       }
//     }
//   };

//   return (
//     <div className="w-full flex flex-col items-center bg-white-5 rounded-md shadow-lg">
//       <h1 className="text-primary font-semibold text-2xl">{type}</h1>
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead className='w-[150px]'>{isBugs ? 'Bug' : 'Todo'}</TableHead>
//             <TableHead>Description</TableHead>
//             {isBugs && <TableHead>Path</TableHead>}
//             <TableHead className='w-[200px]'>Notes</TableHead>
//             <TableHead className='w-[100px]'>Status</TableHead>
//             <TableHead className='w-[100px]'>Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {sortedItems.map((item) => (
//             <TableRow 
//               key={item._id}
//               className={item.status === 'completed' ? 'bg-secondary/20' : ''}
//             >
//               <TableCell>
//                 {editingId === item._id ? (
//                   <Input
//                     value={editForm.item}
//                     onChange={(e) => handleInputChange(e, 'item')}
//                   />
//                 ) : (
//                   item.item
//                 )}
//               </TableCell>
//               <TableCell>
//                 {editingId === item._id ? (
//                   <Input
//                     value={editForm.description}
//                     onChange={(e) => handleInputChange(e, 'description')}
//                   />
//                 ) : (
//                   item.description
//                 )}
//               </TableCell>
//               {isBugs && (
//                 <TableCell>
//                   {editingId === item._id ? (
//                     <Input
//                       value={editForm.path}
//                       onChange={(e) => handleInputChange(e, 'path')}
//                     />
//                   ) : (
//                     item.path
//                   )}
//                 </TableCell>
//               )}
//               <TableCell>
//                 {editingId === item._id ? (
//                   <Input
//                     value={editForm.notes}
//                     onChange={(e) => handleInputChange(e, 'notes')}
//                   />
//                 ) : (
//                   item.notes
//                 )}
//               </TableCell>
//               <TableCell>
//                 {editingId === item._id ? (
//                   <Select
//                     value={editForm.status}
//                     onValueChange={(value) => handleSelectChange(value, 'status')}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select status" />
//                     </SelectTrigger>
//                     <SelectContent className='bg-white-1'>
//                       <SelectItem value="open" className='cursor-pointer'>Open</SelectItem>
//                       <SelectItem value="completed" className='cursor-pointer'>Completed</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 ) : (
//                   <span className="capitalize">{item.status}</span>
//                 )}
//               </TableCell>
//               <TableCell>
//                 {editingId === item._id ? (
//                   <div className="flex flex-col">
//                     <button onClick={handleSave} className="btn-primary">Save</button>
//                     <button className="btn-secondary my-1" onClick={handleCancel}>Cancel</button>
//                     <button className="rounded-md border px-2 py-1 text-base text-secondary-tint font-semibold border-secondary-tint hover:border-transparent hover:bg-secondary hover:text-white-1 transition-all duration-75" onClick={() => handleDelete(item._id)}>Delete</button>
//                   </div>
//                 ) : (
//                   <>
//                     <button className="btn-primary mr-2" onClick={() => handleEdit(item)}>Edit</button>
//                   </>
//                 )}
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// };

// export default TodoTable;

import { useState, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
    <div className="w-full flex flex-col items-center bg-white-5 rounded-md shadow-lg p-4">
      <h1 className="text-primary font-semibold text-2xl mb-4">{type}</h1>
      <Accordion type="single" collapsible className="w-full">
        {sortedItems.map((item) => (
          <AccordionItem 
            key={item._id} 
            value={item._id}
            className={item.status === 'completed' ? 'bg-secondary/20' : ''}
          >
            <AccordionTrigger className='text-primary-tint font-semibold px-3'>{item.item}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div>
                  <p className="text-primary-tint font-semibold">Description:&nbsp;</p>
                  {editingId === item._id ? (
                    <Input
                      value={editForm.description}
                      onChange={(e) => handleInputChange(e, 'description')}
                    />
                  ) : (
                    <p>{item.description}</p>
                  )}
                </div>
                {isBugs && (
                  <div>
                  <p className="text-primary-tint font-semibold">Path:&nbsp;</p>
                  {editingId === item._id ? (
                      <Input
                        value={editForm.path}
                        onChange={(e) => handleInputChange(e, 'path')}
                      />
                    ) : (
                      <p>{item.path}</p>
                    )}
                  </div>
                )}
                <div>
                <p className="text-primary-tint font-semibold">Notes:&nbsp;</p>
                {editingId === item._id ? (
                    <Input
                      value={editForm.notes}
                      onChange={(e) => handleInputChange(e, 'notes')}
                    />
                  ) : (
                    <p>{item.notes}</p>
                  )}
                </div>
                <div>
                <p className="text-primary-tint font-semibold">Status:&nbsp;</p>
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
                    <span className="capitalize">{item.status}</span>
                  )}
                </div>
                <div className="flex space-x-2 mt-4">
                              {editingId === item._id ? (
                  <div className="flex items-center w-full ml-5">
                    <button onClick={handleSave} className="btn-primary">Save</button>
                    <button className="btn-secondary ml-2" onClick={handleCancel}>Cancel</button>
                    <button className="ml-auto mr-10 rounded-md border px-2 py-1 text-base text-secondary-tint font-semibold border-secondary-tint hover:border-transparent hover:bg-secondary hover:text-white-1 transition-all duration-75" onClick={() => handleDelete(item._id)}>Delete</button>
                  </div>
                ) : (
                  <>
                    <button className="btn-primary mr-2" onClick={() => handleEdit(item)}>Edit</button>
                  </>
                )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default TodoTable;