import Figure from "react-bootstrap/Figure";
import Accordion from "react-bootstrap/Accordion";
import AccordionHeader from "react-bootstrap/esm/AccordionHeader";
import AccordionItem from "react-bootstrap/esm/AccordionItem";
import Button from "react-bootstrap/Button";
import "../Event.css";
import { NavLink, useNavigate } from "react-router-dom";
import { Nav } from "react-bootstrap";

const Event = (props) => {
  const upcomingEvents = props.upcomingEvents;
  const type = props.type;
  const currentSavedEvents = props.currentSavedEvents;
  const id = sessionStorage.getItem("userId");
  const navigate = useNavigate();
  let eventKey = 0;

  return (
    <Accordion className="accordion" key={type}>
      {upcomingEvents.length ? (
        upcomingEvents
          .map((event) => {
            if (event) {
              eventKey++;
              return (
                <AccordionItem className="AcordionItem" eventKey={eventKey}>
                  <AccordionHeader className="row">
                    <div className="col-5 col-sm-4 col-md-3 col-lg-2">
                      <NavLink to={`/${event.artistId}/event/${event.eventId}`}>
                        <Figure>
                          <Figure.Image
                            className="event-img-container"
                            width={"100%"}
                            src={event.profilePicture}
                            alt="Artist Image"
                          />
                        </Figure>
                      </NavLink>
                    </div>
                    <div className="col eventTitle">
                      <h2>
                        {event.artistName} {event.eventName}
                      </h2>
                      <h3>
                        event.date.length ?(
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        ,{" "}
                        {new Date(event.startTime).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        ) : null
                      </h3>
                    </div>
                  </AccordionHeader>
                  <Accordion.Body>
                    <Nav.Link
                      onClick={() => {
                        navigate(`/${event.artistId}/event/${event.eventId}`);
                      }}
                    >
                      <div className="col-7 col-sm-9">
                        <div className="row">
                          <p className="venueAddress">{event.address}</p>
                        </div>
                        <div className="row">
                          <p className="eventInfo">{event.info}</p>
                        </div>
                      </div>
                    </Nav.Link>
                    <div className="col-5 col-sm-3 saveEventdiv">
                      {id ? (
                        currentSavedEvents.length ? (
                          currentSavedEvents.find(
                            (savedEvent) => savedEvent.id === event.eventId
                          ) ? (
                            <Button
                              variant="success"
                              className="saveEventButton"
                              onClick={props.onEventClick}
                              value="Saved"
                              data-eventInformation={JSON.stringify(event)}
                            >
                              Saved
                            </Button>
                          ) : (
                            <Button
                              variant="primary"
                              className="saveEventButton"
                              onClick={props.onEventClick}
                              value="Save Event"
                              data-eventInformation={JSON.stringify(event)}
                            >
                              Save Event
                            </Button>
                          )
                        ) : (
                          <Button
                            variant="primary"
                            className="saveEventButton"
                            onClick={props.onEventClick}
                            value="Save Event"
                            data-eventInformation={JSON.stringify(event)}
                          >
                            Save Event
                          </Button>
                        )
                      ) : null}
                    </div>
                  </Accordion.Body>
                </AccordionItem>
              );
            }
          })
          .some((el) => el !== null) ? (
          upcomingEvents.map((event) => {
            if (event) {
              eventKey++;
              return (
                <AccordionItem className="AcordionItem" eventKey={eventKey}>
                  <AccordionHeader className="row">
                    <div className="col-5 col-sm-4 col-md-3 col-lg-2">
                      <NavLink to={`/${event.artistId}/event/${event.eventId}`}>
                        <Figure>
                          <Figure.Image
                            className="event-img-container"
                            width={"100%"}
                            src={event.profilePicture}
                            alt="Artist Image"
                          />
                        </Figure>
                      </NavLink>
                    </div>
                    <div className="col eventTitle">
                      <h2>
                        {event.artistName} {event.eventName}
                      </h2>
                      <h3>
                        {event.date
                          ? new Date(event.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }) +
                            " " +
                            new Date(event.startTime).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : null}
                      </h3>
                    </div>
                  </AccordionHeader>
                  <Accordion.Body>
                    <Nav.Link
                      onClick={() => {
                        navigate(`/${event.artistId}/event/${event.eventId}`);
                      }}
                    >
                      <div className="col-7 col-sm-9">
                        <div className="row">
                          <p className="venueAddress">{event.address}</p>
                        </div>
                        <div className="row">
                          <p className="eventInfo">{event.info}</p>
                        </div>
                      </div>
                    </Nav.Link>
                    <div className="col-5 col-sm-3 saveEventdiv">
                      {id ? (
                        currentSavedEvents.length ? (
                          currentSavedEvents.find(
                            (savedEvent) => savedEvent.eventId === event.eventId
                          ) ? (
                            <Button
                              variant="success"
                              className="saveEventButton"
                              onClick={props.onEventClick}
                              value="Saved"
                              data-eventInformation={JSON.stringify(event)}
                            >
                              Saved
                            </Button>
                          ) : (
                            <Button
                              variant="primary"
                              className="saveEventButton"
                              onClick={props.onEventClick}
                              value="Save Event"
                              data-eventInformation={JSON.stringify(event)}
                            >
                              Save Event
                            </Button>
                          )
                        ) : (
                          <Button
                            variant="primary"
                            className="saveEventButton"
                            onClick={props.onEventClick}
                            value="Save Event"
                            data-eventInformation={JSON.stringify(event)}
                          >
                            Save Event
                          </Button>
                        )
                      ) : null}
                    </div>
                  </Accordion.Body>
                </AccordionItem>
              );
            }
          })
        ) : null
      ) : (
        <div className="noShowsdiv">
          <h6>No Upcoming Shows</h6>
        </div>
      )}
    </Accordion>
  );
};

export default Event;
