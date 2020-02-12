/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 11/02/2020
 * ╚════ ║   (music3) RadioPlayerHandler
 *  ════╝
 */
import DefaultPlayerHandler from "./DefaultPlayerHandler";
import axios from "axios";


export default class RadioPlayerHandler extends DefaultPlayerHandler {
    constructor(player, radio, isResume){
        super(player);
        if(isResume)return;
        this.player.setState({radioIncrement: 2});
        axios.get(`http://localhost:3000/api/v2/radio/${radio.id}/songs`).then((res) => {
            this.setRadio(radio);
            this.shuffleToQueue(res.data);
            this.nextTrack();
        }).catch((error) => console.error(error));
    }

    nextTrack(){
        super.nextTrack();
        if(this.player.state.queue.length < 5) {
            axios.get(`http://localhost:3000/api/v2/radio/${this.player.state.radio.id}/songs?page=${this.player.state.radioIncrement}`).then((res) => {
                this.shuffleToQueue(res.data);
                if (!res.data || res.data.length === 0)
                    this.player.setState({radioIncrement: 2});
                else
                    this.player.setState({radioIncrement: this.player.state.radioIncrement + 1});
            }).catch((error) => console.error(error));
        }
    }

}