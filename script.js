const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTask() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getDateSuffix(date) {
    if (date > 3 && date < 21) return 'th';
    switch (date % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

const today = new Date();
const dayofWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
const dayofMonth = today.getDate();
const month = today.toLocaleDateString('en-US', { month: 'long' });
const dayofMonthWithSuffix = dayofMonth + getDateSuffix(dayofMonth);

document.getElementById("date-display").innerHTML = `${dayofWeek}, ${dayofMonthWithSuffix} ${month}`;

const taskInput = document.querySelector("#taskInput");
const taskDueDate = document.querySelector("#taskDueDate");
const taskType = document.querySelector("#taskType");
const priority = document.querySelector("#priorityInput");
const addTaskBtn = document.querySelector("#addTaskButton");
const taskList = document.querySelector("#taskList");
const searchBtn = document.querySelector("#search");
const toggleBtn = document.querySelector("#toggleBtn"); // Correctly select the toggle button

function addTaskToList(task) {
    const li = document.createElement("li");
    li.innerHTML = `
        <strong>Task:</strong> ${task.value}<br>
        <strong>Due Date:</strong> ${task.dueDate}<br>
        <strong>Type:</strong> ${task.type}<br>
        <strong>Priority:</strong> ${task.priority}<br>
        <button class="removeTaskBtn">Remove</button>
        <input type="checkbox" class="completeTaskBtn" ${task.completed ? 'checked' : ''}></input>
    `;
    taskList.appendChild(li);

    li.querySelector(".removeTaskBtn").addEventListener("click", function () {
        const taskIndex = tasks.indexOf(task);
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
            saveTask();
            loadTask();
        }
    });

    li.querySelector(".completeTaskBtn").addEventListener("change", function () {
        task.completed = this.checked;
        saveTask();
        loadTask();
    });

    if (task.completed) {
        li.classList.add("completed");
    }
}

addTaskBtn.addEventListener("click", function () {
    const taskValue = taskInput.value;
    const dueDate = taskDueDate.value;
    const taskTypeValue = taskType.value;
    const taskPriority = priority.value;

    if (taskValue && dueDate && taskTypeValue && taskPriority) {
        const task = {
            value: taskValue,
            dueDate: dueDate,
            priority: taskPriority,
            type: taskTypeValue,
            completed: false
        };
        tasks.push(task);
        saveTask();
        addTaskToList(task);
        taskInput.value = '';
        taskType.value = 'work';
        priority.value = 'low';
        taskDueDate.value = '';
    } else {
        alert("Please fill in the required fields!");
    }
});

searchBtn.addEventListener("input", function () {
    const searchTerm = searchBtn.value.toLowerCase();
    loadTask(searchTerm);
});

function loadTask(searchTerm = '') {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        if (task.value.toLowerCase().includes(searchTerm)) {
            addTaskToList(task);
        }
    });
}

toggleBtn.addEventListener("click", function () {
    const currentBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = (currentBg === "white" || currentBg === '') ? "black" : "white";
});

document.addEventListener("DOMContentLoaded", loadTask);
