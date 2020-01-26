import {useParams} from "react-router-dom";
import React from "react";
import {Redirect} from "react-router";
import axios from "axios";

/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 26/01/2020
 * ╚════ ║   (music3) LoginController
 *  ════╝
 */
export default function({setCurrentUser}){
    let {key} = useParams();
    axios.defaults.headers.common['Authorization'] = `Bearer ${key}`;

    if(window.localStorage){
        window.localStorage.setItem("key", key);
    }

    console.log("woowowowo");

    //This is horrific
    axios.get('http://localhost:3000/api/v2/user/me').then((res)=>{
        setCurrentUser(res.data);
    }).catch((error)=>console.error(error));

    return (
       <Redirect to='/'/>
    )
};