"use strict";

document.addEventListener("click", async (e) => {
	if (!e.target.closest(".reply-button")) return;
	const replyButton = e.target.closest(".reply-button");
	const postId = getRootIdElement(replyButton);
	await getPost(postId);
});


async function getPost(postId){
	try {
		const response = await fetch(`/api/posts/${postId}`);
		const jsonData = await response.json();
		console.log(jsonData);
	} catch (err) {
		console.error("Something went wrong: ", err);
	}
}
