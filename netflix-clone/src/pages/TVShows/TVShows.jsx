import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import './TVShows.css'
import { TMDB_Access_Key } from '../../config'
import info_icon from '../../assets/info_icon.png'

const TVShows = () => {
  const [tvShows, setTvShows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const fetchTVShows = async (page = 1, append = false) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/popular?language=en-US&page=${page}`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_Access_Key}`
          }
        }
      );
      const data = await response.json();
      
      if (data.results) {
        if (append) {
          setTvShows(prev => [...prev, ...data.results]);
        } else {
          setTvShows(data.results);
        }
        setTotalResults(data.total_results || 0);
        setHasMore(page < (data.total_pages || 0));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchTVShows(nextPage, true);
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchTVShows(1, false);
  }, []);

  return (
    <div className='tv-shows-page'>
      <Navbar />
      <div className='tv-shows-content'>
        <div className="page-header">
          <h1>TV Shows</h1>
          <p>Discover the latest and greatest TV series</p>
        </div>
        
        {!loading && tvShows.length > 0 && (
          <div className="results-summary">
            <p>Showing {tvShows.length} of {totalResults} TV shows</p>
          </div>
        )}
        
        <div className='tv-shows-grid'>
          {tvShows.map((show) => (
            <div key={show.id} className='tv-show-card'>
              <div className="card-image">
                <Link to={`/player/${show.id}`} state={{ name: show.name, type: 'tv' }} className="show-link">
                  {show.backdrop_path || show.poster_path ? (
                    <img src={`https://image.tmdb.org/t/p/w500${show.backdrop_path || show.poster_path}`} alt={show.name} />
                  ) : (
                    <div className='placeholder'>No Image</div>
                  )}
                </Link>
                <div className="card-overlay">
                  <div className="card-actions">
                    <Link to={`/player/${show.id}`} state={{ name: show.name, type: 'tv' }} className="play-btn">
                      ▶ Play
                    </Link>
                    <button className="info-btn">
                      <img src={info_icon} alt="More Info" />
                      More Info
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-info">
                <h3 className="show-title">{show.name}</h3>
                <div className="show-details">
                  <span className="rating">★ {show.vote_average?.toFixed(1) || 'N/A'}</span>
                  <span className="air-date">{show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'N/A'}</span>
                </div>
                <p className="show-overview">{show.overview}</p>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="load-more-container">
            <button 
              onClick={loadMore} 
              className="load-more-btn"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More TV Shows'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TVShows
