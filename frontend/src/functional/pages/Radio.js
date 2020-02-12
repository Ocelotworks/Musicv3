import * as React from "react";
import axios from "axios";
import Error from "../../presentational/Error";
import {PlayerContext} from "../../Context";
import ContextMenuWrapper from "../../presentational/ContextMenuWrapper";
import Button from "../../presentational/Button";
import {Delete, Edit, PlayArrow, Save} from "@material-ui/icons";
import StandardLoader from "../../presentational/StandardLoader";
import RadioFilter from "../RadioFilter";
import RadioPlayerHandler from "../../playerHandlers/RadioPlayerHandler";
import DefaultPlayerHandler from "../../playerHandlers/DefaultPlayerHandler";

/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 11/02/2020
 * ╚════ ║   (music3) Radio
 *  ════╝
 */
function shuffleArray(originalArray) {
    let array = [].concat(originalArray);
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

export default class Radio extends React.Component {
    state = {
        radio: {desc: "Loading..."},
        filters: null,
        allowHeaders: [],
        editing: false,
        hasChangedFilters: false,
        hasChangedRadio: false,
    };

    constructor(props){
        super(props);
        let id = props.data.id;
        document.title = `Radio | Petify`;
        if(id) {
            axios.get(`http://localhost:3000/api/v2/radio/${id}`).then((res) => {
                document.title = `${res.data.name} | Petify`;
                this.setState({radio: res.data})
            }).catch((error) => this.setState({error: error.toString()}));

            axios.get(`http://localhost:3000/api/v2/radio/${id}/filters`).then((res) => {
                this.setState({filters: res.data})
            }).catch((error) => this.setState({error: error.toString()}));

            axios.options(`http://localhost:3000/api/v2/radio/${id}`).then((res) => {
                if (!res.headers.allow) return;
                this.setState({allowHeaders: res.headers["allow"].split(", ")});
            });
        }
    }

    async toggleEditing(){
        if(this.state.editing){
            this.setState({saving: true});
            if(this.state.hasChangedFilters) {
                await axios.patch(`http://localhost:3000/api/v2/radio/${this.state.radio.id}/filters`, this.state.filters);
            }
            if(this.state.hasChangedRadio){
                await axios.patch(`http://localhost:3000/api/v2/radio/${this.state.radio.id}`, this.state.radio);
            }
        }
        this.setState({editing: !this.state.editing, saving: false});
    }

    handleDetailsUpdate(field){
        return (event)=>{
            let value = event.target.value;
            this.setState((state)=>{
                state.radio[field] = value;
                state.hasChangedRadio = true;
                return state;
            });
        }
    }

    render() {
        if(this.state.error)
            return <Error error={this.state.error}/>;
        return (<PlayerContext.Consumer>{player =>(
            <>
                <ContextMenuWrapper/>
                <div id="artistInfo">
                    <div>
                        <h2>{this.state.editing ? <input type="text" value={this.state.radio.name} onChange={this.handleDetailsUpdate("name")}/> : this.state.radio.name}</h2>
                        <h3>{this.state.editing ? <input type="text" value={this.state.radio.desc} onChange={this.handleDetailsUpdate("desc")}/> : this.state.radio.desc}</h3>
                        <Button Icon={PlayArrow} text={player.data.radio && player.data.radio.id === this.state.radio.id ? "Stop Listening" : "Start Listening"} onClick={()=>{player.control.setPlayerHandler(player.data.radio && player.data.radio.id === this.state.radio.id ? new DefaultPlayerHandler(player.control.getPlayer()) : new RadioPlayerHandler(player.control.getPlayer(), this.state.radio))}}/>
                        {this.state.allowHeaders.includes("PATCH") ? this.state.saving ? <>Saving...</> : <Button Icon={this.state.editing ? Save : Edit} text={this.state.editing ? "Save" : "Edit"} onClick={()=>this.toggleEditing()}/> : ""}
                        {this.state.allowHeaders.includes("DELETE") ? <Button Icon={Delete} text={"Delete"} onClick={()=>{}}/> : ""}
                    </div>
                </div>
                <ul className='filterList'>
                    <StandardLoader array={this.state.filters} mapFunction={(filter)=><RadioFilter key={"filter"+filter.id} radioFilter={filter} editing={this.state.editing} isModified={(b)=>this.setState({hasChangedFilters: b})}/>} noneText="This radio has no filters. Will probably be pretty boring."/>
                </ul>
                {this.state.editing ? <button onClick={()=>this.setState((state)=>{state.filters.push({radioID: this.state.radio.id,"exclude":false,"and":true,filterType:"ARTIST",filterData:""});return state;})}>Add Filter</button> :<></>}
            </>
        )}</PlayerContext.Consumer>);
    }
}