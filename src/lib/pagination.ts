export const paginate = (currentPage: number, totalPages: number): number[] => {
  const pageNumbers = [];

  switch (true) {
    case totalPages <= 3:
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      break;

    case currentPage <= 2:
      for (let i = 1; i <= 3; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push(0, totalPages);
      break;

    case currentPage >= totalPages - 1:
      pageNumbers.push(1, 0);
      for (let i = totalPages - 2; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      break;

    case currentPage == 3 && totalPages >= 6:
      pageNumbers.push(1, 2, 3, 4, 0, totalPages);
      break;

    case currentPage == totalPages-2 && totalPages >= 6:
      pageNumbers.push(1, 0, totalPages-3, totalPages-2, totalPages-1, totalPages);
      break;

    default:
      pageNumbers.push(1, 0);
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push(0, totalPages);
      break;
  }

  return pageNumbers;
}
