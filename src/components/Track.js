/** @jsxImportSource @emotion/react */
import React from "react";
import styled from "@emotion/styled/macro";

const AddButton = styled.button`
border: 0px;
background-color: transparent;
font-size: 40px;
color: #FFFFFF;

&:hover{cursor:pointer}
`
const RemoveButton = styled.button`
border: 0px;
background-color: transparent;
font-size: 40px;
color: #FFFFFF;

&:hover{cursor:pointer}
`
const TrackNameText = styled.h4`
font-family: "Montserrat", sans-serif;
font-optical-sizing: auto;
font-weight: 800;
font-style: bold;
color: #FFFFFF;
margin: 0px;
`
const TrackArtistText = styled.h6`
font-family: "Montserrat", sans-serif;
font-optical-sizing: auto;
font-weight: 400;
color:  #cdcdcd;
margin: 2px 0 0 0;
`
const TrackContainer = styled.div`
display: flex; 
justify-content: space-between;
border-bottom: 1px solid #FFFFFF;
`
const TextContainer = styled.div`
display: flex;
flex-direction: column;
padding:1px;
margin: 1px;`

export const Track = ({track, onAdd, onRemove, isInPlaylist}) => {
    const addTrack = () => onAdd(track)
    const removeTrack = () => onRemove(track)

    return (
        <TrackContainer>
        <TextContainer>
        <TrackNameText>{track.name} </TrackNameText>
        <TrackArtistText>{track.artists[0].name} </TrackArtistText>
        <TrackArtistText>{track.album}</TrackArtistText>
        </TextContainer>
        {!isInPlaylist && <AddButton onClick={addTrack}>+</AddButton>}
        {isInPlaylist && <RemoveButton onClick={removeTrack}>-</RemoveButton>}
        </TrackContainer>
    )
}