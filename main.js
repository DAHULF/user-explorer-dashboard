import { states, loadUsers, getUsers, getUsersLoadState, 
    loadActivities, getActivities, getActivitiesLoadState } from "./data.js";

import { renderUsersCards, renderUsersLoading, renderUsersLoadingError,
     renderUsersNotFound, renderActivitiesCards, renderActivitiesLoading, 
     renderActivitiesLoadingError, renderActivitiesNotFound } from "./render.js";

"use strict";

lucide.createIcons();

// Navigation sidebar management
// ==================

const navSidebar = document.querySelector(".nav-sidebar");
const showNavSidebarBtn = document.querySelector(".show-nav-sidebar-btn");
const hideNavSidebarBtn = document.querySelector(".hide-nav-sidebar-btn");

navSidebar.addEventListener("click", (event) => {
    const link = event.target.closest(".menu-item");

    if(!link) {
        return;
    }

    event.preventDefault();
});

showNavSidebarBtn.addEventListener("click", () => {
    navSidebar.classList.toggle('nav-sidebar-displayed', true);
});

hideNavSidebarBtn.addEventListener("click", () => {
    navSidebar.classList.toggle('nav-sidebar-displayed', false);
});

// Filtering manage
// ================

const sortFunctions = {
    "newest-asc": (a, b) => b.id - a.id,
    "newest-desc": (a, b) => a.id - b.id,
    "name-asc": (a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    },
    "name-desc": (a, b) => {
        if (a.name > b.name) return -1;
        if (a.name < b.name) return 1;
        return 0;
    },
    "role-asc": (a, b) => {
        if (a.role < b.role) return -1;
        if (a.role > b.role) return 1;
        return 0;
    },
    "role-desc": (a, b) => {
        if (a.role > b.role) return -1;
        if (a.role < b.role) return 1;
        return 0;
    }
};

let filteredUsers = [];
const filteringForm = document.querySelector(".filtering-form");

function getFilterState() {
    const formData = new FormData(filteringForm);

    return {
        ...Object.fromEntries(formData),
        activeOnly: document.querySelector("#active-only-checkbox").checked
    };
}

function filterUsers() {
    const users = getUsers();
    const filterState = getFilterState();

    // Accept filters
    filteredUsers = users.filter((user) => {
        // Accept search string
        const searchText = `${user.name} ${user.email} ${user.company} ${user.status} ${user.role}`.toLowerCase();
        const matchesSearch = searchText.includes(filterState.searchWord.toLowerCase());

        // Accept status matches
        const matchesStatus = (filterState.displayStatus === "all") || (user.status.toLowerCase() === filterState.displayStatus);

        // Accept active only checkbox option
        const matchesOnlyActiveCheckbox = !filterState.activeOnly || user.status === "Active";

        return matchesSearch && matchesStatus && matchesOnlyActiveCheckbox;
    });

    // Sort filtered users
    filteredUsers.sort(sortFunctions[filterState.sortParam]);
}

const appliedStatusIcon = document.querySelector(".filtering-success-icon-container");
const resetStatusIcon = document.querySelector(".filtering-failure-icon-container");
const filteringStatusHeader = document.querySelector(".filtering-status-text h3");
const filteringStatusText = document.querySelector(".filtering-status-text p");

function updateFilteringStatusBlock() {
    const areFiltersReset = searchField.value === ""
                    && selectStatus.value === "all"
                    && activeOnlyCheckbox.checked === false;
 
    appliedStatusIcon.hidden = areFiltersReset;
    resetStatusIcon.hidden = !areFiltersReset;

    filteringStatusHeader.textContent = areFiltersReset ? "Filters reset" : "Filters applied";
    filteringStatusText.textContent = areFiltersReset ? `Showing all ${filteredUsers.length} users`
                            : `Showing ${filteredUsers.length} of ${getUsers().length} users`;
}

function acceptFilterParams() {
    filterUsers();
    updateFilteringStatusBlock();
    updatePagesButtons();
    updateUsersCards();
}

const applyFiltersBtn = document.querySelector(".apply-filters-btn");
const resetFiltersBtn = document.querySelector(".reset-filters-btn");

const searchField = document.querySelector("#search-field");
const selectStatus = document.querySelector("#select-status");
const selectSort = document.querySelector("#select-sort");
const activeOnlyCheckbox = document.querySelector("#active-only-checkbox");


applyFiltersBtn.addEventListener("click", () => {
    acceptFilterParams();
});

resetFiltersBtn.addEventListener("click", () => {
    searchField.value = "";
    selectStatus.value = "all";
    selectSort.value = "newest-asc";
    activeOnlyCheckbox.checked = false;

    acceptFilterParams();
});


function getUsersCount() {
    return filteredUsers.length;
}

// Users cards manage
// ==================

const displayStatus = document.querySelector(".display-status");

function updateDisplayStatus() {
    if(getUsersLoadState() !== states.LOADED) {
        displayStatus.hidden = true;
        return;
    }

    displayStatus.hidden = false;

    const usersCount = getUsersCount();
    const usersPerPage = getCardsPerPage();
    const currentPage = getCurrentPage();

    const startCard = usersPerPage * (currentPage - 1) + 1;
    const endCard = Math.min(startCard + usersPerPage - 1, usersCount);

    const status = `Showing ${ startCard }-${ endCard } of ${ usersCount } users`;
    displayStatus.textContent = status;
}

const pageButtonsContainer = document.querySelector(".display-page-chooser");

pageButtonsContainer.addEventListener("click", (event) => {
    const clickedButton = event.target.closest(".display-manage-button");

    if(!clickedButton) {
        return;
    }

    if(clickedButton.classList.contains("previous-page-button")) {
        switchPage(getCurrentPage() - 1);
    } 
    
    else if(clickedButton.classList.contains("number-page-button")) {
        switchPage(Number(clickedButton.textContent));
    }

    else if(clickedButton.classList.contains("next-page-button")) {
        switchPage(getCurrentPage() + 1);
    }
});

const leftPagesSpace = document.querySelector(".left-pages-space");
const rightPagesSpace = document.querySelector(".right-pages-space");

const pageButtons = document.querySelectorAll(".number-page-button");

function getCurrentPage() {
    return Number(document.querySelector(".current-page-button").textContent);
}

function switchPage(newPage) {
    const usersCount = getUsersCount();
    const usersPerPage = getCardsPerPage();

    const pagesCount = Math.ceil(usersCount / usersPerPage);

    if(newPage < 1 || newPage > pagesCount) {
        return;
    }

    leftPagesSpace.hidden = (pagesCount < 6 || newPage < 4);
    rightPagesSpace.hidden = (pagesCount < 6 || newPage >= pagesCount - 2);
    
    pageButtons.forEach((button) => button.classList.remove("current-page-button"));

    if(!leftPagesSpace.hidden && !rightPagesSpace.hidden) {
        pageButtons[1].textContent = newPage - 1;
        pageButtons[2].textContent = newPage;
        pageButtons[3].textContent = newPage + 1;

        pageButtons[2].classList.add("current-page-button");
    } else if(leftPagesSpace.hidden && !rightPagesSpace.hidden) {
        pageButtons[1].textContent = 2;
        pageButtons[2].textContent = 3;
        pageButtons[3].textContent = 4;

        pageButtons[newPage - 1].classList.add("current-page-button");
    } else if(!leftPagesSpace.hidden && rightPagesSpace.hidden) {
        pageButtons[1].textContent = pagesCount - 3;
        pageButtons[2].textContent = pagesCount - 2;
        pageButtons[3].textContent = pagesCount - 1;

        pageButtons[pageButtons.length - (pagesCount - newPage + 1)].classList.add("current-page-button");
    } else {
        pageButtons[newPage - 1].classList.add("current-page-button");
    }

    updateUsersCards();
}

function updatePagesButtons() {
    if(getUsersLoadState() !== states.LOADED) {
        pageButtonsContainer.hidden = true;
        return;
    }

    const usersCount = getUsersCount();
    const usersPerPage = getCardsPerPage();

    const pagesCount = Math.ceil(usersCount / usersPerPage);

    pageButtonsContainer.hidden = false;

    leftPagesSpace.hidden = true;
    rightPagesSpace.hidden = (pagesCount < 6);

    pageButtons.forEach((button, index) => {
        const pageNum = index + 1;

        if(pageNum > pagesCount) {
            button.hidden = true;
            return;
        }

        button.hidden = false;
        button.textContent = index + 1;
        button.classList.remove("current-page-button");
    });

    pageButtons[0].classList.add("current-page-button");
    pageButtons[pageButtons.length - 1].textContent = pagesCount;
}

const cardsPerPageSelect = document.querySelector("#cards-per-page-select");

cardsPerPageSelect.addEventListener("change", () => {
    updatePagesButtons();
    updateUsersCards();
});

function getCardsPerPage() {
    return Number(cardsPerPageSelect.value);
}

const cardsContainer = document.querySelector(".cards-container");

cardsContainer.addEventListener("click", (event) => {
    const pressedButton = event.target.closest(".button") 
                ?? event.target.closest(".icon-button");

    if(!pressedButton) {
        return;
    }

    const card = event.target.closest(".user-card");

    if(!card) {
        return;
    }

    if(pressedButton.classList.contains("more-user-card")) {
        alert(`Show more options for user with ID ${card.dataset.id}`);
    } else if(pressedButton.classList.contains("view-user-button")) {
        alert(`View user with ID ${card.dataset.id}`);
    } else if(pressedButton.classList.contains("message-user-button")) {
        alert(`Message user with ID ${card.dataset.id}`);
    }
});

function updateUsersCards() {
    if(getUsersLoadState() === states.ERROR) {
        renderUsersLoadingError();
        updateDisplayStatus();
        return;
    }

    const count = getCardsPerPage();
    const start = (getCurrentPage() - 1) * count;

    if(filteredUsers.length === 0) {
        renderUsersNotFound();
    } else {
        renderUsersCards(filteredUsers, count, start);
    }

    updateDisplayStatus();
}

async function initUsers() {
    try {
        renderUsersLoading();
        await loadUsers();

        filterUsers();
        updateFilteringStatusBlock();
        updatePagesButtons();
        updateUsersCards();
    } catch(error) {
        console.error(error);
        renderUsersLoadingError();
    }
}

initUsers();

// Activities manage
// =================

const reloadActivitiesBtn = document.querySelector(".refresh-activities-btn");

reloadActivitiesBtn.addEventListener("click", () => {
    initActivities();
});

async function initActivities() {
    try {
        renderActivitiesLoading();

        let activities = await loadActivities();
        if(activities.length === 0) {
            renderActivitiesNotFound();
        } else {
            renderActivitiesCards(activities);
        }
    } catch (error) {
        console.error(error);
        renderActivitiesLoadingError();
    }
}

initActivities();