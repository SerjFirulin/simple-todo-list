import React from 'react'
import ReactDOM from 'react-dom'

import axios from 'axios'

import ErrorMessage from "./ErrorMessage"

import TodoLists from "./TodoLists";
import TodoList from "./TodoList";
import TodoForm from "./TodoForm";
import Spinner from "./Spinner";

class TodoApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todoLists: [],
            hideCompletedTodoLists: false,
            isLoading: true,
            errorMessage: null
        };
        this.getTodoLists = this.getTodoLists.bind(this);
        this.createTodoList = this.createTodoList.bind(this);
        this.toggleCompletedTodoLists = this.toggleCompletedTodoLists.bind(this);
        this.handleErrors = this.handleErrors.bind(this);
        this.clearErrors = this.clearErrors.bind(this)
    }
    componentDidMount() {
        this.getTodoLists();
    }
    getTodoLists() {
        axios
            .get("/api/v1/todo_lists")
            .then(response => {
                this.clearErrors();
                this.setState({ isLoading: true });
                const todoLists = response.data;
                this.setState({ todoLists });
                this.setState({ isLoading: false });

            })
            .catch(error => {
                this.setState({ isLoading: true });
                this.setState({
                    errorMessage: {
                        message: "There was an error loading your todo items..."
                    }
                });
            });
    }
    toggleCompletedTodoLists() {
        this.setState({
            hideCompletedTodoLists: !this.state.hideCompletedTodoLists
        });
    }
    createTodoList(todoList) {
        const todoLists = [todoList, ...this.state.todoLists];
        this.setState({ todoLists });
    }
    handleErrors(errorMessage) {
        this.setState({ errorMessage });
    }
    clearErrors() {
        this.setState({
            errorMessage: null
        });
    }
    render() {
        return (
            <>
                {this.state.errorMessage && (
                    <ErrorMessage errorMessage={this.state.errorMessage} />
                )}
                {!this.state.isLoading && (
               <>
                <TodoForm
                  createTodoList={this.createTodoList}
                  handleErrors={this.handleErrors}
                  clearErrors={this.clearErrors}
                />
            <TodoLists
                toggleCompletedTodoLists={this.toggleCompletedTodoLists}
                hideCompletedTodoLists={this.state.hideCompletedTodoLists}
            >
                {this.state.todoLists.map( todoList => (
                    <TodoList
                        key={todoList.id}
                        todoList={todoList}
                        getTodoLists={this.getTodoLists}
                        hideCompletedTodoLists={this.state.hideCompletedTodoLists}
                        handleErrors={this.handleErrors}
                        clearErrors={this.clearErrors}
                    />
                ))}
            </TodoLists>
          </>
        )}
        {this.state.isLoading && <Spinner />}
      </>
      );
  }
}

document.addEventListener('turbolinks:load', () => {
    const app = document.getElementById('todo-app')
    app && ReactDOM.render(<TodoApp />, app)
})