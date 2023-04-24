import React from "react";
import Card from "react-bootstrap/Card";
import "../ArtistCard.css";
import Nav from "react-bootstrap/Nav";
import Image from "react-bootstrap/Image";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

const ArtistCard = (props) => {
  const bandName = props.name;
  const bandPic = props.profilePicture;
  const isTouring = props.touring;
  const bandId = props.id;
  const currentFaveArtists = props.currentFaveArtists;
  const id = sessionStorage.getItem("userId");
  const navigate = useNavigate();

  const onCardClick = () => {
    navigate(`/userprofile/${bandId}`);
  };
  return (
    <Card
      className="bg-dark text-white artistCard"
      style={{ width: "auto" }}
      key={bandId}
    >
      <LinkContainer to={`/userprofile/${bandId}`}>
        <Nav.Link>
          <Card.Img src={bandPic} alt="Artist Picture" fluid={true} />
        </Nav.Link>
      </LinkContainer>
      <Card.ImgOverlay fluid={true}>
        <div className="favoritediv">
          {id ? (
            currentFaveArtists.length ? (
              currentFaveArtists.find((artist) => artist.id === bandId) ? (
                <Image
                  roundedCircle={true}
                  src={`${process.env.REACT_APP_BACKEND_URL}profile-pics/Filled.png`}
                  alt="Filled Heart"
                  className="favorite"
                  onClick={props.onHeartClick}
                  id={bandId}
                  title={bandName}
                  data-touring={isTouring}
                  pic={bandPic}
                ></Image>
              ) : (
                <Image
                  roundedCircle={true}
                  src={`${process.env.REACT_APP_BACKEND_URL}profile-pics/Outline.png`}
                  alt="Heart Outline"
                  className="favorite"
                  onClick={props.onHeartClick}
                  id={bandId}
                  title={bandName}
                  data-touring={isTouring}
                  pic={bandPic}
                ></Image>
              )
            ) : (
              <Image
                roundedCircle={true}
                src={`${process.env.REACT_APP_BACKEND_URL}profile-pics/Outline.png`}
                alt="Heart Outline"
                className="favorite"
                onClick={props.onHeartClick}
                id={bandId}
                title={bandName}
                data-touring={isTouring}
                pic={bandPic}
              ></Image>
            )
          ) : null}
        </div>
        <LinkContainer to={`/userprofile/${bandId}`}>
          <Nav.Link>
            <Card.Title className="bandName">{bandName}</Card.Title>
            {isTouring ? (
              <Card.Footer className="isTouring">Upcoming Shows</Card.Footer>
            ) : null}
          </Nav.Link>
        </LinkContainer>
      </Card.ImgOverlay>
    </Card>
  );
};

export default ArtistCard;
