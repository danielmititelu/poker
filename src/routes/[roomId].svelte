<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import Card from "$lib/components/Card.svelte";
    import NameInput from "$lib/components/NameInput.svelte";
    import { page } from "$app/stores";
    import {
        joinRoom,
        subscribeTo,
        vote,
        revealCards,
        startNewGame,
        getUserId,
        changeName,
        type Room,
    } from "../lib/firebase";
    import { onDestroy, onMount } from "svelte";
    import { playerName } from "../lib/stores";
    import type { Unsubscribe } from "firebase/database";

    let roomId = $page.params.roomId;
    let name = $playerName;
    let uid = null;
    let reveal = false;
    let selectedCard = null;
    let players = [];
    let isOwner = false;

    async function onRoomChange(room: Room) {
        if (!room || !room.players) {
            return;
        }
        reveal = room.reveal;
        if (uid == null) {
            uid = await getUserId();
        }

        if(room.owner === uid) {
            isOwner = true;
        }

        var p = [];
        Object.values(room.players).forEach((player) => {
            if (player.uid === uid) {
                selectedCard = player.voted ? player.vote : null;
            }
            p.push(player);
        });

        players = p;
    }

    let unsubscribe: Unsubscribe;
    onMount(async () => {
        unsubscribe = subscribeTo(roomId, onRoomChange);
        await joinRoom(roomId, $playerName);
    });

    onDestroy(() => {
        if(unsubscribe) {
            unsubscribe();
        }
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
        {#if reveal && isOwner}
            <Button
                class="mx-auto"
                disabled={false}
                on:click={async () => await startNewGame(roomId, players)}
            >
                Start new game
            </Button>
        {:else if isOwner}
            <Button
                class="mx-auto"
                disabled={false}
                on:click={async () => await revealCards(roomId)}
            >
                Reveal Cards
            </Button>
        {/if}
    </div>

    <div class="container outline-dashed flex m-auto">
        {#each ["1", "2", "3", "5", "7"] as value}
            <Card
                {value}
                selected={selectedCard === value}
                on:click={async (event) => await vote(roomId, event.detail)}
            />
        {/each}
    </div>
    <div class="flex">
        <div class="text-white text-lg mx-auto">
            <NameInput
                {name}
                on:nameChanged={async (n) => {
                    name = n.detail;
                    await changeName(roomId, uid, name);
                }}
            />
        </div>
    </div>
</div>

<style>
    .container {
        height: 120px;
        width: 300px;
    }
</style>
