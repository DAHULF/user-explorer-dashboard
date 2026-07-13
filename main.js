"use strict";

lucide.createIcons();

const navSidebar = document.querySelector(".nav-sidebar");
const showNavSidebarBtn = document.querySelector(".show-nav-sidebar-icon");
const hideNavSidebarBtn = document.querySelector(".hide-nav-sidebar-icon");

//navSidebar.classList.toggle('nav-sidebar-displayed', true);

showNavSidebarBtn.addEventListener("click", () => {
    navSidebar.classList.toggle('nav-sidebar-displayed', true);
});

hideNavSidebarBtn.addEventListener("click", () => {
    navSidebar.classList.toggle('nav-sidebar-displayed', false);
});