import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

import axios from "axios";

import SearchBar from "../Components/SearchBar";
import Event from "../Components/Event";
import LoadingIndicator from "../Components/LoadingIndicator";

import { getCountryCode, getGenreId } from "../utils";

const Searchpage = () => {
  let { name, city, country, genre } = useParams();
  const navigation = useNavigate();

  const [bands, setBands] = useState([]);
  const [localBands, setLocalBands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newSearch, setNewSearch] = useState("");
  const [newGenre, setNewGenre] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newCountry, setNewCountry] = useState("");
  const [currentFaveArtists, setCurrentFaveArtists] = useState([]);
  const [currentSavedEvents, setCurrentSavedEvents] = useState([]);
  const [upcomingLocalEvents, setUpcomingLocalEvents] = useState([]);
  const [upcomingMainstreamEvents, setUpcomingMainstreamEvents] = useState([]);
  let localEvents = [];

  const genreId = getGenreId(genre);
  const countryCode = getCountryCode(country);

  const id = sessionStorage.getItem("userId");

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
    navigation(`/search/${newSearch}/${newCountry}/${newCity}/${newGenre}`);
  };

  const handleEventClick = async (e) => {
    e.preventDefault();
    let eventInfo = "";
    let plannedEvents = currentSavedEvents;
    const event = JSON.parse(e.target.getAttribute("data-eventInformation"));
    eventInfo = {
      eventId: event.eventId,
      artistId: event.artistId,
      profilePicture: event.profilePicture,
      artistName: event.artistName,
      date: event.date,
      startTime: event.startTime,
      address: event.address,
      info: event.info,
      artistType: e.target.getAttribute("data-artistType"),
    };
    if (e.target.value === "Save Event") {
      if (currentSavedEvents.length > 0) {
        setCurrentSavedEvents([...currentSavedEvents, eventInfo]);
        plannedEvents = [...currentSavedEvents, eventInfo];
      } else {
        setCurrentSavedEvents([eventInfo]);
        plannedEvents = [eventInfo];
      }
    } else {
      setCurrentSavedEvents(
        currentSavedEvents.filter(
          (event) => event.eventId !== eventInfo.eventId
        )
      );
      plannedEvents = currentSavedEvents.filter(
        (event) => event.eventId !== eventInfo.eventId
      );
    }
    if (id) {
      const payload = { plannedEvents };
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}api/user/${id}/plannedEvents`,
          payload
        );
        console.log(response);
      } catch (err) {
        if (err.status === 404) {
          console.log("Resource could not be found!");
        } else {
          console.log(err.message);
        }
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    if (!name) {
      name = 0;
    }
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}api/artists/${name}/${country}/${city}/${genre}`
      )
      .then((response) => {
        setLocalBands(response.data);
        console.log(response.data);
        response.data.map((band) => {
          console.log(band);
          return band.upcomingEvents
            ? band.upcomingEvents.length
              ? band.upcomingEvents.forEach((event) => {
                  console.log(event);
                  localEvents = [
                    ...localEvents,
                    {
                      artistId: band._id,
                      eventId: event._id,
                      profilePicture: `${band.profilePicture}`,
                      artistName: band.name,
                      eventName: event.eventName,
                      date: event.date,
                      startTime: event.startTime,
                      info: event.info,
                      address: event.address,
                      artistType: "local",
                    },
                  ];
                })
              : null
            : null;
        });
        setUpcomingLocalEvents(localEvents);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
    if (name === "0") {
      name = "";
    }
    if (city === "0") {
      city = "";
    }
    if (name !== "") {
      axios
        .get(
          `https://app.ticketmaster.com/discovery/v2/events?apikey=${process.env.REACT_APP_TICKETMASTER_API}&keyword=${name}&locale=*&sort=relevance,desc&city=${city}&countryCode=${countryCode}&segmentName=Music&genreId=${genreId}`
        )
        .then((response) => {
          if (response.data._embedded) {
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
          } else {
            setBands([]);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      axios
        .get(
          `https://app.ticketmaster.com/discovery/v2/events?apikey=${process.env.REACT_APP_TICKETMASTER_API}&keyword=${name}&locale=*&sort=date,desc&city=${city}&countryCode=${countryCode}&segmentName=Music&genreId=${genreId}`
        )
        .then((response) => {
          if (response.data._embedded) {
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
                    ? band._embedded.venues[0].state
                      ? `${band._embedded.venues[0].address.line1}, ${band._embedded.venues[0].city.name} ${band._embedded.venues[0].postalCode}, ${band._embedded.venues[0].state.name}, ${band._embedded.venues[0].country.name}`
                      : `${band._embedded.venues[0].address.line1}, ${band._embedded.venues[0].postalCode} ${band._embedded.venues[0].city.name}, ${band._embedded.venues[0].country.name}`
                    : "",
                  artistType: "mainstream",
                };
              })
            );
          } else {
            setBands([]);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [countryCode, genreId, name, city, country, genre]);

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

  return (
    <div className="landingpage-container">
      <div className="searchbardiv">
        <SearchBar
          onChange={handleChange}
          onChangeCity={handleChangeCity}
          onChangeCountry={handleChangeCountry}
          onChangeGenre={handleChangeGenre}
          onClick={handleClick}
        />
      </div>
      {isLoading ? (
        <LoadingIndicator />
      ) : bands.length ? (
        <div className="eventdiv">
          {city.length > 1 && countryCode.length ? (
            <h5>{`Upcoming Shows in ${city}, ${countryCode}:`}</h5>
          ) : city.length > 1 ? (
            <h5>{`Upcoming Shows in ${city}:`}</h5>
          ) : countryCode.length ? (
            <h5>{`Upcoming Shows in ${countryCode}:`}</h5>
          ) : (
            <h5>{`Upcoming Shows:`}</h5>
          )}

          <Event
            upcomingEvents={upcomingMainstreamEvents}
            type="non-local"
            onEventClick={handleEventClick}
            currentSavedEvents={currentSavedEvents}
          />
        </div>
      ) : (
        <div className="eventdiv">
          {city.length > 1 && countryCode.length ? (
            <h5>{`Upcoming Shows in ${city}, ${countryCode}:`}</h5>
          ) : city.length > 1 ? (
            <h5>{`Upcoming Shows in ${city}:`}</h5>
          ) : countryCode.length ? (
            <h5>{`Upcoming Shows in ${countryCode}:`}</h5>
          ) : (
            <h5>{`Upcoming Shows:`}</h5>
          )}

          <div className="noShowsdiv">
            <h6>No Upcoming Shows</h6>
          </div>
        </div>
      )}

      <br />
      <br />
      {isLoading ? (
        <LoadingIndicator />
      ) : localBands.length ? (
        <div className="eventdiv">
          {city.length > 1 && countryCode.length ? (
            <h5>{`Upcoming Shows from Local Artists in ${city}, ${countryCode}:`}</h5>
          ) : city.length > 1 ? (
            <h5>{`Upcoming Shows from Local Artists in ${city}:`}</h5>
          ) : countryCode.length ? (
            <h5>{`Upcoming Shows in ${countryCode}:`}</h5>
          ) : (
            <h5>{`Upcoming Shows from Local Artists:`}</h5>
          )}
          <Event
            className="upcoming-shows"
            upcomingEvents={upcomingLocalEvents}
            type="local"
            onEventClick={handleEventClick}
            currentSavedEvents={currentSavedEvents}
          />
        </div>
      ) : (
        <div>No Matching Results</div>
      )}
    </div>
  );
};

export default Searchpage;
