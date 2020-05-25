import * as React from "react";
import axios from "axios";

export default class Delete extends React.Component {

    state = {
        deleting: false,
        error: null,
    }

    constructor(props){
        super(props);
        this.delete = this.delete.bind(this);
    }

    delete(){
        this.setState({deleting: true});
        axios.delete(`http://localhost:3000/api/v2/song/${this.props.song.id}`).then((res)=>{
            console.log("Delete response", res);
            if(res.status >= 400)
                return this.setState({error: "Code "+res.status});
            console.log("Delete succeeded");
            this.props.controls.requestClose();
            document.dispatchEvent(new CustomEvent("petifyDeleteSong", {detail: {songId: this.props.song.id}}));
        }).catch((error)=>{
            this.setState({error, deleting: false});
        });
    }

    render() {
        if(this.state.deleting)
            return <div className="songModalTab" id="songDeleteTab">
                <h2>Deleting...</h2>
            </div>


        if(this.state.error)
            return <div className="songModalTab" id="songDeleteTab">
                {this.state.error}
            </div>

        return (<div className="songModalTab" id="songDeleteTab">
            <h2>Are you sure?</h2>
            <p>Deleted songs are gone forever, they cannot be brought back like people or bad memories.</p>
            <button className="red" onClick={this.delete}>Delete Forever</button>
        </div>);
    }
}