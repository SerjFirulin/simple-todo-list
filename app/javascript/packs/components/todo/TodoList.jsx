import React from 'react'
import PropTypes from 'prop-types'

import axios from "axios"
import setAxiosHeaders from "./AxiosHeaders"

import _ from "lodash"

class TodoList extends React.Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.updateTodoList = this.updateTodoList.bind(this);
        this.inputRef = React.createRef();
        this.completedRef = React.createRef();
        this.state = {
            complete: this.props.todoList.complete,
        }
        this.handleDestroy = this.handleDestroy.bind(this);
        this.path = `/api/v1/todo_lists/${this.props.todoList.id}`;
    }
    handleChange() {
        this.setState({
            complete: this.completedRef.current.checked
        });
        this.updateTodoList();
    }
    updateTodoList = _.debounce(() => {
        setAxiosHeaders();
        axios
            .put(this.path, {
                todo_list: {
                    title: this.inputRef.current.value,
                    complete: this.completedRef.current.checked
                }
            })
            .then(response => {
                this.props.clearErrors();
            })
            .catch(error => {
                this.props.handleErrors(error);
            });
    }, 1000);

    updateTodoList() {
        this.setState({ complete: this.completedRef.current.checked });
        setAxiosHeaders();
        axios
            .put(this.path, {
                todo_list: {
                    title: this.inputRef.current.value,
                    complete: this.completedRef.current.checked
                }
            })
            .then(response => {})
            .catch(error => {
                console.log(error);
            });
    }
    handleDestroy() {
        setAxiosHeaders();
        const confirmation = confirm("Are you sure?");
        if (confirmation) {
            axios
                .delete(this.path)
                .then(response => {
                    this.props.getTodoLists();
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }
    render() {
        const { todoList } = this.props
        return (
            <tr
                className={`${ this.state.complete && this.props.hideCompletedTodoLists ? `d-none` : "" } ${this.state.complete ? "table-light" : ""}`}
            >
                <td>
                    <svg
                        className={`bi bi-check-circle ${
                            this.state.complete ? `text-success` : `text-muted`
                        }`}
                        width="2em"
                        height="2em"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M17.354 4.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3-3a.5.5 0 11.708-.708L10 11.293l6.646-6.647a.5.5 0 01.708 0z"
                            clipRule="evenodd"
                        />
                        <path
                            fillRule="evenodd"
                            d="M10 4.5a5.5 5.5 0 105.5 5.5.5.5 0 011 0 6.5 6.5 0 11-3.25-5.63.5.5 0 11-.5.865A5.472 5.472 0 0010 4.5z"
                            clipRule="evenodd"
                        />
                    </svg>
                </td>
                <td>
                    <input
                        type="text"
                        defaultValue={todoList.title}
                        disabled={this.state.complete}
                        onChange={this.handleChange}
                        ref={this.inputRef}
                        className="form-control"
                        id={`todoList__title-${todoList.id}`}
                    />
                </td>
                <td className="text-right">
                    <div className="form-check form-check-inline">
                        <input
                            type="boolean"
                            defaultChecked={this.state.complete}
                            type="checkbox"
                            onChange={this.handleChange}
                            ref={this.completedRef}
                            className="form-check-input"
                            id={`complete-${todoList.id}`}
                        />
                        <label
                            className="form-check-label"
                            htmlFor={`complete-${todoList.id}`}
                        >
                            Complete?
                        </label>
                    </div>
                    <button
                        onClick={this.handleDestroy}
                        className="btn btn-outline-danger">
                        Delete
                    </button>
                </td>
            </tr>
        )
    }
}

export default TodoList

TodoList.propTypes = {
    todoList: PropTypes.object.isRequired,
    getTodoLists: PropTypes.func.isRequired,
    hideCompletedTodoLists: PropTypes.bool.isRequired,
    clearErrors: PropTypes.func.isRequired
}