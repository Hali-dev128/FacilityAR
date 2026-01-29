<script>
	import { fade } from "svelte/transition";
</script>

<div transition:fade>
    <span>
        <svg data-v-14c8c335="" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-cw-icon lucide-refresh-cw lucide-icon customizable"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>
    </span>
</div>

<style>
    div {
        position: fixed;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(3px);
        background-color: #0007;
        color: var(--pri-color);
        display: grid;
        z-index: 2000;
        place-items: center;
    }

    span {
        animation-name: rotate;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
        animation-play-state: running;
        animation-duration: 1.5s;
    }

    @keyframes rotate {
        0% {
            rotate: 0deg;
        }
        100% {
            rotate: 360deg;
        }
    }
</style>