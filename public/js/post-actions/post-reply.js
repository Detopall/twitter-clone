"use strict";

document.addEventListener("click", async (e) => {
	if (!e.target.closest(".reply-button")) return;
	const replyButton = e.target.closest(".reply-button");
	const postId = getRootIdElement(replyButton);
	await getPost(postId);
});


async function getPost(postId){
	const ogPostContainer = document.querySelector("#original-post-container");
	if (!ogPostContainer) return;
	ogPostContainer.innerHTML = "";

	try {
		const response = await fetch(`/api/posts/${postId}`);
		const jsonData = await response.json();
		
		outputPosts(jsonData, ogPostContainer);
	} catch (err) {
		console.error("Something went wrong: ", err);
	}
}
