<script lang="ts">
    import { createRoom } from './firebase';

    async function onCreateRoom() {
        var roomId = await createRoom();
        //var roomId = "test";
        // redirect to /:roomId
        window.location.href = `/${roomId}`;
    }
</script>

<div class="min-h-screen bg-slate-900 pt-4">
    <button class="text-white text-xl ml-4" on:click={onCreateRoom}>Create room</button>
</div>
