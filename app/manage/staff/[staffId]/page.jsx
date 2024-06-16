import Header from "@components/Header";
import StaffDetailsTable from "@components/admin/StaffDetailsTable";
import StudentListTable from "@components/admin/StudentListTable";

const UserPage = ({ params }) => {
  const { staffId } = params;

  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="mt-10 flex w-full h-1/2 flex-col items-center">
        <h1 className="mb-16 text-5xl font-bold text-primary">Staff</h1>
        <div className="flex w-4/5 items-center justify-evenly h-full">
          <StaffDetailsTable staffId={staffId} />
          <StudentListTable staffId={staffId} />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
