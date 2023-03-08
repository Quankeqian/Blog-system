export const Collapsedreducer = (preState = {
    isCollapsed: false
}, action) => {
    // console.log(action)
    let { type } = action
    switch (type) {
        case "change_collapse":
            let newstate = { ...preState }
            newstate.isCollapsed = !newstate.isCollapsed
            return newstate
        default:
            return preState
    }
}