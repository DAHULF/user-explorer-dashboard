"use strict";

const USERS_API_URL = "https://jsonplaceholder.typicode.com/users";

export const states = {
    NOT_LOADED: "not-loaded",
    LOADING: "loading",
    ERROR: "error",
    NOT_FOUND: "not-found",
    LOADED: "loaded"
};

const usersStatuses = [
    "Active",
    "Pending",
    "Inactive",
    "Blocked"
];

const usersRoles = [
    "Verified",
    "Team Lead",
    "Remote",
    "Contractor",
    "Review",
    "On Leave"
];

let usersLoadState = states.NOT_LOADED;
let users = [];

let activitiesLoadState = states.NOT_LOADED;
let activities = [];

async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchUsers() {
    const response = await fetch(USERS_API_URL);

    if(!response.ok) {
        throw new Error(`Failed to load users: ${response.status}`);
    }

    users = await response.json();
    return users;
}

function normalizeUsers(users) {
    return users.map((user) => {
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                company: user.company?.name ?? "No company",
                city: user.address?.city ?? "Unknown location",
                status: usersStatuses[Math.floor(Math.random() * usersStatuses.length)],
                role: usersRoles[Math.floor(Math.random() * usersRoles.length)],
                isPremium: (Math.random() < 0.25)
            }
        });
}

export async function loadUsers() {
    try{
        usersLoadState = states.LOADING;
        await delay(2000);
        await fetchUsers();
        users = normalizeUsers(users);

        users = [...users, ...users, ...users, ...users, ...users];

        usersLoadState = users.length === 0 
                        ? states.NOT_FOUND
                        : states.LOADED;

        return users;
    } catch (error) {
        usersLoadState = states.ERROR;
        throw new Error("Failed to load users");
    }
}

export function getUsers() {
    return users;
}

export function getUsersLoadState() {
    return usersLoadState;
}

export async function loadActivities() {
    try {
        activitiesLoadState = states.LOADING;
        await delay(2000);

        if(Math.random() <= 0.25) {
            throw new Error("Failed to load activities");
        }

        activities = [
            {
                name: "Sophia Bennett",
                action: "updated her profile",
                timing: "2m ago",
                image: "./img/user-default.jpg",
                isIcon: false,
                actionColor: ""
            },
            {
                name: "Noah Wilson",
                action: "joined the team",
                timing: "1h ago",
                image: "user-plus",
                isIcon: true,
                actionColor: "green"
            },
            {
                name: "Ethan Parker",
                action: "sent a message",
                timing: "3h ago",
                image: "message-square-more",
                isIcon: true,
                actionColor: "purple"
            },
            {
                name: "Ava Martinez",
                action: "status changed to Active",
                timing: "5h ago",
                image: "user-round-pen",
                isIcon: true,
                actionColor: "yellow"
            },
            {
                name: "Isabella Garcia",
                action: "went on leave",
                timing: "1d ago",
                image: "user-round-minus",
                isIcon: true,
                actionColor: "red"
            }
        ];

        if(Math.random() > 0.25) {
            activitiesLoadState = states.LOADED;
        } else {
            activities = [];
            activitiesLoadState = states.NOT_FOUND;
        }
        
        return activities;
    } catch (error) {
        activitiesLoadState = states.ERROR;
        throw new Error(error.message);
    }
}

export function getActivities() {
    return activities;
}

export function getActivitiesLoadState() {
    return activitiesLoadState;
}