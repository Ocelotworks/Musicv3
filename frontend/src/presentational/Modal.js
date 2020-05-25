/**
 *   ╔════   Copyright 2020 Peter Maguire
 *  ║ ════╗  Created 12/01/2020
 * ╚════ ║   (music3) Modal
 *  ════╝
 */
import Modal from 'react-modal';
import React from 'react';
import {Switch, Route} from "react-router-dom";
import {Redirect} from "react-router";
import StupidReact from "./pages/StupidReact";
import SongModal from "../functional/modal/SongModal";
//I don't like this shit
const customStyles = {
    overlay: {
        zIndex: '1000',
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
    },
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        background            : '#191919',
        border                : '1px solid black'
    }
};
export default function ModalContainer({setIsOpen, modalIsOpen, returnUrl, requestClose, controls}){
    function openModal() {
        console.log("Opening modal");
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal(){
        console.log("Closing modal", returnUrl);
        setIsOpen(false);
    }

    return (
        <div>
            <Modal isOpen={modalIsOpen} onAfterOpen={afterOpenModal} onRequestClose={requestClose} style={customStyles} contentLabel="Modal">
                <Switch>
                    <Route path={`${returnUrl}/modal/song/:id`}>
                        <SwitchModal switchModal={openModal} condition={!modalIsOpen}/>
                        <StupidReact Target={SongModal} props={{returnUrl, controls}}/>
                    </Route>
                    <Route path="*">
                        <SwitchModal switchModal={closeModal}  condition={modalIsOpen}/>
                    </Route>
                </Switch>
            </Modal>
        </div>
    );
};


function SwitchModal({switchModal, condition}){
    if(condition)
        switchModal();
    return (<></>)
}


