"use strict";

const urlParams = new URLSearchParams(window.location.search);
const searchTab = urlParams.get("tab");

const searchInput = document.querySelector("#search");
searchInput.addEventListener("keyup", getSearch);

createSearchTabs();

function getSearch() {
	addingPostsOrUsers(searchInput.value);
}

async function addingPostsOrUsers(searchInput) {
	try {
	const postsContainer = document.querySelector(".post-container");
	if (!postsContainer) return;

	if (searchTab === "profiles") {
		document.querySelector("#search-profiles").classList.add("active");
		document.querySelector("#search-posts").classList.remove("active");

		await loadSearchUsers(postsContainer, searchInput);
	} else {
		document.querySelector("#search-profiles").classList.remove("active");
		document.querySelector("#search-posts").classList.add("active");

		await loadSearchPosts(postsContainer, searchInput);
	}
	} catch (err) {
	console.error("Something went wrong: ", err);
	}
}

async function loadSearchUsers(postsContainer, searchInput) {
	const params = new URLSearchParams({ search: searchInput });
	console.log(params);
	const response = await fetch("/api/users?" + params);
	const jsonData = await response.json();
	console.log(jsonData);
	//outputPosts(jsonData, postsContainer);
}

async function loadSearchPosts(postsContainer, searchInput) {
	const params = new URLSearchParams({ search: searchInput });
	console.log(params);
	const response = await fetch("/api/posts?" + params);
	const jsonData = await response.json();
	outputPosts(jsonData, postsContainer);
}

function createSearchTabs() {
	const tabsContainer = document.querySelector(".tabs-container");

	const html = `
		<a id="search-posts" href="/search/?tab=posts" class="tab ${
		searchTab === "posts" ? "active" : ""
		}">Posts</a>
		<a id="search-profiles" href="/search/profiles?tab=profiles" class="tab ${
		searchTab === "profiles" ? "active" : ""
		}">Profiles</a>
	`;

	tabsContainer.insertAdjacentHTML("beforeend", html);
}
