import { Image } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import Figure from "react-bootstrap/Figure";
import Accordion from "react-bootstrap/Accordion";
import AccordionHeader from "react-bootstrap/AccordionHeader";
import AccordionItem from "react-bootstrap/AccordionItem";
import "../Profilepage.css";
import "../ArtistCard.css";
import { NavLink, useNavigate } from "react-router-dom";
import { InputGroup, FormControl, Button, ModalBody } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import { Modal, Form, Nav } from "react-bootstrap";
import Event from "../Components/Event";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { countryNames, stateAbbreviations, genreNames } from "../utils";

const ArtistProfilepage = (props) => {
  const user = props.userData;
  const navigate = useNavigate();
  const {
    userId,
    userUsername,
    userName,
    userAge,
    userCity,
    userCountry,
    userProfileImg,
    userBannerImg,
    userGenre,
    favouriteArtists,
    bio,
    songsList,
    upcomingEvents,
    plannedEvents,
    userType,
  } = user;
  const currentFaveArtists = props.currentFaveArtists;
  const currentSavedEvents = props.currentSavedEvents;
  const id = sessionStorage.getItem("userId");
  let eventKey = 0;

  //STATE VARIABLES AND FUNCTIONS FOR CREATING BIO CONTENT
  const [content, setContent] = useState(bio);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newName, setNewName] = useState(userName);
  const [newAge, setNewAge] = useState(userAge);
  const [newGenre, setNewGenre] = useState(userGenre);
  const [newCity, setNewCity] = useState(userCity);
  const [newCountry, setNewCountry] = useState(userCountry);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newProfilePicture, setNewProfilePicture] = useState("");
  const [newBannerPicture, setNewBannerPicture] = useState("");

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleEditButtonClick = () => {
    setIsEditMode(true);
  };

  const handleProfilePictureChange = (e) => {
    const img = e.target.files[0];
    setNewProfilePicture(img);
  };

  const handleBannerPictureChange = (e) => {
    const img = e.target.files[0];
    setNewBannerPicture(img);
  };

  const handleProfileUpdateSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("profile", newProfilePicture);
    formData.append("banner", newBannerPicture);
    formData.append("name", newName);
    formData.append("age", newAge);
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
      });
  };
  const handleUpdateButtonClick = (e) => {
    e.preventDefault();
    const payload = { bio: content };
    const headers = { "Content-Type": "application/json" };
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}api/user/${id}/biography`,
        JSON.stringify(payload),
        {
          headers,
        }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsEditMode(false);
      });
  };

  // MODAL DATA FOR CREATING NEW SONGS
  const [showSongsModal, setShowSongsModal] = useState(false);
  const [newSong, setNewSong] = useState({
    name: "",
    minutes: "",
    seconds: "",
    url: "",
    releaseDate: "",
    album: "",
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewSong({ ...newSong, [name]: value });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const headers = { "Content-Type": "application/json" };
    const payload = newSong;
    console.log(newSong.minutes);
    console.log(newSong.seconds);
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
      });
  };
  //MODAL DATA FOR CREATING NEW EVENT
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventAddress, setEventAddress] = useState("");
  const [eventCity, setEventCity] = useState(
    userCity.charAt(0).toUpperCase() + userCity.slice(1)
  );
  const [eventCountry, setEventCountry] = useState(userCountry);
  const [eventStreet, setEventStreet] = useState("");
  const [eventPostalCode, setEventPostalCode] = useState("");
  const [eventState, setEventState] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [displayDate, setDisplayDate] = useState("");
  const [displayReleaseDate, setDisplayReleaseDate] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventInfo, setEventInfo] = useState("");
  const handleEventSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      artistId: userId,
      profilePicture: userProfileImg,
      artistName: userName,
      eventName: eventName,
      date: eventDate,
      startTime: eventDate,
      info: eventInfo,
      address: eventAddress,
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
        setEventAddress("");
        setEventDate("");
        setEventVenue("");
        setEventInfo("");
      });
  };
  return user.userName ? (
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
              alt="No Profile Image"
            />
          )}
        </article>
      </section>
      <section className="name-location-container">
        <article style={{ display: "flex", flexDirection: "column" }}>
          <Row className="col-6 col-sm-5 col-md-4">
            <Col>
              <p className="name">{userName}</p>
              <p className="username">{userUsername}</p>
              {id === userId ? (
                <Button
                  className="create-event-button"
                  variant="primary"
                  onClick={() => setShowProfileModal(true)}
                >
                  Edit Profile
                </Button>
              ) : null}
            </Col>
            <Col>
              <div className="liked">
                {id ? (
                  currentFaveArtists.length ? (
                    currentFaveArtists.find(
                      (artist) => artist.id === userId
                    ) ? (
                      <Image
                        roundedCircle={true}
                        src={`${process.env.REACT_APP_BACKEND_URL}profile-pics/Filled.png`}
                        alt="Filled Heart"
                        className="favorite"
                        onClick={props.onHeartClick}
                        id={userId}
                        title={userName}
                        data-touring={props.isTouring}
                        pic={userProfileImg}
                      ></Image>
                    ) : (
                      <Image
                        roundedCircle={true}
                        src={`${process.env.REACT_APP_BACKEND_URL}profile-pics/Outline.png`}
                        alt="Heart Outline"
                        className="favorite"
                        onClick={props.onHeartClick}
                        id={userId}
                        title={userName}
                        data-touring={props.isTouring}
                        pic={userProfileImg}
                      ></Image>
                    )
                  ) : (
                    <Image
                      roundedCircle={true}
                      src={`${process.env.REACT_APP_BACKEND_URL}profile-pics/Outline.png`}
                      alt="Heart Outline"
                      className="favorite"
                      onClick={props.onHeartClick}
                      id={userId}
                      title={userName}
                      data-touring={props.isTouring}
                      pic={userProfileImg}
                    ></Image>
                  )
                ) : null}
              </div>
            </Col>
          </Row>
        </article>
        <Modal
          show={showProfileModal}
          onHide={() => setShowProfileModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleProfileUpdateSubmit}>
              <Form.Group controlId="userName">
                <Form.Label>*Name:</Form.Label>
                <Form.Control
                  type="text"
                  name="userName"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="userAge">
                <Form.Label>Age:</Form.Label>
                <Form.Control
                  type="number"
                  name="userAge"
                  value={newAge}
                  onChange={(e) => setNewAge(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>*City:</Form.Label>
                <Form.Control
                  type="text"
                  name="userCity"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="userCountry">
                <Form.Label>*Country:</Form.Label>
                <Form.Select
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  required
                >
                  {countryNames.map((countryName) => {
                    return <option key={countryName}>{countryName}</option>;
                  })}
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="userGenre">
                <Form.Label>Genre:</Form.Label>
                <Form.Select
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  required
                >
                  {genreNames.map((genreName) => {
                    return <option key={genreName}>{genreName}</option>;
                  })}
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Update Profile Picture:</Form.Label>
                <Form.Control
                  type="file"
                  name="profile"
                  onChange={handleProfilePictureChange}
                />
                <Form.Text className="text-muted">
                  Please select an image to upload.
                </Form.Text>
              </Form.Group>
              <Form.Group>
                <Form.Label>Update Banner Picture:</Form.Label>
                <Form.Control
                  type="file"
                  name="banner"
                  onChange={handleBannerPictureChange}
                />
                <Form.Text className="text-muted">
                  Please select an image to upload.
                </Form.Text>
              </Form.Group>
              <p style={{ fontSize: "smaller" }}>* = Required Field</p>
              <Button className="modal-submit-button" type="submit">
                Submit Changes
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </section>
      {userId.length > 20 ? (
        <section className="artist-bio">
          <p className="bio-title">{userName} Biography:</p>
          <div className="bio-div">
            {isEditMode ? (
              <InputGroup>
                <FormControl
                  as="textarea"
                  rows={1}
                  value={content}
                  onChange={handleContentChange}
                  className="bio-textarea"
                />
                <Button
                  className="modal-submit-button bio"
                  onClick={handleUpdateButtonClick}
                >
                  Update
                </Button>
              </InputGroup>
            ) : (
              <>
                {content === "" ? <p>{"No content yet"}</p> : <p>{content}</p>}
                {id === userId ? (
                  <Button
                    className="edit-bio-button"
                    onClick={() => handleEditButtonClick()}
                  >
                    Edit
                  </Button>
                ) : null}
              </>
            )}
          </div>
        </section>
      ) : null}
      <section className="events-and-fav-artist-contaiener">
        <article className="favourite-artists-events">
          <p className="event-list-title">{userName} Upcoming Shows:</p>
          <Event
            className="upcoming-shows"
            upcomingEvents={upcomingEvents}
            type="local"
            onEventClick={props.onEventClick}
            currentSavedEvents={currentSavedEvents}
          />
          {id === userId ? (
            <Button
              className="create-event-button"
              variant="primary"
              onClick={() => setShowEventModal(true)}
            >
              Create Event
            </Button>
          ) : null}

          <Modal show={showEventModal} onHide={() => setShowEventModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Create new event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleEventSubmit}>
                <Form.Group>
                  <Form.Label>Event Name:</Form.Label>
                  <Form.Control
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Event Address:</Form.Label>
                  <Row>
                    <Col>
                      <Form.Label>Street:</Form.Label>
                      <Form.Control
                        type="text"
                        value={eventStreet}
                        onChange={(e) => setEventStreet(e.target.value)}
                        required
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Label>City:</Form.Label>
                      <Form.Control
                        type="text"
                        value={eventCity}
                        onChange={(e) => setEventCity(e.target.value)}
                        required
                      />
                    </Col>
                    <Col>
                      <Form.Label>State:</Form.Label>
                      <Form.Select
                        value={eventState}
                        onChange={(e) => setEventState(e.target.value)}
                        required
                      >
                        {stateAbbreviations.map((state) => {
                          return <option key={state}>{state}</option>;
                        })}
                      </Form.Select>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Label>Country:</Form.Label>
                      <Form.Select
                        value={eventCountry}
                        onChange={(e) => setEventCountry(e.target.value)}
                        required
                      >
                        {countryNames.map((countryName) => {
                          return (
                            <option key={countryName}>{countryName}</option>
                          );
                        })}
                      </Form.Select>
                    </Col>
                    <Col>
                      <Form.Label>Postal Code:</Form.Label>
                      <Form.Control
                        type="text"
                        value={eventPostalCode}
                        onChange={(e) => setEventPostalCode(e.target.value)}
                        required
                      />
                    </Col>
                  </Row>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Event Date & Time:</Form.Label>

                  <DatePicker
                    showTimeSelect
                    selected={displayDate}
                    todayButton
                    placeholderText={`${new Date().toLocaleString()}`}
                    onChange={(date) => {
                      setDisplayDate(date);
                      setEventDate(date.toISOString());
                    }}
                    dateFormat="Pp"
                    minDate={new Date()}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Event Info:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={eventInfo}
                    placeholder="Minimum Age, Cover, Prohibited Items, etc."
                    onChange={(e) => setEventInfo(e.target.value)}
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
      {userId.length > 20 ? (
        <section className="artist-songs-section">
          <p className="song-list-title">{userName} Songs:</p>
          <article className="songs-container">
            {songsList.length ? (
              <ListGroup as="ol" numbered>
                {songsList.map((song) => {
                  return (
                    <ListGroup.Item
                      as="li"
                      className="d-flex justify-content-between align-items-start"
                    >
                      <Col>
                        <div className="ms-2 me-auto">
                          <div className="fw-bold">{song.name}</div>
                          {song.minutes ? (
                            <Badge bg="primary" pill>
                              Song Duration: {song.minutes}:{song.seconds}
                            </Badge>
                          ) : null}
                        </div>
                      </Col>
                      <Col>
                        {song.releaseDate ? (
                          <div>
                            Release date:{" "}
                            {new Date(song.releaseDate).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </div>
                        ) : null}
                        {song.album ? <div>Album: {song.album}</div> : null}
                      </Col>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            ) : (
              <div className="noShowsdiv">
                <h6>No Songs Available</h6>
              </div>
            )}
            {id === userId ? (
              <Button
                className="add-song-button"
                onClick={() => setShowSongsModal(true)}
              >
                Add New Song
              </Button>
            ) : null}
            <Modal
              show={showSongsModal}
              onHide={() => setShowSongsModal(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Add New Song</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleFormSubmit}>
                  <Form.Group controlId="songName">
                    <Form.Label>*Song Name:</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={newSong.name}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="songDuration">
                    <Row>
                      <Form.Label>Song Duration:</Form.Label>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Label>Minutes:</Form.Label>
                        <Form.Control
                          type="number"
                          name="minutes"
                          min={0}
                          max={59}
                          value={newSong.minutes.toString().padStart(2, "0")}
                          onChange={handleInputChange}
                        />
                      </Col>
                      <Col>
                        <Form.Label>Seconds:</Form.Label>
                        <Form.Control
                          type="number"
                          name="seconds"
                          min={0}
                          max={59}
                          value={newSong.seconds.toString().padStart(2, "0")}
                          onChange={handleInputChange}
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                  <Form.Group controlId="songUrl">
                    <Form.Label>Song URL:</Form.Label>
                    <Form.Control
                      type="text"
                      name="url"
                      value={newSong.url}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="songReleaseDate">
                    <Row>
                      <Form.Label>Release Date:</Form.Label>
                    </Row>
                    <Row>
                      <Col>
                        <DatePicker
                          selected={displayReleaseDate}
                          value={newSong.releaseDate}
                          todayButton
                          placeholderText={`${new Date().toLocaleString()}`}
                          onChange={(date) => {
                            setDisplayReleaseDate(date);
                            handleInputChange({
                              target: { name: "releaseDate", value: date },
                            });
                          }}
                          required
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                  <Form.Group controlId="songAlbum">
                    <Form.Label>Album:</Form.Label>
                    <Form.Control
                      type="text"
                      name="album"
                      value={newSong.album}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <p style={{ fontSize: "smaller" }}>* = Required Field</p>
                  <Button className="modal-submit-button" type="submit">
                    Add Song
                  </Button>
                </Form>
              </Modal.Body>
            </Modal>
          </article>
        </section>
      ) : null}
    </main>
  ) : (
    <Modal show={true} centered>
      <Modal.Header style={{ display: "flex", justifyContent: "center" }}>
        <Modal.Title>Profile Not Found</Modal.Title>
      </Modal.Header>
      <ModalBody>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="primary"
            onClick={() => {
              navigate("/");
            }}
          >
            Homepage
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ArtistProfilepage;
