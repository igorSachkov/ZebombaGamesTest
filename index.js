import { data } from "./modules/data.js"
const player = document.querySelector(".player")
const startButton = document.querySelector(".to-the-university")
const friendsContainer = document.querySelector(".friends-carousel-container")
const arrowLeft = document.querySelector(".arrow-left")
const arrowRight = document.querySelector(".arrow-right")
const ratingButton = document.querySelector(".rating")
const gameModeWindow = document.querySelector(".game-mode")
const btnCloseRatingWindow = document.querySelector(".rating-window__button-close-rating")
const ratingPlayersContainer = document.querySelector(".rating-players-container")
const ratingContainer = document.querySelector(".rating-container")
const addToFriendsImg = "./images/nav/plus.png"
const playerLocation = new Array(10).fill(0)
playerLocation[0] = 1

const checkPoints = [0, 11.5, 20.5, 30, 39, 49.5, 56.7, 65.5, 77.5, 87, 100]

// Заглушка, заполнение массива + один профиль не из друзей для отображения кнопки add-to-friends
const friendsContainerArray = [...data.friends, {
    "id": "796",
    "name": "Даниил",
    "lastName": "Воробьёв",
    "img": "./male.png",
    "points": "642"
}, ...data.friends, ...data.friends]

const playerAPI = {
    currentLocation: [...playerLocation],
    //передвигаем героиню по карте
    playerGo() {
        let currentPosition
        this.currentLocation.map((n, i) => {
            if (n === 1) {
                player.className = `player step${[i + 1]}`
                currentPosition = i
            } else {
                return
            }
        })
        this.currentLocation[currentPosition] = 0
        this.currentLocation[currentPosition + 1] = 1
    }
}
const navAPI = {
    carouselPosition: 0,
    friendItemWidth: 60,
    elementsOnNav: 8,
    navArray: [],
    friendsArray: [],
    configure(navArray, friendsArray) {
        this.navArray = [...navArray]
        this.friendsArray = [...friendsArray]
    },
    //наполняем навигационное меню друзьями
    friendsListFilling() {
        for (let user of this.navArray) {
            const avatar = document.createElement("img")
            avatar.src = user.img
            const newFriend = document.createElement("div")
            newFriend.className = "friend-item"
            // если пользователь не у нас в друзьях, мы можем добавить его
            if (!this.friendsArray.some(e => e.id === user.id)) {
                const addToFriends = document.createElement("img")
                addToFriends.className = "add-to-friends"
                addToFriends.src = addToFriendsImg
                newFriend.appendChild(addToFriends)
            }
            newFriend.appendChild(avatar)
            newFriend.title = `${user.name} ${user.lastName}`
            friendsContainer.appendChild(newFriend)
        }
    },
    //куртим карусель
    carouselRight() {
        if (this.carouselPosition < this.navArray.length - this.elementsOnNav) {
            friendsContainer.style.transform += `translateX(-${this.friendItemWidth}px)`
            this.carouselPosition += 1
        } else {
            friendsContainer.style.transform = `translateX(0px)`
            this.carouselPosition = 0
        }
    },
    carouselLeft() {
        if (this.carouselPosition <= 0) {
            friendsContainer.style.transform += `translateX(${-this.friendItemWidth * (this.navArray.length - this.elementsOnNav)}px)`
            this.carouselPosition = this.navArray.length - this.elementsOnNav
        } else {
            friendsContainer.style.transform += `translateX(${this.friendItemWidth}px)`
            this.carouselPosition -= 1
        }
    }
}

const ratingAPI = {
    // сортируем и размещаем список из рейтинга
    fillRatingBoard: (ratingArray, friendsArray) => {
        const sortArray = ratingArray.slice(0).sort((a, b) => b.points - a.points)
        let playerPosition = 1
        for (let position of sortArray) {
            const div = document.createElement("div")
            div.className = "player-info__item"
            for (let i = 0; i < friendsArray.length; i++) {
                if (position.id === friendsArray[i].id) {
                    div.className += " friend"
                }
            }
            const avatar = document.createElement("img")
            avatar.src = position.img
            const rating = document.createElement("p")
            const name = document.createElement("p")
            const experience = document.createElement("p")
            rating.innerHTML = playerPosition
            rating.className = "rating"
            playerPosition++
            name.innerHTML = `${position.name}`
            name.className = "name"
            experience.innerHTML = `${position.points}`
            experience.className = "exp"
            div.appendChild(rating)
            div.appendChild(avatar)
            div.appendChild(name)
            div.appendChild(experience)
            ratingPlayersContainer.appendChild(div)
        }
    },
    //затенение игрового поля и nav
    pause: () => {
        gameModeWindow.className += " pause"
        ratingContainer.style.transform = ` translateY(600px)`;
    },
    unpause: () => {
        gameModeWindow.className -= " pause"
        ratingContainer.style.transform = ` translateY(0px)`;
    }
}

navAPI.configure(friendsContainerArray, data.friends)
navAPI.friendsListFilling()


ratingAPI.fillRatingBoard(data.rating, data.friends)
ratingButton.addEventListener("click", ratingAPI.pause)
btnCloseRatingWindow.addEventListener("click", ratingAPI.unpause)

arrowRight.addEventListener("click", navAPI.carouselRight.bind(navAPI))
arrowLeft.addEventListener("click", navAPI.carouselLeft.bind(navAPI))

startButton.addEventListener("click", playerAPI.playerGo.bind(playerAPI))
