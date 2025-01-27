
const Pagination = ({
    totalPages,
    currentPage,
    onPageChange,
}: {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}) => {
    const getPaginationRange = () => {
        const range: (number | string)[] = [];
        const delta = 2; // Number of pages to show before and after the current page

        if (totalPages <= 5) {
            // Show all pages if total pages are small
            for (let i = 1; i <= totalPages; i++) {
                range.push(i);
            }
        } else {
            // Always show first, last, and surrounding pages with ellipses
            range.push(1);
            if (currentPage > delta + 2) range.push('...');
            for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
                range.push(i);
            }
            if (currentPage < totalPages - delta - 1) range.push('...');
            range.push(totalPages);
        }

        return range;
    };

    const paginationRange = getPaginationRange();

    return (
        <div className="flex gap-2 justify-center mt-4">
            {/* Previous Button */}
            <button
                className={`px-4 py-2 border-[1px] ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                disabled={currentPage === 1}
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            >
                Prev
            </button>

            {/* Page Numbers */}
            {paginationRange.map((page, index) => (
                <button
                    key={index}
                    className={`px-4 py-2 border-[1px] ${currentPage === page
                            ? 'bg-primary text-white'
                            : typeof page === 'number'
                                ? 'bg-gray-200 hover:bg-gray-300'
                                : 'bg-transparent cursor-default'
                        }`}
                    onClick={() => typeof page === 'number' && onPageChange(page)}
                    disabled={typeof page !== 'number'}
                >
                    {page}
                </button>
            ))}

            {/* Next Button */}
            <button
                className={`px-4 py-2 border-[1px] ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
                disabled={currentPage === totalPages}
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
