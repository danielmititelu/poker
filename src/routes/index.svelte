<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import { createRoom } from "$lib/firebase";
    import { goto } from "$app/navigation";
    import { GetSavedPlayerName, SavePlayerName } from "$lib/storages";
    import { onMount } from "svelte";

    let name = "";
    async function onCreateRoom() {
        if (name == "") {
            alert("Please enter a name");
            return;
        }
        SavePlayerName(name);
        var roomId = await createRoom();
        goto(`${roomId}`);
    }

    function onKeyPress(e: KeyboardEvent) {
        if (e.key === "Enter") {
            onCreateRoom();
        }
    }

    onMount(() => {
        name = GetSavedPlayerName();
    });
</script>

<div class="min-h-screen bg-slate-900 pt-4">
    <div class="ml-2">
        <div>
            <h3>Enter your name:</h3>
            <input on:keypress={onKeyPress} bind:value={name} />
        </div>
        <Button disabled={name == ""} on:click={onCreateRoom}>
            Create room
        </Button>
    </div>
</div>
