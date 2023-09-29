import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addToFavorites,
  removeFromFavorites,
} from '../features/favoritesSlice';
import { useDispatch, useSelector } from 'react-redux';

const DetailsPage = () => {
  const { pair } = useParams();
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites);
  const { isLoggedIn } = useSelector((state) => state.login);
  const [pairDetails, setPairDetails] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(`/v1/pubticker/${pair}`);
        let result = await response.json();
        setPairDetails(result);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [pair]);

  const addToFavoritesHandler = () => {
    dispatch(addToFavorites(pair.toUpperCase()));
    navigate('/favorites');
  };

  const removeFromFavoritesHandler = () => {
    dispatch(removeFromFavorites(pair.toUpperCase()));
  };

  const isFavorite = favorites.includes(pair.toUpperCase());

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Last Price</th>
            <th>Daily High</th>
            <th>Daily Low</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{pair.toUpperCase()}</td>
            <td>{pairDetails?.last_price}</td>
            <td>{pairDetails?.high}</td>
            <td>{pairDetails?.low}</td>
          </tr>
        </tbody>
      </table>

      {isLoggedIn ? (
        isFavorite ? (
          <button onClick={removeFromFavoritesHandler} className='remove'>
            Remove from favorites
          </button>
        ) : (
          <button onClick={addToFavoritesHandler} className='add'>
            Add to favorites
          </button>
        )
      ) : null}
    </div>
  );
};

export default DetailsPage;
