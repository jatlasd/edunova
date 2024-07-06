import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const TimestampTable = ({ behavior }) => {
  return (
    <div className='flex flex-col items-center w-full max-w-2xl mx-auto'>
      <h2 className='font-semibold text-primary text-xl mb-4'>{behavior.behavior}</h2>
      <div className="w-full border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className='bg-primary-clear' isHeader={true}>
              <TableHead className="w-1/3 text-primary-tint font-semibold text-lg">Timestamp</TableHead>
              <TableHead className='text-primary-tint font-semibold text-lg'>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {behavior.timestamps.map((timestamp, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{timestamp.time}</TableCell>
                <TableCell>{timestamp.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default TimestampTable