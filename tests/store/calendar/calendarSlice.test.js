import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice"
import { calendarWithActveEventState, calendarWithEventsState, events, initialState } from "../../fixtures/calendarStates"

describe('Pruebas en calendarSlice', () => {

    test('debe de regresar el estado por defecto', () => {

        expect(calendarSlice.getInitialState()).toEqual(initialState)

    });

    test('onSetActiveEvent debe de activar el evento', () => {

        const state = calendarSlice.reducer( calendarWithEventsState, onSetActiveEvent( events[0] ) );
        expect( state.activeEvent ).toEqual( events[0] );

    });

    test('onAddNewEvent debe de agregar un evento', () => {

        const newEvent = {
            id: '3',
            start: new Date('2022-08-09 18:00:00'),
            end: new Date('2022-08-09 20:00:00'),
            title: 'Cumpleaños de Valery',
            notes: 'Alguna nota de Valery',
        }     

        const state = calendarSlice.reducer( calendarWithEventsState, onAddNewEvent( newEvent ) );
        expect(state.events).toEqual([ ...events, newEvent ]);

    });

    test('onUpdateEvent debe de actualizar un evento', () => {

        const updatedEvent = {
            id: '2',
            start: new Date('2022-11-09 13:00:00'),
            end: new Date('2022-11-09 15:00:00'),
            title: 'Cumpleaños de David Saavedra',
            notes: 'Alguna nota de David Saavedra',
        }     

        const state = calendarSlice.reducer( calendarWithEventsState, onUpdateEvent( updatedEvent ) );
        expect(state.events).toContain( updatedEvent );

    });

    test('onDeleteEvent debe de borrar del evento activo', () => {

        const state = calendarSlice.reducer( calendarWithActveEventState, onDeleteEvent() );
        expect(state.events).toHaveLength(1);
        expect(state.events).not.toContain(events[0]);
        expect(state.activeEvent).toBeNull()
        
    });
    
    test('onLoadEvents debe de establecer los eventos', () => {
        
        const state = calendarSlice.reducer( initialState, onLoadEvents(events) );
        expect(state.isLoadingEvents).toBeFalsy();
        expect( state.events ).toEqual([...events])
        
        const newState = calendarSlice.reducer( state, onLoadEvents(events) );
        expect( newState.events.length ).toBe( events.length );
    });
    
    test('onLogoutCalendar debe de limpiar el estado', () => {
        
        const state = calendarSlice.reducer( calendarWithActveEventState, onLogoutCalendar() );
        expect(state).toEqual(initialState);

    })

})