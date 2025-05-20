/** @jsxImportSource @emotion/react */
import React from "react";
import { TrackList } from "./TrackList";
import styled from "@emotion/styled/macro";

const SearchResultBox = styled.div`
font-family: "Montserrat", sans-serif;
font-optical-sizing: auto;
font-weight: 800;
font-style: bold;
`
const BoxTitle = styled.h1`
color: #FFFFFF;
`

export const SearchResults = ({searchResults, onAdd, isInPlaylist}) =>
{
    return(
        <SearchResultBox>
            <BoxTitle>Search Results</BoxTitle>
            <TrackList isInPlaylist={false} tracks={searchResults} onAdd={onAdd}/>
        </SearchResultBox>
    )
}