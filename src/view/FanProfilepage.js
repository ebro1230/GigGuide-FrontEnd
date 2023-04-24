import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image, Button, Modal, ModalBody } from "react-bootstrap";
import Carousel from "react-grid-carousel";
import "../Profilepage.css";
import "../ArtistCard.css";
import ArtistCard from "../Components/ArtistCard";
import Event from "../Components/Event";

const FanProfilepage = (props) => {
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  const navigate = useNavigate();
  const user = props.userData;
  const currentSavedEvents = props.currentSavedEvents;

  const id = sessionStorage.getItem("userId");

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
              alt="No profile img"
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
        </article>
      </section>
      <section className="events-and-fav-artist-contaiener">
        <article className="favourite-artists-carousel">
          <p className="favourite-artists-title">My favourite artists:</p>
          <Carousel
            activeIndex={index}
            onSelect={handleSelect}
            cols={6}
            rows={1}
            gap={10}
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
                cols: 4,
                rows: 1,
                gap: 10,
                loop: true,
                hideArrow: false,
                showDots: true,
              },
              {
                breakpoint: 768,
                cols: 3,
                rows: 1,
                gap: 10,
                loop: true,
                hideArrow: false,
                showDots: true,
              },
              {
                breakpoint: 576,
                cols: 2,
                rows: 1,
                gap: 10,
                loop: true,
                hideArrow: false,
                showDots: true,
              },
              {
                breakpoint: 350,
                cols: 1,
                rows: 1,
                gap: 10,
                loop: true,
                hideArrow: false,
                showDots: true,
              },
            ]}
            mobileBreakpoint={3}
          >
            {favouriteArtists.length
              ? favouriteArtists.map((artist, index) => {
                  return artist ? (
                    <Carousel.Item key={index}>
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
        </article>
        <article className="saved-upcoming-events">
          <p className="saved-events-title">Saved upcoming events:</p>
          <Event
            upcomingEvents={plannedEvents}
            currentSavedEvents={currentSavedEvents}
            onEventClick={props.onEventClick}
          />
        </article>
      </section>
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

export default FanProfilepage;
