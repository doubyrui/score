import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";
import studentData from './studentData'
import crumbs from './crumbs'

export default createStore({
  plugins: [createPersistedState()],
  modules: {
    studentData,
    crumbs
  }
})
