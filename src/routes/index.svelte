<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import { createRoom } from "$lib/firebase";
    import { playerName } from "$lib/stores";
    import { goto } from '$app/navigation';

    async function onCreateRoom() {
        if($playerName == "") {
            alert("Please enter a name");
            return;
        }
        var roomId = await createRoom();
        goto(`${roomId}`);
    }

    function onKeyPress(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            onCreateRoom();
        }
    }
</script>

<div class="min-h-screen bg-slate-900 pt-4">
    <div class="ml-2">
        <div>
            <h3>Enter your name:</h3>
            <input on:keypress={onKeyPress} bind:value={$playerName}/>
        </div>
        <Button
            disabled={$playerName == ""}
            on:click={onCreateRoom}
        >
            Create room
        </Button>
    </div>
</div>
