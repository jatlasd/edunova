import Header from "@components/Header";
import CreateSessionDialog from "@components/sessions/CreateSessionDialog";
import NewSessionForm from "@components/sessions/NewSessionForm";
import React from "react";

const CreateNewSession = ({ params }) => {
  const { studentId } = params;
  return (
    <div className="w-full flex flex-col justify-center items-center">
        <Header />
      <div className="flex w-4/5 flex-col items-center">

        <CreateSessionDialog studentId={studentId}/>
      </div>
    </div>
  );
};

export default CreateNewSession;
