/** @jsxImportSource @emotion/react */
import React, {useEffect, useState} from "react";
import { SearchResults } from "./components/SearchResults";
import { SearchBar } from "./components/SearchBar";
import { Playlist } from "./components/Playlist";
import { TrackList } from "./components/TrackList";
import { Track } from "./components/Track";
import Spotify from "./utilities/spotifyapi";
import './App.css';
import styled from "@emotion/styled/macro";

const SearchPlaylistContainer = styled.div`
display: flex;
justify-content: space-between;
`

const SearchResultContainer = styled.div`
border-width: 2px;
flex: 1;
padding: 5vh;
margin: 5vh;
display: flex;
border-radius: 10px;
justify-content: center;
background-color: #8300c4;
text-align: left;
`
const PlaylistContainer = styled.div`
display:flex;
border-width: 2px;
flex: 1;
padding: 5vh;
margin: 5vh;
border-radius: 10px;
justify-content: flex-start;
flex-direction: column;
background-color: #8300c4;
text-align: left;
`
const PlaylistName = styled.input`
margin: 20px;
height: 6vh;
width: 35vh;
border-width: 0px;
border-radius: 10px;
display: flex;
text-align: center;
font-family: "Montserrat", sans-serif;
font-optical-sizing: auto;
font-weight: 800;
font-style: bold;
`
const AppTitle = styled.h2`
  font-family: "Audiowide", sans-serif;
  font-weight: 400;
  font-style: normal;
`

function App() {

  useEffect(()=>{
    Spotify.getAccessToken();
  }, []);
  const sampleTracks = [
    {
      id: 1,
      name: "Song Title 1",
      artists: [{ name: "Artist 1" }],
      album: "Album 1",
      uri: "spotify:track:1234567890abcdef1234567890abcdef"
    },
    {
      id: 2,
      name: "Song Title 2",
      artists: [{ name: "Artist 2" }],
      album: "Album 2",
      uri: "spotify:track:abcdef1234567890abcdef1234567890"
    }
  ];

  const mockPlaylist = [
    { uri: "spotify:track:1234567890abcdef1234567890abcdef" },
    { uri: "spotify:track:abcdef1234567890abcdef1234567890" },
  ];
  

  const [playlistTitle, setPlaylistTitle]=useState("");
  const [playlistTracks, setPlaylistTracks]=useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleTitleChange = (event) =>
  {setPlaylistTitle(event.target.value);}

  const handleSearch = async (term) => {
    setSearchTerm(term);
    
    const accessToken = await Spotify.getAccessToken();
    console.log("Access token:", accessToken);
    
    if (!accessToken) return;
    
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?type=track&q=${term}`,
      {
        headers: {
        Authorization: `Bearer ${accessToken}`
      },
    }
  );
  const data = await response.json();
  console.log(data);
  if(data && data.tracks && data.tracks.items){
  const tracks = data.tracks.items.map((track)=>({
    id: track.id,
    name: track.name,
    artists: track.artists.map((artist)=>artist.name).join(", "),
    album: track.album.name,
    uri:track.uri
  }));
  setSearchResults(tracks);
} else {console.error("Error: Tracks data is not available.", data);}}
catch (error){
  console.error("Error fetching search results: ", error)
}
  }

const addToPlaylist = (track) => {
  const trackExists = playlistTracks.some((t)=>t.id === track.id)
  if (!trackExists){
    setPlaylistTracks([...playlistTracks, track])
  }
}
const removeFromPlaylist = (track) => {
  setPlaylistTracks(prevTracks =>
    prevTracks.filter(t=> t.id !== track.id)
  )
  }

  const getTrackUris = () =>{
    return playlistTracks.map((track)=> track.uri)
  }

  const saveToSpotify = () =>{
    const trackUris=getTrackUris();
    Spotify.savePlaylist(playlistTitle, trackUris);
    console.log("Saving these tracks to spotify", trackUris)}
  
  return (
    <div className="App">
      <header className="App-header">
      <AppTitle>Jammming</AppTitle>
      </header>
      <div className="banner">
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch}/>
      </div>
      <SearchPlaylistContainer>
      <SearchResultContainer>
      <SearchResults searchResults={searchResults} onAdd={addToPlaylist}/>
      </SearchResultContainer>
      <PlaylistContainer>
        <PlaylistName type="text" value={playlistTitle}onChange={handleTitleChange}placeholder="Enter playlist title"/>
      <Playlist playlistTitle={playlistTitle} playlistTracks={playlistTracks} onRemove={removeFromPlaylist} onSave={saveToSpotify}/>
      </PlaylistContainer>
      </SearchPlaylistContainer>
    </div>
  );
}


export default App;
