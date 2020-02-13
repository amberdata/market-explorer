// -------------------------------------------------------------------------------------------------

const API_KEY = process.env.API_KEY || '';
const WEBSOCKET_SERVER_URL = process.env.WEBSOCKET_SERVER_URL || 'wss://ws.web3api.io';

const ID_BLOCK               = 1001;
const ID_FUNCTION            = 1002;
const ID_PENDING_TRANSACTION = 1003;
const ID_TOKEN_TRANSFER      = 1004;
const ID_TRANSACTION         = 1005;
const ID_UNCLE               = 1006;

// -------------------------------------------------------------------------------------------------

class Websockets {
  constructor() {
    this.store = null;
    this.websocket = null;

    this.objects = {
      [ID_BLOCK              ] : { name: 'block',               subscription: null, object: null },
      // [ID_FUNCTION           ] : { name: 'function',            subscription: null, object: null },
      // [ID_PENDING_TRANSACTION] : { name: 'pending_transaction', subscription: null, object: null },
      // [ID_TOKEN_TRANSFER     ] : { name: 'token_transfer',      subscription: null, object: null },
      // [ID_TRANSACTION        ] : { name: 'transaction',         subscription: null, object: null },
      // [ID_UNCLE              ] : { name: 'uncle',               subscription: null, object: null },
    };
    this.subscriptions = {};

    this.reset()
  }

  // -----------------------------------------------------------------------------------------------

  _addSubscription(data) {
    const subscription = data.result;
    if (subscription === true || subscription === false) return false;

    const id = data.id;
    this.objects[id].subscription = subscription;
    this.subscriptions[subscription] = id;
    console.log(`New subscription: ${this.objects[id].name} - ${subscription}`)
  }

  _subscribe(id, name) {
    console.log(`[WS >>>] subscribe::${name}...`);
    this.websocket.send(JSON.stringify({
      jsonrpc: '2.0',
      id,
      method: 'subscribe',
      params: [name],
    }));
  }

  _subscribeAll() {
    Object.keys(this.objects).forEach(id => {
      this._subscribe(id, this.objects[id].name);
    })
  }

  _unsubscribe(id) {
    console.log(`[WS >>>] unsubscribe::${this.objects[id].name}...`);
    this.websocket.send(
      JSON.stringify({
        jsonrpc: '2.0',
        method: 'unsubscribe',
        params: [this.objects[id].subscription],
        id,
      }),
    )
  }

  // -----------------------------------------------------------------------------------------------

  reset() {
    this.websocket = new WebSocket(`${WEBSOCKET_SERVER_URL}?x-api-key=${API_KEY}`);

    const vm = this;

    this.websocket.addEventListener('open', function (event) {
      console.log('[WS <<<] open', event);
      vm._subscribeAll()
    });

    this.websocket.addEventListener('message', function (message) {
      console.log('[WS <<<] message', message.data);

      // Parse message data
      if (!message.data) return;
      const data = JSON.parse(message.data);

      // Check for subscription initialization messages
      if (data.id && data.result && vm.objects[data.id]) {
        vm._addSubscription(data)
      }

      // Check for subscription messages = new data
      if (data.method && data.method === 'subscription' && data.params && data.params.result && data.params.subscription) {
        const result = data.params.result;
        const subscription = data.params.subscription;

        if (vm.subscriptions[subscription]) {
          const type = vm.objects[vm.subscriptions[subscription]].name;

          if (vm.store) {
            vm.store.dispatch('update', { type, result })
          }
        }
      }
    });

    this.websocket.addEventListener('close', function (event) {
      console.log('[WS <<<] close', event);
      vm.reset();
    });
  }

  setStore(store) {
    this.store = store;
  }
}

// -------------------------------------------------------------------------------------------------

export default new Websockets()

// -------------------------------------------------------------------------------------------------
