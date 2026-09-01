const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const serverStatus = document.getElementById("serverStatus");

// Load tasks when page opens
loadTasks();

async function loadTasks() {
    try {
        const response = await fetch("/api/tasks");
        const tasks = await response.json();

        renderTasks(tasks);
    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}

function renderTasks(tasks) {
    taskList.innerHTML = "";

    tasks.forEach((task) => {
        const li = document.createElement("li");

        li.className = `task ${task.completed ? "completed" : ""}`;

        li.innerHTML = `
            <span class="task-title">${escapeHtml(task.title)}</span>

            <div class="task-actions">
                <button
                    class="complete-btn"
                    onclick="toggleTask(${task.id})">
                    ${task.completed ? "Undo" : "Complete"}
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})">
                    Delete
                </button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

async function addTask() {
    const title = taskInput.value.trim();

    if (!title) {
        alert("Please enter a task.");
        return;
    }

    try {
        const response = await fetch("/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title })
        });

        if (!response.ok) {
            throw new Error("Failed to create task");
        }

        taskInput.value = "";

        loadTasks();
    } catch (error) {
        console.error(error);
    }
}

async function toggleTask(id) {
    try {
        await fetch(`/api/tasks/${id}`, {
            method: "PUT"
        });

        loadTasks();
    } catch (error) {
        console.error(error);
    }
}

async function deleteTask(id) {
    try {
        await fetch(`/api/tasks/${id}`, {
            method: "DELETE"
        });

        loadTasks();
    } catch (error) {
        console.error(error);
    }
}

async function checkHealth() {
    try {
        const response = await fetch("/api/health");
        const data = await response.json();

        serverStatus.textContent =
            `${data.message} | ${data.nodeVersion}`;
    } catch (error) {
        serverStatus.textContent = "Server is not responding.";
    }
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// Press Enter to add a task
taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});
