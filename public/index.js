let inputBx = document.querySelector("#inputBx");
let list = document.querySelector("#list");

let editingTask = false;

window.addEventListener("load", function () {
    loadTasks();
    loadEditingTask();
  });

inputBx.addEventListener("keyup", function (event) {
  if(this.value=="" && event.key=="Enter")
  {
    alert("Plese enter the task...")
  }  
  if (this.value!="" && event.key == "Enter") {

    if (!editingTask) {
        addItem(this.value);
        saveTasks();
      } else {
        editItem(this.value);
        editingTask = false; 
      }
    this.value = "";
  }
});

let addItem = (inputBx) => {
  let listItem = document.createElement("li");

  listItem.innerHTML = `<span class="edit-icon" onclick="editTask(this)"></span> ${inputBx}<i></i>`;
  listItem.addEventListener("click", function () {
    this.classList.toggle("done");
    saveTasks();
  });

  listItem.querySelector("i").addEventListener("click", function () {
    listItem.remove();
    saveTasks();
  });

  list.appendChild(listItem);
};

let editTask = (editIcon) => {
    let listItem = editIcon.parentElement;
    let taskText = listItem.innerText.trim();
    inputBx.value=taskText;
    listItem.remove();
    editingTask = true;
    saveEditingTask(taskText);
};

let editItem = (editedText) => {
    addItem(editedText);
    saveTasks();
};

let saveTasks = () => {
    let tasks = [];
    list.querySelectorAll("li").forEach((item) => {
      tasks.push({
        text: item.textContent.trim(),
        done: item.classList.contains("done"),
      });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

  let saveEditingTask = (taskText) => {
    localStorage.setItem("editingTask", taskText);
};

  let loadTasks = () => {
    let storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      let tasks = JSON.parse(storedTasks);
      tasks.forEach((task) => {
        addItem(task.text);
        let lastItem = list.lastChild;
        if (task.done) {
          lastItem.classList.add("done");
        }
      });
    }
  };

  let loadEditingTask = () => {
    let editingTaskText = localStorage.getItem("editingTask");
    if (editingTaskText) {
      inputBx.value = editingTaskText;
      localStorage.removeItem("editingTask");
    }
  };