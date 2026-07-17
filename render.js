"use strict";

// User cards render
// =================

const cardsContainer = document.querySelector(".cards-container");
const cardsLoading = document.querySelector(".cards-loading");
const cardsError = document.querySelector(".cards-error");
const cardsEmpty = document.querySelector(".cards-empty");

function createUserCard(user) {
    if(!user) {
        return;
    }

    // Card init
    const card = document.createElement("article");
    card.classList.add("user-card");
    card.dataset.id = user.id;
    if(user.isPremium) {
        card.classList.add("card-premium");
    }

    // Additional block
    const cardAdditionalBlock = document.createElement("div");
    cardAdditionalBlock.classList.add("card-additional-block");

    if(user.isPremium) {
        const premiumCardIconCont = document.createElement("div");
        premiumCardIconCont.classList.add("premium-card-icon-container");

        const premiumCardIcon = document.createElement("i");
        premiumCardIcon.dataset.lucide = "star";
        premiumCardIcon.classList.add("premium-card-icon");

        premiumCardIconCont.append(premiumCardIcon);
        cardAdditionalBlock.append(premiumCardIconCont);
    }

    const moreUserCardButton = document.createElement("button");
    moreUserCardButton.type = "button";
    moreUserCardButton.classList.add("icon-button", "more-user-card");
    moreUserCardButton.setAttribute("aria-label", "Show user menu");

    const moreUserCardIcon = document.createElement("i");
    moreUserCardIcon.dataset.lucide = "ellipsis-vertical";
    moreUserCardIcon.classList.add("more-user-card-icon");

    moreUserCardButton.append(moreUserCardIcon);
    cardAdditionalBlock.append(moreUserCardButton);
    card.append(cardAdditionalBlock);

    // User profile
    const cardUserProfile = document.createElement("div");
    cardUserProfile.classList.add("user-profile", "card-user-profile");

    const profileAvatar = document.createElement("img");
    profileAvatar.setAttribute("src", "./img/user-default.jpg");
    profileAvatar.setAttribute("alt", `${user.name ?? "Unknown"} avatar`);

    const userProfileText = document.createElement("div");
    userProfileText.classList.add("user-profile-text", "card-user-text");

    const userName = document.createElement("h3");
    userName.textContent = user.name ?? "Unknown";

    const userEmail = document.createElement("p");
    userEmail.textContent = user.email ?? "Unknown";

    const userCompany = document.createElement("p");
    userCompany.textContent = user.company ?? "Unknown";

    userProfileText.append(userName, userEmail, userCompany);
    cardUserProfile.append(profileAvatar, userProfileText);
    card.append(cardUserProfile);

    // Statuses block
    const statusesBlock = document.createElement("div");
    statusesBlock.classList.add("statuses-block");

    const userStatus = document.createElement("span");
    userStatus.classList.add("user-status", `status-${user.status?.toLowerCase()}`);
    userStatus.textContent = user.status ?? "No status";

    const userRole = document.createElement("span");
    userRole.classList.add("user-status", `status-${user.role?.toLowerCase().replace(' ', '-')}`);
    userRole.textContent = user.role ?? "No role";

    statusesBlock.append(userStatus, userRole);
    card.append(statusesBlock);

    // User info
    const userInfo = document.createElement("p");
    userInfo.classList.add("user-info");
    userInfo.textContent = `Based in ${user.city ?? "an unknown location"}.`;
    card.append(userInfo);

    // Cards buttons
    const cardsButtonSection = document.createElement("div");
    cardsButtonSection.classList.add("cards-button-section");

    const viewCardButton = document.createElement("button");
    viewCardButton.type = "button";
    viewCardButton.classList.add("button", "typeB-button", "view-user-button");

    const viewCardIcon = document.createElement("i");
    viewCardIcon.dataset.lucide = "eye";
    viewCardIcon.classList.add("view-user-icon");

    const viewCardText = document.createElement("span");
    viewCardText.textContent = "View";

    viewCardButton.append(viewCardIcon);
    viewCardButton.append(viewCardText);

    const messageCardButton = document.createElement("button");
    messageCardButton.type = "button";
    messageCardButton.classList.add("button", "typeB-button", "message-user-button");

    const messageCardIcon = document.createElement("i");
    messageCardIcon.dataset.lucide = "message-square-more";
    messageCardIcon.classList.add("message-user-icon");

    const messageCardText = document.createElement("span");
    messageCardText.textContent = "Message";

    messageCardButton.append(messageCardIcon);
    messageCardButton.append(messageCardText);

    cardsButtonSection.append(viewCardButton);
    cardsButtonSection.append(messageCardButton);
    card.append(cardsButtonSection);

    return card;
}

export function renderUsersCards(users, count = -1, start = 0) {
    if (users.length === 0) {
        renderUsersNotFound();
        return;
    }

    cardsContainer.hidden = false;
    cardsLoading.hidden = true;
    cardsError.hidden = true;
    cardsEmpty.hidden = true;

    if(count > 0) {
        users = users.slice(start, count + start);
    }

    const userCards = users.map((user) => createUserCard(user));
    cardsContainer.replaceChildren(...userCards);
    lucide.createIcons();
}

export function renderUsersLoading() {
    cardsContainer.hidden = true;
    cardsLoading.hidden = false;
    cardsError.hidden = true;
    cardsEmpty.hidden = true;
}

export function renderUsersLoadingError() {
    cardsContainer.hidden = true;
    cardsLoading.hidden = true;
    cardsError.hidden = false;
    cardsEmpty.hidden = true;
}

export function renderUsersNotFound() {
    cardsContainer.hidden = true;
    cardsLoading.hidden = true;
    cardsError.hidden = true;
    cardsEmpty.hidden = false;
}

// Activities render
// =================

const activitiesContainer = document.querySelector(".activity-container");
const activitiesLoading = document.querySelector(".activity-loading");
const activitiesError = document.querySelector(".activity-error");
const activitiesEmpty = document.querySelector(".activity-empty");

function createActivityCard(activity) {
    const activityCard = document.createElement("article");
    activityCard.classList.add("user-profile", "activity");

    // Image / icon
    if(activity.isIcon) {
        const iconContainer = document.createElement("i");
        iconContainer.classList.add("activity-icon-container", `activity-${activity.actionColor}`);

        const icon = document.createElement("i");
        icon.dataset.lucide = activity.image;
        icon.classList.add("activity-icon");

        iconContainer.append(icon);
        activityCard.append(iconContainer);
    } else {
        const image = document.createElement("img");
        image.setAttribute("src", activity.image);
        image.setAttribute("alt", `${activity.name} avatar`);
        activityCard.append(image);
    }

    // Activity text
    const activityText = document.createElement("div");
    activityText.classList.add("activity-text");

    const actionUser = document.createElement("h3");
    actionUser.textContent = activity.name;

    const action = document.createElement("p");
    action.textContent = activity.action;

    activityText.append(actionUser, action);
    activityCard.append(activityText);

    // Activity time
    const activityTime = document.createElement("p");
    activityTime.classList.add("activity-time");
    activityTime.textContent = activity.timing;
    activityCard.append(activityTime);

    return activityCard;
}

export function renderActivitiesCards(activities) {
    if (activities.length === 0) {
        renderActivitiesNotFound();
        return;
    }

    activitiesContainer.hidden = false;
    activitiesLoading.hidden = true;
    activitiesError.hidden = true;
    activitiesEmpty.hidden = true;

    const activitiesCards = activities.map((activity) => createActivityCard(activity));
    activitiesContainer.replaceChildren(...activitiesCards);
    lucide.createIcons();
}

export function renderActivitiesLoading() {
    activitiesContainer.hidden = true;
    activitiesLoading.hidden = false;
    activitiesError.hidden = true;
    activitiesEmpty.hidden = true;
}

export function renderActivitiesLoadingError() {
    activitiesContainer.hidden = true;
    activitiesLoading.hidden = true;
    activitiesError.hidden = false;
    activitiesEmpty.hidden = true;
}

export function renderActivitiesNotFound() {
    activitiesContainer.hidden = true;
    activitiesLoading.hidden = true;
    activitiesError.hidden = true;
    activitiesEmpty.hidden = false;
}