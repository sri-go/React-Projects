import React from 'react';
import './App.css';
import Header from './Header'
import TodoList from './TodoList';
import InputTodo from './InputTodo';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            todos: []
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleSubmit(todo) {
        // console.log(task);
        this.setState((prevState) => {
            console.log(prevState)
            const updatedTodos = [...this.state.todos, todo];
            return {
                todos: updatedTodos
            };
        });
    }
    
    handleDelete(index){
        const updatedArray = [...this.state.todos];
        updatedArray.splice(index, 1);
        this.setState({
            todos: updatedArray
        });
    }

    render() {
        return ( 
            <div className='wrapper'>
                <div className='card frame'>
                    <Header />
                    <InputTodo onSubmitTodo={this.handleSubmit}/>
                    <TodoList data={this.state.todos} onDelete={this.handleDelete}/>
                </div>
            </div>   
        )
    }
}

export default App