<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import config from './config.js';
    import samples from './data/tracks.json';
    import { TileSpecifications } from './tile/config';
    import { TrackEditorModel } from './editor/models';
    import { TrackEditor } from './editor/components';

    const angle = -90;
    const barrierChunks = config.barrierChunks;
    const barrierWidth = config.barrierWidth;
    const laneWidth = config.laneWidth;

    const specs = new TileSpecifications(laneWidth, barrierWidth, barrierChunks, 5);
    const trackEditor = new TrackEditorModel(specs, angle);

    trackEditor.load(samples.track1);
</script>

<TrackEditor editor={trackEditor} />
