"use client"
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

async function fetchFiles() {
  const response = await fetch('/api/parse-csv');

  if (!response.ok) {
    const error = await response.json(); 
    throw new Error(error.message || 'An error occurred while fetching data');
  }
  return response.json();
}

interface File {
  key: string;
  value: string;
}

export default function Home() {
  const [sortBy, setSortBy] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const { data, isLoading, isError, error } = useQuery<File[]>({
    queryKey: ['csv-data'],
    queryFn: fetchFiles,
  });

  if (isLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (isError) {
    return <div className="text-center mt-10 text-red-500">{error instanceof Error ? error.message : 'Error fetching data'}</div>;
  }

  const sortedData = [...(data || [])].sort((a, b) => {
    if (sortBy === 'createdAtAsc') {
      const dateA = new Date(Object.values(a)[0]);
      const dateB = new Date(Object.values(b)[0]);
      return dateA.getTime() - dateB.getTime();
    } else if (sortBy === 'nameAsc') {
      return Object.values(a)[1].localeCompare(Object.values(b)[1]);
    } else if (sortBy === 'nameDesc') {
      return Object.values(b)[1].localeCompare(Object.values(a)[1]);
    }
    return data;
  });

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="text-white shadow-lg rounded-lg p-6">
        <div className="flex justify-center items-center mb-6">
          <div className="relative ">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none w-[190px]"
            >
              Sort By
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-black border border-gray-600 rounded-md shadow-lg">
                <button
                  onClick={() => {
                    setSortBy('createdAtAsc');
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  Created At (Asc)
                </button>
                <button
                  onClick={() => {
                    setSortBy('nameAsc');
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  Filename (Asc)
                </button>
                <button
                  onClick={() => {
                    setSortBy('nameDesc');
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  Filename (Desc)
                </button>
              </div>
            )}
          </div>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sortedData.map((file, index) => (
            <li key={index} className="text-white shadow-lg rounded-lg p-6 border border-gray-600">
              {Object.entries(file).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center mb-2">
                  <span className="text-sm text-black">{value}</span>
                </div>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
