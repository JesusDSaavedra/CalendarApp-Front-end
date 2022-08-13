import { configureStore } from "@reduxjs/toolkit";
import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import calendarApi from "../../src/api/calendarApi";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { authSlice } from "../../src/store";
import { onLogout } from "../../src/store/auth/authSlice";
import { onLogoutCalendar } from "../../src/store/calendar/calendarSlice";
import { authenticatedState, initialState, not_authenticatedState } from "../fixtures/authState";
import { testUserCredentials } from "../fixtures/testUser";


const getMockStore = ( initialState )=> {
    return configureStore ({
        reducer: {
            auth: authSlice.reducer,
        },
        preloadedState: {
            auth: { ...initialState }
        }
    });
};


describe('Pruebas en useAuthStore', () => {

    beforeEach(() => localStorage.clear())


    test('debe de regresar los valores por defecto', () => {

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        });
        expect(result.current).toEqual({
            status: 'checking',
            user: {},
            errorMessage: undefined,
            checkAuthToken: expect.any(Function),
            startLogin: expect.any(Function),
            startLogout: expect.any(Function),
            startRegister: expect.any(Function)
        })

    });

    test('startLogin debe de realizar el login correctamente', async() => {

        const mockStore = getMockStore({ ...not_authenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        });

        await act( async() => {
            await result.current.startLogin( testUserCredentials );
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User', uid: '62f45c0cc0d93e91c23a2910' }
        });

        expect( localStorage.getItem('token') ).toEqual( expect.any(String) )
        expect( localStorage.getItem('token-init-date') ).toEqual( expect.any(String) )

    });

    test('startLogin debe de realizar el login incorrectamente', async() => {

        const mockStore = getMockStore({ ...not_authenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        });

        await act( async() => {
            await result.current.startLogin({ email: 'error@gmail.com', password: 'error123' });
        });

        const { errorMessage, status, user } = result.current;

        expect(localStorage.getItem('token')).toBeNull();
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: expect.any(String),
            status: 'not-authenticated',
            user: {}
        })

        await waitFor(
            () => expect( result.current.errorMessage ).toBe(undefined)
        )

    });

    test('startRegister debe de crear un usuario', async() => { 

        const newUser = { email: 'algo@gmail.com', password: 'algo123', name: 'Test User2' }

        const mockStore = getMockStore({ ...not_authenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        });

        const spy = jest.spyOn( calendarApi, 'post' ).mockReturnValue({
            data: {
                ok: true,
                uid: "13254465",
                name: "Test User",
                token: "ALGUN-TOKEN"
            }
        })

        await act( async() => {
            await result.current.startRegister(newUser);
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User', uid: '13254465' }
        });

        spy.mockRestore();

    });

    test('startRegister debe de fallar la creación', async() => {

        const mockStore = getMockStore({ ...not_authenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        });

        await act( async() => {
            await result.current.startRegister(testUserCredentials);
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'El usuario ya existe',
            status: 'not-authenticated',
            user: {}
        });

        await waitFor(
            () => expect( result.current.errorMessage ).toBe(undefined)
        )

    });

    test('checkAuthToken debe de fallar si no hay token', async() => {

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        });

        await act( async() => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined, 
            status: 'not-authenticated', 
            user: {}
        });

    })

    test('checkAuthToken debe de autenticar el usuario si hay token', async() => {

        const { data } = await calendarApi.post('/auth', testUserCredentials );

        localStorage.setItem('token', data.token );

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        });

        await act( async() => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: "authenticated",
            user: {
                name: "Test User",
                uid: "62f45c0cc0d93e91c23a2910",
            }
        });

    });

    test('checkAuthToken debe de fallar si el token no es valido', async() => {

        localStorage.setItem('token', '123456789ABCXYZ' );

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        });

        await act( async() => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined, 
            status: 'not-authenticated', 
            user: {}
        });

        expect(localStorage.getItem('token')).toBeNull();

    });

});