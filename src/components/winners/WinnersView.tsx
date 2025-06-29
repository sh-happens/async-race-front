import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchWinners } from '../../store/winnersThunks';
import { setCurrentPage } from '../../store/winnersSlice';
import Pagination from '../common/Pagination';
import { WINNERS_PER_PAGE } from '../../types';
import './WinnersView.css';
import WinnersTable from './WinnersTable';

const WinnersView: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    winners,
    isLoading,
    error,
    totalCount,
    currentPage,
    sortField,
    sortOrder,
  } = useAppSelector((state) => state.winners);

  const totalPages = Math.ceil(totalCount / WINNERS_PER_PAGE);

  useEffect(() => {
    dispatch(fetchWinners({
      page: currentPage,
      sort: sortField,
      order: sortOrder,
    }));
  }, [dispatch, currentPage, sortField, sortOrder]);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  return (
    <div className="winners-view">
      <div className="winners-header">
        <h2 className="view-title">Winners</h2>
        <p className="winners-count">Total winners: {totalCount}</p>
      </div>

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      {isLoading ? (
        <div className="loading">Loading winners...</div>
      ) : (
        <>
          <WinnersTable winners={winners} />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {winners.length === 0 && !isLoading && (
        <div className="empty-state">
          <p>No winners yet!</p>
          <p>Start some races to see winners here 🏆</p>
        </div>
      )}
    </div>
  );
};

export default WinnersView;