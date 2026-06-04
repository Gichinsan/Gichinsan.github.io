// GitHub API Configuration
const GITHUB_USER = 'Gichinsan';
const GITHUB_API = 'https://api.github.com/users/' + GITHUB_USER + '/repos';

// Load header
function loadHeader() {
    var headerElement = document.getElementById("header");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            headerElement.innerHTML = this.responseText;
        }
    };
    xhttp.open("GET", "header.html", true);
    xhttp.send();
}

// Load sidebar navigation
function loadNavigation() {
    var sidebarElement = document.getElementById("sidebar");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            sidebarElement.innerHTML = this.responseText;
            loadGithubProjects();
        }
    };
    xhttp.open("GET", "nav.html", true);
    xhttp.send();
}

// Load GitHub projects dynamically
function loadGithubProjects() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var repos = JSON.parse(this.responseText);
            // Filter public repos only and exclude the user repo itself
            repos = repos.filter(repo => !repo.private && repo.name !== GITHUB_USER + '.github.io' && repo.name !== GITHUB_USER);
            addProjectsToMenu(repos);
        }
    };
    xhttp.open("GET", GITHUB_API, true);
    xhttp.send();
}

// Add projects to menu
function addProjectsToMenu(repos) {
    var menuList = document.getElementById('menu-list');
    repos.forEach(function(repo, index) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#';
        a.textContent = (index + 1) + '. ' + repo.name;
        a.setAttribute('data-repo', repo.name);
        a.onclick = function(e) {
            e.preventDefault();
            loadProjectReadme(repo);
        };
        li.appendChild(a);
        menuList.appendChild(li);
    });
    
    // Add click handler for Home
    var homeLink = menuList.querySelector('a[data-action="home"]');
    if (homeLink) {
        homeLink.onclick = function(e) {
            e.preventDefault();
            loadAbout();
        };
    }
}

// Load About content on Home click
function loadAbout() {
    var contentElement = document.getElementById("content");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Extract content from about.html
            var parser = new DOMParser();
            var doc = parser.parseFromString(this.responseText, 'text/html');
            var aboutDiv = doc.querySelector('.aboutbg');
            if (aboutDiv) {
                contentElement.innerHTML = aboutDiv.innerHTML;
            } else {
                contentElement.innerHTML = this.responseText;
            }
        }
    };
    xhttp.open("GET", "about.html", true);
    xhttp.send();
}

// Load README from GitHub project
function loadProjectReadme(repo) {
    var contentElement = document.getElementById("content");
    
    // Try to fetch README.md from GitHub
    var readmeUrl = 'https://raw.githubusercontent.com/' + GITHUB_USER + '/' + repo.name + '/main/README.md';
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                // Convert markdown to HTML (simple conversion)
                var html = markdownToHtml(this.responseText);
                contentElement.innerHTML = html;
            } else {
                // Try master branch if main doesn't exist
                var readmeUrlMaster = 'https://raw.githubusercontent.com/' + GITHUB_USER + '/' + repo.name + '/master/README.md';
                var xhttp2 = new XMLHttpRequest();
                xhttp2.onreadystatechange = function() {
                    if (this.readyState == 4) {
                        if (this.status == 200) {
                            var html = markdownToHtml(this.responseText);
                            contentElement.innerHTML = html;
                        } else {
                            contentElement.innerHTML = '<div class="aboutbg"><h2>' + repo.name + '</h2><p>README nicht gefunden. Besuche das Repository: <a href="' + repo.html_url + '" target="_blank">' + repo.html_url + '</a></p><p>' + repo.description + '</p></div>';
                        }
                    }
                };
                xhttp2.open("GET", readmeUrlMaster, true);
                xhttp2.send();
            }
        }
    };
    xhttp.open("GET", readmeUrl, true);
    xhttp.send();
}

// Simple Markdown to HTML converter
function markdownToHtml(markdown) {
    var html = '<div class="aboutbg">';
    
    // Convert headings
    html = markdown.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    
    // Convert bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^_]+?)__/g, '<strong>$1</strong>');
    
    // Convert italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Convert line breaks to paragraphs
    var paragraphs = html.split('\n\n');
    html = paragraphs.map(function(p) {
        p = p.trim();
        if (p && !p.match(/^<h[1-3]|^<ul|^<ol|^<li|^<blockquote|^<pre/)) {
            return '<p>' + p + '</p>';
        }
        return p;
    }).join('');
    
    html += '</div>';
    return html;
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function() {
    loadHeader();
    loadNavigation();
    loadAbout(); // Load about content on startup
});
