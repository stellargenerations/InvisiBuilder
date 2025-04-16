import React from 'react';

// Define TypeScript interfaces for the table structure from Sanity
interface SanityTableRow {
  _key: string;
  _type: string;
  cells: string[];
}

interface SanityTableCell {
  _key: string;
  _type: string;
  content?: any;
}

interface SanityTableProps {
  value: {
    _type: 'table';
    rows: SanityTableRow[];
  };
}

export const SanityTable: React.FC<SanityTableProps> = ({ value }) => {
  if (!value || !value.rows || !Array.isArray(value.rows)) {
    return null;
  }

  // Extract header row and body rows
  const [headerRow, ...bodyRows] = value.rows;

  return (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded">
        <thead className="bg-gray-50">
          <tr>
            {headerRow.cells.map((cell, index) => (
              <th 
                key={`header-${index}`}
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r last:border-r-0"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bodyRows.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {row.cells.map((cell, cellIndex) => (
                <td 
                  key={`cell-${rowIndex}-${cellIndex}`} 
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r last:border-r-0"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SanityTable;