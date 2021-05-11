tasks = JSON.parse(localStorage.getItem("app_tasks")) || {};

(function (objOfTasks) {
    const themes = {
        default: {
            "--body-bg": "#f9e8de",
            "--base-text-color": "#212529",
            "--header-bg": "#fff",
            "--header-text-color": "#212529",
            "--default-btn-bg": "#007bff",
            "--default-btn-text-color": "#fff",
            "--default-btn-hover-bg": "#0069d9",
            "--default-btn-border-color": "#0069d9",
            "--danger-btn-bg": "#dc3545",
            "--danger-btn-text-color": "#fff",
            "--danger-btn-hover-bg": "#bd2130",
            "--danger-btn-border-color": "#dc3545",
            "--input-border-color": "#ced4da",
            "--input-bg-color": "#fff",
            "--input-text-color": "#495057",
            "--input-focus-bg-color": "#fff",
            "--input-focus-text-color": "#495057",
            "--input-focus-border-color": "#80bdff",
            "--input-focus-box-shadow": "0 0 0 0.2rem rgba(0, 123, 255, 0.25)",
        },
        dark: {
            "--body-bg": "#fff",
            "--base-text-color": "#212529",
            "--header-bg": "#343a40",
            "--header-text-color": "#fff",
            "--default-btn-bg": "#58616b",
            "--default-btn-text-color": "#fff",
            "--default-btn-hover-bg": "#292d31",
            "--default-btn-border-color": "#343a40",
            "--default-btn-focus-box-shadow":
                "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
            "--danger-btn-bg": "#b52d3a",
            "--danger-btn-text-color": "#fff",
            "--danger-btn-hover-bg": "#88222c",
            "--danger-btn-border-color": "#88222c",
            "--input-border-color": "#ced4da",
            "--input-bg-color": "#fff",
            "--input-text-color": "#495057",
            "--input-focus-bg-color": "#fff",
            "--input-focus-text-color": "#495057",
            "--input-focus-border-color": "#78818a",
            "--input-focus-box-shadow":
                "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
        },
        light: {
            "--body-bg": "#fff",
            "--base-text-color": "#212529",
            "--header-bg": "#fff",
            "--header-text-color": "#212529",
            "--default-btn-bg": "#fff",
            "--default-btn-text-color": "#212529",
            "--default-btn-hover-bg": "#e8e7e7",
            "--default-btn-border-color": "#343a40",
            "--default-btn-focus-box-shadow":
                "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
            "--danger-btn-bg": "#f1b5bb",
            "--danger-btn-text-color": "#212529",
            "--danger-btn-hover-bg": "#ef808a",
            "--danger-btn-border-color": "#e2818a",
            "--input-border-color": "#ced4da",
            "--input-bg-color": "#fff",
            "--input-text-color": "#495057",
            "--input-focus-bg-color": "#fff",
            "--input-focus-text-color": "#495057",
            "--input-focus-border-color": "#78818a",
            "--input-focus-box-shadow":
                "0 0 0 0.2rem rgba(141, 143, 146, 0.25)",
        },
    };
    let lastSelectedTheme = localStorage.getItem("app_theme") || "default";

    const listContainer = document.querySelector(
        ".tasks-list-section .list-group"
    );
    const form = document.forms["addTask"];
    const inputContent = form.elements["content"];
    const themeSelect = document.getElementById("themeSelect");

    setTheme(lastSelectedTheme);
    renderAllTasks(objOfTasks);
    form.addEventListener("submit", onFormSubmitHandler);
    listContainer.addEventListener("click", onDeleteHandler);
    listContainer.addEventListener("click", onCompleteHandler);
    themeSelect.addEventListener("change", onThemeSelectHandler);

    function renderAllTasks(tasksList) {
        if (!tasksList) {
            console.error("Передайте список задач!");
            return;
        }

        const fragment = document.createDocumentFragment();

        Object.values(tasksList).forEach((task) => {
            const li = listItemTemplate(task);
            fragment.appendChild(li);
        });

        listContainer.appendChild(fragment);
    }

    function listItemTemplate({ _id, completed, content } = {}) {
        const li = document.createElement("li");
        li.classList.add(
            "list-group-item",
            "d-flex",
            "align-items-center",
            "flex-wrap",
            "mt-2"
        );
        li.setAttribute("data-task-id", _id);
        li.setAttribute("data-task-completed", completed);

        const div = document.createElement("div");
        div.classList.add(
            "d-flex",
            "w-100",
            "justify-content-between",
            "align-items-center"
        );

        const checkbox = document.createElement("div");
        checkbox.classList.add("custom-control", "custom-checkbox", "mr-sm-2");

        const input = document.createElement("input");
        input.classList.add("custom-control-input", "completed-checkbox");
        input.setAttribute("id", _id);
        input.setAttribute("type", "checkbox");
        input.checked = completed;

        label = document.createElement("label");
        label.classList.add("custom-control-label");
        label.setAttribute("for", _id);
        label.textContent = content;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Удалить";
        deleteBtn.classList.add("btn", "btn-danger", "delete-btn");

        checkbox.appendChild(input);
        checkbox.appendChild(label);

        div.appendChild(checkbox);
        div.appendChild(deleteBtn);

        li.appendChild(div);

        return li;
    }

    function onFormSubmitHandler(e) {
        e.preventDefault();
        const contentValue = inputContent.value;

        if (!contentValue) {
            alert("Введите заголовок и содержимое, чтобы создать задачу");
            return;
        }

        const task = createNewTask(contentValue);
        const listItem = listItemTemplate(task);

        listContainer.appendChild(listItem);
        form.reset();
    }

    function createNewTask(content) {
        const newTask = {
            content,
            completed: false,
            _id: `task-${Math.random()}`,
        };

        objOfTasks[newTask._id] = newTask;
        updateLocalStorage("app_tasks", objOfTasks);

        return { ...newTask };
    }

    function deleteTask(id) {
        const { content } = objOfTasks[id];
        const isConfirm = confirm(
            `Вы действительно хотите удалить элемент "${content}"?`
        );

        if (!isConfirm) return isConfirm;
        delete objOfTasks[id];

        updateLocalStorage("app_tasks", objOfTasks);

        return isConfirm;
    }

    function deleteTaskFromHtml(confirmed, el) {
        if (!confirmed) return;
        el.remove();
    }

    function onDeleteHandler({ target }) {
        if (target.classList.contains("delete-btn")) {
            const parent = target.closest("[data-task-id]");
            const id = parent.dataset.taskId;
            const confirmed = deleteTask(id);
            deleteTaskFromHtml(confirmed, parent);
        }
    }

    function onCompleteHandler({ target }) {
        if (target.classList.contains("completed-checkbox")) {
            const parent = target.closest("[data-task-id]");
            const id = parent.dataset.taskId;
            const taskCompleted = objOfTasks[id].completed;

            objOfTasks[id].completed = !taskCompleted;
            parent.dataset.taskCompleted = !taskCompleted;

            updateLocalStorage("app_tasks", objOfTasks);
        }
    }

    function onThemeSelectHandler(e) {
        const selectedTheme = themeSelect.value;
        const isConfirmed = confirm(
            `Вы действительно хотите изменить текущую тему на ${selectedTheme}?`
        );
        if (!isConfirmed) {
            themeSelect.value = lastSelectedTheme;
            return;
        }
        setTheme(selectedTheme);
        lastSelectedTheme = selectedTheme;
        localStorage.setItem("app_theme", selectedTheme);
    }

    function setTheme(name) {
        const selectedThemObj = themes[name];
        Object.entries(selectedThemObj).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });
    }

    function updateLocalStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
})(tasks);
