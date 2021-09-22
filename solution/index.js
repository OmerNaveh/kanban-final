const body= document.getElementById("body");
let getLocal = () =>JSON.parse(window.localStorage.getItem('tasks') || 'false');  //gets local data saved
if(!getLocal())
{
    getLocal= { "todo":[], "in-progress":[], "done":[] };
}
else
{
    getLocal= getLocal(); //make sure the variable is never a function and always has a object value
}
const saveToLocal = (data) => window.localStorage.setItem('tasks', JSON.stringify(data)); //saves new local data
printData();
function printData() // creates li element of existing data
{
    const sections= document.querySelectorAll("section");
    for (let section of sections)
    {
        const ul= section.querySelector("ul");
        if(ul.classList.contains("to-do-tasks"))
        {
            for(let todo of getLocal["todo"])
            {
                const li= document.createElement("li");
                li.textContent = todo;
                li.classList.add("task");
                ul.append(li);
            }
        }
        if(ul.classList.contains("in-progress-tasks"))
        {
            for(let inProgress of getLocal["in-progress"])
            {
                const li= document.createElement("li");
                li.textContent = inProgress;
                li.classList.add("task");
                ul.append(li);
            }
        }
        if(ul.classList.contains("done-tasks"))
        {
            for(let done of getLocal["done"])
            {
                const li= document.createElement("li");
                li.textContent = done;
                li.classList.add("task");
                ul.append(li);
            }
         }
    }
}

 /* event listeners */
body.addEventListener("click",(e)=>addTask(e));
body.addEventListener("dblclick",(e)=>editTask(e));
body.addEventListener("mouseover", (e)=>changeSect(e));
const searchbar = document.getElementById("search");
searchbar.addEventListener("keyup", (e)=>searchFilter())
const saveButton= document.getElementById("saveToApi");
saveButton.addEventListener("click", (e)=>SaveToApi(getLocal));
const LoadButton = document.getElementById("loadFromApi");
LoadButton.addEventListener("click", (e)=>LoadFromApi());



function addTask({target}) //adds task li to corresponding ul
{
    if(target.id==="submit-add-to-do" || target.id==="submit-add-in-progress" || target.id==="submit-add-done")
    {
        const section = target.closest("section"); //find closest section
        let inputText= section.querySelector("input").value; 
        const newTask = document.createElement("li");
        if(inputText!=="") //only add a li if the input has value
        {
            newTask.textContent= inputText;
            section.querySelector("input").value = ""; //reset input value
            newTask.classList.add("task");
            const ul = section.querySelector("ul");
            ul.prepend(newTask); //adds the new task to the top of the list
            SaveData(target.id, newTask.textContent); //test which task to insert data to local
        }
        else
        {
            alert("Please enter value");
        }
    }
}
function SaveData(id,liValue)
{
    let savedData = getLocal;    
        switch (id) {
            case 'submit-add-to-do':
                savedData['todo'].unshift(liValue);
                break;
            case 'submit-add-in-progress':
                savedData['in-progress'].unshift(liValue);
                break;
            case 'submit-add-done':
                savedData['done'].unshift(liValue);
                break;
            case 'to-do-tasks':
                savedData['todo'].unshift(liValue);
                break;
            case 'in-progress-tasks':
                savedData['in-progress'].unshift(liValue);
                break;
            case 'done-tasks':
                savedData['done'].unshift(liValue);
                break;
        }
    

     saveToLocal(savedData);
}
    
function editTask(e) //edits task value on dbl click
{   
    const target= e.target;
    const mouseEvent= e;
    if(target.classList.contains("task"))
    {
        const li= target;
        const oldValue = li.textContent;
        const input = document.createElement("input");
        input.placeholder = oldValue;
        li.replaceWith(input);
        input.classList.add("task");
        input.focus(); //right when a user dblClicks the input focuses
        input.onblur= (e)=>{
            if(input.value!=="")
            {
                li.textContent = input.value;
                input.replaceWith(li); //replaces the li with the new value
                const section = li.closest("section");
                const buttonId = section.querySelector("button").id;
                SaveData(buttonId, li.textContent);
                const key= getKeyValue(mouseEvent);
                deleteData(key, oldValue)
            }
            else{alert("Must enter Value")}
         }
    }

}

function deleteData(key, value) //delets value from local data
{
    const dataArray= getLocal;
    const valueIndex = dataArray[key].indexOf(value);
    dataArray[key].splice(valueIndex,1);
    saveToLocal(dataArray);
}
function getKeyValue(e)
{
    const liItem= e.target;
    const containingSec = liItem.closest("section");
    const h2Text = containingSec.querySelector("h2").textContent;
    if(h2Text.includes("To Do"))
    {
        return "todo"
    }
    if(h2Text.includes("In Progress"))
    {
        return "in-progress"
    }
    if(h2Text.includes("Done"))
    {
        return "done"
    }
}
function duplicateLi({target}) //take existing li items content and creates new li item
{
    const liContent= target.textContent;
    const newTask = document.createElement("li");
    newTask.textContent = liContent;
    newTask.classList.add("task");
    return newTask;
}
function changeSect(e) //changes section based on alt + num entered
{
    if(e.target.classList.contains("task"))
    {
        e.target.style.backgroundColor = "lightgray";
        let keysPressed= {};
        const mouseEvent= e;
        document.onkeydown= (event)=>{
            keysPressed[event.key]= true;
            if(keysPressed["Alt"] && event.key === "1")
            {
                const ul = document.querySelector(".to-do-tasks");
                const newLi= duplicateLi(mouseEvent)
                ul.prepend(newLi);
                SaveData("to-do-tasks", newLi.textContent);
                const key=getKeyValue(mouseEvent);
                deleteData(key,newLi.textContent)
                mouseEvent.target.remove();
            }
            if(keysPressed["Alt"] && event.key ==="2")
            {
                const ul = document.querySelector(".in-progress-tasks");
                const newLi= duplicateLi(mouseEvent)
                ul.prepend(newLi);
                SaveData("in-progress-tasks", newLi.textContent);
                const key=getKeyValue(mouseEvent);
                deleteData(key,newLi.textContent)
                mouseEvent.target.remove();
            }
            if(keysPressed["Alt"] && event.key ==="3")
            {
                const ul = document.querySelector(".done-tasks");
                const newLi= duplicateLi(mouseEvent)
                ul.prepend(newLi);
                SaveData("done-tasks", newLi.textContent);
                const key=getKeyValue(mouseEvent);
                deleteData(key,newLi.textContent)
                mouseEvent.target.remove();
            }
            event.target.onkeyup= (e)=> delete keysPressed[e.key];
        }
    }
    e.target.onmouseout= (e)=>{e.target.style.backgroundColor = ""};
}
function searchFilter() //search maipulation Dom
{
    const search = document.getElementById("search").value.toLowerCase(); //converts search text to lower case
    const allLis= document.querySelectorAll(".task");
    for(li of allLis)
    {
        const liText= li.textContent.toLowerCase() //convert value text to lower case
        if(!liText.includes(search))
        {
            li.remove();
        }
    }
    if(search==="")
    {
        for(let li of allLis)
        {
            li.remove();
        }
        printData();
    }
}
let statusCode = undefined; //will be used in ApiFunctions to display a cool cat img displaying error status 
async function SaveToApi(tasks)
{
    const div = document.getElementById("apiUsage");
    const loader = document.createElement("img");
    loader.classList.add("loader");
    loader.src="https://c.tenor.com/sOcqo6-1sXQAAAAM/loading-bar.gif";
    div.append(loader);    
    loader.style.display = "block"
    const saving = await fetch("https://json-bins.herokuapp.com/bin/614b0b534021ac0e6c080cd7", {
        method:"PUT",
        headers: {
        Accept: "application/json", 
        "Content-Type": "application/json",},
        body:JSON.stringify({tasks})
    })
    if(!saving.ok)
    {
        statusCode = saving.status;
        const catImg = document.createElement("img");
        catImg.classList.add("Cats");
        catImg.src= `https://http.cat/${statusCode}`;
        div.append(catImg);
    }
    loader.remove();
}

async function LoadFromApi(tasks)
{
    const div = document.getElementById("apiUsage");
    const loader = document.createElement("img");
    loader.classList.add("loader");
    loader.src="https://c.tenor.com/sOcqo6-1sXQAAAAM/loading-bar.gif";
    div.append(loader);
    loader.style.display = "block"
    const response = await fetch("https://json-bins.herokuapp.com/bin/614b0b534021ac0e6c080cd7", { headers: {
    Accept: "application/json", 
    "Content-Type": "application/json",},});
    if(!response.ok)
    {
        statusCode = response.status;
        const catImg = document.createElement("img");
        catImg.classList.add("Cats");
        catImg.src= `https://http.cat/${statusCode}`;
        div.append(catImg);
    }
    const data = await response.json();
    loader.remove();
    const loadedTasks = data.tasks;
    getLocal = loadedTasks;
    saveToLocal(loadedTasks);
    clearData();
    printData();
}

function clearData() //clear all data before printing new one;
{
    const sections= document.querySelectorAll("section");
    for (let section of sections)
    {
        const ul= section.querySelector("ul");
        const li = ul.querySelectorAll("li");
        for(let i of li)
        {
            i.remove();
        }
    }
}