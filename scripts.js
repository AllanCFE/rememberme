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
                            <div class="col-8" style="text-align: left;">${tasktext}</div>
                            <div class="col-1">${("0" + dateandtime.getHours()).slice(-2)}:${("0" + dateandtime.getMinutes()).slice(-2)}</div>
                            <div class="col-1"> ${("0" + dateandtime.getDate()).slice(-2)}/${("0" + (dateandtime.getMonth() + 1)).slice(-2)}/${("000" + dateandtime.getFullYear()).slice(-4)}</div>
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
