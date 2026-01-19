import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import './NewPopular.css'
import { TMDB_Access_Key } from '../../config'

const NewPopular = () => {
  const [trending, setTrending] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const fetchTrending = async (page = 1, append = false) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/all/day?language=en-US&page=${page}`,
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
          setTrending(prev => [...prev, ...data.results]);
        } else {
          setTrending(data.results);
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
    fetchTrending(nextPage, true);
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchTrending(1, false);
  }, []);

  const getMediaTypeLabel = (type) => {
    switch(type) {
      case 'movie': return 'Movie';
      case 'tv': return 'TV Show';
      case 'person': return 'Person';
      default: return 'Unknown';
    }
  };

  const getTitle = (item) => {
    return item.original_title || item.name || item.title;
  };

  const getImageUrl = (item) => {
    return item.backdrop_path || item.poster_path ? 
      `https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}` : null;
  };

  const getReleaseDate = (item) => {
    const date = item.release_date || item.first_air_date;
    return date ? new Date(date).getFullYear() : 'N/A';
  };

  return (
    <div className='new-popular-page'>
      <Navbar />
      <div className='new-popular-content'>
        <div className="page-header">
          <h1>New & Popular</h1>
          <p>Trending now - what's hot and what's new</p>
        </div>
        
        {!loading && trending.length > 0 && (
          <div className="results-summary">
            <p>Showing {trending.length} of {totalResults} trending items</p>
          </div>
        )}
        
        <div className='trending-grid'>
          {trending.map((item) => (
            <div key={`${item.media_type}-${item.id}`} className='trending-card'>
              <Link to={`/player/${item.id}`} state={{ name: getTitle(item), type: item.media_type }} className="trending-link">
                {getImageUrl(item) ? (
                  <img src={getImageUrl(item)} alt={getTitle(item)} />
                ) : (
                  <div className='placeholder'>No Image</div>
                )}
                <div className="card-info">
                  <h3 className="item-title">{getTitle(item)}</h3>
                  <div className="item-details">
                    <span className="media-type">{getMediaTypeLabel(item.media_type)}</span>
                    <span className="rating">★ {item.vote_average?.toFixed(1) || 'N/A'}</span>
                    <span className="release-date">{getReleaseDate(item)}</span>
                  </div>
                  <p className="item-overview">{item.overview}</p>
                </div>
              </Link>
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
              {loading ? 'Loading...' : 'Load More Trending'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NewPopular
