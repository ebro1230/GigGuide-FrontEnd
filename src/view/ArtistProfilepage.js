import { Image } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import "../Profilepage.css";
import "../ArtistCard.css";
import { useNavigate } from "react-router-dom";
import { InputGroup, FormControl, Button, ModalBody } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import { Modal, Form } from "react-bootstrap";
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
    userProfileImgRaw,
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
  const eventName = props.eventName;
  const eventCity = props.eventCity;
  const eventCountry = props.eventCountry;
  const eventStreet = props.eventStreet;
  const eventPostalCode = props.eventPostalCode;
  const eventState = props.eventState;
  const eventDate = props.eventDate;
  const displayDate = props.displayDate;
  const displayReleaseDate = props.displayReleaseDate;
  const eventInfo = props.eventInfo;
  const newSong = props.newSong;
  const newName = props.newName;
  const newGenre = props.newGenre;
  const newCity = props.newCity;
  const newCountry = props.newCountry;
  const newProfilePicture = props.newProfilePicture;
  const newBannerPicture = props.newBannerPicture;
  const showProfileModal = props.showProfileModal;
  const showSongsModal = props.showSongsModal;
  const showEventModal = props.showEventModal;

  //STATE VARIABLES AND FUNCTIONS FOR CREATING BIO CONTENT
  const [content, setContent] = useState(bio);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleEditButtonClick = () => {
    setIsEditMode(true);
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

  return user.userName ? (
    <main className="profile-container">
      <section className="img-container">
        <div className="centerdiv">
          {userBannerImg.length ? (
            <article className="bannerdiv">
              <Image
                fluid={true}
                className="banner-img"
                src={userBannerImg}
                alt="Banner img"
              />
            </article>
          ) : (
            <article className="nobannerdiv">
              <Image fluid={true} className="banner-img" />
            </article>
          )}
        </div>
        <article>
          {userProfileImg.length ? (
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
                  onClick={props.onEditUser}
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
        <Modal show={showProfileModal} onHide={props.onHideProfileModal}>
          <Modal.Header closeButton>
            <Modal.Title>Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={props.onArtistProfileUpdateSubmit}>
              <Form.Group controlId="userName">
                <Form.Label>*Name:</Form.Label>
                <Form.Control
                  type="text"
                  name="userName"
                  value={newName}
                  onChange={props.onNameChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>*City:</Form.Label>
                <Form.Control
                  type="text"
                  name="userCity"
                  value={newCity}
                  onChange={props.onCityChange}
                />
              </Form.Group>
              <Form.Group controlId="userCountry">
                <Form.Label>*Country:</Form.Label>
                <Form.Select
                  value={newCountry}
                  onChange={props.onCountryChange}
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
                  onChange={props.onGenreChange}
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
                  onChange={props.onProfilePictureChange}
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
                  onChange={props.onBannerPictureChange}
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
              onClick={props.onNewEvent}
            >
              Add New Event
            </Button>
          ) : null}

          <Modal show={showEventModal} onHide={props.onHideNewEventModal}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={props.onEventSubmit}>
                <Form.Group>
                  <Form.Label>Event Name:</Form.Label>
                  <Form.Control
                    type="text"
                    value={eventName}
                    onChange={props.onEventNameChange}
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
                        onChange={props.onEventStreetChange}
                        required
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Label>Country:</Form.Label>
                      <Form.Select
                        value={eventCountry}
                        onChange={props.onEventCountryChange}
                        required
                      >
                        {countryNames.map((countryName) => {
                          return (
                            <option key={countryName}>{countryName}</option>
                          );
                        })}
                      </Form.Select>
                    </Col>
                  </Row>
                  {eventCountry === "United States Of America" ? (
                    <Row>
                      <Col>
                        <Form.Label>State:</Form.Label>
                        <Form.Select
                          value={eventState}
                          onChange={props.onEventStateChange}
                          required
                        >
                          {stateAbbreviations.map((state) => {
                            return <option key={state}>{state}</option>;
                          })}
                        </Form.Select>
                      </Col>
                    </Row>
                  ) : null}
                  <Row>
                    <Col>
                      <Form.Label>City:</Form.Label>
                      <Form.Control
                        type="text"
                        value={eventCity}
                        onChange={props.onEventCityChange}
                        required
                      />
                    </Col>
                    <Col>
                      <Form.Label>Postal Code:</Form.Label>
                      <Form.Control
                        type="text"
                        value={eventPostalCode}
                        onChange={props.onEventPostalCodeChange}
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
                    onChange={props.onEventDateChange}
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
                    onChange={props.onEventInfoChange}
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
                              Song Duration:{" "}
                              {song.minutes.toString().padStart(2, "0")}:
                              {song.seconds.toString().padStart(2, "0")}
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
              <Button className="add-song-button" onClick={props.onNewSong}>
                Add New Song
              </Button>
            ) : null}
            <Modal show={showSongsModal} onHide={props.onHideSongsModal}>
              <Modal.Header closeButton>
                <Modal.Title>Add New Song</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={props.onSongSubmit}>
                  <Form.Group controlId="songName">
                    <Form.Label>*Song Name:</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={newSong.name}
                      onChange={props.onInputChange}
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
                          onChange={props.onInputChange}
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
                          onChange={props.onInputChange}
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
                      onChange={props.onInputChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="songReleaseDate">
                    <Row>
                      <Form.Label>*Release Date:</Form.Label>
                    </Row>
                    <Row>
                      <Col>
                        <DatePicker
                          selected={displayReleaseDate}
                          value={newSong.releaseDate}
                          todayButton
                          placeholderText={`${new Date().toLocaleString()}`}
                          onChange={props.onSongReleaseDateChange}
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
                      onChange={props.onInputChange}
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
