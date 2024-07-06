import { format } from "date-fns";
import TimestampTable from "./TimestampTable";

const SelectedSessionReportContainer = ({ session }) => {
  return (
    <div className="flex w-full flex-col items-center">
      {/* Header */}
      <h2 className="mb-2 w-full text-center text-xl font-semibold text-primary">
        {session.name}
      </h2>
      <p>
        Conducted On&nbsp;:&nbsp;
        <span>{format(session.conductedDate, "MM-dd-yyyy")}</span>
      </p>
      {/* Report Cards */}
      <div className="flex w-full flex-col gap-5">
        <div className="flex flex-col items-center bg-white-2 p-10 shadow-md rounded-md">
          <h1 className="text-primary font-bold text-2xl w-1/5 pb-1 border-b border-b-primary/30 text-center">Behavior Logs</h1>
        <div className="mt-5 flex w-full gap-5 ">
          {session.behaviors.map((behavior, index) => (
            <TimestampTable key={index} behavior={behavior} />
          ))}
        </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedSessionReportContainer;
