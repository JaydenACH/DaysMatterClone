import React, { Component } from 'react'
import './App.css'
import axios from 'axios'
import CustomModal from './components/modals'
import { LuPin } from "react-icons/lu";
import { MdPushPin } from "react-icons/md";
import { FaRegSquarePlus } from "react-icons/fa6";


class App extends Component {
  constructor(props) {
    super(props)
    const savedViewType = localStorage.getItem('viewType') || 'div';
    this.state = {
      events: [],
      modalIsOpen: false,
      currentEvent: null,
      viewType: savedViewType,
      eventViewTypes: {},
    }
  }

  componentDidMount() {
    const apiUrl = process.env.REACT_APP_API_URL;
    axios.get(apiUrl)
      .then(response => {
        const events = response.data.data;
        const eventViewTypes = events.reduce((acc, evt) => {
          acc[evt.event_id] = 0;
          return acc;
        }, {});
        this.setState({ events, eventViewTypes });
      })
      .catch(error => {
        console.error('There was an error making the request!', error)
      })
  }

  toggleModal = (currentEvent = null) => {
    this.setState(prevState => ({
      modalIsOpen: !prevState.modalIsOpen,
      currentEvent
    }))
  }

  addNewEvent = (newEvent = {}) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    if (newEvent.ongoing) {
      newEvent.end_date = "";
    }
    if (newEvent.event_id) {
      axios
        .put(`${apiUrl}newevent/${newEvent.event_id}`, newEvent)
        .then(response => {
          this.toggleModal();
          this.componentDidMount();
        })
        .catch(error => {
          alert("Error editing the data", error)
        })
      return;
    }
    axios
      .post(`${apiUrl}newevent`, newEvent)
      .then(response => {
        this.toggleModal();
        this.componentDidMount();
      })
      .catch(error => {
        alert('Error saving data: ', error)
      });
  }

  handleDelete = (event = {}) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    axios
      .delete(`${apiUrl}deleteevent/${event.id}`)
      .then(response => {
        this.toggleModal();
        this.componentDidMount();
      })
      .catch(error => {
        alert("Failed to delete", error)
      })
  }

  handleEdit = (event = null) => {
    this.setState({
      currentEvent: event,
      modalIsOpen: true
    });
  }

  handlePin = (event = {}) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    axios
      .put(`${apiUrl}pinevent/${event.event_id}`)
      .then(response => {
        this.componentDidMount();
      })
      .catch(error => {
        alert("Failed to pin this event", error)
      })
  }

  handleViewChange = (e) => {
    const viewType = e.target.value;
    this.setState({ viewType: viewType });
    localStorage.setItem('viewType', viewType);
  }

  toggleEventView = (event_id) => {
    this.setState(prevState => {
      const find_event = prevState.events.find(event => event.event_id === event_id);
      if (find_event && find_event.days_diff) {
        const list_length = find_event.days_diff.length;
        const newViewType = (prevState.eventViewTypes[event_id] + 1) % list_length;
        return {
          eventViewTypes: {
            ...prevState.eventViewTypes,
            [event_id]: newViewType
          }
        };
      } else {
        console.error(`Event with ID ${event_id} not found or days_diff is undefined`);
        return null;
      }
    });
  }

  render() {
    const { events, modalIsOpen, currentEvent, viewType, eventViewTypes } = this.state;

    return (
      <div id="main" className='container-fluid p-3'>
        <div className='row'>
          <div className='d-grid col-2 me-auto mb-2'>
            <button type="button" className='btn btn-primary' onClick={() => this.toggleModal()}>
              <FaRegSquarePlus /> Add
            </button>
          </div>
          <div className='d-grid gap-3 col-2 ms-auto mb-2'>
            <select name="event_view" id="event_view" className='form-select' value={viewType} onChange={this.handleViewChange}>
              <option value="div">ThumbNail</option>
              <option value="list">List</option>
            </select>
          </div>
        </div>
        <div className='row'>
          {events && events.length > 0 ? (
            viewType === 'div' ? (
              events.map((event, index) => (
                <div key={index} className="col-md-6 mb-3" onClick={() => this.handleEdit(event)}>
                  <div className="border rounded-5 shadow p-4" style={{ cursor: 'pointer' }}>
                    <h3 className='text-center'>{event.ongoing ? "" : <button className='btn btn-secondary btn-sm' disabled>Ended</button>} {event.event}
                      <button className='btn' onClick={(e) => { e.stopPropagation(); this.handlePin(event) }}>
                        {event.pin_on_top ? <MdPushPin /> : <LuPin />}
                      </button>
                    </h3>
                    <div className='row text-center'>
                      <div className='col pt-3'>
                        <p>Start Date: {event.start_date}</p>
                      </div>
                      <div className='col pt-3'>
                        <p>End Date: {event.end_date ? event.end_date : 'Ongoing'}</p>
                      </div>
                    </div>
                    <div className='pt-3 text-center'>
                      <button className='btn btn-info btn-lg' onClick={(e) => { e.stopPropagation(); this.toggleEventView(event.event_id) }}>
                        <p className='fw-bold m-1'>
                          {event.days_diff[eventViewTypes[event.event_id]]}
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <ul className='list-group pr-0'>
                {events.map((event, index) => (
                  <li key={index} className='list-group-item d-flex justify-content-between align-items-center' onClick={() => this.handleEdit(event)} style={{ cursor: 'pointer' }}>
                    <div className='d-flex flex-column'>
                      <h3 className='mb-0'>{event.ongoing ? "" : <button className='btn btn-secondary btn-sm' disabled>Ended</button>} {event.event}
                        <button className='btn' onClick={(e) => { e.stopPropagation(); this.handlePin(event) }}>
                          {event.pin_on_top ? <MdPushPin /> : <LuPin />}
                        </button>
                      </h3>
                    </div>
                    <div className='text-center'>
                      <button className='btn btn-info btn-sm mb-2' onClick={(e) => { e.stopPropagation(); this.toggleEventView(event.event_id) }}>
                        <p className='fw-bold m-1'>
                          {event.days_diff[eventViewTypes[event.event_id]]}
                        </p>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )
          ) : (
            <p>Loading events</p>
          )}
          <CustomModal
            isOpen={modalIsOpen}
            toggle={this.toggleModal}
            onSave={this.addNewEvent}
            onDelete={this.handleDelete}
            events={currentEvent}
          />
        </div>
      </div>
    )
  }
}

export default App
