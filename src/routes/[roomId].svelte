<script lang="ts">
    import Button from "../components/Button.svelte";
    import Card from "../components/Card.svelte";
    import { page } from "$app/stores";
    import {
        unsubscribe,
        joinRoom,
        subscribeTo,
        vote,
        revealCards,
        startNewGame,
        getUserId
    } from "../lib/firebase";
    import { onDestroy, onMount } from "svelte";
    import { playerName } from "../lib/stores";

    let roomId = $page.params.roomId;
    let name = $playerName;
    let uid = null;
    let reveal = false;
    let selectedCard = null;

    async function onSelectCard(event: CustomEvent<string>) {
        vote(event.detail);
    };

    function onRoomChange(room: any) {
        reveal = room.reveal;
    }

    let players = [];
    async function onPlayersChange(receivedPlayers: any) {
        if (!receivedPlayers) return;
        if(uid == null) {
            uid = await getUserId();
        }

        let p = [];
        receivedPlayers.forEach((player) => {
            if (player.userId === uid) {
                selectedCard = player.voted ? player.vote : null;
            }
            p.push(player);
        });
        players = p;
    }

    function onRevealCards() {
        revealCards(roomId);
    }

    function onStartNewGame() {
        startNewGame(roomId, players);
    }

    onMount(() => {
        joinRoom(roomId, name);
        subscribeTo(roomId, onRoomChange, onPlayersChange);
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

<div class="min-h-screen bg-slate-900 pt-4">
    <div
        class="container outline-dashed mx-auto
                mb-2"
    >
        {#each players as player}
            <div class="text-white ml-2 flex ">
                <div class="mr-1">{player.name}</div>
                {#if reveal && player.voted}
                    <div>{player.vote}</div>
                {:else if player.voted}
                    <div>✔️</div>
                {:else}
                    <div>❌</div>
                {/if}
            </div>
        {/each}
    </div>
    <div class="flex mb-2">
        {#if reveal}
            <Button class="mx-auto" disabled={false} on:click={onStartNewGame}>
                Start new game
            </Button>
        {:else}
            <Button class="mx-auto" disabled={false} on:click={onRevealCards}>
                Reveal Cards
            </Button>
        {/if}
    </div>

    <div class="container outline-dashed flex m-auto">
        {#each ["1", "2", "3", "5", "7"] as value}
            <Card
                {value}
                selected={selectedCard === value}
                on:click={onSelectCard}
            />
        {/each}
    </div>
    <div class="flex">
        <div class="text-white text-lg mx-auto">
            {name}
        </div>
    </div>
</div>

<style>
    .container {
        height: 120px;
        width: 300px;
    }
</style>
