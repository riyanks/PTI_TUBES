import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { motion } from "framer-motion";

interface PaginationButtonsProps {
  sortedData: any[]; // Gantilah YourType dengan tipe data yang sesuai
  itemsPerPage: number;
  paginate: (pageNumber: number) => void;
}

const PaginationButtons: React.FC<PaginationButtonsProps> = ({ sortedData, itemsPerPage, paginate }) => {
  const pageCount = Math.ceil(sortedData.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
    paginate(selected + 1);
  };

  const paginationVariants = {
    hidden: {
      opacity: 0,
      y: 200,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 2,
      },
    },
  };

  const showNextButton = currentPage !== totalPages - 1;
  const showPrevButton = currentPage !== 0;

  return (
    <motion.div variants={paginationVariants} initial="hidden" animate="visible">
      <ReactPaginate
        breakLabel={<span className="mr-4">...</span>}
        nextLabel={
          showNextButton ? (
            <span className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-md">
              <BsChevronRight />
            </span>
          ) : null
        }
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel={
          showPrevButton ? (
            <span className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-md mr-4">
              <BsChevronLeft />
            </span>
          ) : null
        }
        containerClassName="flex items-center justify-center mt-8 mb-4"
        pageClassName="block border- border-solid border-yellow-500 hover:bg-yellow-700 w-10 h-10 flex items-center justify-center rounded-md mr-4"
        activeClassName="bg-yellow-500 text-white"
      />
    </motion.div>
  );
};

export default PaginationButtons;
