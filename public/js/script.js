"use strict";

document.addEventListener("keyup", (e) => {
	if (e.target.matches("#post-textarea")){
		const textarea = document.querySelector("#post-textarea");
		if (!textarea) return;
		const value = textarea.value.trim();

		const submitButton = document.querySelector("#submit-post-button");
		if (!submitButton) return;

		if (value === ""){
			submitButton.disabled = true;
			submitButton.style.cursor = null;
		} else {
			submitButton.disabled = false;
			submitButton.style.cursor = "pointer";
		}
	}
});


function getRootIdElement(element){
	const isRoot = element.classList.contains("post");
	const root = isRoot ? element : element.closest(".post");
	return root.getAttribute("data-id");
}
