"use client"

import React, { useState, useEffect, useRef } from 'react'
import { FileIcon, TableIcon, ReaderIcon, UpdateIcon } from '@radix-ui/react-icons'

import ReactToPrint from 'react-to-print'
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Loading from '@/components/ui/loading'

import { Card, DonutChart, Title, AreaChart, BarChart, Flex, Switch } from "@tremor/react";
import dataBarbie from '../../movie-barbie.json';


import { ExportToCsv } from '../exports/ExportToCsv'
import { ExportToExcel } from '../exports/ExportToExcel'
import { ExportToTxt } from '../exports/ExportToTxt'
import { handleUpdateData } from './UpdateData'
import { ExportAlertDialog } from '../exports/ExportAlertDialog'

interface SensorDataProps {
  sensorType: string
  endpoint: string
}
const chartdata = [
  {
    name: "Acc Collocated",
    "Number of threatened species": 2488,
  },
  {
    name: "Acc Non Colo",
    "Number of threatened species": 1445,
  },
  {
    name: "Acc 2020",
    "Number of threatened species": 743,
  },
  {
    name: "Acc REIS",
    "Number of threatened species": 281,
  }
];



const SensorDataStatus: React.FC<SensorDataProps> = ({ sensorType, endpoint }) => {
  const [data, setData] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const componentRef = useRef<HTMLDivElement>(null)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [selectedExportType, setSelectedExportType] = useState('')
  const [sortColumn, setSortColumn] = useState<string>('No.');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10; // Jumlah item per halaman

  const countOn = data ? data.filter(item => item.Status === 'ON').length : 0;
  const countOff = data ? data.filter(item => item.Status === 'OFF').length : 0;
  const countGap = data ? data.filter(item => item.Status === 'GAP').length : 0;


  // Calculate the total count
  const totalCount = data ? data.length : 0;

  // Calculate the percentages
  const percentageOn = (countOn / totalCount) * 100;
  const percentageOff = (countOff / totalCount) * 100;
  const percentageGap = (countGap / totalCount) * 100;

  // Use the percentages to generate data for the DonutChart
  const donutChartData = [
    { name: 'ON', userScore: percentageOn },
    { name: 'OFF', userScore: percentageOff },
    { name: 'GAP', userScore: percentageGap },
  ];
  const handleSort = (columnName: string) => {
    if (columnName === sortColumn) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnName);
      setSortOrder('asc');
    }
  };

  // Sort data based on the current sort column and order
  const sortedData = data
    ? [...data].sort((a, b) => {
        const valueA = a[sortColumn];
        const valueB = b[sortColumn];

        if (sortOrder === 'asc') {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      })
    : null;
      // Paginate data
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data ? data.slice(indexOfFirstItem, indexOfLastItem) : null;

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


  const buttonExport = [
    { title: 'CSV', icon: <FileIcon />, export: () => ExportToCsv(data, 'sensor_data.csv'), style: 'gap-3 bg-green-400 hover:bg-green-600' },
    { title: 'Excel', icon: <TableIcon />, export: () => ExportToExcel(data, 'sensor_data.xlsx'), style: 'gap-3 bg-green-700 hover:bg-green-900' },
    { title: 'TXT', icon: <ReaderIcon />, export: () => ExportToTxt(data, 'sensor_data.txt'), style: 'gap-3 bg-stone-600 hover:bg-stone-800' }
  ]

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(endpoint)
        const result = await response.json()
        if (response.ok) {
          setData(result)
        } else {
          setError(result.error)
        }
      } catch (error) {
        setError('Error fetching data.')
      }
    }
    fetchData()
  }, [endpoint])


  return (
    <>
      <h1 className="text-7xl p-4 mb-6 font-bold text-center scroll-m-20 border-b tracking-tight first:mt-0">{`Sensor ${sensorType}`}</h1>
      <div ref={componentRef} className="flex flex-col min-h-screen overflow-x-auto">
        <div className="flex-grow overflow-x-auto">
          {error ? (
            <p>{error}</p>
          ) : data === null ? (
            <div className="flex justify-center items-center h-screen">
              <Loading />
            </div>
          ) : (
            <>
              <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-4 py-2">
                  <Button
                    className="gap-3 bg-yellow-500 hover:bg-yellow-700"
                    onClick={handleUpdateData}
                  >
                    <UpdateIcon />
                  </Button>
                  <div>
                    <Input
                      placeholder="Search"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-between">
                
              <div className="rounded-md border my-3">
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('No.')}>
              No. {sortColumn === 'No.' && sortOrder === 'asc' ? '▲' : '▼'}
            </th>
            <th onClick={() => handleSort('Last Data')}>
              Last Data {sortColumn === 'Last Data' && sortOrder === 'asc' ? '▲' : '▼'}
            </th>
            <th onClick={() => handleSort('Sensor')}>
              Sensor {sortColumn === 'Sensor' && sortOrder === 'asc' ? '▲' : '▼'}
            </th>
            <th onClick={() => handleSort('Status')}>
              Status {sortColumn === 'Status' && sortOrder === 'asc' ? '▲' : '▼'}
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems &&
            currentItems.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>{rowIndex + 1 + indexOfFirstItem}</td>
                {Object.values(row).map((cell, cellIndex) => (
                  <td key={cellIndex}>{String(cell)}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>

      {/* Render pagination buttons */}
      <div>
        {data &&
          Array.from({ length: Math.ceil(data.length / itemsPerPage) }).map((_, index) => (
            <button key={index} onClick={() => paginate(index + 1)}>
              {index + 1}
            </button>
          ))}
      </div>
    </div>
                    <div className='w-full h-screen rounded-lg flex flex-row space-x-4 p-4'>
                  <div className="border-dashed border border-zinc-500 w-full h-40 rounded-lg">
                  <Card className="max-w-lg mb-6 light-tremor">
                    <Title>Status</Title>
                    <DonutChart
                      className="mt-6 mb-6"
                      data= {donutChartData}
                      category="userScore"
                      index="name"
                      colors={["green", "slate", "yellow"]} 
                      label={`${percentageOn.toFixed()}%`}
                    />
                  </Card>
                          </div>
                  <div className="border-dashed border border-zinc-500 w-full h-1/2 rounded-lg">
                  <Card>
                        <Title>Jumlah Sensor perJenis</Title>
                        <BarChart
                          className="mt-6"
                          data={chartdata}
                          index="name"
                          categories={["Number of threatened species"]}
                          colors={["blue"]}
                          yAxisWidth={48}
                        />
                      </Card>
                  </div>
                      </div>            
              </div>
              
              <div className="flex flex-row gap-2">
                {buttonExport.map((item, index) => {
                  return (
                    <Button
                      key={index}
                      onClick={() => {
                        setIsExportDialogOpen(true)
                        setSelectedExportType(item.title)
                      }}
                      className={item.style}
                    >
                      {item.icon}
                      {item.title}
                    </Button>
                  )
                })}
              </div>

              <ExportAlertDialog
                isOpen={isExportDialogOpen}
                onCancel={() => setIsExportDialogOpen(false)}
                onExport={() => {
                  switch (selectedExportType) {
                    case 'CSV':
                      ExportToCsv(data, 'sensor_data.csv')
                      break
                    case 'Excel':
                      ExportToExcel(data, 'sensor_data.xlsx')
                      break
                    case 'TXT':
                      ExportToTxt(data, 'sensor_data.txt')
                      break
                    default:
                      break
                  }
                  setIsExportDialogOpen(false)
                }}
              />
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default SensorDataStatus
