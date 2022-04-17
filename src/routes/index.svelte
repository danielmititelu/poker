<script lang="ts">

    import { createRoom } from "../lib/firebase";
    import Button from "../components/Button.svelte";
    import { playerName } from "../lib/stores";
 
    async function onCreateRoom() {
        if($playerName == "") {
            alert("Please enter a name");
            return;
        }
        var roomId = await createRoom();
        window.location.href = `/${roomId}`;
    }
</script>

<div class="min-h-screen bg-slate-900 pt-4">
    <div class="ml-2">
        <div>
            <h3>Enter your name:</h3>
            <input bind:value={$playerName}/>
        </div>
        <Button
            disabled={$playerName == ""}
            on:click={onCreateRoom}
        >
            Create room
        </Button>
    </div>
</div>
