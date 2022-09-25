<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { setContext } from 'svelte';
    import config from './config.js';
    import { Sketch } from './track/elements';
    import { Track } from './track/components';
    import { buildList, buildTrack } from './track/builders';
    import { TileCoordList, TileList } from './track/models';
    import { TileSpecifications } from './track/config';
    import {
        CURVED_TILE_ENLARGED_TYPE,
        CURVED_TILE_TYPE,
        STRAIGHT_TILE_TYPE,
        TILE_DIRECTION_RIGHT
    } from './track/helpers';

    const angle = 0;
    const barrierChunks = config.barrierChunks;
    const barrierWidth = config.barrierWidth;
    const laneWidth = config.laneWidth;

    const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks, 5);
    setContext(specs.contextId, specs);

    function click(event) {
        console.log(event.detail);
    }

    const track = new TileList(specs);
    const trackCoords = new TileCoordList(track, buildTrack, { startAngle: angle, hPadding: 20, vPadding: 20 });
    track.subscribe(() => console.log(JSON.stringify(track.export())));

    const list = new TileList(specs);
    list.import([
        { type: STRAIGHT_TILE_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 },
        { type: CURVED_TILE_ENLARGED_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 },
        { type: CURVED_TILE_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 1 },
        { type: CURVED_TILE_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 2 },
        { type: CURVED_TILE_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 3 },
        { type: CURVED_TILE_TYPE, direction: TILE_DIRECTION_RIGHT, ratio: 4 }
    ]);
    const menuCoords = new TileCoordList(list, buildList, {
        tileAngle: -90,
        centered: true,
        aligned: true,
        vertical: true,
        vPadding: 20
    });
    const statsCoords = new TileCoordList(list, buildList, {
        tileAngle: -0,
        centered: true,
        aligned: true,
        vertical: false,
        hPadding: 30,
        vPadding: 50
    });
</script>

<div class="page">
    <header>header</header>
    <main>
        <aside>
            <Sketch width="100%" height="100%">
                <Track
                    list={menuCoords}
                    on:click={event => {
                        click(event);
                        track.appendTile(event.detail.type, event.detail.direction, event.detail.ratio);
                    }}
                />
            </Sketch>
        </aside>
        <section>
            <nav>
                <Sketch width="100%" height="100%">
                    <Track list={statsCoords} on:click={click} />
                </Sketch>
            </nav>
            <article>
                <Sketch width="100%" height="100%" style="background-color: gray;">
                    <Track
                        list={trackCoords}
                        on:click={event => {
                            click(event);
                            track.getTile(event.detail.id).flipDirection();
                            track.update();
                        }}
                    />
                </Sketch>
            </article>
        </section>
    </main>
    <footer>footer</footer>
</div>

<style>
    .page {
        display: flex;
        flex-direction: column;

        position: relative;
        padding: 0;
        margin: 0;
        height: 100%;
        overflow: hidden;
    }

    header {
        height: 3rem;
        flex: 0 0 auto;
    }

    main {
        display: flex;
        flex-direction: row;
        flex: 1 1 auto;
    }

    aside {
        flex: 0 0 10%;
    }

    section {
        display: flex;
        flex-direction: column;
    }

    nav {
        flex: 0 0 auto;
        height: 5rem;
    }

    article {
        flex: 1 1 auto;
    }

    footer {
        height: 2rem;
        flex: 0 0 auto;
    }
</style>
