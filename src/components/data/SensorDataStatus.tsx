"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  FileIcon,
  TableIcon,
  ReaderIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";

import ReactToPrint from "react-to-print";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import PaginationButtons  from "@/components/ui/PaginationButtons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";

import {
  Card,
  DonutChart,
  Title,
  AreaChart,
  BarChart,
  Flex,
  Switch,
} from "@tremor/react";
import dataBarbie from "../../movie-barbie.json";

import { ExportToCsv } from "../exports/ExportToCsv";
import { ExportToExcel } from "../exports/ExportToExcel";
import { ExportToTxt } from "../exports/ExportToTxt";
import { handleUpdateData } from "./UpdateData";
import { ExportAlertDialog } from "../exports/ExportAlertDialog";

interface SensorDataProps {
  sensorType: string;
  endpoint: string;
}
const chartdata = [
  {
    name: "Acc Collocated",
    "Number of threatened species": 35,
  },
  {
    name: "Acc Non Colo",
    "Number of threatened species": 8,
  },
  {
    name: "Acc 2020",
    "Number of threatened species": 4,
  },
  {
    name: "Acc REIS",
    "Number of threatened species": 12,
  },
];

const SensorDataStatus: React.FC<SensorDataProps> = ({
  sensorType,
  endpoint,
}) => {
  const [data, setData] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedExportType, setSelectedExportType] = useState("");
  const [sortColumn, setSortColumn] = useState<string>("No.");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10; // Jumlah item per halaman

  const countOn = data ? data.filter((item) => item.Status === "ON").length : 0;
  const countOff = data
    ? data.filter((item) => item.Status === "OFF").length
    : 0;
  const countGap = data
    ? data.filter((item) => item.Status === "GAP").length
    : 0;

  // Calculate the total count
  const totalCount = data ? data.length : 0;

  // Calculate the percentages
  const percentageOn = (countOn / totalCount) * 100;
  const percentageOff = (countOff / totalCount) * 100;
  const percentageGap = (countGap / totalCount) * 100;

  // Use the percentages to generate data for the DonutChart
  const donutChartData = [
    { name: "ON", userScore: percentageOn },
    { name: "OFF", userScore: percentageOff },
    { name: "GAP", userScore: percentageGap },
  ];

  // Sorting logic
  const sortedData =
    useMemo(() => {
      if (!data) return null;

      return [...data].sort((a, b) => {
        const valueA = a[sortColumn];
        const valueB = b[sortColumn];

        if (sortOrder === "asc") {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
    }, [data, sortColumn, sortOrder]) ?? [];

  // Handle sorting
  const handleSort = (columnName: string) => {
    if (columnName === sortColumn) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnName);
      setSortOrder("asc");
    }
  };

  // Paginate data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData
    ? sortedData.slice(indexOfFirstItem, indexOfLastItem)
    : null;

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const buttonExport = [
    {
      title: "CSV",
      icon: <FileIcon />,
      export: () => ExportToCsv(data, "sensor_data.csv"),
      style: "gap-3 bg-green-400 hover:bg-green-600",
    },
    {
      title: "Excel",
      icon: <TableIcon />,
      export: () => ExportToExcel(data, "sensor_data.xlsx"),
      style: "gap-3 bg-green-700 hover:bg-green-900",
    },
    {
      title: "TXT",
      icon: <ReaderIcon />,
      export: () => ExportToTxt(data, "sensor_data.txt"),
      style: "gap-3 bg-stone-600 hover:bg-stone-800",
    },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(endpoint);
        const result = await response.json();
        if (response.ok) {
          setData(result);
        } else {
          setError(result.error);
        }
      } catch (error) {
        setError("Error fetching data.");
      }
    }
    fetchData();
  }, [endpoint]);

  return (
    <>
      <h1 className="text-7xl p-4 mb-6 font-bold text-center scroll-m-20 border-b tracking-tight first:mt-0">{`Sensor ${sensorType}`}</h1>
      <div
        ref={componentRef}
        className="flex flex-col min-h-screen overflow-x-auto"
      >
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
                    <Input placeholder="Search" />
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-arround">
                <div
                  className="flex-2 rounded-md border my-3 bg-white"
                  ref={componentRef}
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead onClick={() => handleSort("No.")}>
                          No.{" "}
                          {sortColumn === "No." && sortOrder === "asc"
                            ? "▲"
                            : "▼"}
                        </TableHead>
                        <TableHead onClick={() => handleSort("Last Data")}>
                          Last Data{" "}
                          {sortColumn === "Last Data" && sortOrder === "asc"
                            ? "▲"
                            : "▼"}
                        </TableHead>
                        <TableHead onClick={() => handleSort("Sensor")}>
                          Sensor{" "}
                          {sortColumn === "Sensor" && sortOrder === "asc"
                            ? "▲"
                            : "▼"}
                        </TableHead>
                        <TableHead onClick={() => handleSort("Status")}>
                          Status{" "}
                          {sortColumn === "Status" && sortOrder === "asc"
                            ? "▲"
                            : "▼"}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems &&
                        currentItems.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            <TableCell>{rowIndex + 1 + indexOfFirstItem}</TableCell>
                            {Object.values(row).map((cell, cellIndex) => (
                              <TableCell key={cellIndex}>{String(cell)}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>

                  {/* Render pagination buttons */}
                  <div className="gap-2 mx-3 my-2">
                    <PaginationButtons
                    sortedData={sortedData} itemsPerPage={itemsPerPage} paginate={paginate} />
                  </div>
                </div>
                <div className="flex-1 h-screen rounded-lg flex flex-col space-y-4 p-4">
                  {/* <div className="border-dashed border border-zinc-500 w-full h-40 rounded-lg"> */}
                  <Card className="container mx-auto max-w-lg mb-6 light-tremor">
                    <Title>Status</Title>
                    <DonutChart
                      className="mt-6 mb-6"
                      data={donutChartData}
                      category="userScore"
                      index="name"
                      colors={["green", "slate", "yellow"]}
                      label={`${percentageOn.toFixed()}%`}
                    />
                  </Card>
                  <Card className="container mx-auto max-w-lg mb-6 light-tremor">
                    <Title>Jumlah Sensor per Jenis</Title>
                    <BarChart
                      className="mt-6"
                      data={chartdata}
                      index="name"
                      categories={["Number of threatened species"]}
                      colors={["blue"]}
                      yAxisWidth={48}
                    />
                  </Card>
                  {/* </div> */}
                  {/* <div className="border-dashed border border-zinc-500 w-full h-1/2 rounded-lg"> */}

                  {/* </div> */}
                </div>
               
              </div>

              <div className="flex flex-row gap-2">
                {buttonExport.map((item, index) => {
                  return (
                    <Button
                      key={index}
                      onClick={() => {
                        setIsExportDialogOpen(true);
                        setSelectedExportType(item.title);
                      }}
                      className={item.style}
                    >
                      {item.icon}
                      {item.title}
                    </Button>
                  );
                })}
              </div>

              <ExportAlertDialog
                isOpen={isExportDialogOpen}
                onCancel={() => setIsExportDialogOpen(false)}
                onExport={() => {
                  switch (selectedExportType) {
                    case "CSV":
                      ExportToCsv(data, "sensor_data.csv");
                      break;
                    case "Excel":
                      ExportToExcel(data, "sensor_data.xlsx");
                      break;
                    case "TXT":
                      ExportToTxt(data, "sensor_data.txt");
                      break;
                    default:
                      break;
                  }
                  setIsExportDialogOpen(false);
                }}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SensorDataStatus;
