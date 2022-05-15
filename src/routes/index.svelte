<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import { createRoom } from "$lib/firebase";
    import { goto } from "$app/navigation";
    import { GetSavedPlayerName, SavePlayerName } from "$lib/storages";
    import { onMount } from "svelte";

    let name = "";
    let loading = false;
    async function onCreateRoom() {
        if (name == "") {
            alert("Please enter a name");
            return;
        }

        loading = true;
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

<div class="mx-auto w-3/6 text-center">
    <div>
        <h3 class="mb-1">Enter your name:</h3>
        <input on:keypress={onKeyPress} bind:value={name} />
    </div>
    <Button class="mt-2" {loading} disabled={name == ""} on:click={onCreateRoom}>
        Create room
    </Button>
</div>
