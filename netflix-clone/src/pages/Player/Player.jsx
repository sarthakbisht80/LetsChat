import React, { useEffect, useState } from 'react'
import './Player.css'
import back_arrow_icon from '../../assets/back_arrow_icon.png'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { TMDB_Access_Key } from '../../config'

const Player = (props) => {
  const location = useLocation();
  const {id} = useParams();
  const navigate = useNavigate();
  const [apiData, setApiData] = useState({
    name: "",
    key: "",
    published_at: "",
    type: ""
  });
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_Access_Key}`
    }
  };

  useEffect(()=>{
    setLoading(true);
    setError(null);
    
    // Fetch both video data and movie details
    Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options),
      fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
    ])
      .then(responses => {
        if (!responses[0].ok || !responses[1].ok) {
          throw new Error('Failed to fetch data');
        }
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(([videoData, movieData]) => {
        setMovieDetails(movieData);
        
        if (videoData.results && videoData.results.length > 0) {
          // Try to find a trailer first, then any video
          const trailer = videoData.results.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube'
          ) || videoData.results.find(video => 
            video.site === 'YouTube'
          ) || videoData.results[0];
          
          setApiData(trailer);
        } else {
          setError('No videos available for this movie');
        }
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load content. Please try again later.');
      })
      .finally(() => setLoading(false));
  },[id]);

  if (loading) {
    return (
      <div className='player'>
        <img src={back_arrow_icon} alt="" onClick={()=>{navigate(-1)}}/>
        <div className="player-loading">
          <div className="spinner"></div>
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  if (error || !apiData.key) {
    return (
      <div className='player'>
        <img src={back_arrow_icon} alt="" onClick={()=>{navigate(-1)}}/>
        <div className="player-error">
          <h2>Video Unavailable</h2>
          <p>{error || 'No video content available for this movie.'}</p>
          {movieDetails && (
            <div className="movie-fallback">
              <h3>{movieDetails.title || movieDetails.original_title}</h3>
              <p className="movie-overview">{movieDetails.overview}</p>
              <div className="movie-meta">
                <span>Release Date: {movieDetails.release_date}</span>
                <span>Rating: ★ {movieDetails.vote_average?.toFixed(1)}</span>
                <span>Runtime: {movieDetails.runtime} min</span>
              </div>
            </div>
          )}
          <button onClick={() => navigate(-1)} className="back-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='player'>
      <img src={back_arrow_icon} alt="" onClick={()=>{navigate(-1)}}/>
      <iframe 
        src={`https://www.youtube.com/embed/${apiData.key}`}
        title='trailer' 
        frameBorder='0' 
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
      <div className="player-info">
        <p>{apiData.published_at ? apiData.published_at.slice(0,10) : 'Date unavailable'}</p>
        <p>{location.state && location.state.name ? location.state.name : (movieDetails?.title || 'Movie Title')}</p>
        <p>{apiData.type || 'Video'}</p>
      </div>
    </div>
  )
}

export default Player
