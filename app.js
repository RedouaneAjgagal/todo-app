import { newTodo } from './clones/todo-clone.js';
// LightMode & DarkMode
const toggleTheme = () => {
    const toggle = document.querySelector('#toggleTheme');
    toggle.addEventListener('click', () => {
        toggle.checked ? lightMode(toggle) : darkMode(toggle);
    });
}
const darkMode = (btn) => {
    document.documentElement.style.setProperty('--textColor', '#fff');
    document.documentElement.style.setProperty('--backgroundColor', '#23293b');
    document.documentElement.style.setProperty('--cardColor', '#28304e');
    document.documentElement.style.setProperty('--lightColor', '#637ca1');
    document.documentElement.style.setProperty('--lightBorder', '#b3b3b327');
    document.body.classList = 'darkMode';
    btn.classList = 'darkMode';
}
const lightMode = (btn) => {
    document.documentElement.style.setProperty('--textColor', '#202020');
    document.documentElement.style.setProperty('--backgroundColor', '#f8f8f8');
    document.documentElement.style.setProperty('--cardColor', '#ffffff');
    document.documentElement.style.setProperty('--lightColor', '#8b8b8b');
    document.documentElement.style.setProperty('--lightBorder', '#9292922a');
    document.body.classList = 'lightMode';
    btn.classList = 'lightMode';
}
toggleTheme();
let draggedItem;
let mode = 'all';
let todos;
localStorage.localTodos ? todos = JSON.parse(localStorage.localTodos) : todos = [];

const data = (content, active, completed) => {
    const data = {
        content: content,
        active: active,
        completed: completed,
    }
    return data;
}
const addAtodo = document.getElementById('addAtodo');
const publishTodo = () => {
    addAtodo.addEventListener('submit', (e) => {
        const input = e.target.elements.newTodo;
        e.preventDefault();
        if (input.value.trim() !== '') {
            todos.push(data(input.value, true, false));
            localStorage.setItem('localTodos', JSON.stringify(todos));
            input.value = '';
            displayTodos();
            leftItems();
        }
    });
}

const displayTodos = () => {
    const allTodos = document.querySelector('.allTodos');
    allTodos.innerHTML = '';
    todos.forEach(todo => {
        // create a todo section
        const todoSection = document.createElement('div');
        todoSection.classList = 'todo';
        if (mode === 'active') {
            activeTodos(todo, todoSection);
        } else if (mode === 'completed') {
            completedTodos(todo, todoSection);
        } else {
            showAllTodos(todo, todoSection);
        }
        // display all todos
        allTodos.appendChild(todoSection);
    });
    new Sortable(allTodos, {
        animation: 350,
        chosenClass: "sortable-chosen",
        dragClass: "sortable-drag"
    });
    publishTodo();
}

// Delete function
const deleteFunc = (btn, todo) => {
    btn.addEventListener('click', () => {
        todos = todos.filter(e => e != todo);
        localStorage.localTodos = JSON.stringify(todos);
        displayTodos();
        leftItems();
    });
}
// completed function
const completed = (btn, content, todo) => {
    btn.addEventListener('click', () => {
        if (btn.checked) {
            todo.completed = true;
            todo.active = false
            content.style.textDecoration = 'line-through'
        } else {
            todo.completed = false;
            todo.active = true
            content.style.textDecoration = 'none'
        }
        localStorage.localTodos = JSON.stringify(todos);
        displayTodos();
        leftItems();
    });
}
// Show all todos
const showAllTodos = (todo, section) => {
    if (todo.completed) {
        section.innerHTML = newTodo(todo.content, 'checked');
    } else {
        section.innerHTML = newTodo(todo.content, '');
    }
    // call delete func
    const deleteBtn = section.querySelector('.deleteBtn');
    deleteFunc(deleteBtn, todo);
    // call completed func
    const completedCheckbox = section.querySelector('.progress');
    const contentVal = section.querySelector('.content');
    completed(completedCheckbox, contentVal, todo);
}
// Show completed todos only
const completedTodos = (todo, section) => {
    if (todo.completed) {
        section.innerHTML = newTodo(todo.content, 'checked');
        // call delete func
        const deleteBtn = section.querySelector('.deleteBtn');
        deleteFunc(deleteBtn, todo);
        // call completed func
        const completedCheckbox = section.querySelector('.progress');
        const contentVal = section.querySelector('.content');
        completed(completedCheckbox, contentVal, todo);
    } else {
        section.classList.add('invisible');
    }
}
// Show active todos only
const activeTodos = (todo, section) => {
    if (todo.active) {
        section.innerHTML = newTodo(todo.content, '');
        // call delete func
        const deleteBtn = section.querySelector('.deleteBtn');
        deleteFunc(deleteBtn, todo);
        // call completed func
        const completedCheckbox = section.querySelector('.progress');
        const contentVal = section.querySelector('.content');
        completed(completedCheckbox, contentVal, todo);
    } else {
        section.classList.add('invisible');
    }
}
// Modes fucntion
const allBtn = document.querySelector('.all');
const activeBtn = document.querySelector('.onProgress');
const completedBtn = document.querySelector('.completed');
const displayMode = (btn, btn2, btn3, modes) => {
    btn.addEventListener('click', () => {
        btn.classList.add('active');
        btn2.classList.remove('active');
        btn3.classList.remove('active');
        mode = modes;
        displayTodos();
    });
}
displayMode(allBtn, activeBtn, completedBtn, 'all');
displayMode(activeBtn, allBtn, completedBtn, 'active');
displayMode(completedBtn, activeBtn, allBtn, 'completed');

// clear completed
const clearBtn = document.querySelector('.clearCompleted');
const clearCompleted = () => {
    clearBtn.addEventListener('click', () => {
        todos = todos.filter(todo => todo.active);
        localStorage.localTodos = JSON.stringify(todos);
        displayTodos();
    });
}
clearCompleted();
// calc left items
const leftItems = () => {
    const itemsLeft = document.querySelector('.leftItems');
    itemsLeft.innerHTML = `${todos.filter(e => e.active).length} items left`;
}
leftItems();
displayTodos();