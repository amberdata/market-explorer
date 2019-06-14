// -------------------------------------------------------------------------------------------------

<template>
  <div id="blockchain_data">
    <div class="tabs">
      <a v-on:click="activetab=1" v-bind:class="[ activetab === 1 ? 'active' : '' ]">Blocks</a>
      <a v-on:click="activetab=2" v-bind:class="[ activetab === 2 ? 'active' : '' ]">Token-Transfers</a>
    </div>

    <div class="content">
      <div v-if="activetab === 1" class="tabcontent">
        <BlockchainDataBlocks :exchange="exchange" :pair="pair"></BlockchainDataBlocks>
      </div>
      <div v-if="activetab === 2" class="tabcontent">
        <BlockchainDataTokenTransfers :exchange="exchange" :pair="pair"></BlockchainDataTokenTransfers>
      </div>
    </div>
  </div>
</template>

// -------------------------------------------------------------------------------------------------

<script>
  import BlockchainDataBlocks from './BlockchainDataBlocks.vue'
  import BlockchainDataTokenTransfers from './BlockchainDataTokenTransfers.vue'

  export default {
    // Properties
    name: 'blockchain_data',

    // Reactive data
    components: { BlockchainDataBlocks, BlockchainDataTokenTransfers },
    data () {
      return {
        activetab: 2,
      }
    },
    props: ['exchange', 'pair'],
  }
</script>

// -------------------------------------------------------------------------------------------------

<style scoped lang="scss">
  /* RESET */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .container {
    /*max-width: 620px;*/
    /*min-width: 420px;*/
    margin: 40px auto;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 0.9em;
    color: #888;
  }

  /* Style the tabs */
  .tabs {
    overflow: hidden;
    margin-left: 20px;
    margin-bottom: -2px; // hide bottom border
  }

  .tabs ul {
    list-style-type: none;
    margin-left: 20px;
  }

  .tabs a{
    float: left;
    cursor: pointer;
    padding: 12px 24px;
    transition: background-color 0.2s;
    border: 1px solid #ccc;
    border-right: none;
    background-color: #f1f1f1;
    border-radius: 10px 10px 0 0;
    font-weight: bold;
  }
  .tabs a:last-child {
    border-right: 1px solid #ccc;
  }

  /* Change background color of tabs on hover */
  .tabs a:hover {
    background-color: #aaa;
    color: #fff;
  }

  /* Styling for active tab */
  .tabs a.active {
    background-color: #fff;
    color: #484848;
    border-bottom: 2px solid #fff;
    cursor: default;
  }

  /* Style the tab content */
  .tabcontent {
    padding: 30px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 3px 3px 6px #e1e1e1
  }
</style>

// -------------------------------------------------------------------------------------------------
