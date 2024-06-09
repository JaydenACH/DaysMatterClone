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
    }
  }

  componentDidMount() {
    axios.get('http://127.0.0.1:8000')
      .then(response => {
        this.setState({ events: response.data.data })
      })
      .catch(error => {
        console.error('There was an error making the request!', error)
      })
  }

  toggleModal = () => {
    this.setState(prevState => ({
      modalIsOpen: !prevState.modalIsOpen
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

  addNewEvent = () => {
    const { formData } = this.state;
    axios
      .post('http://127.0.0.1:8000/api/newevent', formData)
      .then(response => {
        console.log('Data posted successfully: ', response.data);
        this.toggleModal();
      })
      .catch(error => {
        console.error('Error saving data: ', error)
      });
  }


  render() {
    const { events, modalIsOpen } = this.state;

    return (
      <div id="main" className='container-fluid p-3'>
        <div className='d-grid gap-2 col-6 mx-auto mb-3'>
          <button type="button" className='btn btn-primary' onClick={() => this.toggleModal()}>
            Add
          </button>
        </div>
        {events && events.length > 0 ? (
          events.map((event, index) => (
            <div key={index} className="col mb-3">
              <div className="border rounded-5 shadow p-4">
                <h3 className='text-center'>{event.event}</h3>
                <div className='row text-center'>
                  <div className='col pt-3'>
                    <p>Start Date: {event.start_date}</p>
                  </div>
                  <div className='col pt-3'>
                    <p>End Date: {event.end_date ? event.end_date : 'Ongoing'}</p>
                  </div>
                </div>
                <div className='pt-3'>
                  <p className='text-center fw-bold'>Count Days: {this.calculateCountDays(event.start_date, event.end_date, event['on-going'])}</p>
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
        />
      </div>
    )
  }
}

export default App
