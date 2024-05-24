class Resident {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.energy = 100;
        this.mood = 'happy';
        this.friends = [];
        this.enemies = [];
        this.needs = {
            food: 100,
            sleep: 100,
            social: 100,
            entertainment: 100
        };
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.energy -= Math.sqrt(dx * dx + dy * dy);
        this.needs.food -= 1;
        this.needs.sleep -= 1;
        this.needs.social -= 0.5;
        this.needs.entertainment -= 0.5;
    }

    eat() {
        this.energy += 20;
        this.needs.food += 50;
    }

    sleep() {
        this.energy += 50;
        this.needs.sleep += 50;
    }

    socialize(otherResident) {
        this.mood = 'happy';
        this.needs.social += 30;
        if (!this.friends.includes(otherResident.id)) {
            this.friends.push(otherResident.id);
        }
    }

    entertain() {
        this.mood = 'happy';
        this.needs.entertainment += 30;
    }

    interactWithEnvironment(city) {
        const nearbyResidents = city.getResidentsNear(this.x, this.y);
        if (nearbyResidents.length > 0) {
            this.socialize(nearbyResidents[0]);
        }
    }

    updateNeeds() {
        for (let need in this.needs) {
            if (this.needs[need] < 0) {
                this.mood = 'sad';
            }
        }
    }
}

class AI {
    constructor() {}

    decideAction(resident, city) {
        if (resident.needs.food < 20) {
            return 'eat';
        } else if (resident.needs.sleep < 20) {
            return 'sleep';
        } else if (resident.needs.social < 20) {
            return 'socialize';
        } else if (resident.needs.entertainment < 20) {
            return 'entertain';
        } else {
            return 'move';
        }
    }

    performAction(resident, action, city) {
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
            case 'socialize':
                const nearbyResidents = city.getResidentsNear(resident.x, resident.y);
                if (nearbyResidents.length > 0) {
                    resident.socialize(nearbyResidents[0]);
                }
                break;
            case 'entertain':
                resident.entertain();
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
            ai.performAction(resident, action, city);
            resident.interactWithEnvironment(city);
            resident.updateNeeds();

            const residentElement = document.getElementById(`resident-${resident.id}`);
            residentElement.style.left = `${resident.x}px`;
            residentElement.style.top = `${resident.y}px`;
        });

        requestAnimationFrame(update);
    }

    update();
});