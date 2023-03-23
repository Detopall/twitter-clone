"use strict";

getPosts();

async function getPosts(){
	try {
		const postsContainer = document.querySelector(".post-container");
		if (!postsContainer) return;

		const response = await fetch("/api/posts");
		const jsonData = await response.json();
		outputPosts(jsonData, postsContainer);
	} catch (err) {
		console.error("Something went wrong: ", err);
	}
}


function outputPosts(results, container){
	container.innerHTML = "";

	results.forEach(res => {
		const html = createPostHtml(res);
		container.insertAdjacentHTML("afterbegin", html);
	});

	if (results.length === 0){
		container.insertAdjacentHTML("afterbegin", `<p>No content to show.</p>`);
	}
}

