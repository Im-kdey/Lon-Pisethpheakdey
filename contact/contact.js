
const form = document.querySelector("#contactForm");
const sendBtn = document.querySelector("#sendBtn");
const formStatus = document.querySelector("#formStatus");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form information
    const formData = new FormData(form);

    const data = {
        name: formData.get("name").trim(),
        email: formData.get("email").trim(),
        subject: formData.get("subject").trim(),
        message: formData.get("message").trim()
    };

    // Check empty fields
    if (
        !data.name ||
        !data.email ||
        !data.subject ||
        !data.message
    ) {
        formStatus.textContent = "Please fill in all fields.";
        return;
    }

    // Loading state
    sendBtn.disabled = true;
    sendBtn.innerHTML = `
        Sending...
        <i class="bi bi-hourglass-split"></i>
    `;

    formStatus.textContent = "";

    try {
        // Send data to Vercel API
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Failed to send message."
            );
        }

        // Success
        formStatus.textContent =
            "✓ Message sent successfully!";

        formStatus.style.color = "#4ade80";

        form.reset();

    } catch (error) {

        // Error
        console.error("Contact form error:", error);

        formStatus.textContent =
            "✕ " + (error.message || "Something went wrong.");

        formStatus.style.color = "#f87171";

    } finally {

        // Reset button
        sendBtn.disabled = false;

        sendBtn.innerHTML = `
            Send Message
            <i class="bi bi-send"></i>
        `;
    }
});
