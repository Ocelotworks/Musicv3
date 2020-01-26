/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 09/01/2020
 * ╚════ ║   (music3) Header
 *  ════╝
 */
import React from 'react';
import '../css/Header.css'
import {NavLink} from "react-router-dom";
import {
    Home,
    LibraryMusic,
    Person,
    Album,
    Subject,
    QueueMusic,
    Radio,
    AddBox,
    InsertChart,
    Lock,
} from "@material-ui/icons";
import User from "./User";
import {PlayerContext} from "../Context";

const links = [
    {icon: Home, href: "/", name: "Home", exact: true},
    {icon: LibraryMusic, href: "/song", name: "Songs"},
    {icon: Person, href: "/artist", name: "Artists"},
    {icon: Album, href: "/album", name: "Albums"},
    {icon: Subject, href: "/genre", name: "Genres"},
    {icon: QueueMusic, href: "/playlist", name: "Playlists"},
    {icon: Radio, href: "/radio", name: "Radio"},
    {icon: AddBox, href: "/add", name: "Add"},
    {icon: InsertChart, href: "/stat", name: "Stats"},
    {icon: Lock, href: "/admin", name: "Admin"},
];

export default function(){
    return (<PlayerContext.Consumer>{player => (
        <div id="topBar">
            <span id="title">Petify</span>
            {links.map((link)=><NavLink key={link.name} to={link.href} exact={link.exact || false} className="navLink"><link.icon/><div>{link.name}</div></NavLink>)}

            <div id="topBarUserContainer">

                <input type="text" id="search" placeholder="Search" autoComplete="false"/>
                {player.data.user ? <User user={player.data.user}/> : <div>Login bitch</div>}
            </div>
        </div>)}
    </PlayerContext.Consumer>)
}