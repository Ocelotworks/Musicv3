import React from "react";

/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 22/01/2020
 * ╚════ ║   (music3) RelatedSong
 *  ════╝
 */

//export enum Relation {
//     SAMPLES = "SAMPLES",
//     COPIES = "COPIES",
//     REMIX = "REMIX",
//     ALTERNATE = "ALTERNATE",
//     MASHUP = "MASHUP",
//     REFERENCES = "REFERENCES",
//     COVER = "COVER",
//     DUPLICATE = "DUPLICATE",
// }


const relations = {
    forwards: {
        MASHUP: "is a mashup of",
        SAMPLES: "samples",
        COPIES: "copies",
        REMIX: "is a remix of",
        ALTERNATE: "is an alternate version of",
        REFERENCES: "references",
        COVER: "is a cover of",
        DUPLICATE: "is a duplicate of"
    },
    backwards: {
        MASHUP: "was mashed up by",
        SAMPLES: "was sampled by",
        COPIES: "copied by",
        REMIX: "was remixed in",
        ALTERNATE: "is an alternate version of",
        REFERENCES: "was referenced by",
        COVER: "was covered in",
        DUPLICATE: "is a duplicate of"
    }
};

export default function({relation}){
    return (<div className={`relatedSong ${relation.relation.toLowerCase()} ${relation.direction}`}>
        <span className="relatedSongRelation">{relations[relation.direction][relation.relation]} </span>
        <span className="relatedSongName">{relation.relatedSong.artist.name} - {relation.relatedSong.title}</span>
    </div>)
}