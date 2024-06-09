import React, { Component } from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Input,
    Label,
} from "reactstrap";


export default class CustomModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {
                title: props.events ? props.events.event : "",
                startDate: props.events ? props.events.start_date : "",
                endDate: props.events ? props.events.end_date : "",
                ongoing: props.events ? props.events.ongoing : true,
            }
        };
    }

    handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                [name]: type === 'checkbox' ? checked : value
            }
        }));
    }

    render() {
        const { isOpen, toggle, onSave } = this.props;
        const { formData } = this.state;

        return (
            <Modal isOpen={isOpen} toggle={toggle}>
                <ModalHeader toggle={toggle}>Add New Event</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="event-title">Title</Label>
                            <Input
                                type="text"
                                id="event-title"
                                name="title"
                                value={formData.title}
                                onChange={this.handleChange}
                                placeholder="Enter Event Title"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="event-start-date">Start Date</Label>
                            <Input
                                type="date"
                                id="event-start-date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={this.handleChange}
                                placeholder="Enter Start Date"
                            />
                        </FormGroup>
                        {!formData.ongoing && (
                            <FormGroup>
                                <Label for="event-end-date">End Date</Label>
                                <Input
                                    type="date"
                                    id="event-end-date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={this.handleChange}
                                    placeholder="Enter End Date"
                                />
                            </FormGroup>
                        )}
                        <FormGroup check>
                            <Label check>
                                <Input
                                    type="checkbox"
                                    name="ongoing"
                                    checked={formData.ongoing}
                                    onChange={this.handleChange}
                                />
                                On-going?
                            </Label>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button
                        className="btn btn-success"
                        onClick={() => onSave(this.state.formData)}
                    >
                        Save
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}
