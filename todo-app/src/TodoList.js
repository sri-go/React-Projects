import React from 'react'
import TodoItem from './TodoItem'

function TodoList(props) {
    console.log(props.data.length)
    const todos = props.data.map((todo, index) => {
        return <TodoItem content={todo} key={index} id={index} onDelete={props.onDelete}/>
      });
    return( 
        <div className='list-wrapper'>
          {todos}
        </div>
    );
}

export default TodoList