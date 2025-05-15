import {createSlice} from "@reduxjs/toolkit";

interface AuthState {
    user: any | null,
    status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated',
}

const initialState : AuthState = {
    user: null,
    status: 'idle'
}

const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers: {
        setUsers(state, action){
            state.user = action.payload,
            state.status = 'authenticated'
        },
        clearUsers(state){
             state.user = null,
             state.status = 'unauthenticated'
        },
        setLoading(state){
            state.status = 'loading'
        }
    }
})

export const {setUsers, clearUsers, setLoading} = authSlice.actions;
export default authSlice.reducer;