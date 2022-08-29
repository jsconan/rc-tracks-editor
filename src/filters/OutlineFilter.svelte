<script>
    // Licensed under GNU Public License version 3
    // Copyright (c) 2022 Jean-Sébastien CONAN

    export let id = 'outline';
    export let width = 5;
    export let R = 0;
    export let G = 0;
    export let B = 0;
    export let A = 1;

    $: color = `1 0 0 0 ${R}
                0 1 0 0 ${G}
                0 0 1 0 ${B}
                0 0 0 ${A} 0`;
</script>

<filter {id} filterUnits="userSpaceOnUse">
    <feMorphology operator="dilate" in="SourceAlpha" radius="0" result="inner" />
    <feMorphology operator="dilate" in="SourceAlpha" radius={width} result="outer" />
    <feComposite in="inner" in2="outer" operator="xor" result="outline" />
    <feColorMatrix type="matrix" in="outline" values={color} result="coloredOutline" />
    <feComposite in="coloredOutline" in2="SourceGraphic" operator="over" result="output" />
</filter>
