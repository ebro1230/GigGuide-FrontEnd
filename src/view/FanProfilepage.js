import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image, Button, Modal, ModalBody, Form } from "react-bootstrap";
import axios from "axios";
import { countryNames } from "../utils";

import Carousel from "react-grid-carousel";
import "../Profilepage.css";
import "../ArtistCard.css";
import ArtistCard from "../Components/ArtistCard";
import Event from "../Components/Event";

const FanProfilepage = (props) => {
  const user = props.userData;
  const {
    userId,
    userUsername,
    userName,
    userAge,
    userCity,
    userCountry,
    userProfileImg,
    userBannerImg,
    favouriteArtists,
    plannedEvents,
  } = user;
  const newName = props.newName;
  const newAge = props.newAge;
  const newCity = props.newCity;
  const newCountry = props.newCountry;
  const newProfilePicture = props.newProfilePicture;
  const newBannerPicture = props.newBannerPicture;
  const showProfileModal = props.showProfileModal;

  const navigate = useNavigate();

  const currentSavedEvents = props.currentSavedEvents;

  const id = sessionStorage.getItem("userId");

  return user.userName ? (
    <div className="profile-container">
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
        <article>
          <p className="name-and-age">
            {userName}, <span className="age">({userAge})</span>
          </p>
          <p className="username">({userUsername})</p>
          {id === userId ? (
            <Button
              className="create-event-button"
              variant="primary"
              onClick={props.onEditUser}
            >
              Edit Profile
            </Button>
          ) : null}
        </article>
        <Modal show={showProfileModal} onHide={props.onHideProfileModal}>
          <Modal.Header closeButton>
            <Modal.Title>Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={props.onFanProfileUpdateSubmit}>
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
              <Form.Group controlId="userAge">
                <Form.Label>Age:</Form.Label>
                <Form.Control
                  type="number"
                  name="userAge"
                  value={newAge}
                  onChange={props.onAgeChange}
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
      <div className="BandsCarouseldiv">
        <p className="favourite-artists-title">My favourite artists:</p>
        <div className="carouseldiv">
          <Carousel
            cols={6}
            rows={1}
            gap={10}
            className="carousel"
            loop={true}
            scrollSnap={true}
            hideArrow={false}
            showDots={true}
            style={{ height: "100%" }}
            responsiveLayout={[
              {
                breakpoint: 1200,
                cols: 5,
                rows: 1,
                gap: 10,
                loop: true,
                hideArrow: false,
                showDots: true,
              },
              {
                breakpoint: 992,
                cols: 3,
                rows: 1,
                gap: 10,
                loop: true,
                hideArrow: false,
                showDots: true,
              },
              {
                breakpoint: 768,
                cols: 2,
                rows: 1,
                gap: 10,
                loop: true,
                hideArrow: false,
                showDots: true,
              },
              /*  {
              breakpoint: 576,
              cols: 2,
              rows: 1,
              gap: 10,
              loop: true,
              hideArrow: false,
              showDots: true,
            }, */
            ]}
            mobileBreakpoint={576}
          >
            {favouriteArtists.length
              ? favouriteArtists.map((artist, index) => {
                  return artist ? (
                    <Carousel.Item key={index} className="carousel-item">
                      <ArtistCard
                        className="band"
                        name={artist.name}
                        id={artist.id}
                        profilePicture={artist.pic}
                        touring={artist.touring}
                        onHeartClick={props.onHeartClick}
                        currentFaveArtists={props.currentFaveArtists}
                      />
                    </Carousel.Item>
                  ) : null;
                })
              : null}
          </Carousel>
        </div>
      </div>
      <section className="events-and-fav-artist-contaiener">
        <article className="saved-upcoming-events">
          <p className="saved-events-title">Saved upcoming events:</p>
          <Event
            upcomingEvents={plannedEvents}
            currentSavedEvents={currentSavedEvents}
            onEventClick={props.onEventClick}
          />
        </article>
      </section>
    </div>
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

export default FanProfilepage;
