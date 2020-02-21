import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
import Assets from '@/pages/Assets'
import Arbitrage from '@/pages/Arbitrage'
import Blockchain from '@/pages/Blockchain'
import MarketDepth from '@/pages/MarketDepth'
import OHLCV from '@/pages/OHLCV'
import PriceComparison from '@/pages/PriceComparison'
import Settings from '@/pages/Settings'
import Summary from '@/pages/Summary'
import TransactionInspector from '@/pages/TransactionInspector'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/assets',
      name: 'Assets',
      component: Assets
    },
    {
      path: '/arbitrage',
      name: 'Arbitrage',
      component: Arbitrage
    },
    {
      path: '/blockchain',
      name: 'Blockchain',
      component: Blockchain
    },
    {
      path: '/market-depth',
      name: 'Market Depth',
      component: MarketDepth
    },
    {
      path: '/ohlcv',
      name: 'OHLCV',
      component: OHLCV
    },
    {
      path: '/comparison',
      name: 'PriceComparison',
      component: PriceComparison
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    },
    {
      path: '/summary',
      name: 'Summary',
      component: Summary
    },
    {
      path: '/txn-inspector',
      name: 'TransactionInspector',
      component: TransactionInspector
    },
  ]
})
