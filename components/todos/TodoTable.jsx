import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  

const TodoTable = ({items, type}) => {
    const isBugs = type === "Bugs"
  return (
    <div className="w-full flex flex-col items-center bg-primary-clear rounded-md shadow-md">
        <h1 className="text-primary font-semibold text-2xl ">{type}</h1>
        <Table>
            <TableHeader>
                <TableRow isHeader={true}>
                    <TableHead>{isBugs ? 'Bug' : 'Todo'}</TableHead>
                    <TableHead>Description</TableHead>
                    {isBugs && <TableHead>Path</TableHead>}
                    <TableHead>Notes</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                
            </TableBody>
        </Table>
    </div>
  )
}

export default TodoTable