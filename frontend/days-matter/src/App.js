import React, { Component } from 'react'
import './App.css'
import axios from 'axios'
import CustomModal from './components/modals'


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      events: [],
      modalIsOpen: false,
      currentEvent: null,
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

  toggleModal = () => {
    this.setState(prevState => ({
      modalIsOpen: !prevState.modalIsOpen,
      currentEvent: null
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

  addNewEvent = (newEvent) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    if (newEvent.event_id) {
      axios
        .put(`${apiUrl}newevent/${newEvent.event_id}/`, newEvent)
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
        console.error('Error saving data: ', error)
      });
  }

  handleDelete = (event) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    axios
      .delete(`${apiUrl}deleteevent/${event.id}/`)
      .then(response => {
        this.componentDidMount();
      })
      .catch(error => {
        alert("Failed to delete", error)
      })
  }

  handleEdit = (event) => {
    this.setState({
      currentEvent: event,
      modalIsOpen: true
    });
  }

  render() {
    const { events, modalIsOpen, currentEvent } = this.state;

    return (
      <div id="main" className='container-fluid p-3'>
        <div className='d-grid gap-2 col-6 mx-auto mb-3'>
          <button type="button" className='btn btn-primary' onClick={() => this.toggleModal()}>
            Add
          </button>
        </div>
        <div className='row'>
          {events && events.length > 0 ? (
            events.map((event, index) => (
              <div key={index} className="col-md-6 mb-3">
                <div className="border rounded-5 shadow p-4">
                  <h3 className='text-center'>{event.event} {event.ongoing ? "" : "// Ended //"}</h3>
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
                  <div className='pt-1'>
                    <button type='button' className='btn btn-warning m-2' onClick={() => this.handleEdit(event)}>
                      Edit
                    </button>
                    <button type='button' className='btn btn-danger' onClick={() => this.handleDelete(event)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Loading events</p>
          )}
          <CustomModal
            isOpen={modalIsOpen}
            toggle={this.toggleModal}
            onSave={this.addNewEvent}
            events={currentEvent}
          />
        </div>
      </div>
    )
  }
}

export default App
