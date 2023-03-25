"use strict";

document.addEventListener("click", async (e) => {
	if (!e.target.closest(".delete-post-button")) return;
	const deletePostButton = e.target.closest(".delete-post-button");
	const postId = getRootIdElement(deletePostButton);

	const submitDeleteButton = document.querySelector("#delete-post-button");
	if (!submitDeleteButton) return;
	submitDeleteButton.setAttribute("data-id", postId);
});

document.addEventListener("click", async (e) => {
	if (!e.target.closest("#delete-post-button")) return;
	const submitButton = document.querySelector("#delete-post-button");
	const postId = submitButton.getAttribute("data-id");
	await deletePost(postId);
});

async function deletePost(postId){
	try {
		await fetch(`/api/posts/${postId}`, getDeleteOptions("DELETE"));
	} catch (err) {
		console.error("Something went wrong: ", err);
	}
	location.reload();
}

function getDeleteOptions(method){
	return {
		method: method,
		headers: {
			"Content-Type": "application/json"
		}
	}
}