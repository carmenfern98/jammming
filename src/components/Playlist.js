/** @jsxImportSource @emotion/react */
import React from "react";
import { TrackList } from "./TrackList";
import styled from "@emotion/styled/macro";

const SaveButton = styled.button`
border-radius: 10px;
border-width: 0px;
background-color: #CF9FFF;
height: 5vh;
width: 20vh;
color: #FFFFFF;
font-family: "Montserrat", sans-serif;
font-optical-sizing: auto;
font-weight: 800;
font-style: bold;
margin: 5vh;

&:hover{
cursor: pointer;}`

const PlaylistTitle = styled.h2`
color: #FFFFFF;
`
const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`

export const Playlist = ({playlistTitle, playlistTracks, onRemove, onSave, isInPlaylist}) =>
{
    return(
        <div>
            <PlaylistTitle>{playlistTitle}</PlaylistTitle>
            <TrackList isInPlaylist={true} tracks={playlistTracks} onRemove={onRemove}/>
            <ButtonWrapper>
            <SaveButton type="submit" onClick={onSave}>Save to Spotify</SaveButton>
            </ButtonWrapper>
        </div>
    )
}