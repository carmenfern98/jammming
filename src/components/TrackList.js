import React from "react";
import { Track } from "./Track";

export const TrackList = ({tracks = [], onAdd, onRemove, isInPlaylist}) => {
    return (
        <div>
            {tracks.map((track) => (<Track key={track.id} track={track} onAdd={onAdd} onRemove={onRemove} isInPlaylist={isInPlaylist}/>))}
        </div>
    )
}