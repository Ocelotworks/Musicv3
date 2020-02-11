import React from "react";
import axios from "axios";
import Error from "../presentational/Error";
import User from "../presentational/User";
import '../css/RadioFilter.css';
import {Link} from "react-router-dom";

/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 11/02/2020
 * ╚════ ║   (music3) RadioFilter
 *  ════╝
 */

const filterMaps = {
    ARTIST: {
        endpoint: "artist",
        title: "Songs by",
        display: (data)=>{
            return <Link to={'/artist/'+data.id}>{data.name}</Link>;
        }
    },
    GENRE: {
        endpoint: "genre",
        title: "Songs in the genre",
        display: (data)=>{
            return <Link to={'/genre/'+data.id}>{data.name}</Link>;
        }
    },
    SONG: {
        title: "The song",
        endpoint: "song",
        display: (data)=>{
            return data.title;
        }
    },
    PLAYLIST: {
        title: "Songs in the playlist",
        endpoint: "playlist",
        endpointSuffix: "/info",
        display: (data)=>{
            if(data.error)
                return data.error;
            return <Link to={'/playlist/'+data.id}>{data.name} ({data.count} songs)</Link>;
        }
    },
    USER: {
        title: "Songs added by the user",
        endpoint: "user",
        display: (data)=>{
            return <User user={data}/>;
        }
    },
    KEYWORD: {
        title: "Titles containing",
        endpoint: null,
        display: (data, filter)=>filter.filterData,
    },
    DJ: {
        title: "User manually controls the queue",
        endpoint: "user",
        display: (data)=>{
            return <User user={data}/>;
        }
    }
};

export default class RadioFilter extends React.Component {
    state = {
        data: null,
    };

    constructor(props){
        super(props);
        const filterMap = filterMaps[props.radioFilter.filterType];
        if(filterMap.endpoint) {
            axios.get(`http://localhost:3000/api/v2/${filterMap.endpoint}/${props.radioFilter.filterData}${filterMap.endpointSuffix || ""}`).then((res) => {
                this.setState({data: res.data})
            }).catch((error) => this.setState({error: error.toString()}));
        }else {
            setImmediate(() => { //For some reason
                this.setState({data: props.radioFilter.filterData});
            });
        }
    }

    render() {
        if(this.state.error)
            return <Error error={this.state.error}/>;
        return (
            <li className={`radioFilter ${this.props.radioFilter.and ? "and" : "or"} ${this.props.radioFilter.exclude ? "exclude":"include"} ${this.props.radioFilter.filterType.toLowerCase()}`}>
                <span className='filterName'>{filterMaps[this.props.radioFilter.filterType].title}</span>
                <span className='playlistInfo'>{this.state.data ? filterMaps[this.props.radioFilter.filterType].display(this.state.data, this.props.radioFilter) : "Loading..."}</span>
                {this.props.editing ? <div className="controls">Meep moop</div> : ""}
            </li>
        )
    }
}