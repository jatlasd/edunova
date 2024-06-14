import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const UserTable = ({ students }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className='w-[100px]'>
          <TableHead>Name</TableHead>
          <TableHead>Grade</TableHead>
          <TableHead>Age</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student._id}>
            <TableCell>{student.name}</TableCell>
            <TableCell>{student.grade}</TableCell>
            <TableCell>{student.age}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
