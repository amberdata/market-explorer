export default {
  apiKey: state => state.apiKey,
  authenticated: state => state.authenticated,
  block: state => state.block,
  pending_transaction: state => state.pending_transaction,
  wsActive: state => state.wsActive,
  wsBlocks: state => state.wsBlocks,
  wsPendingTransactions: state => state.wsPendingTransactions,
}
