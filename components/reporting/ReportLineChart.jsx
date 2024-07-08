import React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip } from "recharts";

const ReportLineChart = ({ session }) => {
  const parseTime = (timeStr) => {
    const [time, meridiem] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (meridiem.toLowerCase() === "pm" && hours !== 12) hours += 12;
    if (meridiem.toLowerCase() === "am" && hours === 12) hours = 0;
    return new Date(2024, 0, 1, hours, minutes).getTime();
  };

  const consolidateTimestamps = () => {
    let consolidatedTimestamps = [];
    session.behaviors.forEach((behavior) => {
      behavior.timestamps.forEach((timestamp) => {
        consolidatedTimestamps.push({
          behavior: behavior.behavior,
          time: timestamp.time,
          notes: timestamp.notes,
        });
      });
    });
    consolidatedTimestamps.sort((a, b) => parseTime(a.time) - parseTime(b.time));
    return consolidatedTimestamps;
  };

  const data = consolidateTimestamps();

  const prepareChartData = () => {
    const countMap = {};
    data.forEach((item) => {
      if (!countMap[item.time]) {
        countMap[item.time] = {
          time: item.time,
          events: []
        };
      }
      countMap[item.time].events.push({
        behavior: item.behavior,
        notes: item.notes
      });
    });

    return Object.values(countMap).map(entry => ({
      ...entry,
      count: entry.events.length
    }));
  };

  const chartData = prepareChartData();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-2 border rounded shadow bg-white-1">
          {data.events.map((event, index) => (
            <div key={index} className={`mb-3 ${index === data.events.length - 1 ? '' : 'mb-3'}`}>
              <p className="font-semibold text-primary">Behavior:&nbsp;<span className="font-normal text-black-1">{event.behavior}</span></p>
              <p className="font-semibold text-primary">Time:&nbsp;<span className="font-normal text-black-1">{data.time}</span></p>
              <p className="font-semibold text-primary">Notes:&nbsp;<span className="font-normal text-black-1">{event.notes}</span></p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-5 items-center">
      <h1 className="font-semibold text-primary text-2xl mt-5 w-1/2 border-b border-b-primary/30 text-center pb-1">Timeline of Behaviors</h1>
      <LineChart
        width={600}
        height={300}
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="time"
          type="category"
          tickFormatter={(tick) => tick}
        />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#1e857b"
          dot={{ r: 5 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </div>
  );
};

export default ReportLineChart;