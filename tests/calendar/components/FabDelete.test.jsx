import { fireEvent, render, screen } from "@testing-library/react";
import { FabDelete } from "../../../src/calendar/components/FabDelete";
import { useCalendarStore } from "../../../src/hooks";

jest.mock('../../../src/hooks/useCalendarStore')


describe('Pruebas en FabDelete', () => {

    const mockStartDeletingEvent = jest.fn();

    beforeEach( () => jest.clearAllMocks() )

    test('debe de mostrar el componente correctamente', () => {

        useCalendarStore.mockReturnValue({
            hasEventSelected: false
        })

        render( <FabDelete />)
        
        const btn = screen.getByLabelText('btn-delete');

        expect( btn.classList.toString());
        expect( btn.classList ).toContain('btn');
        expect( btn.classList ).toContain('btn-danger');
        expect( btn.classList ).toContain('fab-danger');
        expect( btn.style.display ).toBe('none');

    });

    test('debe de mostrar el botón si hay un evento activo', () => {

        useCalendarStore.mockReturnValue({
            hasEventSelected: true
        })

        render( <FabDelete />)

        const btn = screen.getByLabelText('btn-delete');

        expect( btn.style.display ).toBe('');

    });

    test('debe de llamar startDeleteEvent si hay evento activo', () => {

        useCalendarStore.mockReturnValue({
            hasEventSelected: true,
            startDeleteEvent: mockStartDeletingEvent
        })

        render( <FabDelete />)
        // screen.debug();

        const btn = screen.getByLabelText('btn-delete');
        fireEvent.click(btn)

        expect( mockStartDeletingEvent ).toHaveBeenCalled();

    });

});