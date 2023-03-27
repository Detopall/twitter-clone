"use strict";

const urlParams = new URLSearchParams(window.location.search);
const searchTab = urlParams.get("tab");

const searchInput = document.querySelector("#search");
searchInput.addEventListener("keyup", getSearch);

createSearchTabs();
addingPostsOrUsers(searchInput.value);

function getSearch() {
	addingPostsOrUsers(searchInput.value);
}

async function addingPostsOrUsers(searchInput) {
	try {
	const postsContainer = document.querySelector(".post-container");
	const userContainer = document.querySelector(".user-container");
	if (!postsContainer) return;

	if (searchTab === "profiles") {
		postsContainer.classList.add("hidden");
		userContainer.classList.remove("hidden");

		document.querySelector("#search-profiles").classList.add("active");
		document.querySelector("#search-posts").classList.remove("active");

		await loadSearchUsers(userContainer, searchInput);
	} else {
		postsContainer.classList.remove("hidden");
		userContainer.classList.add("hidden");

		document.querySelector("#search-profiles").classList.remove("active");
		document.querySelector("#search-posts").classList.add("active");

		await loadSearchPosts(postsContainer, searchInput);
	}
	} catch (err) {
	console.error("Something went wrong: ", err);
	}
}

async function loadSearchUsers(userContainer, searchInput) {
	const params = new URLSearchParams({ search: searchInput });
	const response = await fetch("/api/users?" + params);
	const jsonData = await response.json();
	outputUsers(jsonData, userContainer);
}

async function loadSearchPosts(postsContainer, searchInput) {
	const params = new URLSearchParams({ search: searchInput });
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


function outputUsers(userData, userContainer){
	if (!userData) return;

	userContainer.innerHTML = "";

	if (!Array.isArray(userData)){
		userData = [userData];
	}

	if (userData.length === 0){
		userContainer.insertAdjacentHTML("afterbegin", `<p class="no-posts">No content to show.</p>`);
	}

	userData.forEach(user => {
		const html = createUserHtml(user);
		userContainer.insertAdjacentHTML("beforeend", html);
	});
}

function createUserHtml(user){
	if (!user) return;
	const displayName = `${user.firstname} ${user.lastname}`;

	return `
	<div class="${user._id} user">
		<div class="user-img-container">
			<img src="../../${user.profilePic}" alt='profile-pic'>
		</div>
		<div class="header">
			<a href="/profile/${user.username}" class="display-name">${displayName}</a>
			<span class="username">@${user.username}</span>
		</div>
	</div>
	`;
}
