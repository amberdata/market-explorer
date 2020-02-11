export default {
  // Generic Update
  update({ commit }, { key, value }) {
    commit('UPDATE', { key, value })
  },
  socketUpdate({ commit }, data) {
    commit('SOCKET_UPDATE', data)
  },
}
