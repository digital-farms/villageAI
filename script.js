class Resident {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.energy = 100;
        this.mood = 'happy';
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.energy -= Math.sqrt(dx * dx + dy * dy);
    }

    eat() {
        this.energy += 20;
    }

    sleep() {
        this.energy += 50;
    }

    interact(otherResident) {
        this.mood = 'happy';
    }

    interactWithEnvironment(city) {
        const nearbyResidents = city.getResidentsNear(this.x, this.y);
        if (nearbyResidents.length > 0) {
            this.interact(nearbyResidents[0]);
        }
    }
}

class AI {
    constructor() {}

    decideAction(resident, city) {
        if (resident.energy < 20) {
            return 'sleep';
        } else if (resident.energy < 50) {
            return 'eat';
        } else {
            return 'move';
        }
    }

    performAction(resident, action) {
        switch (action) {
            case 'move':
                const dx = (Math.random() - 0.5) * 10;
                const dy = (Math.random() - 0.5) * 10;
                resident.move(dx, dy);
                break;
            case 'eat':
                resident.eat();
                break;
            case 'sleep':
                resident.sleep();
                break;
        }
    }
}

class City {
    constructor() {
        this.residents = [];
    }

    addResident(resident) {
        this.residents.push(resident);
    }

    getResidentsNear(x, y, radius = 50) {
        return this.residents.filter(resident => {
            const dx = resident.x - x;
            const dy = resident.y - y;
            return Math.sqrt(dx * dx + dy * dy) < radius;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const city = new City();
    const ai = new AI();

    const cityElement = document.getElementById('city');

    // Создание жителей
    for (let i = 0; i < 10; i++) {
        const resident = new Resident(i, Math.random() * 800, Math.random() * 600);
        city.addResident(resident);

        const residentElement = document.createElement('div');
        residentElement.className = 'resident';
        residentElement.id = `resident-${i}`;
        residentElement.style.left = `${resident.x}px`;
        residentElement.style.top = `${resident.y}px`;
        cityElement.appendChild(residentElement);
    }

    function update() {
        city.residents.forEach(resident => {
            const action = ai.decideAction(resident, city);
            ai.performAction(resident, action);
            resident.interactWithEnvironment(city);

            const residentElement = document.getElementById(`resident-${resident.id}`);
            residentElement.style.left = `${resident.x}px`;
            residentElement.style.top = `${resident.y}px`;
        });

        requestAnimationFrame(update);
    }

    update();
});