
  const reposUrl = "https://api.github.com/users/Gichinsan/repos?type=public";

  fetch(reposUrl)
    .then(response => response.json())
    .then(data => {
      const repos = document.getElementById("repos");

      data.forEach(repo => {
        const repoLink = document.createElement("a");
        repoLink.href = repo.html_url;
        repoLink.textContent = repo.name;

        const listItem = document.createElement("li");
        listItem.appendChild(repoLink);

        repos.appendChild(listItem);
      });
    })
    .catch(error => {
      console.error(error);
    });

