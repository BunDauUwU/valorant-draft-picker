
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

// function spinAgent(){
    
//     if(turnIndex >= order.length){

//         alert("Draft Complete");
//         return;
//     }

//     let candidates;

//     if(selectedRole === "Any"){

//         candidates = availableAgents;

//     }else{

//         candidates =
//             availableAgents.filter(
//                 a => a.role === selectedRole
//             );
//     }

//     if(candidates.length === 0){

//         alert("No agents left");
//         return;
//     }

//     let currentCard = null;

//     let currentDelay = 100;  
//     const maxDelay = 600;
//     const decelerationRate = 1.2;

//     const interval =
//     setInterval(() => {

//         if(currentCard){

//             currentCard.classList.remove(
//                 "active"
//             );
//         }

//         const random =
//             candidates[
//                 Math.floor(
//                     Math.random()
//                     * candidates.length
//                 )
//             ];

//         currentCard =
//             document.getElementById(
//                 "card-" + random.name
//             );

//         currentCard.classList.add(
//             "active"
//         );

//         document
//             .getElementById(
//                 "previewImage"
//             ).src = random.image;

//         document
//             .getElementById(
//                 "previewName"
//             ).textContent =
//             random.name;

//         document
//             .getElementById(
//                 "previewRole"
//             ).textContent =
//             random.role;
        
//     },currentDelay);

//     setTimeout(() => {

//         clearInterval(interval);

//         const picked =
//             candidates[
//                 Math.floor(
//                     Math.random()
//                     * candidates.length
//                 )
//             ];

//         document
//             .querySelectorAll(
//                 ".agent-card"
//             )
//             .forEach(card =>
//                 card.classList.remove(
//                     "active"
//                 )
//             );

//         const winner =
//             document.getElementById(
//                 "card-" + picked.name
//             );

//         winner.classList.add(
//             "winner"
//         );

//         winner.classList.add(
//             "used"
//         );

//         document
//             .getElementById(
//                 "previewImage"
//             ).src = picked.image;

//         document
//             .getElementById(
//                 "previewName"
//             ).textContent =
//             picked.name;

//         document
//             .getElementById(
//                 "previewRole"
//             ).textContent =
//             picked.role;

//         const slot =
//             document.getElementById(
//                 order[turnIndex]
//             );

//         slot.innerHTML = `
//             <img src="${picked.image}">
//             <span>${picked.name}</span>
//         `;

//         availableAgents =
//             availableAgents.filter(
//                 a => a.name !== picked.name
//             );

//         turnIndex++;

//         document
//             .getElementById(
//                 "turnText"
//             ).textContent =
//             turnIndex < order.length
//             ? "Current Turn: " +
//               order[turnIndex]
//             : "Draft Complete";

//     },5000);
// }