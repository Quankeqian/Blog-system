export const LoadingReducer = (preState = {
    isLoading: true
}, action) => {
    // console.log(action)
    let { type, payload } = action
    switch (type) {
        case "change_loading":
            let newstate = { ...preState }
            newstate.isLoading = payload
            return newstate
        default:
            return preState
    }
}