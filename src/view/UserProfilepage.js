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
    if (userId.length > 20) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}api/user/${userId}`)
        .then((response) => {
          setUser({
            userId: userId,
            userUsername: response.data.username,
            userName: response.data.name,
            userAge: response.data.age,
            userCity: response.data.city,
            userCountry: response.data.country,
            userProfileImg:
              process.env.REACT_APP_BACKEND_URL + response.data.profilePicture,
            userBannerImg: "",
            favouriteArtists: response.data.favouriteArtists,
            bio: response.data.bio,
            songsList: response.data.songsList,
            upcomingEvents: response.data.upcomingEvents,
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
  }, [userId]);

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
          isTouring={isTouring}
        />
      ) : user.userType === "Artist" ? (
        <ArtistProfilepage
          userData={user}
          onHeartClick={handleHeartClick}
          currentSavedEvents={currentSavedEvents}
          onEventClick={handleEventClick}
          currentFaveArtists={currentFaveArtists}
          isTouring={isTouring}
        />
      ) : null}
    </>
  );
};
export default UserProfilepage;
