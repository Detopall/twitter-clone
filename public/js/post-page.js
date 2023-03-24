"use strict";

getPosts();

async function getPosts(){
	try {
		const postsContainer = document.querySelector(".post-container");
		if (!postsContainer) return;

		const response = await fetch(`/api/posts/${POST_ID}`);
		const jsonData = await response.json();
		outputPostsWithReplies(jsonData, postsContainer);
	} catch (err) {
		console.error("Something went wrong: ", err);
	}
}

