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

const links = [
    {icon: Home, href: "/", name: "Home"},
    {icon: LibraryMusic, href: "/songs", name: "Songs"},
    {icon: Person, href: "/artists", name: "Artists"},
    {icon: Album, href: "/albums", name: "Albums"},
    {icon: Subject, href: "/genres", name: "Genres"},
    {icon: QueueMusic, href: "/playlists", name: "Playlists"},
    {icon: Radio, href: "/radio", name: "Radio"},
    {icon: AddBox, href: "/add", name: "Add"},
    {icon: InsertChart, href: "/stats", name: "Stats"},
    {icon: Lock, href: "/admin", name: "Admin"},
];

export default function(){
    return (<div id="topBar">
        <span>Petify</span>
        {links.map((link)=><NavLink to={link.href} className="navLink"><link.icon/><div>{link.name}</div></NavLink>)}

        <div id="topBarUserContainer">
            <div className="user">
                <img src="https://placekitten.com/16/16"/>
                <span>User stub</span>
            </div>
        </div>
    </div>)
}