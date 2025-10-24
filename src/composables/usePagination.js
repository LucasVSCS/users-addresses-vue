export function usePagination () {
  const getPageNumbers = (currentPage, lastPage) => {
    const pages = []
    const maxVisible = 5

    if (lastPage <= maxVisible) {
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push('...')
        pages.push(lastPage)
      } else if (currentPage >= lastPage - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = lastPage - 3; i <= lastPage; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push('...')
        pages.push(lastPage)
      }
    }

    return pages
  }

  return {
    getPageNumbers
  }
}
