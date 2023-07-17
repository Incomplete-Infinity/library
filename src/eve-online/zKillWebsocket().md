# `zKillWebSocket()`

## Summary

### Code

```js

function zKillWebSocket() {
  const socketUrl = `wss://zkillboard.com/websocket/`
  const webSocket = new WebSocket(socketUrl, protocol);
    webSocket.send({"action": "sub", "channel": "killstream"});
  console.log(webSocket);
}

```
