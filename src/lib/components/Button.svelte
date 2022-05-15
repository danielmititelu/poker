<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let disabled;
    export let loading = false;
    export { className as class };

    let className = "";

    function onClick(event) {
        if (disabled || loading) {
            return;
        }
        dispatch("click", event.detail);
    }
</script>

<button
    class:disabled
    class:enabled={!disabled}
    class:loading
    class="font-bold
          py-2 px-4 rounded
          {className ? className : ''}"
    on:click={onClick}
>
    <div class="flex items-center">
        {#if loading}
            <div
                class="w-3 h-3 mr-1 border-2 
                    border-solid rounded-full 
                    loading-circle animate-spin"
            />
        {/if}
        <slot />
    </div>
</button>

<style>
    .enabled {
        cursor: pointer;
        @apply bg-blue-500 hover:bg-blue-700;
    }

    .disabled {
        cursor: not-allowed;
        @apply bg-gray-500 hover:bg-gray-700;
    }

    .loading {
        cursor: wait;
        @apply bg-gray-500 hover:bg-gray-700;
    }

    .loading-circle {
        border: 3px solid #f3f3f3;
        border-radius: 50%;
        border-top: 3px solid #3498db;
    }
</style>
