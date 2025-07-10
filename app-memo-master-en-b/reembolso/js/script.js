document.addEventListener("DOMContentLoaded", () => {
    const steps = Array.from(document.querySelectorAll(".form-step"));
    const nameForm = document.getElementById("nameStep");
    const emailForm = document.getElementById("emailStep");
    const reasonForm = document.getElementById("reasonStep");

    const nameInput = document.getElementById("nameInput");
    const emailInput = document.getElementById("emailInput");
    const reasonInput = document.getElementById("reasonInput");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const reasonError = document.getElementById("reasonError");

    const emailBackBtn = document.getElementById("emailBackBtn");
    const reasonBackBtn = document.getElementById("reasonBackBtn");

    let currentStep = 0;

    function showStep(stepIndex) {
        steps.forEach((stepEl, idx) => {
            if (idx === stepIndex) {
                stepEl.classList.add("active-step");
            } else {
                stepEl.classList.remove("active-step");
            }
        });
    }

    function validateName() {
        if (!nameInput.value.trim()) {
            nameError.textContent = "Please enter your name.";
            nameInput.focus();
            return false;
        }
        nameError.textContent = "";
        return true;
    }

    function validateEmail() {
        if (!emailInput.value.trim()) {
            emailError.textContent = "Please enter the email address.";
            emailInput.focus();
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            emailError.textContent = "Please provide a valid email address.";
            emailInput.focus();
            return false;
        }
        emailError.textContent = "";
        return true;
    }

    function validateReason() {
        if (!reasonInput.value.trim()) {
            reasonError.textContent = "Please state the reason for the refund.";
            reasonInput.focus();
            return false;
        }
        reasonError.textContent = "";
        return true;
    }

    nameForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (validateName()) {
            currentStep = 1;
            showStep(currentStep);
        }
    });

    emailForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (validateEmail()) {
            currentStep = 2;
            showStep(currentStep);
        }
    });

    reasonForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (validateReason()) {
            currentStep = 3; // Go to processing step
            showStep(currentStep);
            // Simulate processing
            setTimeout(() => {
                currentStep = 4; // Go to completed step
                showStep(currentStep);
            }, 3000); // 3 seconds processing time
        }
    });

    emailBackBtn.addEventListener("click", () => {
        currentStep = 0;
        showStep(currentStep);
    });

    reasonBackBtn.addEventListener("click", () => {
        currentStep = 1;
        showStep(currentStep);
    });

    // Show the first step initially and ensure others are hidden
    showStep(currentStep);
});


