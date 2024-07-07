import { format } from "date-fns";
import TimestampTable from "./TimestampTable";
import { calculateDuration } from "@lib/reportingutils";

const SelectedSessionReportContainer = ({ session }) => {
  const handleClick = () => {
    console.log(calculateDuration(session.startTime, session.endTime));
  };
  return (
    <div className="flex w-full flex-col items-center">

      {/* Header */}
      <div className="flex flex-col items-center">
        <h2 className="mb-2 w-full text-center text-xl font-semibold text-primary">
          {session.name}
        </h2>
        <p className="text-primary font-semibold">Conducted On&nbsp;:&nbsp;<span className="text-black-1 font-normal">{format(session.conductedDate, "MM-dd-yyyy")}</span></p>
        <div className="flex gap-5 mt-2">
        <p className="text-primary font-semibold">Start Time&nbsp;:&nbsp;<span className="text-black-1 font-normal">{session.startTime}</span></p>
        <p className="text-primary font-semibold">End Time&nbsp;:&nbsp;<span className="text-black-1 font-normal">{session.endTime}</span></p>
        <p className="text-primary font-semibold">Duration&nbsp;:&nbsp;<span className="text-black-1 font-normal">{calculateDuration(session.startTime, session.endTime)}</span></p>
        </div>
      </div>

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
