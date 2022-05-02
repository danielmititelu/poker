<script lang="ts">
    import Button from "$lib/components/Button.svelte";
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
    import type { Unsubscribe } from "firebase/database";
    import { GetSavedPlayerName, SavePlayerName } from "$lib/storages";
    import Cards from "$lib/components/Cards.svelte";

    let roomId = $page.params.roomId;
    let name = "";
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

        if (room.owner === uid) {
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

    async function onNameChange(name: string) {
        SavePlayerName(name);
        await changeName(roomId, uid, name);
    }

    let unsubscribe: Unsubscribe;
    onMount(async () => {
        name = GetSavedPlayerName();
        await joinRoom(roomId, name);
        unsubscribe = subscribeTo(roomId, onRoomChange);
    });

    onDestroy(() => {
        if (unsubscribe) {
            unsubscribe();
        }
    });
</script>

<div class="flex flex-col lg:mx-40 md:mx-36 sm:mx-10 mx-5">
    <div
        class="container outline-dashed mx-auto
                mb-2 min-h-[120px] "
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
    <div class="mb-2 flex mx-auto">
        {#if reveal && isOwner}
            <Button
                disabled={false}
                on:click={async () => await startNewGame(roomId, players)}
            >
                Start new game
            </Button>
        {:else if isOwner}
            <Button
                disabled={false}
                on:click={async () => await revealCards(roomId)}
            >
                Reveal Cards
            </Button>
        {/if}
    </div>

    <Cards
        {selectedCard}
        availableCards={["1", "2", "3", "5", "8"]}
        on:selectCard={async (e) => await vote(roomId, e.detail)}
    />
    <NameInput {name} on:nameChanged={(e) => onNameChange(e.detail)} />
</div>
