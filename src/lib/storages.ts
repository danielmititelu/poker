export function GetSavedPlayerName() {
    var localPlayerName = localStorage.getItem('playerName');
    if (localPlayerName) {
        return localPlayerName;
    }

    return "Anonymous";
}

export function SavePlayerName(name: string) {
    localStorage.setItem('playerName', name);
}