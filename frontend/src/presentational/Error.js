/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 14/01/2020
 * ╚════ ║   (music3) Error
 *  ════╝
 */

import React from "react";

export default function Error({error}){
    return (
        <div className="errorMessageContainer">
            <h1>{error}</h1>
            <div className='errorMessage'>
                golly gee willikers, looks like you've taken a wrong turn!!!!, looks like our army of busy little worker bees must have filed the page you were looking for in the wrong filing cabinet!!!! mayhaps you could try looking at one of our other many pages? ?? i am sure you would find something else you would like instead?? SO sorry you did not find what you were looking for!! may the force be with you fellow geek! :3 :3 :3
            </div>
        </div>
    );
}
