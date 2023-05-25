import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import FanProfilepage from "./FanProfilepage";
import ArtistProfilepage from "./ArtistProfilepage";
import LoadingIndicator from "../Components/LoadingIndicator";

const UserProfilepage = () => {
  const { userId } = useParams();
  const id = sessionStorage.getItem("userId");
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentFaveArtists, setCurrentFaveArtists] = useState([]);
  const [currentSavedEvents, setCurrentSavedEvents] = useState([]);
  const [isTouring, setIsTouring] = useState(false);
  const [fanChange, setFanChange] = useState(0);
  const [artistChange, setArtistChange] = useState(0);
  const [userProfileImgRaw, setUserProfileImgRaw] = useState("");
  const [userName, setUserName] = useState("");

  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newCountry, setNewCountry] = useState("");
  const [newGenre, setNewGenre] = useState("");
  const [newProfilePicture, setNewProfilePicture] = useState("");
  const [newBannerPicture, setNewBannerPicture] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [showSongsModal, setShowSongsModal] = useState(false);
  const [newSong, setNewSong] = useState({
    name: "",
    minutes: "",
    seconds: "",
    url: "",
    releaseDate: "",
    album: "",
  });

  const [showEventModal, setShowEventModal] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventCity, setEventCity] = useState("");
  const [eventCountry, setEventCountry] = useState("");
  const [eventStreet, setEventStreet] = useState("");
  const [eventPostalCode, setEventPostalCode] = useState("");
  const [eventState, setEventState] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [displayDate, setDisplayDate] = useState("");
  const [displayReleaseDate, setDisplayReleaseDate] = useState("");
  const [eventInfo, setEventInfo] = useState("");

  const handleHeartClick = async (e) => {
    e.preventDefault();
    //console.log("clicked");
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
      } catch (err) {
        if (err.status === 404) {
          console.log("Resource could not be found!");
        } else {
          console.log(err.message);
        }
      }
    }
  };

  const handleProfilePictureChange = (e) => {
    const img = e.target.files[0];
    setNewProfilePicture(img);
  };

  const handleBannerPictureChange = (e) => {
    const img = e.target.files[0];
    setNewBannerPicture(img);
  };

  const handleEditUser = () => {
    setShowProfileModal(true);
  };
  const handleHideProfileModal = () => setShowProfileModal(false);

  const handleAgeChange = (e) => setNewAge(e.target.value);

  const handleCityChange = (e) => setNewCity(e.target.value);

  const handleCountryChange = (e) => setNewCountry(e.target.value);

  const handleNameChange = (e) => setNewName(e.target.value);

  const handleGenreChange = (e) => setNewGenre(e.target.value);

  const handleFanProfileUpdateSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("profile", newProfilePicture);
    formData.append("banner", newBannerPicture);
    formData.append("name", newName);
    formData.append("age", newAge);
    formData.append("city", newCity);
    formData.append("country", newCountry);

    axios
      .put(`${process.env.REACT_APP_BACKEND_URL}api/user/${id}`, formData, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => {
        console.log(response.data); // log the newly created event object
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setShowProfileModal(false);
        setNewProfilePicture("");
        setNewBannerPicture("");
        setFanChange(fanChange + 1);
      });
  };

  const handleArtistProfileUpdateSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("profile", newProfilePicture);
    formData.append("banner", newBannerPicture);
    formData.append("name", newName);
    formData.append("city", newCity);
    formData.append("country", newCountry);
    formData.append("genre", newGenre);

    axios
      .put(`${process.env.REACT_APP_BACKEND_URL}api/user/${id}`, formData, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => {
        console.log(response.data); // log the newly created event object
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setShowProfileModal(false);
        setNewProfilePicture("");
        setNewBannerPicture("");
        setArtistChange(artistChange + 1);
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewSong({ ...newSong, [name]: value });
  };

  const handleNewSong = () => {
    setShowSongsModal(true);
  };
  const handleHideNewSongModal = () => setShowSongsModal(false);

  const handleSongReleaseDateChange = (date) => {
    setDisplayReleaseDate(date);
    handleInputChange({
      target: { name: "releaseDate", value: date },
    });
  };

  const handleSongSubmit = (event) => {
    event.preventDefault();
    const headers = { "Content-Type": "application/json" };
    const payload = newSong;
    // Send the new song to the server using Axios
    axios
      .put(`${process.env.REACT_APP_BACKEND_URL}api/user/${id}/song`, payload, {
        headers,
      })
      .then((response) => {
        console.log("MY NEW SONG IS IN DB", response.data);
      })
      .catch((err) => {
        console.log("DID'T ADD MY NEW SONG", err);
      })
      .finally(() => {
        // Hide the modal
        setShowSongsModal(false);
        setNewSong({
          name: "",
          minutes: "",
          seconds: "",
          url: "",
          releaseDate: "",
          album: "",
        });
        setArtistChange(artistChange + 1);
      });
  };

  const handleEventNameChange = (e) => setEventName(e.target.value);

  const handleEventStreetChange = (e) => setEventStreet(e.target.value);

  const handleEventCountryChange = (e) => setEventCountry(e.target.value);

  const handleEventStateChange = (e) => setEventState(e.target.value);

  const handleEventCityChange = (e) => setEventCity(e.target.value);

  const handleEventPostalCodeChange = (e) => setEventPostalCode(e.target.value);

  const handleEventDateChange = (date) => {
    setDisplayDate(date);
    setEventDate(date.toISOString());
  };

  const handleEventInfoChange = (e) => setEventInfo(e.target.value);

  const handleNewEvent = () => {
    setShowEventModal(true);
  };
  const handleHideNewEventModal = () => setShowEventModal(false);

  const handleEventSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      artistId: userId,
      profilePicture: userProfileImgRaw,
      artistName: userName,
      eventName: eventName,
      date: eventDate,
      startTime: eventDate,
      info: eventInfo,
      street: eventStreet,
      city: eventCity,
      state: eventState ? eventState : "",
      country: eventCountry,
      postalCode: eventPostalCode,
      address: eventState
        ? `${eventStreet}, ${eventCity}, ${eventState} ${eventPostalCode}, ${eventCountry}`
        : `${eventStreet}, ${eventPostalCode} ${eventCity}, ${eventCountry}`,
      artistType: "local",
    };
    const headers = { "Content-Type": "application/json" };
    const payload = newEvent;

    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}api/user/${id}/upcomingEvent`,
        payload,
        {
          headers,
        }
      )
      .then((response) => {
        console.log(response.data); // log the newly created event object
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setShowEventModal(false);
        setEventName("");
        setEventDate("");
        setEventInfo("");
        setEventState("");
        setEventCountry("");
        setEventStreet("");
        setEventPostalCode("");
        setEventCity("");
        setArtistChange(artistChange + 1);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    if (userId.length > 20) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}api/user/${userId}`)
        .then((response) => {
          console.log(response.data.profilePicture);
          setNewName(response.data.name);
          setUserName(response.data.name);
          setNewCity(
            response.data.city.charAt(0).toUpperCase() +
              response.data.city.slice(1)
          );
          setNewCountry(response.data.country);
          setNewAge(response.data.age);
          setNewGenre(response.data.genre);
          setEventCity(
            response.data.city.charAt(0).toUpperCase() +
              response.data.city.slice(1)
          );
          setEventCountry(response.data.country);
          setUserProfileImgRaw(
            response.data.profilePicture ? response.data.profilePicture : ""
          );
          console.log(response.data);
          setUser({
            userId: userId,
            userUsername: response.data.username,
            userName: response.data.name,
            userAge: response.data.age,
            userCity:
              response.data.city.charAt(0).toUpperCase() +
              response.data.city.slice(1),
            userCountry: response.data.country,
            userGenre: response.data.genre,
            userProfileImgRaw: response.data.profilePicture
              ? response.data.profilePicture
              : "",
            userProfileImg: response.data.profilePicture
              ? response.data.profilePicture
              : "",
            userBannerImg: response.data.bannerPicture
              ? response.data.bannerPicture
              : "",
            favouriteArtists: response.data.favouriteArtists,
            bio: response.data.bio,
            songsList: response.data.songsList,
            upcomingEvents: response.data.upcomingEvents.length
              ? response.data.upcomingEvents.map((event) => {
                  return {
                    artistId: event.artistId,
                    eventId: event._id,
                    profilePicture: `${event.profilePicture}`,
                    artistName: event.artistName,
                    eventName: event.eventName,
                    date: event.date,
                    startTime: event.startTime,
                    info: event.info,
                    street: event.street,
                    city: event.city,
                    state: event.state ? event.state : "",
                    country: event.country,
                    postalCode: event.postalCode,
                    address: event.address,
                    artistType: event.artistType,
                  };
                })
              : "",
            plannedEvents: response.data.plannedEvents,
            userType: response.data.userType,
          });
          if (response.data.upcomingEvents.length) {
            setIsTouring(true);
          }
          if (id) {
            axios
              .get(`${process.env.REACT_APP_BACKEND_URL}api/user/${id}`)
              .then((response) => {
                setCurrentFaveArtists(response.data.favouriteArtists);
                setCurrentSavedEvents(response.data.plannedEvents);
              })
              .catch((error) => {
                console.log(error);
              });
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
          `https://app.ticketmaster.com/discovery/v2/events?apikey=${process.env.REACT_APP_TICKETMASTER_API}&attractionId=${userId}&locale=*&segmentName=Music`
        )
        .then((response) => {
          const user = response.data._embedded.events[0];
          if (id) {
            axios
              .get(`${process.env.REACT_APP_BACKEND_URL}api/user/${id}`)
              .then((response) => {
                setCurrentFaveArtists(response.data.favouriteArtists);
                setCurrentSavedEvents(response.data.plannedEvents);
              })
              .catch((error) => {
                console.log(error);
              });
          }
          if (user._embedded.attractions[0].upcomingEvents._total > 0) {
            setIsTouring(true);
            axios
              .get(
                `https://app.ticketmaster.com/discovery/v2/events?apikey=${process.env.REACT_APP_TICKETMASTER_API}&attractionId=${userId}&locale=*&sort=date,asc`
              )
              .then((response) => {
                const events = response.data._embedded.events;
                setUser({
                  userId: userId,
                  userUsername: "",
                  userName: user._embedded.attractions
                    ? user._embedded.attractions[0].name
                    : user.name,
                  userAge: null,
                  userCity: "",
                  userCountry: "",
                  userProfileImg: user._embedded.attractions[0].images.find(
                    (element) =>
                      element.ratio === "16_9" && element.height > 150
                  ).url,
                  userBannerImg: "",
                  favouriteArtists: [],
                  bio: "Bio Unavailable",
                  songsList: [],
                  upcomingEvents: events.map((band) => {
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
                  }),
                  plannedEvents: [],
                  userType: "Artist",
                });
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            setUser({
              userId: userId,
              userUsername: "",
              userName: user._embedded.attractions
                ? user._embedded.attractions[0].name
                : user.name,
              userAge: null,
              userCity: "",
              userCountry: "",
              userProfileImg: user._embedded.attractions
                ? user._embedded.attractions[0].images.find(
                    (element) =>
                      element.ratio === "16_9" && element.height > 150
                  ).url
                : "",
              userBannerImg: "",
              favouriteArtists: [],
              bio: "Bio Unavailable",
              songsList: [],
              upcomingEvents: [],
              plannedEvents: [],
              userType: "Artist",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [userId, fanChange, artistChange]);

  return isLoading ? (
    <div
      className="loadingdiv"
      style={{
        backgroundColor: "black",
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        paddingTop: "60px",
      }}
    >
      <LoadingIndicator />
    </div>
  ) : (
    <>
      {user.userType === "Fan" ? (
        <FanProfilepage
          userData={user}
          currentFaveArtists={currentFaveArtists}
          currentSavedEvents={currentSavedEvents}
          onEventClick={handleEventClick}
          onHeartClick={handleHeartClick}
          onFanProfileUpdateSubmit={handleFanProfileUpdateSubmit}
          onAgeChange={handleAgeChange}
          onCityChange={handleCityChange}
          onNameChange={handleNameChange}
          onCountryChange={handleCountryChange}
          onProfilePictureChange={handleProfilePictureChange}
          onBannerPictureChange={handleBannerPictureChange}
          onEditUser={handleEditUser}
          onHideProfileModal={handleHideProfileModal}
          isTouring={isTouring}
          newName={newName}
          newAge={newAge}
          newCity={newCity}
          newCountry={newCountry}
          newProfilePicture={newProfilePicture}
          newBannerPicture={newBannerPicture}
          showProfileModal={showProfileModal}
        />
      ) : user.userType === "Artist" ? (
        <ArtistProfilepage
          userData={user}
          onHeartClick={handleHeartClick}
          currentSavedEvents={currentSavedEvents}
          onEventClick={handleEventClick}
          onGenreChange={handleGenreChange}
          onCityChange={handleCityChange}
          onNameChange={handleNameChange}
          onCountryChange={handleCountryChange}
          onProfilePictureChange={handleProfilePictureChange}
          onBannerPictureChange={handleBannerPictureChange}
          onEditUser={handleEditUser}
          onArtistProfileUpdateSubmit={handleArtistProfileUpdateSubmit}
          onHideProfileModal={handleHideProfileModal}
          currentFaveArtists={currentFaveArtists}
          isTouring={isTouring}
          newName={newName}
          newGenre={newGenre}
          newCity={newCity}
          newCountry={newCountry}
          newProfilePicture={newProfilePicture}
          newBannerPicture={newBannerPicture}
          showProfileModal={showProfileModal}
          showSongsModal={showSongsModal}
          showEventModal={showEventModal}
          onInputChange={handleInputChange}
          onNewSong={handleNewSong}
          onSongSubmit={handleSongSubmit}
          onHideNewSongModal={handleHideNewSongModal}
          onNewEvent={handleNewEvent}
          onEventSubmit={handleEventSubmit}
          onHideNewEventModal={handleHideNewEventModal}
          onSongReleaseDateChange={handleSongReleaseDateChange}
          onEventNameChange={handleEventNameChange}
          onEventStreetChange={handleEventStreetChange}
          onEventCountryChange={handleEventCountryChange}
          onEventStateChange={handleEventStateChange}
          onEventCityChange={handleEventCityChange}
          onEventPostalCodeChange={handleEventPostalCodeChange}
          onEventDateChange={handleEventDateChange}
          onEventInfoChange={handleEventInfoChange}
          eventName={eventName}
          eventCity={eventCity}
          eventCountry={eventCountry}
          eventStreet={eventStreet}
          eventPostalCode={eventPostalCode}
          eventState={eventState}
          eventDate={eventDate}
          displayDate={displayDate}
          displayReleaseDate={displayReleaseDate}
          eventInfo={eventInfo}
          newSong={newSong}
        />
      ) : null}
    </>
  );
};
export default UserProfilepage;
