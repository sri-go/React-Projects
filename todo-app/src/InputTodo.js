import React from 'react';

class InputTodo extends React.Component {
    constructor() {
        super();
        this.state = {
            todoText: ""
        } 
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        if(this.state.todoText === "") return
        this.props.onSubmitTodo(this.state.todoText);
        this.setState({
            todoText: ""
        });
    }

    handleChange(event) {
        const {name, value} = event.target;
        this.setState({
            [name]: value
        })
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input 
                    className='input is-medium'
                    type="text" 
                    name="todoText"
                    value={this.state.todoText}
                    placeholder="What's On Your Mind"
                    onChange={this.handleChange}
                />
                <button className='button'>Add To Do</button>
            </form>
        )
    }
}

export default InputTodo