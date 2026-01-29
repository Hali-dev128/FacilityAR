<script>
    export let type = 'button';
    export let diff = false;
    export let light = false;
    export let full = false;
    export let flex = false;
    export let rad = false;
    export let active = false;
</script>

<button 
    class="btn"
    type={type === 'button' ? 'button' : 'submit'}
    class:diff={diff}
    class:active={active}
    class:light={light}
    class:full={full}
    class:flex={flex}
    class:rad={rad}
    on:click
>
    <slot></slot>
</button>

<style>
    .btn.diff:hover {
        color: var(--sec-color);
    }

    
    .light {
        background-color: var(--pri-color);
        color: var(--sec-color);
    }

    .light:hover, .active {
        background-color: transparent;
        color: var(--pri-color);
        border: 2px solid var(--pri-color);
    }

    .full {
        width: 100% !important;
    }

    .flex {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .rad {border-radius: 10px;}
</style>