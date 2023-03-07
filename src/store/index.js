import { createStore } from 'redux';
import rootReducer from '../reducers';
/*
 * 创建一个 Redux store 来以存放应用中所有的 state。
 * 应用中应有且仅有一个 store。
 */

const store = createStore(rootReducer, window.devToolsExtension && window.devToolsExtension());

export default store;
