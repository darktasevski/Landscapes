/* eslint-disable no-console */
import Vue from 'vue';
import Vuex from 'vuex';

import { defaultClient as apolloClient } from './main';
import router from './router';

import { GET_POSTS, SIGNIN_USER, SIGNUP_USER, GET_CURRENT_USER } from './queries';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		posts: [],
		isLoading: false,
		user: null,
	},
	mutations: {
		setPosts(state, payload) {
			state.posts = payload;
		},
		setLoading(state, payload) {
			state.loading = payload;
		},
		setUser(state, payload) {
			state.user = payload;
		},
	},
	actions: {
		async getCurrentUser({ commit }) {
			commit('setLoading', true);
			await apolloClient
				.query({ query: GET_CURRENT_USER })
				.then(({ data }) => {
					commit('setLoading', false);
					commit('setUser', data.getCurrentUser);
				})
				.catch(err => {
					commit('setLoading', false);
					throw new Error(err);
				});
		},
		async getPosts({ commit }) {
			commit('setLoading', true);
			// Use Apollo client to fire getPosts query
			await apolloClient
				.query({ query: GET_POSTS })
				.then(({ data }) => {
					// Commit will pass data from action to mutation func
					commit('setPosts', data.getPosts);
					commit('setLoading', false);
				})
				.catch(err => {
					commit('setLoading', false);
					throw new Error(err);
				});
		},
		async signinUser({ commit }, payload) {
			return await apolloClient
				.mutate({
					mutation: SIGNIN_USER,
					variables: payload,
				})
				.then(({ data }) => {
					localStorage.setItem('token', data.signinUser.token);
					// To make sure that the created method in main.js is run reload the page :/
					router.go();
				})
				.catch(err => {
					throw new Error(err);
				});
		},
	},
	getters: {
		posts: state => state.posts,
		isLoading: state => state.isLoading,
		user: state => state.user,
	},
});
