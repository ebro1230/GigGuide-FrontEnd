import { useState, useEffect } from "react";
import { Image, Button, Modal, Form, Figure, Accordion } from "react-bootstrap";
import { useParams, NavLink, useNavigate } from "react-router-dom";

import axios from "axios";

import AccordionHeader from "react-bootstrap/AccordionHeader";
import AccordionItem from "react-bootstrap/AccordionItem";
import Event from "../Components/Event";

import Datetime from "react-datetime";
import LoadingIndicator from "../Components/LoadingIndicator";
import { getCountryCode } from "../utils";

import "../Profilepage.css";
import "../ArtistCard.css";

const EventsPage = () => {
  const { userId, eventId } = useParams();
  const id = sessionStorage.getItem("userId");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventAddress, setEventAddress] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventInfo, setEventInfo] = useState("");
  const [newEventName, setNewEventName] = useState("");
  const [newEventAddress, setNewEventAddress] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventVenue, setNewEventVenue] = useState("");
  const [newEventInfo, setNewEventInfo] = useState("");
  const [userName, setUserName] = useState("");
  const [userBannerImg, setUserBannerImg] = useState("");
  const [userProfileImg, setUserProfileImg] = useState("");
  const [userUsername, setUserUsername] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [artistName, setArtistName] = useState("");
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [currentSavedEvents, setCurrentSavedEvents] = useState([]);
  const [success, setSuccess] = useState(false);
  const [deleteEvent, setDeleteEvent] = useState(false);
  const navigate = useNavigate();

  let eventKey = 0;
  console.log(upcomingEvents);

  useEffect(() => {
    setIsLoading(true);
    if (eventId.length > 20) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}api/artists/${userId}`)
        .then((response) => {
          setUserName(response.data.name);
          if (response.data.bannerPicture) {
            setUserBannerImg(
              process.env.REACT_APP_BACKEND_URL + response.data.bannerPicture
            );
          } else {
            setUserBannerImg(undefined);
          }
          setUserProfileImg(
            process.env.REACT_APP_BACKEND_URL + response.data.profilePicture
          );
          setUserUsername(response.data.username);
          setArtistName(response.data.name);
          setUpcomingEvents(response.data.upcomingEvents);
          console.log(response.data.upcomingEvents[0]._id);
          const event = response.data.upcomingEvents.filter(
            (upcomingEvent) => upcomingEvent._id === eventId
          );
          setEventDate({ _d: event[0].date.toString() });
          setEventVenue(event[0].venue);
          setEventInfo(event[0].info);
          setEventAddress(event[0].address);
          setEventName(event[0].eventName);
          setNewEventDate({ _d: event[0].date.toString() });
          setNewEventVenue(event[0].venue);
          setNewEventInfo(event[0].info);
          setNewEventAddress(event[0].address);
          setNewEventName(event[0].eventName);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .get(
          `https://app.ticketmaster.com/discovery/v2/events?apikey=${process.env.REACT_APP_TICKETMASTER_API}&id=${eventId}&locale=*`
        )
        .then((response) => {
          console.log(response);
          setUserName(
            response.data._embedded.events[0]._embedded.attractions[0].name
          );
          if (response.data._embedded.events[0]._embedded.venues[0].images) {
            setUserBannerImg(
              response.data._embedded.events[0]._embedded.venues[0].images[0]
                .url
            );
          } else {
            setUserBannerImg("");
          }
          setUserProfileImg(
            response.data._embedded.events[0]._embedded.attractions[0].images.find(
              (element) => element.ratio === "16_9" && element.height > 150
            ).url
          );
          setUserUsername("");
          setArtistName(
            response.data._embedded.events[0]._embedded.attractions[0].name
          );
          setEventDate({
            _d: response.data._embedded.events[0].dates.start.dateTime.toString(),
          });
          setEventVenue(
            response.data._embedded.events[0]._embedded.venues[0].name
          );
          if (
            response.data._embedded.events[0]._embedded.venues[0].generalInfo
          ) {
            setEventInfo(
              response.data._embedded.events[0]._embedded.venues[0].generalInfo
                .generalRule
            );
          } else {
            setEventInfo("Information for this show is unavailable");
          }
          if (response.data._embedded.events[0]._embedded.venues[0].state) {
            setEventAddress(
              response.data._embedded.events[0]._embedded.venues[0].address
                .line1 +
                " " +
                response.data._embedded.events[0]._embedded.venues[0].city
                  .name +
                ", " +
                response.data._embedded.events[0]._embedded.venues[0].state
                  .stateCode +
                ", " +
                response.data._embedded.events[0]._embedded.venues[0].country
                  .countryCode
            );
          } else {
            setEventAddress(
              response.data._embedded.events[0]._embedded.venues[0].address
                .line1 +
                " " +
                response.data._embedded.events[0]._embedded.venues[0].city
                  .name +
                ", " +
                response.data._embedded.events[0]._embedded.venues[0].country
                  .countryCode
            );
          }
          setEventName(
            response.data._embedded.events[0]._embedded.venues[0].name
          );
          setNewEventDate({
            _d: response.data._embedded.events[0].dates.start.dateTime.toString(),
          });
          setNewEventVenue(
            response.data._embedded.events[0]._embedded.venues[0].name
          );
          if (
            response.data._embedded.events[0]._embedded.venues[0].generalInfo
          ) {
            setNewEventInfo(
              response.data._embedded.events[0]._embedded.venues[0].generalInfo
                .generalRule
            );
          } else {
            setNewEventInfo("Information for this show is unavailable");
          }
          if (response.data._embedded.events[0]._embedded.venues[0].state) {
            setNewEventAddress(
              response.data._embedded.events[0]._embedded.venues[0].address
                .line1 +
                " " +
                response.data._embedded.events[0]._embedded.venues[0].city
                  .name +
                ", " +
                response.data._embedded.events[0]._embedded.venues[0].state
                  .stateCode +
                ", " +
                response.data._embedded.events[0]._embedded.venues[0].country
                  .countryCode
            );
          } else {
            setNewEventAddress(
              response.data._embedded.events[0]._embedded.venues[0].address
                .line1 +
                " " +
                response.data._embedded.events[0]._embedded.venues[0].city
                  .name +
                ", " +
                response.data._embedded.events[0]._embedded.venues[0].country
                  .countryCode
            );
          }
          setNewEventName(
            response.data._embedded.events[0]._embedded.venues[0].name
          );
          if (
            response.data._embedded.events[0]._embedded.attractions[0]
              .upcomingEvents._total > 0
          ) {
            axios
              .get(
                `https://app.ticketmaster.com/discovery/v2/events?apikey=${process.env.REACT_APP_TICKETMASTER_API}&attractionId=${userId}&locale=*&sort=date,asc`
              )
              .then((response) => {
                const events = response.data._embedded.events;
                console.log(events);
                setUpcomingEvents(
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
          } else {
            setUpcomingEvents([]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (id) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}api/artists/${id}`)
        .then((response) => {
          setCity(response.data.city);
          setCountry(response.data.country);
          setCountryCode(getCountryCode(response.data.country));
          setCurrentSavedEvents(response.data.plannedEvents);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  const handleEventSubmit = (e) => {
    e.preventDefault();
    const date = new Date(newEventDate._d).toISOString();
    const info = newEventInfo;
    const address = newEventAddress;
    const venue = newEventVenue;
    const eventName = newEventName;
    setEventDate(date);
    setEventInfo(newEventInfo);
    setEventAddress(newEventAddress);
    setEventVenue(newEventVenue);
    setEventName(newEventName);

    const headers = { "Content-Type": "application/json" };
    const payload = {
      eventName,
      artistName,
      date,
      startTime: date,
      venue,
      address,
      info,
    };

    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}api/user/${userId}/upcomingEvent/${eventId}`,
        payload,
        {
          headers,
        }
      )
      .then((response) => {
        console.log(response.data); // log the edited event object
        setSuccess(true);
        setTimeout(() => {
          navigate(`/userprofile`);
        }, 3000);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setShowEventModal(false);
      });
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

  const handleEventDelete = (e) => {
    e.preventDefault();
    axios
      .delete(
        `${process.env.REACT_APP_BACKEND_URL}api/user/${userId}/upcomingEvent/${eventId}`
      )
      .then((response) => {
        console.log(response.data); // log the deleted event object
        setDeleteEvent(true);
        setTimeout(() => {
          navigate(`/userprofile/${userId}`);
        }, 3000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return success ? (
    <Modal show={true} centered>
      <Modal.Header>
        <Modal.Title>Event Updated!</Modal.Title>
      </Modal.Header>
    </Modal>
  ) : deleteEvent ? (
    <Modal show={true} centered>
      <Modal.Header>
        <Modal.Title>Event Deleted!</Modal.Title>
      </Modal.Header>
    </Modal>
  ) : isLoading ? (
    <LoadingIndicator />
  ) : (
    <main className="profile-container">
      <section className="img-container">
        <article>
          {userBannerImg ? (
            <Image
              fluid={true}
              className="banner-img"
              src={userBannerImg}
              alt="Banner img"
            />
          ) : null}
        </article>
        <article>
          {userProfileImg ? (
            <Image
              fluid={true}
              className="profile-img"
              roundedCircle={true}
              src={userProfileImg}
              alt="Profile img"
            />
          ) : (
            <Image
              fluid={true}
              className="no-profile-img"
              roundedCircle={true}
              alt="No profile img"
            />
          )}
        </article>
      </section>
      <section className="name-location-container">
        <article>
          <p className="name">
            {artistName} at {eventName}
          </p>
          <p className="username">
            {new Date(eventDate._d).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            ,{" "}
            {new Date(eventDate._d).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="username">{eventAddress}</p>
        </article>
        {id === userId ? (
          <article className="edit-event-container">
            <Button
              variant="primary"
              className="eventbuttons"
              onClick={() => setShowEventModal(true)}
            >
              Edit Event
            </Button>
            <br />
            <br />
            <Button
              variant="danger"
              className="eventbuttons"
              onClick={handleEventDelete}
            >
              Delete Event
            </Button>
          </article>
        ) : null}
      </section>
      <section className="artist-bio">
        <p className="bio-title">{eventName} Information:</p>
        <div className="info-div">
          {eventInfo.length ? (
            <p className="info-textarea">{eventInfo}</p>
          ) : eventInfo === "" ? (
            <p>{"No Event Info"}</p>
          ) : (
            <p>{eventInfo}</p>
          )}
        </div>
      </section>
      <section className="events-and-fav-artist-contaiener">
        <article className="favourite-artists-events">
          <p className="event-list-title">
            More Upcoming Shows From {userName}:
          </p>
          <Event
            className="upcoming-shows"
            upcomingEvents={upcomingEvents}
            type="local"
            onEventClick={handleEventClick}
            currentSavedEvents={currentSavedEvents}
          />

          <Modal show={showEventModal} onHide={() => setShowEventModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Create new event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleEventSubmit}>
                <Form.Group>
                  <Form.Label>Event name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newEventName}
                    onChange={(e) => setNewEventName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Event address</Form.Label>
                  <Form.Control
                    type="text"
                    value={newEventAddress}
                    onChange={(e) => setNewEventAddress(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Event date and time</Form.Label>
                  <Datetime
                    onChange={(value) => {
                      setNewEventDate(value);
                    }}
                    required
                    value={newEventDate}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Event venue</Form.Label>
                  <Form.Control
                    type="text"
                    value={newEventVenue}
                    onChange={(e) => setNewEventVenue(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Event info</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newEventInfo}
                    onChange={(e) => setNewEventInfo(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button
                  className="modal-submit-button"
                  variant="primary"
                  type="submit"
                >
                  Submit
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </article>
      </section>
    </main>
  );
};

export default EventsPage;
