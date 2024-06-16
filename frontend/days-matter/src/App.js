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
    this.state = {
      events: [],
      modalIsOpen: false,
      currentEvent: null,
      viewType: 'list',
    }
  }

  componentDidMount() {
    const apiUrl = process.env.REACT_APP_API_URL;
    axios.get(apiUrl)
      .then(response => {
        this.setState({ events: response.data.data })
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

  calculateCountDays(start_date, end_date, on_going) {
    if (on_going) {
      end_date = new Date().toISOString().split('T')[0];
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const timeDifference = Math.abs(endDate.getTime() - startDate.getTime());
    const countDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return countDays + " days";
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
      .put(`${apiUrl}pinevent/${event.id}`)
      .then(response => {
        this.componentDidMount();
      })
      .catch(error => {
        alert("Failed to pin this event", error)
      })
  }

  handleViewChange = (e) => {
    this.setState({ viewType: e.target.value });
  }

  render() {
    const { events, modalIsOpen, currentEvent, viewType } = this.state;

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
                    <div className='pt-3'>
                      <p className='text-center fw-bold'>Count Days: {this.calculateCountDays(event.start_date, event.end_date, event['ongoing'])}</p>
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
                    <p className='fw-bold mb-0'>Count Days: {this.calculateCountDays(event.start_date, event.end_date, event['ongoing'])}</p>
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
