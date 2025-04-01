function showToast(message, type = "info", delay = 4000) {
    const toastContainer = document.getElementById("toast-container");
    if (!toastContainer) return;

    const typeClasses = {
        success: "bg-success text-white",
        info: "bg-primary text-white",
        warning: "bg-warning text-dark",
        error: "bg-danger text-white"
    };

    const toastEl = document.createElement("div");
    toastEl.className = `toast align-items-center show toast-custom ${typeClasses[type] || typeClasses.info}`;
    toastEl.setAttribute("role", "alert");
    toastEl.setAttribute("aria-live", "assertive");
    toastEl.setAttribute("aria-atomic", "true");

    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    toastContainer.appendChild(toastEl);

    setTimeout(() => {
        toastEl.classList.remove("show");
        toastEl.classList.add("hide");
        toastEl.addEventListener("transitionend", () => toastEl.remove());
    }, delay);
}
