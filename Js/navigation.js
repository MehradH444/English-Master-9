/* ==========================================
   English Master 9 - Navigation Module (SPA Router)
   ================================---------- */

document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");
    const pageTitle = document.getElementById("page-title");
    const sidebar = document.getElementById("sidebar");
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");

    // Handle Route Changes
    function handleRoute() {
        const hash = window.location.hash.substring(1) || "dashboard";
        
        // Update active class on links
        navLinks.forEach(link => {
            if (link.getAttribute("data-target") === hash) {
                link.classList.add("active");
                pageTitle.textContent = link.textContent.trim();
            } else {
                link.classList.remove("active");
            }
        });

        // Show corresponding view (For now, fallback to dashboard if view doesn't exist yet)
        const targetViewId = `${hash}-view`;
        let targetView = document.getElementById(targetViewId);

        // If specific view section is not yet created in HTML, create a placeholder view dynamically
        if (!targetView) {
            const viewContainer = document.getElementById("view-container");
            targetView = document.createElement("section");
            targetView.id = targetViewId;
            targetView.className = "content-view";
            targetView.innerHTML = `
                <div class="welcome-banner">
                    <h2>بخش ${pageTitle.textContent}</h2>
                    <p>این بخش در حال توسعه کامل و اتصال به داده‌های تخصصی پایه نهم (Prospect 3) است.</p>
                </div>
            `;
            viewContainer.appendChild(targetView);
        }

        // Toggle views visibility
        document.querySelectorAll(".content-view").forEach(view => {
            view.classList.remove("active");
        });
        targetView.classList.add("active");

        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 768) {
            sidebar.classList.remove("open");
        }
    }

    // Listen to hash change
    window.addEventListener("hashchange", handleRoute);
    
    // Initial route check on load
    if (window.location.hash) {
        handleRoute();
    }

    // Mobile menu toggle
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("open");
        });
    }
});
