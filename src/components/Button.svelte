<script>
    export let disabled;
    let className = '';
    export { className as class }
</script>
<button
    class:disabled={disabled}
    class:enabled={!disabled}
    class='font-bold
          py-2 px-4 rounded
          mt-2 {className ? className : ''}'
    on:click
>
    <slot />
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
</style>