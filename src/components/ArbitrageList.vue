<template>
  <div id="arbitrage">
    <Table row-key="id" :loading="loading" size="small" height="600" border :columns="columns" :data="allItems"></Table>
  </div>
</template>

<script>
const columns = [
  // {
  //     title: '#',
  //     key: 'rank',
  //     // fixed: 'left',
  //     width: 50
  // },
  {
      title: 'Asset',
      key: 'name',
      tree: true,
      // fixed: 'left',
      width: 140
  },
  // {
  //     title: 'Symbol',
  //     key: 'symbol',
  //     width: 100
  // },
  // {
  //     title: 'Price',
  //     key: 'currentPrice',
  //     // width: 130
  // },
  // {
  //     title: '% Change',
  //     key: 'changeInPrice',
  //     // width: 100
  // },
  // {
  //     title: 'Total Pairs',
  //     key: 'totalPairs',
  //     // width: 100
  // },
  {
      title: 'Pair',
      key: 'pair',
  },
  {
      title: 'Exchange',
      key: 'exchange',
  },
  {
      title: 'Spread',
      key: 'spread',
  },
  {
      title: 'Arb %',
      key: 'arbPercent',
  },
  {
      title: 'Last',
      key: 'last',
  },
  {
      title: 'Bid',
      key: 'bid',
  },
  {
      title: 'Ask',
      key: 'ask',
  },
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
    getSpread(ticker) {
      return Number(ticker.ask - ticker.bid).toFixed(4)
    },
    calcArbitragePercent(ticker, asset) {
      let minPrice = asset.currentPrice;
      let maxPrice = asset.currentPrice;

      if (ticker.last && asset.currentPrice) {
        if (ticker.last > maxPrice) maxPrice = ticker.last;
        if (ticker.last < minPrice) minPrice = ticker.last;
      }

      return ((maxPrice - minPrice) / maxPrice).toFixed(4)
    },
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
              // a.pairs.push({ pair: p, exchange: e })
              if (!a.pairs.includes(p)) a.pairs.push(p)
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
      // this.loading = false
      if (!res || !res.data) return
      const items = this.associatePairData(res.data)
      // console.log('getRankings', items)
      // this.allItems = items

      // Now loop everything and find the tickers for each
      this.getPrices(items.slice(0, 2))
      // this.getPrices(items)
    },
    async getPrices(list) {
      if (!list || list.length <= 0) return
      const all = await list.map(async (l, idx) => {
        l.children = []
        l.id = `${l.rank}${idx}`
        await l.pairs.forEach(async (p, pdx) => {
          try {
            const tickers = await this.$w3d.market.getTickers(p)
            // console.log('ticker', tickers)

            // l.children.push(ticker[p.exchange])
            Object.keys(tickers).forEach((t, tdx) => {
              const tmpTick = {
                ...tickers[t],
                id: `${l.rank}${idx}${pdx}${tdx}`,
                name: l.name,
                symbol: l.symbol,
                pair: p,
                exchange: t,
                spread: this.getSpread(tickers[t]),
                arbPercent: this.calcArbitragePercent(tickers[t], l)
              }

              if (tmpTick.arbPercent > 0.5) {
                tmpTick.cellClassName = { name: 'cell-bk-warn' }
              }
              if (tmpTick.arbPercent > 2) {
                tmpTick.cellClassName = { name: 'cell-bk-err' }
              }

              l.children.push(tmpTick)
            })
          } catch(e) {
            console.log('e', e)
          }
        })

        // tmpItems[idx] = l
        // this.allItems = tmpItems
        return l
      })

      const updatedItems = await Promise.all(all)
      console.log('updatedItems', updatedItems)
      this.allItems = updatedItems
      this.allItems[0]._showChildren = true
      console.log('this.allItems', this.allItems)

      // this.allItems = []
      // this.allItems = updatedItems
      this.loading = false

      // setTimeout(() => {
      //   this.allItems = []
      //   this.allItems = updatedItems
      //   this.loading = false
      // }, 3000)
    },
  },

  mounted() {
    this.getRankings()
  },
}
</script>

<style lang="scss">
.ivu-table td.cell-bk-warn {
  background: orange;
  color: white;
}
.ivu-table td.cell-bk-err {
  background: red;
  color: white;
}
</style>
