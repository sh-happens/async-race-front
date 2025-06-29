import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setSortField, setSortOrder } from '../../store/winnersSlice';
import type { WinnerWithCar, SortField, SortOrder } from '../../types';
import './WinnersTable.css';

interface WinnersTableProps {
  winners: WinnerWithCar[];
}

const WinnersTable: React.FC<WinnersTableProps> = ({ winners }) => {
  const dispatch = useAppDispatch();
  const { sortField, sortOrder } = useAppSelector((state) => state.winners);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      const newOrder: SortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      dispatch(setSortOrder(newOrder));
    } else {
      dispatch(setSortField(field));
      dispatch(setSortOrder('asc'));
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const formatTime = (time: number) => {
    return `${time.toFixed(2)}s`;
  };

  return (
    <div className="winners-table-container">
      <table className="winners-table">
        <thead>
          <tr>
            <th className="col-number">№</th>
            <th className="col-car">Car</th>
            <th className="col-name">Name</th>
            <th
              className="col-wins sortable"
              onClick={() => handleSort('wins')}
            >
              Wins {getSortIcon('wins')}
            </th>
            <th
              className="col-time sortable"
              onClick={() => handleSort('time')}
            >
              Best Time {getSortIcon('time')}
            </th>
          </tr>
        </thead>
        <tbody>
          {winners.map((winner) => (
            <tr key={winner.id}>
              <td className="col-number">{winner.id}</td>
              <td className="col-car">
                <div
                  className="car-icon"
                  style={{ backgroundColor: winner.car.color }}
                  title={`${winner.car.name} - ${winner.car.color}`}
                />
              </td>
              <td className="col-name">{winner.car.name}</td>
              <td className="col-wins">{winner.wins}</td>
              <td className="col-time">{formatTime(winner.time)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WinnersTable;