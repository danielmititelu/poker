<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let value: string;

    const dispatch = createEventDispatcher();

     function onClick() {
        dispatch('click', value);
    }
</script>

<div class="bg-slate-100 card
            m-1 text-center text-4xl
            hover:bg-slate-300 mouse
            cursor-pointer rounded-md" 
            on:click={() => onClick()}>
    {value}
</div>

<style>
    .card {
        height: 75px;
        width: 50px;
    }
</style>