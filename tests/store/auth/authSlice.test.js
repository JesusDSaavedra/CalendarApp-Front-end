import { authSlice, clearErrorMessage, onChecking, onLogin, onLogout } from "../../../src/store/auth/authSlice"
import { authenticatedState, initialState } from "../../fixtures/authState";
import { testUserCredentials } from "../../fixtures/testUser";


describe('Pruebas en authSlice', () => {

    test('debe de regresar el estado por defecto', () => {
        
        expect(authSlice.getInitialState()).toEqual(initialState);

    });

    test('debe de realizar un login', () => {

        const state = authSlice.reducer( initialState, onLogin( testUserCredentials ) );
        // console.log(state);
        expect(state).toEqual({
            status: 'authenticated',
            user: testUserCredentials,
            errorMessage: undefined
          })

    })

    test('debe de realizar un logout', () => {

        const state = authSlice.reducer( authenticatedState, onLogout());
        expect(state).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: undefined
        });

    });

    test('debe de realizar un logout', () => {

        const errorMessage = 'Error en la autenticación'
        const state = authSlice.reducer( authenticatedState, onLogout(errorMessage));
        // console.log(state);
        expect(state).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage
        });

    });

    test('debe de limpiar el mensaje de error', () => {

        const errorMessage = 'Error en la autenticación'
        let state = authSlice.reducer( authenticatedState, onLogout(errorMessage));
        // console.log(state);
        state = authSlice.reducer( state, clearErrorMessage() )
        // console.log(state);
        expect( state.errorMessage ).toBe(undefined)

    })

    test('debe de mostrar el status en "checking" ', () => {

        const state = authSlice.reducer( authenticatedState, onLogout());
        const newState = authSlice.reducer( state, onChecking() );
        expect( newState.status ).toBe('checking');
        expect( newState ).toEqual( initialState );

    })

});