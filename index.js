const resultsContainer = document.querySelector(".results-container");

const searchInput = document.querySelector(".search-input");

function debounce(mainFunction, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      mainFunction(...args);
    }, delay);
  };
}

let result = [];

function sendRequest(query) {
  fetch(`http://localhost:3002/api/search?q=${query}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      result = [
        ...data.items.slice(0, 5).map((repo) => {
          return {
            name: repo.name,
            owner: repo.owner.login,
            stars: repo.stargazers_count,
          };
        }),
      ];

      searchElem();
      console.log(result);
    })
    .catch((error) => {
      // Обработка ошибок
      console.error("Ошибка при получении данных:", error);
    });
}

const debouncedFetchData = debounce(sendRequest, 250);

searchInput.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/\s/g, "");
  if (searchInput.value !== "") {
    const query = e.target.value;
    debouncedFetchData(query);
  }
});

function searchElem() {
  removeElements();
  let searchElem = document.querySelector(".autocomplete");
  for (let i of result) {
    let listItem = document.createElement("li");
    if (
      i.name.toLowerCase().startsWith(searchInput.value.toLowerCase()) &&
      searchInput.value !== "" && result.length > 0
    ) {
      listItem.classList.add("list-items");
      let word = i.name.substr(searchInput.value);
      listItem.textContent = word;
      listItem.addEventListener("click", function () {
        result = [];
        searchInput.value = ""; // Очищаем поле ввода
        removeElements(); // Очищаем список подсказок
        displayResultItem(i); // Вызываем функцию для отображения элемента
      });
      searchElem.appendChild(listItem);
    }
  }
}

function displayResultItem(item) {
  // Функция для отображения элемента
  let resultItem = document.createElement("ul");
  resultItem.classList.add("result-Item");
  resultItem.innerHTML = `
    <li>Name: ${item.name}</li>
    <li>Owner: ${item.owner}</li>
    <li>Stars: ${item.stars}</li>
    <button class="resultItemBtn" >DELETE</button>`;
  document.querySelector(".result").appendChild(resultItem);

  // Обработчик удаления
  const deleteButton = resultItem.querySelector(".resultItemBtn");
  deleteButton.addEventListener("click", () => {
    deleteResultItem(resultItem); // Передаем имя и элемент для удаления
  });
}

function deleteResultItem(resultItem) {
  resultItem.parentNode.removeChild(resultItem);
}

function removeElements() {
  let items = document.querySelectorAll(".list-items");
  items.forEach((item) => {
    item.remove();
  });
}
