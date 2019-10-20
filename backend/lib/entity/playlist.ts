import User from "./user";
import Song from "./song";

export default class Playlist{
    id: string;
    name: string;
    private: boolean;
    ownerID: string;


    async getOwner(): Promise<User> {
        return null;
    }

    async getSongs(): Promise<Song[]>{
        return null;
    }
}

