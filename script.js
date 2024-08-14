document.addEventListener("DOMContentLoaded", function () {
    const pole = document.getElementById("pole");
    const hrac = document.getElementById("hrac");

    let hracX = 0;
    let hracY = 0;

    let utocneTecky = [];
    const maxPocetTecek = 10;

    let ohenX, ohenY;

    const zbrane = [];

    let maOhen = false;

    function updateHracPosition() {
        hrac.style.left = hracX + "px";
        hrac.style.top = hracY + "px";
    }

    function moveUtocnaTecka() {
        if (utocneTecky.length < maxPocetTecek) {
            const utocnaTecka = document.createElement("div");
            utocnaTecka.className = "utocnaTecka";
            pole.appendChild(utocnaTecka);

            let utocnaTeckaX, utocnaTeckaY;
            const randomSide = Math.floor(Math.random() * 4);

            switch (randomSide) {
                case 0:
                    utocnaTeckaX = 0;
                    utocnaTeckaY = Math.random() * (pole.clientHeight - 25);
                    break;
                case 1:
                    utocnaTeckaX = Math.random() * (pole.clientWidth - 25);
                    utocnaTeckaY = 0;
                    break;
                case 2:
                    utocnaTeckaX = pole.clientWidth - 25;
                    utocnaTeckaY = Math.random() * (pole.clientHeight - 25);
                    break;
                case 3:
                    utocnaTeckaX = Math.random() * (pole.clientWidth - 25);
                    utocnaTeckaY = pole.clientHeight - 25;
                    break;
            }

            utocnaTecka.style.left = utocnaTeckaX + "px";
            utocnaTecka.style.top = utocnaTeckaY + "px";

            utocneTecky.push({
                element: utocnaTecka,
                directionX: 1,
                directionY: 1,
                speed: 1
            });
        }
    }

    function updateUtocneTeckyPosition() {
        utocneTecky.forEach(utocnaTecka => {
            let utocnaTeckaX = parseFloat(utocnaTecka.element.style.left);
            let utocnaTeckaY = parseFloat(utocnaTecka.element.style.top);

            utocnaTeckaX += utocnaTecka.speed * utocnaTecka.directionX;
            utocnaTeckaY += utocnaTecka.speed * utocnaTecka.directionY;
            // Kontrola hranic hracího pole pro útočnou tečku
            if (utocnaTeckaX > pole.clientWidth - 25 || utocnaTeckaX < 0) {
                utocnaTecka.directionX *= -1; // Odražení od hranice na ose X
            }
            if (utocnaTeckaY > pole.clientHeight - 25 || utocnaTeckaY < 0) {
                utocnaTecka.directionY *= -1; // Odražení od hranice na ose Y
            }

            utocnaTecka.element.style.left = utocnaTeckaX + "px";
            utocnaTecka.element.style.top = utocnaTeckaY + "px";
        });
    }

    function moveOhen() {
        ohenX = Math.random() * (pole.clientWidth - 25);
        ohenY = Math.random() * (pole.clientHeight - 25);

        const ohen = document.createElement("div");
        ohen.className = "zbran ohen";
        pole.appendChild(ohen);

        ohen.style.left = ohenX + "px";
        ohen.style.top = ohenY + "px";

        zbrane.push({
            element: ohen,
            type: "ohen"
        });
    }

    function checkCollision() {
        const hracRect = hrac.getBoundingClientRect();

        utocneTecky.forEach(utocnaTecka => {
            const utocnaTeckaRect = utocnaTecka.element.getBoundingClientRect();

            if (
                hracRect.left < utocnaTeckaRect.right &&
                hracRect.right > utocnaTeckaRect.left &&
                hracRect.top < utocnaTeckaRect.bottom &&
                hracRect.bottom > utocnaTeckaRect.top
            ) {
                gameOver();
            }
        });
    }

    function checkWeaponCollision() {
        const hracRect = hrac.getBoundingClientRect();

        zbrane.forEach(zbran => {
            const zbranRect = zbran.element.getBoundingClientRect();

            if (
                hracRect.left < zbranRect.right &&
                hracRect.right > zbranRect.left &&
                hracRect.top < zbranRect.bottom &&
                hracRect.bottom > zbranRect.top
            ) {
                if (zbran.type === "ohen") {
                    maOhen = true;
                    pole.removeChild(zbran.element);
                }
            }
        });
    }

    function useWeapon() {
        document.addEventListener("keydown", function (event) {
            if (event.key === "q") {
                if (maOhen) {
                    console.log("Oheň použit!");
                    maOhen = false;
                }
            }
        });
    }

    function gameOver() {
        const restartGame = confirm("Game Over! Do you want to restart?");
        if (restartGame) {
            alert("Thanks for playing!");
            location.reload();
        }
    }

    function gameLoop() {
        updateHracPosition();
        updateUtocneTeckyPosition();
        checkCollision();
        checkWeaponCollision();
        requestAnimationFrame(gameLoop);
    }

    document.addEventListener("keydown", function (event) {
        switch (event.key) {
            case "ArrowUp":
                hracY -= 10;
                break;
            case "ArrowDown":
                hracY += 10;
                break;
            case "ArrowLeft":
                hracX -= 10;
                break;
            case "ArrowRight":
                hracX += 10;
                break;
        }
    });

    setInterval(() => {
        moveUtocnaTecka();
        utocneTecky.forEach(utocnaTecka => {
            utocnaTecka.speed += 0.5;
        });

        if (Math.random() < 0.2) {
            moveOhen();
        }
    }, 1500);

    moveOhen();  // Inicializace ohně na začátku hry

    useWeapon();
    gameLoop();
});
