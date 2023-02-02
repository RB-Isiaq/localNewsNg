"use strict";
const categoryTitle = document.querySelectorAll(".category-title");
const allCategoryPosts = document.querySelectorAll(".all");
const mainContainer = document.querySelector(".posts-main-container");
const API_KEY = "pub_164004e12922bca57f5bc3b4114a7db58aeea";

const spinner = `
<div class="lds-roller">
<div></div>
<div></div>
<div></div>
<div></div>
<div></div>
<div></div>
<div></div>
<div></div>
</div>
`;

for (let i = 0; i < categoryTitle.length; i++) {
  categoryTitle[i].addEventListener(
    "click",
    filterPosts.bind(this, categoryTitle[i])
  );
}

mainContainer.insertAdjacentHTML("afterbegin", spinner);
fetchNews("top");

function filterPosts(item) {
  changeActivePosition(item);
  mainContainer.insertAdjacentHTML("afterbegin", spinner);
  fetchNews(item.id);

  for (let i = 0; i < allCategoryPosts.length; i++) {
    if (allCategoryPosts[i].classList.contains(item.attributes.id.value)) {
      allCategoryPosts[i].style.display = "block";
    } else {
      allCategoryPosts[i].style.display = "none";
    }
  }
}

function changeActivePosition(activeItem) {
  for (let i = 0; i < categoryTitle.length; i++) {
    categoryTitle[i].classList.remove("active");
  }
  activeItem.classList.add("active");
}

async function fetchNews(category) {
  try {
    const res = await fetch(
      `https://newsdata.io/api/1/news?apikey=${API_KEY}&language=en&category=${category}&country=ng`,
      {
        mode: "no-cors",
      }
    );
    if (!res.ok) {
      throw new Error("Request Limit reached!. Please try again Tommorow.");
    }
    const data = await res.json();
    const results = data.results;

    const newHtml = results.map((res) => {
      const newDate = res.pubDate.split(" ").slice(0, 1).join("");
      const today = new Date(newDate);
      const options = {
        day: "2-digit",
        month: "long",
        year: "numeric",
      };
      const todaysDate = new Intl.DateTimeFormat(
        navigator.locale,
        options
      ).format(today);

      const contents = res.content.split(" ").slice(0, 40).join(" ");

      function image(img, categ) {
        if ((img === null && categ === "business") || categ === "politics") {
          const id = Math.trunc(Math.random() * 4) + 1;
          return (img = `images/${res.category}-${id}.jpg`);
        } else if (img === null) {
          return (img = `https://source.unsplash.com/1600x900/?${res.category}`);
        } else {
          return img;
        }
      }
      const html = `
      <div class="all ${category}">
      <div class="post-img">
            <img src="${image(res.image_url, category)}" alt="post" />
            <span class="category-name">${category}</span>
        </div>

        <div class="post-content">
        <div class="post-content-top">
          <span><i class="fas fa-calendar"></i>${todaysDate}</span>
          <span><img src='./images/nigeria-flag-icon.svg' class='logo' /> NIG</span>
          </div>
          <h2>${res.title}</h2>
          <p>
          ${contents} ...
          </p>
          </div>
          <button type="button" class="read-btn"><a href="${
            res.link
          }" target="_blank">Read Now</a></button>
          </div>
          `;

      return html;
    });

    newHtml.sort();
    mainContainer.innerHTML = "";
    newHtml.forEach((html) =>
      mainContainer.insertAdjacentHTML("afterbegin", html)
    );
  } catch (error) {
    console.log(error.message);
    mainContainer.innerHTML = "";
    const html = `<p>${error.message}</p>`;
    mainContainer.insertAdjacentHTML("afterbegin", html);
  }
}
