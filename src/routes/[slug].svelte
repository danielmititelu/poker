<script lang="ts">
    import Card from "../components/card.svelte";
    import { addSample, getSample } from './firebase';
    import { page } from '$app/stores';
    
    let choices: { [name: string]: string } = {};
    let selectCard = (event: CustomEvent<string>): any => {
        choices["Daniel"] = event.detail;
    };
</script>

{$page.params.slug}

<div class="min-h-screen bg-slate-900 pt-4">
    <div
        class="container outline-dashed flex m-auto
                mb-4"
    >
        {#each Object.entries(choices) as [name, value]}
            <div>
                <Card {value} />
                <div class="text-white">{name}</div>
            </div>
        {/each}
    </div>

    <div class="container outline-dashed flex m-auto">
        <Card value="1" on:click={selectCard} />
        <Card value="2" on:click={selectCard} />
        <Card value="3" on:click={selectCard} />
        <Card value="5" on:click={selectCard} />
        <Card value="7" on:click={selectCard} />
    </div>
</div>

<style>
    .container {
        height: 120px;
        width: 300px;
    }
</style>