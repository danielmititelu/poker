<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let name = "";
    let editing = false;
    let tempName = name;

    function onKeyPress(e: KeyboardEvent) {
        if (e.key === "Enter") {
            onNameChange();
        }
    }

    function onNameChange() {
        name = tempName;
        editing = false;
        dispatch("nameChanged", name);
    }
</script>
<div class="flex mt-2 text-white text-lg mx-auto">
    {#if editing}
        <input
            class="mr-1"
            on:keypress={onKeyPress}
            bind:value={tempName}
            type="text"
        />
        <button on:click={onNameChange}>✔️</button>
        <button on:click={() => (editing = false)}>❌</button>
    {:else}
        <div class="mr-1">{name}</div>
        <button on:click={() => (editing = true)}>✏️</button>
    {/if}
</div>
