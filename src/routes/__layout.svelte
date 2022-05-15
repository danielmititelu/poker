<script>
  import { onMount } from "svelte";

  import "../app.css";
  import { initializeFirebase } from "$lib/firebase";
  onMount(() => {
    initializeFirebase();
  });
</script>

<div class="bg-slate-900 pt-4 min-h-screen">
  <div class="max-w-screen-sm mx-auto ">
    <slot />
  </div>
</div>
