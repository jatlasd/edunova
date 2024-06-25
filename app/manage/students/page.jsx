import Header from "@components/Header"
import ManageStudentsTable from "@components/admin/ManageStudentsTable"
import AdminAddStudentDialog from "@components/admin/AdminAddStudentDialog"


const ManageStudents = () => {


  return (
    <div className="flex flex-col items-center">
      <Header />
      <h1 className="mt-10 mb-5 text-primary-tint font-bold text-3xl">Manage Students</h1>
      <AdminAddStudentDialog />
      <ManageStudentsTable />
    </div>
  )
}

export default ManageStudents