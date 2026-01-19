import React, { useEffect, useRef, useState } from 'react'
import './TitleCards.css'
import { Link } from 'react-router-dom'
import { TMDB_Access_Key } from '../../config'
import info_icon from '../../assets/info_icon.png'

const TitleCards = ({title, category}) => {

  const [apiData, setApiData] = useState([]);
  const cardsRef = useRef();

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_Access_Key}`
    }
  };
  

  const handleWheel = (event)=>{
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  }

  useEffect(()=>{
    fetch(`https://api.themoviedb.org/3/movie/${category?category:"now_playing"}?language=en-US&page=1`, options)
      .then(response => response.json())
      .then(response => setApiData(response.results || []))
      .catch(err => console.error(err));

    const el = cardsRef.current;
    el && el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el && el.removeEventListener('wheel', handleWheel);
    }
  },[category])

  return (
    <div className='title-cards'>
      <h2>{title?title:"Popular on Netflix"}</h2>
      <div className="card-list" ref={cardsRef}>
        {apiData.map((card, index)=>{
          return (
            <div key={index} className="card-container">
              <Link to={`/player/${card.id}`} state={{ name: card.original_title }} className="card">
                <img src={`https://image.tmdb.org/t/p/w500`+card.backdrop_path} alt="" />
                <p>{card.original_title}</p>
              </Link>
              <div className="card-overlay">
                <div className="card-actions">
                  <Link to={`/player/${card.id}`} state={{ name: card.original_title }} className="play-btn">
                    ▶ Play
                  </Link>
                  <button className="info-btn">
                    <img src={info_icon} alt="More Info" />
                    More Info
                  </button>
                </div>
                <div className="card-details">
                  <span className="rating">★ {card.vote_average?.toFixed(1) || 'N/A'}</span>
                  <span className="year">{card.release_date ? new Date(card.release_date).getFullYear() : 'N/A'}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TitleCards
