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
                event: props.events ? props.events.event : "",
                start_date: props.events ? props.events.start_date : "",
                end_date: props.events ? props.events.end_date : "",
                ongoing: props.events ? props.events.ongoing : true,
            }
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.events !== prevProps.events) {
            this.setState({
                formData: {
                    event_id: this.props.events ? this.props.events.id : "",
                    event: this.props.events ? this.props.events.event : "",
                    start_date: this.props.events ? this.props.events.start_date : "",
                    end_date: this.props.events ? this.props.events.end_date : "",
                    ongoing: this.props.events ? this.props.events.ongoing : true,
                }
            });
        }
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

    handleSave = () => {
        const { formData } = this.state;
        this.props.onSave(formData);
    }

    render() {
        const { isOpen, toggle } = this.props;
        const { formData } = this.state;

        return (
            <Modal isOpen={isOpen} toggle={toggle}>
                <ModalHeader toggle={toggle}>{this.props.events ? "Edit Event" : "Add New Event"}</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="event">Title</Label>
                            <Input
                                type="text"
                                id="event"
                                name="event"
                                value={formData.event}
                                onChange={this.handleChange}
                                placeholder="Enter Event Title"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="start_date">Start Date</Label>
                            <Input
                                type="date"
                                id="start_date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={this.handleChange}
                                placeholder="Enter Start Date"
                            />
                        </FormGroup>
                        {!formData.ongoing && (
                            <FormGroup>
                                <Label for="end_date">End Date</Label>
                                <Input
                                    type="date"
                                    id="end_date"
                                    name="end_date"
                                    value={formData.end_date}
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
                        onClick={this.handleSave}
                    >
                        Save
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}
