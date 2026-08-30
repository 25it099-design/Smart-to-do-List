// ==========================================
// TASKFLOW - SMART TO-DO MANAGER
// ==========================================


// ==========================================
// ELEMENTS
// ==========================================

const taskInput =
    document.getElementById("taskInput");

const priorityInput =
    document.getElementById("priorityInput");

const dateInput =
    document.getElementById("dateInput");

const saveTaskBtn =
    document.getElementById("saveTaskBtn");

const addTaskBtn =
    document.getElementById("addTaskBtn");

const searchInput =
    document.getElementById("searchInput");

const taskList =
    document.getElementById("taskList");


// Statistics

const totalTasks =
    document.getElementById("totalTasks");

const pendingTasks =
    document.getElementById("pendingTasks");

const completedTasks =
    document.getElementById("completedTasks");

const productivity =
    document.getElementById("productivity");


// Progress

const progressPercent =
    document.getElementById("progressPercent");

const progressFill =
    document.getElementById("progressFill");

const progressBar =
    document.getElementById("progressBar");

const progressMessage =
    document.getElementById("progressMessage");


// Overview

const highPriorityCount =
    document.getElementById(
        "highPriorityCount"
    );

const todayCount =
    document.getElementById(
        "todayCount"
    );

const completionRate =
    document.getElementById(
        "completionRate"
    );


// Date

const currentDate =
    document.getElementById(
        "currentDate"
    );


// Theme

const themeBtn =
    document.getElementById("themeBtn");

const themeIcon =
    document.getElementById("themeIcon");

const themeText =
    document.getElementById("themeText");


// Navigation

const dashboardNav =
    document.getElementById(
        "dashboardNav"
    );

const tasksNav =
    document.getElementById(
        "tasksNav"
    );

const importantNav =
    document.getElementById(
        "importantNav"
    );

const calendarNav =
    document.getElementById(
        "calendarNav"
    );


// Views

const dashboardView =
    document.getElementById(
        "dashboardView"
    );

const calendarView =
    document.getElementById(
        "calendarView"
    );


// Calendar

const previousMonth =
    document.getElementById(
        "previousMonth"
    );

const nextMonth =
    document.getElementById(
        "nextMonth"
    );

const todayBtn =
    document.getElementById(
        "todayBtn"
    );

const calendarMonth =
    document.getElementById(
        "calendarMonth"
    );

const calendarDays =
    document.getElementById(
        "calendarDays"
    );

const selectedDateTitle =
    document.getElementById(
        "selectedDateTitle"
    );

const selectedTaskCount =
    document.getElementById(
        "selectedTaskCount"
    );

const calendarTaskList =
    document.getElementById(
        "calendarTaskList"
    );

const backDashboardBtn =
    document.getElementById(
        "backDashboardBtn"
    );


// ==========================================
// LOAD LOCAL STORAGE
// ==========================================

let tasks =
    JSON.parse(
        localStorage.getItem(
            "smartTasks"
        )
    ) || [];


// Current filter

let currentFilter = "all";


// Calendar month

let calendarDate =
    new Date();


// Selected calendar date

let selectedCalendarDate = null;


// ==========================================
// SAVE TASKS
// ==========================================

function saveTasks() {

    localStorage.setItem(
        "smartTasks",
        JSON.stringify(tasks)
    );
}


// ==========================================
// DATE HELPERS
// ==========================================

function getTodayString() {

    const today =
        new Date();

    return createDateString(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );
}


function createDateString(
    year,
    month,
    day
) {

    return (
        year +
        "-" +
        String(month + 1).padStart(2, "0") +
        "-" +
        String(day).padStart(2, "0")
    );
}


function formatDate(dateString) {

    if (!dateString) {

        return "";
    }

    const date =
        new Date(
            dateString +
            "T00:00:00"
        );

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


// ==========================================
// SHOW CURRENT DATE
// ==========================================

function showCurrentDate() {

    const today =
        new Date();

    currentDate.textContent =
        today.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );
}


showCurrentDate();


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent = text;

    return div.innerHTML;
}


// ==========================================
// ADD TASK
// ==========================================

function addTask() {

    const text =
        taskInput.value.trim();


    if (text === "") {

        alert(
            "Please enter a task."
        );

        taskInput.focus();

        return;
    }


    const task = {

        id: Date.now(),

        text: text,

        completed: false,

        priority:
            priorityInput.value,

        date:
            dateInput.value

    };


    tasks.push(task);


    saveTasks();


    taskInput.value = "";

    dateInput.value = "";

    priorityInput.value =
        "medium";


    displayTasks();

    updateStatistics();


    // Refresh calendar if open

    if (
        calendarView.style.display ===
        "block"
    ) {

        renderCalendar();

        if (
            selectedCalendarDate
        ) {

            showCalendarTasks(
                selectedCalendarDate
            );
        }
    }


    taskInput.focus();
}


// ==========================================
// DISPLAY TASKS
// ==========================================

function displayTasks() {

    taskList.innerHTML = "";


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const filteredTasks =
        tasks.filter(
            function(task) {

                const matchesSearch =
                    task.text
                        .toLowerCase()
                        .includes(searchText);


                let matchesFilter =
                    true;


                if (
                    currentFilter ===
                    "pending"
                ) {

                    matchesFilter =
                        !task.completed;
                }


                if (
                    currentFilter ===
                    "completed"
                ) {

                    matchesFilter =
                        task.completed;
                }


                return (
                    matchesSearch &&
                    matchesFilter
                );

            }
        );


    if (
        filteredTasks.length === 0
    ) {

        taskList.innerHTML = `

            <li class="empty-message">

                📝 No tasks found.

                <br>

                Add a task to get started!

            </li>

        `;

        return;
    }


    filteredTasks.forEach(
        function(task) {

            const li =
                document.createElement(
                    "li"
                );


            li.className =
                "task-item";


            let priorityText =
                task.priority
                    .charAt(0)
                    .toUpperCase() +
                task.priority.slice(1);


            let dateHTML = "";


            if (task.date) {

                const overdue =
                    !task.completed &&
                    task.date <
                    getTodayString();


                dateHTML = `

                    <span
                        class="task-date ${
                            overdue
                                ? "overdue"
                                : ""
                        }"
                    >

                        ${
                            overdue
                                ? "⚠️ Overdue:"
                                : "📅"
                        }

                        ${formatDate(task.date)}

                    </span>

                `;
            }


            li.innerHTML = `

                <div
                    class="task-check ${
                        task.completed
                            ? "completed"
                            : ""
                    }"
                    onclick="toggleTask(${task.id})"
                    role="button"
                    tabindex="0"
                    aria-label="${
                        task.completed
                            ? "Mark task as pending"
                            : "Mark task as completed"
                    }"
                >

                    ${
                        task.completed
                            ? "✓"
                            : ""
                    }

                </div>


                <div class="task-info">

                    <div
                        class="task-title ${
                            task.completed
                                ? "completed-text"
                                : ""
                        }"
                    >

                        ${escapeHTML(
                            task.text
                        )}

                    </div>


                    <div class="task-meta">

                        <span
                            class="priority priority-${task.priority}"
                        >
                            ${priorityText}
                        </span>

                        ${dateHTML}

                    </div>

                </div>


                <div class="task-actions">

                    <button
                        type="button"
                        onclick="editTask(${task.id})"
                        title="Edit task"
                        aria-label="Edit task"
                    >
                        ✏️
                    </button>


                    <button
                        type="button"
                        onclick="deleteTask(${task.id})"
                        title="Delete task"
                        aria-label="Delete task"
                    >
                        🗑️
                    </button>

                </div>

            `;


            taskList.appendChild(li);

        }
    );
}


// ==========================================
// TOGGLE TASK
// ==========================================

function toggleTask(id) {

    const task =
        tasks.find(
            function(task) {

                return task.id === id;

            }
        );


    if (!task) {

        return;
    }


    task.completed =
        !task.completed;


    saveTasks();


    displayTasks();

    updateStatistics();


    if (
        calendarView.style.display ===
        "block"
    ) {

        renderCalendar();

        if (
            selectedCalendarDate
        ) {

            showCalendarTasks(
                selectedCalendarDate
            );
        }
    }
}


// ==========================================
// DELETE TASK
// ==========================================

function deleteTask(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmDelete) {

        return;
    }


    tasks =
        tasks.filter(
            function(task) {

                return task.id !== id;

            }
        );


    saveTasks();


    displayTasks();

    updateStatistics();


    if (
        calendarView.style.display ===
        "block"
    ) {

        renderCalendar();

        if (
            selectedCalendarDate
        ) {

            showCalendarTasks(
                selectedCalendarDate
            );
        }
    }
}


// ==========================================
// EDIT TASK
// ==========================================

function editTask(id) {

    const task =
        tasks.find(
            function(task) {

                return task.id === id;

            }
        );


    if (!task) {

        return;
    }


    const newText =
        prompt(
            "Edit your task:",
            task.text
        );


    if (
        newText === null
    ) {

        return;
    }


    const trimmed =
        newText.trim();


    if (
        trimmed === ""
    ) {

        alert(
            "Task cannot be empty."
        );

        return;
    }


    task.text =
        trimmed;


    saveTasks();


    displayTasks();

    updateStatistics();


    if (
        calendarView.style.display ===
        "block"
    ) {

        renderCalendar();

        if (
            selectedCalendarDate
        ) {

            showCalendarTasks(
                selectedCalendarDate
            );
        }
    }
}


// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            function(task) {

                return task.completed;

            }
        ).length;


    const pending =
        total - completed;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );
    }


    totalTasks.textContent =
        total;


    pendingTasks.textContent =
        pending;


    completedTasks.textContent =
        completed;


    productivity.textContent =
        percentage + "%";


    progressPercent.textContent =
        percentage + "%";


    progressFill.style.width =
        percentage + "%";


    progressBar.setAttribute(
        "aria-valuenow",
        percentage
    );


    completionRate.textContent =
        percentage + "%";


    // High priority

    const highPriority =
        tasks.filter(
            function(task) {

                return (
                    task.priority ===
                    "high" &&
                    !task.completed
                );

            }
        ).length;


    highPriorityCount.textContent =
        highPriority;


    // Due today

    const today =
        getTodayString();


    const dueToday =
        tasks.filter(
            function(task) {

                return (
                    task.date === today &&
                    !task.completed
                );

            }
        ).length;


    todayCount.textContent =
        dueToday;


    // Message

    if (
        percentage === 100 &&
        total > 0
    ) {

        progressMessage.textContent =
            "🎉 Amazing! All tasks completed!";

    }
    else if (
        percentage >= 75
    ) {

        progressMessage.textContent =
            "🔥 Almost there! Keep going!";

    }
    else if (
        percentage >= 50
    ) {

        progressMessage.textContent =
            "💪 Great progress!";

    }
    else if (
        percentage > 0
    ) {

        progressMessage.textContent =
            "🚀 Keep building momentum!";

    }
    else {

        progressMessage.textContent =
            "Let's complete your first task!";
    }
}


// ==========================================
// FILTER BUTTONS
// ==========================================

const filterButtons =
    document.querySelectorAll(
        ".filter-btn"
    );


filterButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                filterButtons.forEach(
                    function(btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter;


                displayTasks();

            }
        );

    }
);


// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener(
    "input",
    function() {

        displayTasks();

    }
);


// ==========================================
// ADD TASK BUTTON
// ==========================================

addTaskBtn.addEventListener(
    "click",
    function() {

        taskInput.focus();

    }
);


// ==========================================
// SAVE TASK
// ==========================================

saveTaskBtn.addEventListener(
    "click",
    addTask
);


// ==========================================
// ENTER TO ADD
// ==========================================

taskInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key ===
            "Enter"
        ) {

            event.preventDefault();

            addTask();

        }

    }
);


// ==========================================
// SET ACTIVE NAV
// ==========================================

function setActiveNav(button) {

    document
        .querySelectorAll(".nav-item")
        .forEach(
            function(item) {

                item.classList.remove(
                    "active"
                );

            }
        );


    button.classList.add(
        "active"
    );
}


// ==========================================
// SHOW DASHBOARD
// ==========================================

function showDashboard() {

    dashboardView.style.display =
        "block";


    calendarView.style.display =
        "none";
}


// ==========================================
// DASHBOARD NAV
// ==========================================

dashboardNav.addEventListener(
    "click",
    function() {

        setActiveNav(
            dashboardNav
        );


        showDashboard();


        currentFilter =
            "all";


        setFilterButton(
            "all"
        );


        searchInput.value = "";


        displayTasks();

    }
);


// ==========================================
// MY TASKS
// ==========================================

tasksNav.addEventListener(
    "click",
    function() {

        setActiveNav(
            tasksNav
        );


        showDashboard();


        currentFilter =
            "pending";


        setFilterButton(
            "pending"
        );


        displayTasks();

    }
);


// ==========================================
// IMPORTANT TASKS
// ==========================================

importantNav.addEventListener(
    "click",
    function() {

        setActiveNav(
            importantNav
        );


        showDashboard();


        displayImportantTasks();

    }
);


// ==========================================
// IMPORTANT DISPLAY
// ==========================================

function displayImportantTasks() {

    taskList.innerHTML = "";


    const importantTasks =
        tasks.filter(
            function(task) {

                return (
                    task.priority ===
                    "high"
                );

            }
        );


    if (
        importantTasks.length === 0
    ) {

        taskList.innerHTML = `

            <li class="empty-message">

                ⭐ No important tasks.

                <br>

                High-priority tasks
                will appear here.

            </li>

        `;

        return;
    }


    importantTasks.forEach(
        function(task) {

            const li =
                document.createElement(
                    "li"
                );


            li.className =
                "task-item";


            li.innerHTML = `

                <div
                    class="task-check ${
                        task.completed
                            ? "completed"
                            : ""
                    }"
                    onclick="toggleTask(${task.id})"
                >

                    ${
                        task.completed
                            ? "✓"
                            : ""
                    }

                </div>


                <div class="task-info">

                    <div
                        class="task-title ${
                            task.completed
                                ? "completed-text"
                                : ""
                        }"
                    >

                        ${escapeHTML(
                            task.text
                        )}

                    </div>


                    <div class="task-meta">

                        <span
                            class="priority priority-high"
                        >
                            High
                        </span>

                    </div>

                </div>


                <div class="task-actions">

                    <button
                        type="button"
                        onclick="editTask(${task.id})"
                        aria-label="Edit task"
                    >
                        ✏️
                    </button>


                    <button
                        type="button"
                        onclick="deleteTask(${task.id})"
                        aria-label="Delete task"
                    >
                        🗑️
                    </button>

                </div>

            `;


            taskList.appendChild(li);

        }
    );
}


// ==========================================
// CALENDAR
// ==========================================

calendarNav.addEventListener(
    "click",
    function() {

        setActiveNav(
            calendarNav
        );


        dashboardView.style.display =
            "none";


        calendarView.style.display =
            "block";


        renderCalendar();

    }
);


// ==========================================
// BACK TO DASHBOARD
// ==========================================

backDashboardBtn.addEventListener(
    "click",
    function() {

        setActiveNav(
            dashboardNav
        );


        showDashboard();

    }
);


// ==========================================
// RENDER CALENDAR
// ==========================================

function renderCalendar() {

    const year =
        calendarDate.getFullYear();


    const month =
        calendarDate.getMonth();


    calendarMonth.textContent =
        calendarDate.toLocaleDateString(
            "en-IN",
            {
                month: "long",
                year: "numeric"
            }
        );


    calendarDays.innerHTML = "";


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const previousMonthDays =
        new Date(
            year,
            month,
            0
        ).getDate();


    // Previous month

    for (
        let i = firstDay - 1;
        i >= 0;
        i--
    ) {

        const day =
            document.createElement(
                "div"
            );


        day.className =
            "calendar-day other-month";


        day.innerHTML = `

            <div class="calendar-day-number">
                ${previousMonthDays - i}
            </div>

        `;


        calendarDays.appendChild(day);
    }


    // Current month

    for (
        let dayNumber = 1;
        dayNumber <= daysInMonth;
        dayNumber++
    ) {

        const day =
            document.createElement(
                "div"
            );


        day.className =
            "calendar-day";


        const dateString =
            createDateString(
                year,
                month,
                dayNumber
            );


        // Today

        if (
            isToday(
                year,
                month,
                dayNumber
            )
        ) {

            day.classList.add(
                "today"
            );
        }


        // Selected

        if (
            selectedCalendarDate ===
            dateString
        ) {

            day.classList.add(
                "selected"
            );
        }


        // Tasks

        const dateTasks =
            tasks.filter(
                function(task) {

                    return (
                        task.date ===
                        dateString
                    );

                }
            );


        let dotsHTML = "";


        if (
            dateTasks.length > 0
        ) {

            dotsHTML = `

                <div
                    class="calendar-task-dots"
                >

                    ${dateTasks
                        .slice(0, 5)
                        .map(
                            function(task) {

                                return `

                                    <span
                                        class="task-dot ${task.priority}"
                                        title="${escapeHTML(task.text)}"
                                    >
                                    </span>

                                `;

                            }
                        )
                        .join("")}

                </div>

            `;
        }


        let countHTML = "";


        if (
            dateTasks.length > 0
        ) {

            countHTML = `

                <span
                    class="calendar-task-count"
                >

                    ${dateTasks.length}

                    task${
                        dateTasks.length > 1
                            ? "s"
                            : ""
                    }

                </span>

            `;
        }


        day.innerHTML = `

            <div class="calendar-day-number">
                ${dayNumber}
            </div>

            ${dotsHTML}

            ${countHTML}

        `;


        day.addEventListener(
            "click",
            function() {

                selectedCalendarDate =
                    dateString;


                renderCalendar();


                showCalendarTasks(
                    dateString
                );

            }
        );


        calendarDays.appendChild(
            day
        );
    }


    // Next month empty cells

    const totalCells =
        firstDay +
        daysInMonth;


    const remainingCells =
        totalCells % 7 === 0
            ? 0
            : 7 -
              (totalCells % 7);


    for (
        let i = 1;
        i <= remainingCells;
        i++
    ) {

        const day =
            document.createElement(
                "div"
            );


        day.className =
            "calendar-day other-month";


        day.innerHTML = `

            <div class="calendar-day-number">
                ${i}
            </div>

        `;


        calendarDays.appendChild(day);
    }
}


// ==========================================
// TODAY CHECK
// ==========================================

function isToday(
    year,
    month,
    day
) {

    const today =
        new Date();


    return (
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === day
    );
}


// ==========================================
// SHOW CALENDAR TASKS
// ==========================================

function showCalendarTasks(
    dateString
) {

    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    selectedDateTitle.textContent =
        date.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    const dateTasks =
        tasks.filter(
            function(task) {

                return (
                    task.date ===
                    dateString
                );

            }
        );


    selectedTaskCount.textContent =
        dateTasks.length +
        " task" +
        (
            dateTasks.length !== 1
                ? "s"
                : ""
        );


    if (
        dateTasks.length === 0
    ) {

        calendarTaskList.innerHTML = `

            <div class="calendar-empty">

                🎉 No tasks scheduled
                for this date.

            </div>

        `;

        return;
    }


    calendarTaskList.innerHTML = "";


    dateTasks.forEach(
        function(task) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "calendar-task";


            const priorityText =
                task.priority
                    .charAt(0)
                    .toUpperCase() +
                task.priority.slice(1);


            item.innerHTML = `

                <button
                    type="button"
                    class="calendar-complete-btn ${
                        task.completed
                            ? "completed"
                            : ""
                    }"
                    onclick="toggleCalendarTask(${task.id})"
                    aria-label="${
                        task.completed
                            ? "Mark task pending"
                            : "Complete task"
                    }"
                >

                    ${
                        task.completed
                            ? "✓"
                            : ""
                    }

                </button>


                <div
                    class="calendar-task-info"
                >

                    <div
                        class="calendar-task-title ${
                            task.completed
                                ? "completed-text"
                                : ""
                        }"
                    >

                        ${escapeHTML(
                            task.text
                        )}

                    </div>


                    <div>

                        <span
                            class="priority priority-${task.priority}"
                        >

                            ${priorityText}

                        </span>

                    </div>

                </div>

            `;


            calendarTaskList.appendChild(
                item
            );

        }
    );
}


// ==========================================
// TOGGLE CALENDAR TASK
// ==========================================

function toggleCalendarTask(id) {

    const task =
        tasks.find(
            function(task) {

                return task.id === id;

            }
        );


    if (!task) {

        return;
    }


    task.completed =
        !task.completed;


    saveTasks();


    updateStatistics();

    displayTasks();


    showCalendarTasks(
        selectedCalendarDate
    );


    renderCalendar();
}


// ==========================================
// PREVIOUS MONTH
// ==========================================

previousMonth.addEventListener(
    "click",
    function() {

        calendarDate.setMonth(
            calendarDate.getMonth() - 1
        );


        renderCalendar();

    }
);


// ==========================================
// NEXT MONTH
// ==========================================

nextMonth.addEventListener(
    "click",
    function() {

        calendarDate.setMonth(
            calendarDate.getMonth() + 1
        );


        renderCalendar();

    }
);


// ==========================================
// TODAY BUTTON
// ==========================================

todayBtn.addEventListener(
    "click",
    function() {

        const today =
            new Date();


        calendarDate =
            new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            );


        selectedCalendarDate =
            createDateString(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
            );


        renderCalendar();


        showCalendarTasks(
            selectedCalendarDate
        );

    }
);


// ==========================================
// DARK MODE
// ==========================================

themeBtn.addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "dark"
        );


        const darkMode =
            document.body.classList.contains(
                "dark"
            );


        localStorage.setItem(
            "darkMode",
            darkMode
        );


        updateThemeButton();

    }
);


// ==========================================
// UPDATE THEME BUTTON
// ==========================================

function updateThemeButton() {

    const darkMode =
        document.body.classList.contains(
            "dark"
        );


    if (darkMode) {

        themeIcon.textContent =
            "☀️";

        themeText.textContent =
            "Light Mode";

    }
    else {

        themeIcon.textContent =
            "🌙";

        themeText.textContent =
            "Dark Mode";
    }
}


// ==========================================
// LOAD DARK MODE
// ==========================================

if (
    localStorage.getItem(
        "darkMode"
    ) === "true"
) {

    document.body.classList.add(
        "dark"
    );
}


updateThemeButton();


// ==========================================
// INITIALIZE
// ==========================================

displayTasks();

updateStatistics();

showDashboard();
