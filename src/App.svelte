<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    import config from './config.js';
    import samples from './data/tracks.json';
    import { TileSpecifications } from './tile/config';
    import { TrackEditorModel } from './editor/models';
    import { TrackEditor } from './editor/components';

    const angle = -90;
    const specs = new TileSpecifications(config);
    const trackEditor = new TrackEditorModel(specs, angle);

    trackEditor.load(samples.track1);
</script>

<TrackEditor editor={trackEditor} />
