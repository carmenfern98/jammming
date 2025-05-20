/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import styled from "@emotion/styled/macro";

const SearchBarStyled = styled.input`
margin: 20px;
height: 8vh;
width: 30vh;
border-width: 0px;
border-radius: 10px;
display: flex;
text-align: center;
font-family: "Montserrat", sans-serif;
font-optical-sizing: auto;
font-weight: 800;
font-style: bold;
`
const SearchBarContainer = styled.div`
display: flex;
align-items: center;
justify-content: center;
`

const SearchButton = styled.button`
border-radius: 10px;
border-width: 0px;
background-color: #4c00a4;
height: 5vh;
width: 10vh;
color: #FFFFFF;
font-family: "Montserrat", sans-serif;
font-optical-sizing: auto;
font-weight: 800;
font-style: bold;

&:hover{
cursor: pointer;}
`

export const SearchBar = ({searchTerm, setSearchTerm, onSearch}) =>
{

    const handleSearch = (event) =>
        setSearchTerm(event.target.value)

    const handleSubmit = (event) => {
        event.preventDefault();
        if (searchTerm){
            onSearch(searchTerm);
        }
    }

    return(
        <SearchBarContainer>
        <form onSubmit={handleSubmit}>
            <SearchBarStyled 
                type="text" 
                value={searchTerm} 
                onChange={handleSearch}
                placeholder="Search Songs"
            />
        <SearchButton type="submit" onClick={handleSubmit}>Search</SearchButton>
        </form>
        </SearchBarContainer>
    )
}