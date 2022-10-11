<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import { setContext } from 'svelte';
    import config from './config.js';
    import { Sketch } from './track/elements';
    import { TileSelector } from './editor/components';
    import { TrackEditorModel } from './editor/models';
    import { TileSpecifications } from './tile/config';
    import { Track, TrackStats } from './track/components';
    import samples from './data/tracks.json';

    const angle = -90;
    const barrierChunks = config.barrierChunks;
    const barrierWidth = config.barrierWidth;
    const laneWidth = config.laneWidth;

    const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks, 5);
    setContext(specs.contextId, specs);

    function click(event) {
        console.log(event.detail);
    }

    const trackEditor = new TrackEditorModel(specs, angle);
    trackEditor.load(samples.track1);
</script>

<div class="page">
    <header>header</header>
    <main>
        <aside>
            <Sketch width="100%" height="100%">
                <TileSelector
                    tiles={trackEditor.tiles}
                    on:click={event => {
                        click(event);
                        trackEditor.track.append(event.detail.type, event.detail.direction, event.detail.ratio);
                    }}
                />
            </Sketch>
        </aside>
        <section>
            <nav>
                <Sketch width="100%" height="100%">
                    <TrackStats track={trackEditor.track} />
                </Sketch>
            </nav>
            <article>
                <Sketch width="100%" height="100%">
                    <Track
                        track={trackEditor.track}
                        on:click={event => {
                            click(event);
                            trackEditor.track.getById(event.detail.id).flipDirection();
                            trackEditor.track.update();
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
        background-color: gray;
    }

    footer {
        height: 2rem;
        flex: 0 0 auto;
    }
</style>
