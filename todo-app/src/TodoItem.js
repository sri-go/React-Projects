import React from "react";

function TodoItem(props) {  
    return (
        <div className='list-item'>
            {props.content}
            <button className='delete is-pulled-right' onClick={() => props.onDelete(props.id)}></button>
        </div>
    )
}

export default TodoItem