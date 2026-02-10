const sidebarButtons = document.querySelectorAll(".sidebar-btn");
const tabContents = document.querySelectorAll(".tab-content");

sidebarButtons.forEach(sidebarButton => {
    sidebarButton.addEventListener("click", () => {
        sidebarButtons.forEach(sidebarBtn => sidebarBtn.classList.remove("active"));
        tabContents.forEach(tabContent => tabContent.classList.remove("active"));
        sidebarButton.classList.add("active");
        document.getElementById(sidebarButton.dataset.tab)
            .classList.add("active");
    });
});