//Class to standardize the tasks
class Task {
    constructor(text, datetime, id) {
        this.text = text
        this.datetime = datetime
        this.id = id
    }
}

//Class var to hold all tasks
Task.list = []

//Check if there is a need to play the buzzer
const interval = setInterval(function() {
    for (let index in Task.list){
        let nowT = new Date()
        let thisTask = Task.list[index]
        if(thisTask.datetime < nowT){
            var audio = new Audio('beep.mp3')
            audio.play()
        }   
    }
}, 60000);


function create () {
    let text = document.getElementById('ttask')
    let hour = document.getElementById('ttime')

    //Check if the description and the due date are filled
    if(text.value == "" || hour.value == "") alert('Please, insert the task and the due time')
    else{
        //Creating the task in the user interface
        let item = document.createElement('div')
        item.setAttribute('class', 'element')
        item.setAttribute('key',Task.list.length)

        let dateandtime = new Date(hour.value)
        let tasktext = text.value
        item.innerHTML = `<input class='form-check-input' type='checkbox' onclick='deleteTask()' pos='${Task.list.length}'> ${tasktext} | ${dateandtime.getHours()}:${dateandtime.getMinutes()} | ${dateandtime.getDate()}/${dateandtime.getMonth() + 1}/${dateandtime.getFullYear()}`
        
        //Cleaning for the next task
        text.value = ""
        hour.value = ""
        text.focus()

        //Setting the task in the user interface
        let tasklist = document.querySelector('.tasklist')
        tasklist.appendChild(item)

        //Setting the task at the control list
        let newtask = new Task(tasktext, dateandtime, Task.list.length)
        Task.list.push(newtask)
    }
}


function deleteTask() {
    //Checkbox
    let pos = document.querySelector(`input[type='checkbox']:checked`).getAttribute('pos')
    //Div of the task in user interface
    let tInterface = document.querySelector(`div.element[key='${pos}']`)
    //Confirm if the user wants to delete the task
    let res = confirm(`Do you want to finish the task ${Task.list[pos].text}?`)

    if(res){
        tInterface.parentElement.removeChild(tInterface)
        for (let index in Task.list){
            if(Task.list[index].id = pos){
                Task.list.splice(pos,1)
                return
            }
        }
    } else document.querySelector(`input[type='checkbox']:checked`).checked = false
}
