import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import calendarApi from "../api/calendarApi";
import { convertEventsToDateEvents } from "../helpers";
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store";

export const useCalendarStore = () => {

  const dispatch = useDispatch();
  const { events, activeEvent } = useSelector( state => state.calendar )
  const { user } = useSelector( state => state.auth )
  
  const setActiveEvent = ( calendarEvent ) => {
    dispatch( onSetActiveEvent( calendarEvent ) )
  }

  const startSavingEvent = async( calendarEvent ) => {
    // TODO: llegar al backend

    try {
        // Todo bien
      if ( calendarEvent.id ) {
        // Actualizado
        await calendarApi.put(`/events/${ calendarEvent.id }`, calendarEvent );
        dispatch( onUpdateEvent({ ...calendarEvent, user }) )
        return;
        
      }

      //Creado
      const { data } = await calendarApi.post('/events', calendarEvent );
      dispatch( onAddNewEvent( { ...calendarEvent, id: data.evento.id, user } ) )

    } catch (error) {
      console.log(error);
      Swal.fire('Error al actualizar', error.response.data.msg, 'error')
    }
    
  };

  const startDeleteEvent = async() => {
    // TODO: Llegar al backend
    try {
      await calendarApi.delete(`/events/${ activeEvent.id }`);
      dispatch( onDeleteEvent() );
    } catch (error) {
      console.log(error);
      Swal.fire('Error al eliminar', error.response.data.msg, 'error')
    }
  } 

  const startLoadingEvents = async() => {

    try {

      const { data } = await calendarApi.get('/events')
      const events = convertEventsToDateEvents( data.eventos )
      dispatch( onLoadEvents( events ) )
      // console.log(events);
      
    } catch (error) {
      console.log('Error cargando eventos');
      console.log(error);
    }
  }

  return {
    // Propiedades
    events,
    activeEvent,
    hasEventSelected: !!activeEvent,

    // Metodos
    startDeleteEvent,
    setActiveEvent,
    startLoadingEvents,
    startSavingEvent,

  }
}