import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import Event from "../Components/Event";
import DisplayCarousel from "../Components/DisplayCarousel";
import LandingpageSlogan from "../Components/LandingpageSlogan";
import SearchBar from "../Components/SearchBar";
import LoadingIndicator from "../Components/LoadingIndicator";

import "../LandingPage.css";

const LandingPage = () => {
  const [bands, setBands] = useState([]);
  const [localBands, setLocalBands] = useState([]);
  const [city, setCity] = useState();
  const [countryCode, setCountryCode] = useState();
  const [country, setCountry] = useState(0);
  const [newSearch, setNewSearch] = useState("");
  const [newGenre, setNewGenre] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newCountry, setNewCountry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [upcomingLocalEvents, setUpcomingLocalEvents] = useState([]);
  const [upcomingMainstreamEvents, setUpcomingMainstreamEvents] = useState([]);

  const favouriteArtists = [];
  const currentFaveArtists = [];
  const id = sessionStorage.getItem("userId");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setNewSearch(e.target.value);
  };

  const handleChangeCity = (e) => {
    setNewCity(e.target.value);
  };

  const handleChangeCountry = (e) => {
    setNewCountry(e.target.value);
  };

  const handleChangeGenre = (e) => {
    setNewGenre(e.target.value);
  };

  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/search/${newSearch}/${newCountry}/${newCity}/${newGenre}`);
  };

  useEffect(() => {
    if (newSearch === "") {
      setNewSearch(0);
    }
    if (newCountry === "" || newCountry === "None") {
      setNewCountry(0);
    }
    if (newCity === "") {
      setNewCity(0);
    }
    if (newGenre === "" || newGenre === "None") {
      setNewGenre(0);
    }
  }, [newSearch, newCity, newCountry, newGenre]);

  useEffect(() => {
    if (id) {
      navigate("/homepage");
    }
    setIsLoading(true);
    axios
      .get(
        `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.REACT_APP_IP_API_KEY}`,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((response) => {
        setCity(response.data.city);
        setCountryCode(response.data.country_code2);
        setCountry(response.data.country_name);
        axios
          .get(
            `https://app.ticketmaster.com/discovery/v2/events?apikey=${process.env.REACT_APP_TICKETMASTER_API}&locale=*&sort=date,asc&city=${response.data.city}&countryCode=${response.data.country_code2}&segmentName=Music`
          )
          .then((response) => {
            setBands(response.data._embedded.events);
            setUpcomingMainstreamEvents(
              response.data._embedded.events.map((band) => {
                return {
                  artistId: band._embedded.attractions
                    ? band._embedded.attractions[0].id
                    : band.id,
                  eventId: band.id,
                  profilePicture: band.images.find(
                    (element) =>
                      element.ratio === "16_9" && element.height > 150
                  ).url,
                  artistName: band._embedded.attractions
                    ? band._embedded.attractions[0].name
                    : band.name,
                  eventName: band._embedded.venues
                    ? `at ${band._embedded.venues[0].name}`
                    : "",
                  date: band.dates.start.dateTime,
                  startTime: band.dates.start.dateTime,
                  info: band._embedded.venues
                    ? band._embedded.venues[0].generalInfo
                      ? band._embedded.venues[0].generalInfo.generalRule
                      : ""
                    : "",
                  address: band._embedded.venues
                    ? band._embedded.venues[0].address
                      ? band._embedded.venues[0].state
                        ? `${band._embedded.venues[0].address.line1}, ${band._embedded.venues[0].city.name} ${band._embedded.venues[0].postalCode}, ${band._embedded.venues[0].state.name}, ${band._embedded.venues[0].country.name}`
                        : `${band._embedded.venues[0].address.line1}, ${band._embedded.venues[0].postalCode} ${band._embedded.venues[0].city.name}, ${band._embedded.venues[0].country.name}`
                      : ""
                    : "",
                  artistType: "mainstream",
                };
              })
            );
          })
          .catch((error) => {
            console.log(error);
          });
        axios
          .get(
            `${process.env.REACT_APP_BACKEND_URL}api/artists/0/${response.data.country_name}/${response.data.city}/0`
          )
          .then((response) => {
            setLocalBands(response.data);
            setUpcomingLocalEvents(
              response.data.map((band) => {
                return band.upcomingEvents
                  ? band.upcomingEvents.length
                    ? band.upcomingEvents.map((event) => {
                        return {
                          artistId: band._id,
                          eventId: event._id,
                          profilePicture: `${process.env.REACT_APP_BACKEND_URL}${band.profilePicture}`,
                          artistName: band.name,
                          eventName: event.eventName,
                          date: event.date,
                          startTime: event.startTime,
                          info: event.info,
                          address: event.address,
                          artistType: "local",
                        };
                      })
                    : null
                  : null;
              })
            );
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  return (
    <div className="landingpage-container">
      <br />
      <br />
      <div className="searchbardiv">
        <SearchBar
          onChange={handleChange}
          onChangeCity={handleChangeCity}
          onChangeCountry={handleChangeCountry}
          onChangeGenre={handleChangeGenre}
          onClick={handleClick}
        />
      </div>
      <br />
      <br />
      <div>
        <LandingpageSlogan />
      </div>
      <br />
      {isLoading ? (
        <LoadingIndicator />
      ) : bands.length ? (
        <>
          <div className="BandsCarouseldiv">
            <h5>Artists:</h5>
            <DisplayCarousel
              bands={bands}
              type="non-local"
              favouriteArtists={favouriteArtists}
            />
          </div>
          <br />
          <div className="eventdiv">
            <h5>{`Upcoming Shows in ${city}, ${countryCode}:`}</h5>
            <Event upcomingEvents={upcomingMainstreamEvents} type="non-local" />
          </div>
        </>
      ) : null}
      ;
      <br />
      <br />
      {localBands.length ? (
        <>
          <div className="localBandsCarouseldiv">
            <h5>{`Local Artists in ${city}, ${countryCode}:`}</h5>
            <DisplayCarousel
              bands={bands}
              type="local"
              currentFaveArtists={currentFaveArtists}
            />
          </div>
        </>
      ) : (
        <>
          <div className="eventdiv">
            <h5>{`Local Artists in ${city}, ${countryCode}:`}</h5>
          </div>
          <div className="noShowsdiv">
            <h6>No Local Artists Available</h6>
          </div>
        </>
      )}
      {localBands.length ? (
        <div className="eventdiv">
          <h5>{`Upcoming Shows from Local Artists in ${city}, ${countryCode}:`}</h5>
          <Event
            className="upcoming-shows"
            upcomingEvents={upcomingLocalEvents}
            type="local"
          />
        </div>
      ) : null}
      ;
    </div>
  );
};

export default LandingPage;
