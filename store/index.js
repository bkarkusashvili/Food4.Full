export const state = () => ({
    settings: {}
})

export const mutations = {
    setSettings(state, settings) {
        Object.assign(state.settings, settings);
    }
}

export const actions = {
    nuxtServerInit(store, context) {
        return context.$axios.get("/api/settings").then(response => {
            return store.commit("setSettings", response.data);
        });
    }
}
