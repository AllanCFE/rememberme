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

var frequency_r = Number(document.querySelector('select#frequency_m').value) * Number(document.querySelector('input#frequency_a').value)
var volume = document.querySelector(`input#volume`).value

//Check if there is a need to play the buzzer
function periodicCall(){
    let howMany = 0
    for (let index in Task.list){
        let nowT = new Date()
        let thisTask = Task.list[index]
        if(thisTask.datetime < nowT){
            howMany++
            let divitem = document.querySelector(`div[key='${index}']`)
            divitem.style.backgroundColor = '#ffb8b5'
        }   
    }
    if (howMany > 0){
        let audio = new Audio('beep.mp3')
        audio.volume = volume/100
        audio.play()
    }
    setTimeout(periodicCall, frequency_r)
}
periodicCall()

function setSettings() {
    frequency_r = Number(document.querySelector('select#frequency_m').value) * Number(document.querySelector('input#frequency_a').value)
    volume = document.querySelector(`input#volume`).value
    periodicCall()
}

function resetSettings() {
    frequency_r = 60000
    volume = 1
    document.querySelector('select#frequency_m').value = 1000
    document.querySelector('input#frequency_a').value = 60
    document.querySelector(`input#volume`).value = 100
    periodicCall()
}

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
        item.innerHTML = `<div class='row'>
                            <div style="width: max-content; margin: 0;"><input class='form-check-input' type='checkbox' onclick='deleteTask()' pos='${Task.list.length}' style="margin-right: 0;"></div>
                            <div class="col-8 edit tasktext" style="text-align: left;" onclick="setChanger(${Task.list.length})" data-bs-toggle="modal" data-bs-target="#changer">${tasktext}</div>
                            <div class="col-1 edit taskhour" onclick="setChanger(${Task.list.length})" data-bs-toggle="modal" data-bs-target="#changer">${("0" + dateandtime.getHours()).slice(-2)}:${("0" + dateandtime.getMinutes()).slice(-2)}</div>
                            <div class="col-1 edit taskdate" onclick="setChanger(${Task.list.length})" data-bs-toggle="modal" data-bs-target="#changer"> ${("0" + dateandtime.getDate()).slice(-2)}/${("0" + (dateandtime.getMonth() + 1)).slice(-2)}/${("000" + dateandtime.getFullYear()).slice(-4)}</div>
                        </div>`
        
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
    let id = document.querySelector(`input[type='checkbox']:checked`).getAttribute('pos')
    let pos = -1
    for (let index in Task.list){
        if(Task.list[index].id == id){
            pos = index
            index = Task.list.length
        }
    }
    //Div of the task in user interface
    let tInterface = document.querySelector(`div.element[key='${id}']`)
    //Confirm if the user wants to delete the task
    let res = confirm(`Do you want to finish the task ${Task.list[pos].text}?`)

    if(res){
        tInterface.parentElement.removeChild(tInterface)
        Task.list.splice(pos,1)
        return
    } else document.querySelector(`input[type='checkbox']:checked`).checked = false
}

function setChanger(id) {
    document.getElementById('changer').setAttribute('pos',id)
    document.getElementById('ctask').value = Task.list[id].text
    Task.list[id].datetime.setMinutes(Task.list[id].datetime.getMinutes() - Task.list[id].datetime.getTimezoneOffset())
    document.getElementById('ctime').value = Task.list[id].datetime.toISOString().slice(0,16)
    Task.list[id].datetime.setMinutes(Task.list[id].datetime.getMinutes() + Task.list[id].datetime.getTimezoneOffset())
    if (document.querySelector(`[role='alert']`)){
        document.querySelector(`[role='alert']`).parentElement.removeChild(document.querySelector(`[role='alert']`))
    }
}

function changeTask() {
    let id = document.getElementById('changer').getAttribute('pos')
    let text = document.getElementById('ctask').value
    let hour = new Date(document.getElementById('ctime').value)
    
    Task.list[id] = new Task(text, hour, id)

    document.querySelector(`div[key='${id}'] div.row .tasktext`).innerHTML = text
    document.querySelector(`div[key='${id}'] div.row .taskhour`).innerHTML = `${("0" + hour.getHours()).slice(-2)}:${("0" + hour.getMinutes()).slice(-2)}`
    document.querySelector(`div[key='${id}'] div.row .taskdate`).innerHTML = `${("0" + hour.getDate()).slice(-2)}/${("0" + (hour.getMonth() + 1)).slice(-2)}/${("000" + hour.getFullYear()).slice(-4)}`

    let res = document.createElement('div')
    res.setAttribute('class','alert alert-success alert-dismissible')
    res.setAttribute('role','alert')
    res.innerHTML = 'Task saved! <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>'
    document.querySelector('.modal-body').appendChild(res)
}