
let agents = [];
let availableAgents = [];

let selectedRole = "Any";

const order = [
    "A1","B1",
    "A2","B2",
    "A3","B3",
    "A4","B4",
    "A5","B5"
];

let turnIndex = 0;

const spinSound =
    document.getElementById(
        "spinSound"
    );

spinSound.volume = 0.4; // Set volume to 40%

spinSound.currentTime = 6.4; // Rewind to the beginning if replaying
spinSound.loop = true; // Enable looping


fetch("data/agents.json")
.then(r => r.json())
.then(data => {

    agents = data;
    availableAgents = [...agents];

    renderPool();
});

document
.querySelectorAll(".role-btn")
.forEach(btn => {

    btn.addEventListener("click", () => {

        document
        .querySelectorAll(".role-btn")
        .forEach(b =>
            b.classList.remove("active")
        );

        btn.classList.add("active");

        selectedRole =
            btn.dataset.role;
    });
});

function renderPool(){

    const pool =
        document.getElementById("agentPool");

    pool.innerHTML = "";

    agents.forEach(agent => {

        pool.innerHTML += `
            <div class="agent-card"
                 id="card-${agent.name}">
                <img src="${agent.image}">
                <p>${agent.name}</p>
            </div>
        `;
    });
}

document
.getElementById("spinBtn")
.addEventListener("click", spinAgent);



async function spinAgent(){
    spinSound.play();
    spinBtn.disabled = true;

    if(turnIndex >= order.length){
        alert("Draft Complete");
        return;
    }

    let candidates;

    if(selectedRole === "Any"){
        candidates = availableAgents;
    }else{
        candidates = availableAgents.filter(
            a => a.role === selectedRole
        );
    }

    if(candidates.length === 0){
        alert("No agents left");
        return;
    }

    document.getElementById("spinBtn").disabled = true;

    let currentCard = null;
    let currentAgent = null;

    let currentIndex = 0;
    let delay = 30;
    let totalDelay = 0;

    const rounds =
        Math.max(
            4,
            Math.ceil(
                40 / candidates.length
            )
        );

    const totalSteps =
        candidates.length * rounds +
        Math.floor(
            Math.random() * candidates.length
        );
    
    for(let i = 0; i < totalSteps; i++){

        if(currentCard){
            currentCard.classList.remove(
                "active"
            );
        }

        currentAgent =
            candidates[
                currentIndex %
                candidates.length
            ];

        currentCard =
            document.getElementById(
                "card-" + currentAgent.name
            );

        currentCard.classList.add(
            "active"
        );

        document.getElementById(
            "previewImage"
        ).src = currentAgent.image;

        document.getElementById(
            "previewName"
        ).textContent =
        currentAgent.name;

        document.getElementById(
            "previewRole"
        ).textContent =
        currentAgent.role;

        await new Promise(resolve =>
            setTimeout(resolve, delay)
        );

        currentIndex++;

        delay *= 1.06;
        totalDelay += delay;
        console.log("Delay: " + delay.toFixed(2) + "ms, Total: " + totalDelay.toFixed(2) + "ms");
        if(totalDelay > 7000 || candidates.length === 1){ 
            await new Promise(resolve =>
                setTimeout(resolve, delay)
            );
            break;
        }
    }

    const picked = currentAgent;

    document
        .querySelectorAll(".agent-card")
        .forEach(card =>
            card.classList.remove(
                "active"
            )
        );

    const winner =
        document.getElementById(
            "card-" + picked.name
        );

    winner.classList.add("winner");
    winner.classList.add("used");

    const slot =
        document.getElementById(
            order[turnIndex]
        );

    slot.innerHTML = `
        <img src="${picked.image}">
        <span>${picked.name}</span>
    `;

    availableAgents =
        availableAgents.filter(
            a => a.name !== picked.name
        );

    turnIndex++;

    document
        .getElementById("turnText")
        .textContent =
        turnIndex < order.length
        ? "Current Turn: " +
          order[turnIndex]
        : "Draft Complete";

    document.getElementById(
        "spinBtn"
    ).disabled = false;
}

/* Banner */

function setupTeamUpload(
    inputId,
    imageId
){

    const input =
        document.getElementById(
            inputId
        );

    const image =
        document.getElementById(
            imageId
        );

    image.addEventListener(
        "click",
        () => input.click()
    );

    input.addEventListener(
        "change",
        e => {

            const file =
                e.target.files[0];

            if(!file) return;

            image.src =
                URL.createObjectURL(
                    file
                );
        }
    );
}

setupTeamUpload(
    "uploadA",
    "teamAImage"
);

setupTeamUpload(
    "uploadB",
    "teamBImage"
);

/* map pool */

const maps = [
    {
        name:"Abyss",
        image:"assets/abyss.avif"
    },

    {
        name:"Ascent",
        image:"assets/ascent.avif"
    },

    {
        name:"Bind",
        image:"assets/bind.avif"
    },

    {
        name:"Breeze",
        image:"assets/breeze.avif"
    },

    {
        name:"Corrode",
        image:"assets/corrode.avif"
    },

    {
        name:"Icebox",
        image:"assets/icebox.avif"
    },

    {
        name:"Haven",
        image:"assets/haven.avif"
    },

    {
        name:"Split",
        image:"assets/split.avif"
    },

    {
        name:"Lotus",
        image:"assets/lotus.avif"
    },

    {
        name:"Sunset",
        image:"assets/sunset.avif"
    },

    {
        name:"Pearl",
        image:"assets/pearl.avif"
    },

    {
        name:"Fracture",
        image:"assets/fracture.avif"
    }
];

const excludedMaps = new Set();

function toggleMap(mapName) {

    if (excludedMaps.has(mapName)) {
        excludedMaps.delete(mapName);
    } else {
        excludedMaps.add(mapName);
    }

    renderMapPool();
}

function renderMapPool() {

    const pool =
        document.getElementById("mapPool");

    pool.innerHTML = "";

    maps.forEach(map => {

        const card =
            document.createElement("div");

        card.className = "map-card";

        if (excludedMaps.has(map.name)) {
            card.classList.add("excluded");
        }

        card.innerHTML = `
            <img src="${map.image}">
            <div class="map-title">
                ${map.name}
            </div>
        `;

        card.onclick = () =>
            toggleMap(map.name);

        pool.appendChild(card);
    });
}

function getAvailableMaps() {

    return maps.filter(
        map => !excludedMaps.has(map.name)
    );

}

renderMapPool();

/// map rand

function updateMapPreview(index){
    const availableMaps =
        getAvailableMaps();

    const current =
        availableMaps[index];

    const prev =
        availableMaps[
            (index - 1 + availableMaps.length)
            % availableMaps.length
        ];

    const next =
        availableMaps[
            (index + 1)
            % availableMaps.length
        ];

    document.getElementById(
        "prevMap"
    ).src = prev.image;

    document.getElementById(
        "currentMap"
    ).src = current.image;

    document.getElementById(
        "nextMap"
    ).src = next.image;

    document.getElementById(
        "mapName"
    ).textContent =
        current.name;
}


async function spinMap(){
    const availableMaps =
        getAvailableMaps();

    if (availableMaps.length === 0) {

        alert(
            "At least 1 map is required."
        );

        return;
    }

    spinSound.play();
    const btn =
        document.getElementById(
            "mapBtn"
        );

    if(btn.disabled) return;

    btn.disabled = true;

    btn.textContent =
        "RANDOMING...";

    let index = 0;

    let delay = 80;

    const loops = 8;

    const stopAt =
        Math.floor(
            Math.random() *
            availableMaps.length
        );

    const totalSteps =
        loops * availableMaps.length +
        stopAt;

    for(
        let i = 0;
        i <= totalSteps;
        i++
    ){

        updateMapPreview(
            index % availableMaps.length
        );

        await new Promise(
            resolve =>
            setTimeout(
                resolve,
                delay
            )
        );

        index++;

        if(i > totalSteps * 0.5){
            if(delay > 1200) continue;
            delay *= 1.08;
        }
    }

    btn.textContent =
        "MAP SELECTED";

    const selectedMap =
    availableMaps[
        (index - 1) % availableMaps.length
    ];

    document
        .getElementById(
            "selectedMapThumb"
        ).src =
        selectedMap.image;

    document
        .getElementById(
            "selectedMapName"
        ).textContent =
        selectedMap.name;

    document
        .getElementById(
            "mapSidebar"
        ).classList.add(
            "show"
    );
    btn.disabled = 0;

    ////

    const mapSection =
        document.getElementById(
            "mapSection"
        );

    const agentSection =
        document.getElementById(
            "agentSection"
        );

    mapSection.classList.remove(
        "visible"
    );

    mapSection.classList.add(
        "hidden"
    );

    setTimeout(() => {

        mapSection.style.display =
            "none";

        agentSection.style.display =
            "block";

        requestAnimationFrame(() => {

            agentSection.classList.remove(
                "hidden"
            );

            agentSection.classList.add(
                "visible"
            );

        });

    }, 400);
    
}

updateMapPreview(0);

document
    .getElementById("mapBtn")
    .addEventListener(
        "click",
        spinMap
    );

