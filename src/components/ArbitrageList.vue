<template>
  <div id="arbitrage">
    <Table :loading="loading" size="small" height="600" border :columns="columns" :data="allItems"></Table>
  </div>
</template>

<script>
const columns = [
  {
      title: '#',
      key: 'rank',
      // fixed: 'left',
      width: 50
  },
  {
      title: 'Asset',
      key: 'name',
      // fixed: 'left',
      // width: 100
  },
  {
      title: 'Symbol',
      key: 'symbol',
      width: 100
  },
  {
      title: 'Price',
      key: 'currentPrice',
      // width: 130
  },
  {
      title: '% Change',
      key: 'changeInPrice',
      // width: 100
  },
  {
      title: 'Total Pairs',
      key: 'totalPairs',
      // width: 100
  },
  // {
  //     title: 'Pairs',
  //     key: 'pairs',
  //     // width: 100
  // },
]

export default {
  name: 'ArbitrageList',
  props: ['exchanges'],
  data () {
    return {
      loading: true,
      allItems: [],
      columns,
    }
  },
  methods: {
    associatePairData(arr) {
      const ex = this.exchanges
      if (!ex || ex.length <= 0) return arr
      return arr.map(a => {
        Object.keys(ex).forEach(e => {
          Object.keys(ex[e]).forEach(p => {
            // Associate ANY match
            // if (p.search(a.symbol) !== -1) {
            //   a.pairs = a.pairs || []
            //   a.pairs.push(p)
            // }
            // Associate base only
            if (p.split('_')[0] === a.symbol.toLowerCase()) {
              a.pairs = a.pairs || []
              a.pairs.push(p)
            }
          })
        })
        if (a.pairs) a.totalPairs = a.pairs.length
        else a.totalPairs = 0

        // Format values for easier reading
        a.changeInPrice = parseFloat(a.changeInPrice).toFixed(2)
        a.currentPrice = parseFloat(a.currentPrice).toFixed(4)

        return a
      })
    },
    async getRankings() {
      const res = await this.$w3d.market.getRankings()
      this.loading = false
      if (!res || !res.data) return
      const items = this.associatePairData(res.data)
      console.log('getRankings', items)
      this.allItems = items
    },
    async getPrices() {
      const res = await this.$w3d.market.getRankings()
      this.loading = false
      if (!res || !res.data) return
      const items = this.associatePairData(res.data)
      console.log('getRankings', items)
      this.allItems = items
    },
  },

  mounted() {
    this.getRankings()
  },
}
</script>

<style scoped lang="scss">
  .arbitrage {
    color: dodgerblue;
  }
  .highSpread {
    color: red;
  }
  .noClass {
  }
</style>
