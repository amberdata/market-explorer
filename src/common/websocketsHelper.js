// -------------------------------------------------------------------------------------------------

function _addWatcher(store, trigger, callback) {
  return store
    ? store.watch(trigger, (object) => callback(object))
    : null;
}

// -------------------------------------------------------------------------------------------------

export function addWatcherBlocks(store, callback) {
  return _addWatcher(store, state => state.block, callback)
}

export function addWatcherPendingTransactions(store, callback) {
  return _addWatcher(store, state => state.pending_transaction, callback)
}

export function deleteWatcher(unwatch) {
  if (unwatch) unwatch();
}

// -------------------------------------------------------------------------------------------------
