import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPair, updatePair } from '../features/tickerSlice';
import { Link, useLocation } from 'react-router-dom';

const HomePage = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.ticker);
  const favorites = useSelector((state) => state.favorites);

  const location = useLocation();

  const showFivePairs = async () => {
    try {
      let response = await fetch('/v1/symbols');
      let pairs = await response.json();
      return pairs.slice(0, 5);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const ws = new WebSocket('wss://api-pub.bitfinex.com/ws/2');

    // Define a function to create the desired object structure
    const createApiCallObject = (name) => {
      return {
        event: 'subscribe',
        channel: 'ticker',
        symbol: 't' + name.toUpperCase(),
      };
    };

    // Mapping the array of pairs to the desired object structure
    showFivePairs().then((pairs) => {
      const apiCalls = pairs.map((pair) => createApiCallObject(pair));

      ws.onopen = () => {
        // Sending each API call object as a JSON string
        apiCalls.forEach((apiCall) => {
          ws.send(JSON.stringify(apiCall));
        });
      };
    });

    ws.onmessage = (msg) => {
      const response = JSON.parse(msg.data);

      if (response.event === 'subscribed') {
        dispatch(
          addPair({ symbol: response.pair, channelId: response.chanId })
        );
      }

      if (response[1] && typeof response[1] !== 'string') {
        dispatch(
          updatePair({
            channelId: response[0],
            lastPrice: response[1][6],
            dailyChange: response[1][4],
            dailyChangePercent: response[1][5] * 100,
            dailyHigh: response[1][8],
            dailyLow: response[1][9],
          })
        );
      }
    };

    ws.onerror = (error) => {
      console.error(`ws error:`, error);
    };

    ws.onclose = (msg) => {
      console.log('closed', msg);
    };
    return () => {
      if (ws.readyState === 1) {
        ws.close();
      }
    };
  }, [favorites]);

  const getFavoriteItems = (favorites, data) => {
    return data.filter((item) => favorites.includes(item.symbol));
  };
  const matchedPairs = getFavoriteItems(favorites, data);

  const isFavoritesRoute = location.pathname === '/favorites';

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Last Price</th>
            <th>Daily Change</th>
            <th>Daily Change Percent</th>
            <th>Daily High</th>
            <th>Daily Low</th>
          </tr>
        </thead>
        <tbody>
          {/* Conditionally render pairs based on the route */}
          {isFavoritesRoute
            ? /* Render favorite pairs */
              matchedPairs.map((item, index) => (
                <tr key={index}>
                  <td>
                    <Link
                      to={`/details/${item.symbol.toLowerCase()}`}
                      className='pair-name'
                    >
                      {item.symbol}
                    </Link>
                  </td>
                  <td>{item.lastPrice}</td>
                  <td>{item.dailyChange}</td>
                  <td>{item.dailyChangePercent}</td>
                  <td>{item.dailyHigh}</td>
                  <td>{item.dailyLow}</td>
                </tr>
              ))
            : /* Render all 5 pairs */
              data.map((item, index) => (
                <tr key={index}>
                  <td>
                    <Link
                      to={`/details/${item.symbol.toLowerCase()}`}
                      className='pair-name'
                    >
                      {item.symbol}
                    </Link>
                  </td>
                  <td>{item.lastPrice}</td>
                  <td>{item.dailyChange}</td>
                  <td>{item.dailyChangePercent}</td>
                  <td>{item.dailyHigh}</td>
                  <td>{item.dailyLow}</td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default HomePage;
