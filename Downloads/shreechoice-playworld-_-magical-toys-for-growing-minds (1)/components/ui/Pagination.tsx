
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons/Icon';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    // Logic to create page numbers with ellipsis for large number of pages
    // For simplicity, we'll show a limited set of numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }
    
    return (
        <nav className="flex items-center justify-center space-x-2 mt-12" aria-label="Pagination">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeftIcon className="w-5 h-5" />
                <span className="sr-only">Previous</span>
            </button>

            {startPage > 1 && (
                <>
                    <button onClick={() => onPageChange(1)} className="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100">1</button>
                    {startPage > 2 && <span className="px-4 py-2 text-sm">...</span>}
                </>
            )}

            {pageNumbers.map(number => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`px-4 py-2 text-sm font-bold rounded-md ${currentPage === number ? 'bg-brand-primary text-white' : 'hover:bg-gray-100'}`}
                >
                    {number}
                </button>
            ))}

            {endPage < totalPages && (
                 <>
                    {endPage < totalPages -1 && <span className="px-4 py-2 text-sm">...</span>}
                    <button onClick={() => onPageChange(totalPages)} className="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100">{totalPages}</button>
                </>
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronRightIcon className="w-5 h-5" />
                 <span className="sr-only">Next</span>
            </button>
        </nav>
    );
};
