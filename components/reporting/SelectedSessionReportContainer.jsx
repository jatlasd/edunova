import { format } from "date-fns";
import TimestampTable from "./TimestampTable";

const SelectedSessionReportContainer = ({ session }) => {
  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="w-full text-center text-xl font-semibold text-primary mb-2">
        {session.name}
      </h2>
      <p>Conducted On&nbsp;:&nbsp;<span>{format(session.conductedDate, ('MM-dd-yyyy'))}</span></p>
      <div className="flex gap-5 mt-10 w-full">
      {session.behaviors.map((behavior, index) => (
        <TimestampTable key={index} behavior={behavior} />
      
      ))}
      </div>
    </div>
  );
};

export default SelectedSessionReportContainer;
