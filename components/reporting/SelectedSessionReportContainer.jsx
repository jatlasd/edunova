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
        {/* TimestampTables */}
        <div className="flex flex-col items-center rounded-md bg-white-2 p-10 shadow-md">
          <h1 className="w-1/5 border-b border-b-primary/30 pb-1 text-center text-2xl font-bold text-primary">
            Behavior Logs
          </h1>
          <div className="mt-5 flex w-full gap-5">
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
