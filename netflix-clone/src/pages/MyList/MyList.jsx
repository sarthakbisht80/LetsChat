import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import './MyList.css'
import { TMDB_Access_Key } from '../../config'

const MyList = () => {
  const [myList, setMyList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  // For demo purposes, we'll use a curated list since we don't have user authentication
  // In a real app, this would fetch from user's saved list
  const fetchMyList = async (page = 1, append = false) => {
    setLoading(true);
    try {
      // Using top rated movies as a demo for "My List"
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`,
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
          setMyList(prev => [...prev, ...data.results]);
        } else {
          setMyList(data.results);
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
    fetchMyList(nextPage, true);
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchMyList(1, false);
  }, []);

  return (
    <div className='my-list-page'>
      <Navbar />
      <div className='my-list-content'>
        <div className="page-header">
          <h1>My List</h1>
          <p>Your personal collection of favorite movies and shows</p>
        </div>
        
        {!loading && myList.length > 0 && (
          <div className="results-summary">
            <p>Showing {myList.length} of {totalResults} items in your list</p>
          </div>
        )}
        
        <div className='my-list-grid'>
          {myList.map((item) => (
            <div key={item.id} className='list-item-card'>
              <Link to={`/player/${item.id}`} state={{ name: item.original_title }} className="list-item-link">
                {item.backdrop_path || item.poster_path ? (
                  <img src={`https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`} alt={item.original_title} />
                ) : (
                  <div className='placeholder'>No Image</div>
                )}
                <div className="card-info">
                  <h3 className="item-title">{item.original_title}</h3>
                  <div className="item-details">
                    <span className="rating">★ {item.vote_average?.toFixed(1) || 'N/A'}</span>
                    <span className="release-date">{item.release_date ? new Date(item.release_date).getFullYear() : 'N/A'}</span>
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
              {loading ? 'Loading...' : 'Load More from My List'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyList
