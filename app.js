class Agent{
    constructor(name, role, abilities, image, description) {
        this.name = name
        this.role = role
        this. abilities =  abilities
        this.image = image
        this.description = description
    }

    htmlCard() {
        return `
        <div id="card">
            <img src="${this.image}" alt="" id="image"> 
            <div id="title">
                <h1 id="name">${this.name}</h1>
                <p id="role">${this.role}</p>
            </div>
            <div id="line"></div>
            <p id="description">${this.description}</p>
            <h3>Abilities</h3>
             <ul>${this.abilities.map(ability => `<li>${ability}</li>`).join('')}</ul>

            `;
        }
}


let agents = [];


async function getAgents() {
    const response = await fetch('https://valorant-api.com/v1/agents');
    const json = await response.json();
    const data = json["data"];
    const addedNames = new Set(); 

    for (let agentJson of data) {
        const roleDisplayName = agentJson.role ? agentJson.role.displayName : null;
        const abilitiesDisplay = agentJson.abilities 
            ? agentJson.abilities.map(ability => ability.displayName) 
            : [];


        if (roleDisplayName && roleDisplayName !== "Unknown Role" && !addedNames.has(agentJson.displayName)) {
            const agent = new Agent(
                agentJson.displayName,
                roleDisplayName,
                abilitiesDisplay,
                agentJson.displayIcon,
                agentJson.description
            );            
            agents.push(agent);
            addedNames.add(agentJson.displayName);
        }
    }
    renderAgents();
}

getAgents();


function renderAgents() {
    const container = document.getElementById("container");
    container.innerHTML = ""; 

    for (let agent of agents) {
        container.innerHTML += agent.htmlCard();
    }
}   


function filterAgents(event) {
    const searchTerm = event.target.value.toLowerCase();

    if (searchTerm === "") {
        renderAgents();
    } else {
        const filteredAgents = agents.filter(agent => {
            return agent.name.toLowerCase().includes(searchTerm);
        });
        renderFilter(filteredAgents);
    }
}

function renderFilter(filteredAgents) {
    const container = document.getElementById("container");
    container.innerHTML = "";

    for (let agent of filteredAgents) {
        container.innerHTML += agent.htmlCard();
    }
}


document.getElementById('busqueda').addEventListener('input', filterAgents);
