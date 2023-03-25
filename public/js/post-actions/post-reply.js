"use strict";

document.addEventListener("click", async (e) => {
	if (!e.target.closest(".reply-button")) return;
	const replyButton = e.target.closest(".reply-button");
	const postId = getRootIdElement(replyButton);
	
	const submitReplyButton = document.querySelector("#submit-reply-button");
	if (!submitReplyButton) return;
	submitReplyButton.setAttribute("data-id", postId);

	await getPost(postId);
});

document.addEventListener("click", async (e) => {
	if (!e.target.closest("#submit-reply-button")) return;
	const submitButton = document.querySelector("#submit-reply-button");
	const textarea = document.querySelector("#reply-textarea");

	const data = {
		content: textarea.value.trim(),
		replyTo: submitButton.getAttribute("data-id")
	};

	await createPost(textarea, submitButton, data);
});

async function getPost(postId){
	const ogPostContainer = document.querySelector("#original-post-container");
	if (!ogPostContainer) return;
	ogPostContainer.innerHTML = "";

	try {
		const response = await fetch(`/api/posts/${postId}`);
		const jsonData = await response.json();
		
		outputPosts(jsonData.postData, ogPostContainer);
	} catch (err) {
		console.error("Something went wrong: ", err);
	}
}
