import { writable } from "svelte/store";

// const storedPlayerName = localStorage.getItem("playerName");
export const playerName = writable("Anonymous");
// todo: there appear to be a bug with ssr rendering and localStorage
// figure this out later.
// playerName.subscribe(name => {
//     localStorage.setItem("playerName", name);
// });

