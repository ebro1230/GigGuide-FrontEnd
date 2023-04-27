import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import axios from "axios";

import Event from "../Components/Event";
import DisplayCarousel from "../Components/DisplayCarousel";
import SearchBar from "../Components/SearchBar";
import LoadingIndicator from "../Components/LoadingIndicator";

import "../LandingPage.css";

import { getCountryCode } from "../utils";

const LocalBandsPage = () => {
  const [localBands, setLocalBands] = useState([]);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [genre, setGenre] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newSearch, setNewSearch] = useState("");
  const [newGenre, setNewGenre] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newCountry, setNewCountry] = useState(0);
  const [currentFaveArtists, setCurrentFaveArtists] = useState([]);
  const [currentSavedEvents, setCurrentSavedEvents] = useState([]);
  const [upcomingLocalEvents, setUpcomingLocalEvents] = useState([]);
  let localEvents = [];

  const id = sessionStorage.getItem("userId");

  const navigation = useNavigate();

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

  const handleSearchClick = (e) => {
    e.preventDefault();
    navigation(`/search/${newSearch}/${newCountry}/${newCity}/${newGenre}`);
  };

  const handleHeartClick = async (e) => {
    e.preventDefault();
    const faveId = e.target.getAttribute("id");
    const faveName = e.target.getAttribute("title");
    const favePic = e.target.getAttribute("pic");
    const faveTouring = e.target.getAttribute("data-touring");
    const fave = {
      id: faveId,
      name: faveName,
      pic: favePic,
      touring: faveTouring,
    };
    let favouriteArtists = currentFaveArtists;
    if (
      e.target.src ===
      `${process.env.REACT_APP_BACKEND_URL}profile-pics/Outline.png`
    ) {
      if (currentFaveArtists.length > 0) {
        setCurrentFaveArtists([...currentFaveArtists, fave]);
        favouriteArtists = [...currentFaveArtists, fave];
      } else {
        setCurrentFaveArtists([fave]);
        favouriteArtists = [fave];
      }
    } else {
      setCurrentFaveArtists(
        currentFaveArtists.filter((artist) => artist.id !== e.target.id)
      );
      favouriteArtists = currentFaveArtists.filter(
        (artist) => artist.id !== e.target.id
      );
    }
    if (id) {
      const payload = { favouriteArtists };
      try {
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}api/user/${id}/faveArtist`,
          payload
        );
      } catch (err) {
        if (err.status === 404) {
          console.log("Resource could not be found!");
        } else {
          console.log(err.message);
        }
      }
    }
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
    setIsLoading(true);

    if (id) {
      localEvents = [];
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}api/artists/${id}`)
        .then((response) => {
          setCity(response.data.city);
          setCountry(response.data.country);
          setCountryCode(getCountryCode(response.data.country));
          if (response.data.favouriteGenre.length) {
            setGenre(response.data.favouriteGenre);
            axios
              .get(
                `${process.env.REACT_APP_BACKEND_URL}api/artists/0/${response.data.country}/${response.data.city}/${response.data.favouriteGenre}`
              )
              .then((response) => {
                setLocalBands(response.data);
                localEvents = [];
                response.data.map((band) => {
                  return band.upcomingEvents
                    ? band.upcomingEvents.length
                      ? band.upcomingEvents.forEach((event) => {
                          console.log(event);
                          localEvents = [
                            ...localEvents,
                            {
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
              });
          } else {
            setGenre(0);
            axios
              .get(
                `${process.env.REACT_APP_BACKEND_URL}api/artists/0/${response.data.country}/${response.data.city}/0`
              )
              .then((response) => {
                setLocalBands(response.data);
                localEvents = [];
                response.data.map((band) => {
                  return band.upcomingEvents
                    ? band.upcomingEvents.length
                      ? band.upcomingEvents.forEach((event) => {
                          console.log(localEvents);
                          localEvents = [
                            ...localEvents,
                            {
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
              });
          }
          setCurrentFaveArtists(response.data.favouriteArtists);
          setCurrentSavedEvents(response.data.plannedEvents);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      localEvents = [];
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
          console.log(response);
          setCity(response.data.city);
          setCountryCode(response.data.country_code2);
          setCountry(response.data.country_name);
          axios
            .get(
              `${process.env.REACT_APP_BACKEND_URL}api/artists/0/${response.data.country_name}/${response.data.city}/0`
            )
            .then((response) => {
              setLocalBands(response.data);
              localEvents = [];
              response.data.map((band) => {
                return band.upcomingEvents
                  ? band.upcomingEvents.length
                    ? band.upcomingEvents.forEach((event) => {
                        console.log(localEvents);
                        localEvents = [
                          ...localEvents,
                          {
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
        });
    }
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
          onClick={handleSearchClick}
        />
      </div>
      <br />
      <br />
      <br />
      {isLoading ? (
        <LoadingIndicator />
      ) : localBands.length ? (
        <>
          <div className="localBandsCarouseldiv">
            {city.length > 1 && countryCode.length ? (
              <h5>{`Local Artists in ${city}, ${countryCode}:`}</h5>
            ) : city.length > 1 ? (
              <h5>{`Local Artists in ${city}:`}</h5>
            ) : countryCode.length ? (
              <h5>{`Artists in ${countryCode}:`}</h5>
            ) : (
              <h5>{`Artists:`}</h5>
            )}
            <DisplayCarousel
              bands={localBands}
              type="local"
              onHeartClick={handleHeartClick}
              currentFaveArtists={currentFaveArtists}
            />
          </div>
        </>
      ) : (
        <>
          <br />
          <br />
          <h6 style={{ color: "white" }}>No Local Artists Available</h6>
        </>
      )}
      {/* {isLoading ? (
        <LoadingIndicator />
      ) : id ? (
        currentSavedEvents.length ? (
          <>
            <br />
            <br />
            <div className="eventdiv">
              {city.length > 1 && countryCode.length ? (
                <h5>{`Saved Upcoming Shows from Local Artists in ${city}, ${countryCode}:`}</h5>
              ) : city.length > 1 ? (
                <h5>{`Saved Upcoming Shows from Local Artists in ${city}:`}</h5>
              ) : countryCode.length ? (
                <h5>{`Saved Upcoming Shows in ${countryCode}:`}</h5>
              ) : (
                <h5>{`Saved Upcoming Shows:`}</h5>
              )}
              <SavedEvents
                className="upcoming-shows"
                events={currentSavedEvents}
                onEventClick={handleEventClick}
                type="local"
              />
            </div>
          </>
        ) : (
          <>
            <br />
            <br />
            <h6 style={{ color: "white" }}>No Saved Upcoming Local Shows</h6>
          </>
        )
      ) : null} */}
      {isLoading ? (
        <LoadingIndicator />
      ) : localBands.length ? (
        <>
          <br />
          <br />
          <div className="eventdiv">
            {city.length > 1 && countryCode.length ? (
              <h5>{`Upcoming Shows from Local Artists in ${city}, ${countryCode}:`}</h5>
            ) : city.length > 1 ? (
              <h5>{`Upcoming Shows from Local Artists in ${city}:`}</h5>
            ) : countryCode.length ? (
              <h5>{`Upcoming Shows in ${countryCode}:`}</h5>
            ) : (
              <h5>{`Upcoming Shows:`}</h5>
            )}
            <Event
              className="upcoming-shows"
              upcomingEvents={upcomingLocalEvents}
              type="local"
              onEventClick={handleEventClick}
              currentSavedEvents={currentSavedEvents}
            />
          </div>
        </>
      ) : null}
      ;
    </div>
  );
};

export default LocalBandsPage;
