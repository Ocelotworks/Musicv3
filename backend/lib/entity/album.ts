import Artist from "./artist";

export default class Album{
    id: string;
    artistID: string;
    name: string;

    async getImage(): Promise<object> {
        return null;
    }

    async getArtist(): Promise<Artist> {
        return null;
    }


}