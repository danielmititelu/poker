<script lang="ts">
    import Card from "../components/card.svelte";
    import { page } from "$app/stores";
    import {
        unsubscribe,
        joinRoom,
        subscribeTo,
        vote,
    } from "./firebase";
    import { onDestroy, onMount } from "svelte";

    var roomId = $page.params.roomId;

    let selectCard = (event: CustomEvent<string>): any => {
        vote(event.detail);
    };

    function onRoomChange(room: any) {
        console.log(room);
    }
    var players = [];
    function onPlayersChange(receivedPlayers: any) {
        console.log(receivedPlayers);
        if (!receivedPlayers) return;
        var p = [];
        receivedPlayers.forEach((player) => {
            p.push(player);
            console.log(player);
        });
        players = p;
    }

    onMount(() => {
        joinRoom(roomId);
        subscribeTo(roomId, onRoomChange, onPlayersChange);
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

<div class="min-h-screen bg-slate-900 pt-4">
    <div
        class="container outline-dashed m-auto
                mb-4"
    >
        {#each players as player}
            <div class="text-white ml-2 flex">
                <div>{player.name}</div>
                {#if player.voted == false}
                    <div class="ml-1">X</div>
                {:else}
                    <div class="ml-1">{player.vote}</div>
                {/if}
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
