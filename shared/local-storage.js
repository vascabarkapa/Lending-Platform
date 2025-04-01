const LocalStorage = {
    getItem(key) {
        return JSON.parse(localStorage.getItem(key));
    },

    setItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    removeItem(key) {
        localStorage.removeItem(key);
    },

    getActiveWebSocketUrl() {
        const settings = this.getItem("wsSettings");
        return settings?.selected || settings?.custom || WebSocketServers[0].value;
    }
};
