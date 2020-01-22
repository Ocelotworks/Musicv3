import * as React from "react";
import axios from "axios";
import RelatedSong from "../../../presentational/modal/song/RelatedSong";

import '../../../css/modal/song/Related.css';

/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 22/01/2020
 * ╚════ ║   (music3) Related
 *  ════╝
 */

export default class Related extends React.Component {
    state = {
        relations: null,
    };

    constructor(props){
        super(props);
        let id = props.song.id;
        axios.get(`http://localhost:3000/api/v2/song/${id}/related`).then((res)=>{
            this.setState({
                relations: res.data,
            })
        });
    }

    render() {
        if (!this.state.relations) {
            return (<div>Loading...</div>)
        }

        if(this.state.relations.length === 0){
            return (<div>No Relations</div>)
        }
        return (<div className="songModalTab" id="songRelationsTab">
            <h3>Related Songs</h3>
            {this.state.relations.map((relation) => <RelatedSong relation={relation}/>)}
        </div>);
    }
}