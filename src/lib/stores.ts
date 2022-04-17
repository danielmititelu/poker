import { writable } from "svelte/store";

const storedPlayerName = localStorage.getItem("playerName");
export const playerName = writable(storedPlayerName ?? "Anonymous");
playerName.subscribe(name => {
    localStorage.setItem("playerName", name);
});
