import { format } from "date-fns";
import TimestampTable from "./TimestampTable";
import { calculateDuration } from "@lib/reportingutils";
import ReportLineChart from "./ReportLineChart";
import GenerateAi from "./GenerateAi";

const SelectedSessionReportContainer = ({ session }) => {
  const { formattedDuration } = calculateDuration(session.startTime, session.endTime)



  const handleClick = () => {
    // const timestamps = consolidateTimestamps()
    console.log(session)
  };
  return (
    <div className="flex w-full flex-col items-center">

      {/* Header */}
      <div className="flex flex-col items-center">
        <h2 className="mb-2 w-full text-center text-3xl font-semibold text-primary">
          {session.name}
        </h2>
        {/* <button className="btn-primary mt-2 mb-5" onClick={handleClick}>click!!!</button> */}
        <p className="text-primary font-semibold">Conducted On&nbsp;:&nbsp;<span className="text-black-1 font-normal">{format(session.conductedDate, "MM-dd-yyyy")}</span></p>
        <div className="flex gap-5 mt-2">
        <p className="text-primary font-semibold">Start Time&nbsp;:&nbsp;<span className="text-black-1 font-normal">{session.startTime}</span></p>
        <p className="text-primary font-semibold">End Time&nbsp;:&nbsp;<span className="text-black-1 font-normal">{session.endTime}</span></p>
        <p className="text-primary font-semibold">Duration&nbsp;:&nbsp;<span className="text-black-1 font-normal">{formattedDuration}</span></p>
        </div>
        <div className="flex gap-5 mt-2">
        <p className="text-primary font-semibold">Location&nbsp;:&nbsp;<span className="text-black-1 font-normal">{session.location}</span></p>
        <p className="text-primary font-semibold">Subject&nbsp;:&nbsp;<span className="text-black-1 font-normal">{session.subject}</span></p>
        <p className="text-primary font-semibold">Teacher&nbsp;:&nbsp;<span className="text-black-1 font-normal">{session.teacher}</span></p>
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
            <ReportLineChart session={session}/>
        </div>
      </div>
      <GenerateAi session={session}/>

    </div>
  );
};

export default SelectedSessionReportContainer;
