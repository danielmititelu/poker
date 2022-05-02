<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let value: string;
    export let selected: boolean;
    const dispatch = createEventDispatcher();

     function onSelectCard() {
        dispatch('selectCard', value);
    }
</script>

<div class="bg-slate-100 card
            m-1 text-center text-4xl
            hover:bg-slate-300 mouse
            cursor-pointer rounded-md" 
            class:selected
            on:click={() => onSelectCard()}>
    {value}
</div>

<style>
    .selected {
        background-color: #4b4949;
    }
    .card {
        height: 75px;
        width: 50px;
    }
</style>