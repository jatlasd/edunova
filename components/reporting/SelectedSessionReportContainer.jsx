import { format } from "date-fns";
import TimestampTable from "./TimestampTable";

const SelectedSessionReportContainer = ({ session }) => {
  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="w-full text-center text-xl font-semibold text-primary mb-2">
        {session.name}
      </h2>
      <button className="my-5 border p-3" onClick={() => console.log(session.behaviors[0].timestamps)}>Behaviors1</button>
      <button className="my-5 border p-3" onClick={() => console.log(session.behaviors[1].timestamps)}>Behaviors2</button>
      <p>Conducted On&nbsp;:&nbsp;<span>{format(session.conductedDate, ('MM-dd-yyyy'))}</span></p>
      {session.behaviors.map((behavior, index) => (
        <TimestampTable key={index} behavior={behavior} />
      
      ))}
    </div>
  );
};

export default SelectedSessionReportContainer;
