"use strict";

document.addEventListener("keyup", (e) => {
	if (e.target.matches("#post-textarea")){
		const postTxtArea = document.querySelector("#post-textarea");
		const submitButton = document.querySelector("#submit-post-button");
		textAreaBehaviour(postTxtArea, submitButton);
	}
	if (e.target.matches("#reply-textarea")) {
		const replyTxtArea = document.querySelector("#reply-textarea");
		const replyButton = document.querySelector("#submit-reply-button");
		textAreaBehaviour(replyTxtArea, replyButton);
	}
});


function textAreaBehaviour(textarea, button){
	if (!textarea) return;	
	if (!button) return;

	const value = textarea.value.trim();
	if (value === ""){
		button.disabled = true;
		button.style.cursor = null;
	} else {
		button.disabled = false;
		button.style.cursor = "pointer";
	}
}

function getRootIdElement(element){
	const isRoot = element.classList.contains("post");
	const root = isRoot ? element : element.closest(".post");
	return root.getAttribute("data-id");
}
