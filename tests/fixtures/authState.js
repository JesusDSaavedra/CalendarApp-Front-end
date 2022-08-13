
export const initialState = {
    status: 'checking', // 'authenticated','not-authenticated'
    user: {},
    errorMessage: undefined,
}

export const authenticatedState = {
    status: 'authenticated', // 'authenticated','not-authenticated'
    user: {
        uid: 'abc',
        name: 'Jesus'
    },
    errorMessage: undefined,
}

export const not_authenticatedState = {
    status: 'not-authenticated', // 'authenticated','not-authenticated'
    user: {},
    errorMessage: '',
}





