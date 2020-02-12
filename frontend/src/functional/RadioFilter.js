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
        },
        displayEditing: (data, filter)=><input type="text" value={filter.filterData}/>
    },
    GENRE: {
        endpoint: "genre",
        title: "Songs in the genre",
        display: (data)=>{
            return <Link to={'/genre/'+data.id}>{data.name}</Link>;
        },
        displayEditing: (data, filter)=><input type="text" value={filter.filterData}/>
    },
    SONG: {
        title: "The song",
        endpoint: "song",
        display: (data)=>{
            return data.title;
        },
        displayEditing: (data, filter)=><input type="text" value={filter.filterData}/>
    },
    PLAYLIST: {
        title: "Songs in the playlist",
        endpoint: "playlist",
        endpointSuffix: "/info",
        display: (data)=>{
            if(data.error)
                return data.error;
            return <Link to={'/playlist/'+data.id}>{data.name} ({data.count} songs)</Link>;
        },
        displayEditing: (data, filter)=><>TODO</>
    },
    USER: {
        title: "Songs added by the user",
        endpoint: "user",
        display: (data)=>{
            return <User user={data}/>;
        },
        displayEditing: (data, filter)=><>TODO</>
    },
    KEYWORD: {
        title: "Titles containing",
        endpoint: null,
        display: (data, filter)=>filter.filterData,
        displayEditing: (data, filter)=><input type="text" value={filter.filterData}/>
    },
    DJ: {
        title: "User manually controls the queue",
        endpoint: "user",
        display: (data)=>{
            return <User user={data}/>;
        },
        displayEditing: (data, filter)=><>TODO</>
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

    updateFilterType(event){
        this.props.isModified(true);
        console.log(event.target.value);
        this.props.radioFilter.filterType = event.target.value;
    }

    render() {
        if(this.state.error)
            return <Error error={this.state.error}/>;

        if(this.props.editing)
            return (
                <li className="radioFilter">
                    <span className='filterName'>
                        <div>
                            <button onClick={()=>{this.props.radioFilter.and = !this.props.radioFilter.and}} className={this.props.radioFilter.and ? "and" : "or"}>{this.props.radioFilter.and ? "AND" : "OR"}</button>
                            <button onClick={()=>{this.props.radioFilter.exclude = !this.props.radioFilter.exclude}}  className={this.props.radioFilter.exclude ? "exclude" : "include"}>{this.props.radioFilter.exclude ? "EXCLUDES" : "INCLUDES"}</button>
                            <button>Delete</button>
                        </div>
                        <select value={this.props.radioFilter.filterType} onChange={(e)=>this.updateFilterType(e)}>
                            {Object.keys(filterMaps).map((key)=><option key={this.props.radioFilter.id+key} value={key}>{filterMaps[key].title}</option>)}
                        </select>
                    </span>
                    <span className='playlistInfo'>{filterMaps[this.props.radioFilter.filterType].displayEditing(this.state.data, this.props.radioFilter)}</span>
                </li>
            );
        return (
            <li className={`radioFilter ${this.props.radioFilter.and ? "and" : "or"} ${this.props.radioFilter.exclude ? "exclude":"include"} ${this.props.radioFilter.filterType.toLowerCase()}`}>
                <span className='filterName'>{filterMaps[this.props.radioFilter.filterType].title}</span>
                <span className='playlistInfo'>{this.state.data ? filterMaps[this.props.radioFilter.filterType].display(this.state.data, this.props.radioFilter) : "Loading..."}</span>

            </li>
        )
    }
}