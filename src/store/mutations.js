export default {
  // Generic update
  UPDATE(state, { key, value }) {
    state[key] = value
  },
  WS_ACTIVE(state, bool) {
    state.wsActive = bool
  },
  SOCKET_UPDATE(state, data) {
    console.log('[WS] internal event', data.type, data.result);

    switch (data.type) {
      case 'block':
        state.block = data.result
        break;
      case 'pending_transaction':
        state.pending_transaction = data.result
        break;
    }
  },
}
