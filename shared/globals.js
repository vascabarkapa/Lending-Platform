const WebSocketServer = {
    ASIA: {
        value: "wss://node928.info:82",
        label: "Asia [node928.info]"
    },
    EU_WEST: {
        value: "wss://bitcoin-betting.org:82",
        label: "Europe West [bitcoin-betting.org]"
    },
    EU_EAST: {
        value: "wss://node82.sytes.net:82",
        label: "Europe East [node82.sytes.net]"
    },
    SOUTH_AMERICA: {
        value: "wss://sa.bitcoin-betting.com:82",
        label: "South America [bitcoin-betting.com]"
    },
    CUSTOM: {
        value: "",
        label: "Choose Custom"
    }
};

const WebSocketServers = Object.values(WebSocketServer);

const ToastType = {
    SUCCESS: "success",
    INFO: "info",
    WARNING: "warning",
    ERROR: "error"
};

const CryptoCurrency = {
    RBTC: 5,
    USDC: 6
};