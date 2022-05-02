<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import { createEventDispatcher } from "svelte";
    export let selectedCard: string;
    export let availableCards: string[];

    const dispatch = createEventDispatcher();
    function onSelectCard(event) {
        dispatch("selectCard", event.detail);
    }
</script>

<div
    class="container outline-dashed flex flex-wrap justify-center"
>
    {#each availableCards as value}
        <Card
            {value}
            selected={selectedCard === value}
            on:selectCard={onSelectCard}
        />
    {/each}
</div>
