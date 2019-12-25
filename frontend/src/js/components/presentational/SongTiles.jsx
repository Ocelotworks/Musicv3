import React from 'react';
import {GridList, GridTile, GridTilePrimary, GridTilePrimaryContent, GridTileSecondary, GridTileTitle, } from 'rmwc';

export const SongTiles = () => (
    <>
        <GridList>
            {Array(6)
                .fill(undefined)
                .map((val, i) => (
                    <GridTile key={i}>
                        <GridTilePrimary>
                            <GridTilePrimaryContent
                                src="https://placekitten.com/400/400"
                                alt="test"
                            />
                        </GridTilePrimary>
                        <GridTileSecondary>
                            <GridTileTitle>Tile {i + 1}</GridTileTitle>
                        </GridTileSecondary>
                    </GridTile>
                ))}
        </GridList>
    </>
);