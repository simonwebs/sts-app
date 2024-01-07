/* eslint-disable react/jsx-no-duplicate-props */
import React from 'react';
import ReactPaginate from 'react-paginate';

const SinglesPagination = ({ pageCount, onPageChange }) => {
  const customButtonStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '8px',
    margin: '2px',
    cursor: 'pointer',
    borderRadius: '4px',
    border: '1px solid #ccc',
  };

  const customActiveButtonStyles = {
    ...customButtonStyles,
    backgroundColor: '#4CAF50',
    color: 'white',
  };

  return (
    <ReactPaginate
      pageCount={pageCount}
      pageRangeDisplayed={2}
      marginPagesDisplayed={1}
      onPageChange={onPageChange}
      containerClassName="pagination"
      activeClassName="active"
      previousLabel={
        <div style={customButtonStyles}>
          &lt; Previous
        </div>
      }
      nextLabel={
        <div style={customButtonStyles}>
          Next &gt;
        </div>
      }
      breakLabel={'...'}
      breakClassName={'break-me'}
      pageClassName={'pagination-item'}
      pageLinkClassName={'pagination-link'}
      previousClassName={'pagination-previous'}
      nextClassName={'pagination-next'}
      disabledClassName={'pagination-disabled'}
      activeLinkClassName={'pagination-active-link'}
      previousLinkClassName={'pagination-previous-link'}
      nextLinkClassName={'pagination-next-link'}
      containerClassName={'pagination-container'}
      subContainerClassName={'pagination-subcontainer'}
      activeClassName={'active'}
      pageRangeDisplayed={2}
    />
  );
};

export default SinglesPagination;
