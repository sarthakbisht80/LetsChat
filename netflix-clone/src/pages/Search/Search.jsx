import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import './Search.css'
import { TMDB_Access_Key } from '../../config'

const Search = () => {
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const q = params.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState('movie');
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  const searchMovies = async (page = 1, append = false) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    
    // Enhanced search with multiple endpoints and pagination
    const searchEndpoints = [
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(q)}&include_adult=false&language=en-US&page=${page}`,
      `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(q)}&include_adult=false&language=en-US&page=${page}`,
      `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(q)}&include_adult=false&language=en-US&page=${page}`
    ];

    try {
      const responses = await Promise.all(
        searchEndpoints.map(endpoint =>
          fetch(endpoint, {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${TMDB_Access_Key}`
            }
          }).then(res => res.json())
        )
      );

      const [movies, tvShows, people] = responses;
      let allResults = [];
      
      // Add movies with type indicator
      if (movies.results) {
        allResults.push(...movies.results.map(item => ({ ...item, media_type: 'movie' })));
      }
      
      // Add TV shows with type indicator
      if (tvShows.results) {
        allResults.push(...tvShows.results.map(item => ({ ...item, media_type: 'tv' })));
      }
      
      // Add people with type indicator
      if (people.results) {
        allResults.push(...people.results.map(item => ({ ...item, media_type: 'person' })));
      }

      // Sort results based on selection
      if (sortBy === 'relevance') {
        allResults.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      } else if (sortBy === 'rating') {
        allResults.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
      } else if (sortBy === 'date') {
        allResults.sort((a, b) => new Date(b.release_date || b.first_air_date || 0) - new Date(a.release_date || a.first_air_date || 0));
      }

      if (append) {
        setResults(prev => [...prev, ...allResults]);
      } else {
        setResults(allResults);
      }

      // Check if there are more results
      const maxTotal = Math.max(
        movies.total_results || 0,
        tvShows.total_results || 0,
        people.total_results || 0
      );
      setTotalResults(maxTotal);
      setHasMore(allResults.length > 0 && (page * 20) < maxTotal);
      
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    searchMovies(1, false);
  }, [q, sortBy]);

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    searchMovies(nextPage, true);
  };

  const filteredResults = useMemo(() => {
    if (searchType === 'all') return results;
    return results.filter(item => item.media_type === searchType);
  }, [results, searchType]);

  const getMediaTypeLabel = (type) => {
    switch(type) {
      case 'movie': return 'Movie';
      case 'tv': return 'TV Show';
      case 'person': return 'Person';
      default: return 'Unknown';
    }
  };

  const getImageUrl = (item) => {
    if (item.media_type === 'person') {
      return item.profile_path ? `https://image.tmdb.org/t/p/w500${item.profile_path}` : null;
    }
    return item.backdrop_path || item.poster_path ? `https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}` : null;
  };

  const getTitle = (item) => {
    if (item.media_type === 'person') return item.name;
    return item.original_title || item.name || item.title;
  };

  const getReleaseDate = (item) => {
    if (item.media_type === 'person') return null;
    const date = item.release_date || item.first_air_date;
    return date ? new Date(date).getFullYear() : null;
  };

  return (
    <div className='search-page'>
      <Navbar />
      <div className='search-content'>
        <div className="search-header">
          <h2>Search results for: "{q}"</h2>
          <div className="search-filters">
            <select 
              value={searchType} 
              onChange={(e) => setSearchType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="movie">Movies</option>
              <option value="tv">TV Shows</option>
              <option value="person">People</option>
            </select>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="relevance">Most Relevant</option>
              <option value="rating">Highest Rated</option>
              <option value="date">Newest First</option>
            </select>
          </div>
        </div>
        
        {loading && currentPage === 1 && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Searching...</p>
          </div>
        )}
        
        {!loading && filteredResults.length === 0 && q && (
          <div className="no-results">
            <p>No results found for "{q}".</p>
            <p>Try different keywords or check your spelling.</p>
          </div>
        )}
        
        {!loading && filteredResults.length > 0 && (
          <div className="results-summary">
            <p>Found {filteredResults.length} results {totalResults > 0 && `of ${totalResults} total`}</p>
          </div>
        )}
        
        <div className='search-grid'>
          {filteredResults.map((item) => (
            <div key={`${item.media_type}-${item.id}`} className='search-card'>
              {item.media_type === 'person' ? (
                <Link to={`/search?q=${encodeURIComponent(item.name)}`} className="person-link">
                  {getImageUrl(item) ? (
                    <img src={getImageUrl(item)} alt={getTitle(item)} />
                  ) : (
                    <div className='placeholder person-placeholder'>No Image</div>
                  )}
                  <div className="card-info">
                    <p className="card-title">{getTitle(item)}</p>
                    <span className="media-type">Actor/Actress</span>
                  </div>
                </Link>
              ) : (
                <Link to={`/player/${item.id}`} state={{ name: getTitle(item) }} className="media-link">
                  {getImageUrl(item) ? (
                    <img src={getImageUrl(item)} alt={getTitle(item)} />
                  ) : (
                    <div className='placeholder'>No Image</div>
                  )}
                  <div className="card-info">
                    <p className="card-title">{getTitle(item)}</p>
                    <div className="card-details">
                      <span className="media-type">{getMediaTypeLabel(item.media_type)}</span>
                      {getReleaseDate(item) && <span className="release-date">{getReleaseDate(item)}</span>}
                      {item.vote_average && <span className="rating">★ {item.vote_average.toFixed(1)}</span>}
                    </div>
                  </div>
                </Link>
              )}
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
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search


