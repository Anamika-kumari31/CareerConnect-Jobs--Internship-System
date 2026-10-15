
const jobs = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "PixelCraft Studio",
    type: "Internship",
    mode: "Remote",
    location: "Remote",
    skills: "HTML, CSS, JavaScript"
  },
  {
    id: 2,
    title: "Java Developer Trainee",
    company: "CodeSpring Labs",
    type: "Full-time",
    mode: "Hybrid",
    location: "Noida",
    skills: "Java, OOP, SQL"
  },
  {
    id: 3,
    title: "Data Analyst Intern",
    company: "InsightWorks",
    type: "Internship",
    mode: "Hybrid",
    location: "Noida",
    skills: "Excel, SQL, Python"
  },
  {
    id: 4,
    title: "UI/UX Design Intern",
    company: "Northstar Digital",
    type: "Internship",
    mode: "Remote",
    location: "Remote",
    skills: "Figma, UI Design"
  },
  {
    id: 5,
    title: "QA Testing Associate",
    company: "BrightByte Systems",
    type: "Full-time",
    mode: "On-site",
    location: "Noida",
    skills: "Testing, SQL"
  },
  {
    id: 6,
    title: "Cloud Support Intern",
    company: "Nimbus Tech",
    type: "Internship",
    mode: "On-site",
    location: "Noida",
    skills: "Linux, Cloud, Networking"
  }
];

let savedJobs = JSON.parse(localStorage.getItem("ccSavedJobs") || "[]");
let applications = JSON.parse(localStorage.getItem("ccApplications") || "[]");

const jobList = document.getElementById("jobList");
const savedList = document.getElementById("savedList");
const applicationList = document.getElementById("applicationList");

function saveData() {
  localStorage.setItem("ccSavedJobs", JSON.stringify(savedJobs));
  localStorage.setItem("ccApplications", JSON.stringify(applications));
}

function displayJobs() {
  const search = document.getElementById("searchInput")
    .value.toLowerCase().trim();

  const type = document.getElementById("typeFilter").value;
  const mode = document.getElementById("modeFilter").value;

  const filteredJobs = jobs.filter(job => {
    const text = `${job.title} ${job.company} ${job.skills} ${job.location}`
      .toLowerCase();

    return text.includes(search) &&
      (type === "All" || job.type === type) &&
      (mode === "All" || job.mode === mode);
  });

  document.getElementById("emptyMessage")
    .classList.toggle("hidden", filteredJobs.length > 0);

  jobList.innerHTML = filteredJobs.map(job => `
    <article class="job-card">
      <h3>${job.title}</h3>
      <p class="company">${job.company}</p>
      <p class="job-details">
        ${job.type} · ${job.mode}<br>
        Location: ${job.location}
      </p>
      <p class="skills">${job.skills}</p>
      <button class="save-btn" data-save="${job.id}">
        ${savedJobs.includes(job.id) ? "♥ Saved" : "♡ Save"}
      </button>
      <button class="track-btn" data-track="${job.id}">
        ${applications.some(a => a.id === job.id)
          ? "View Tracker" : "Track Application"}
      </button>
    </article>
  `).join("");
}

function displaySaved() {
  const list = jobs.filter(job => savedJobs.includes(job.id));

  savedList.innerHTML = list.length
    ? list.map(job => `
      <article class="job-card">
        <h3>${job.title}</h3>
        <p class="company">${job.company}</p>
        <button class="remove-btn" data-remove-save="${job.id}">
          Remove Saved Job
        </button>
      </article>
    `).join("")
    : "<p>No saved jobs yet. Use the Save button above.</p>";
}

function displayApplications() {
  applicationList.innerHTML = applications.length
    ? applications.map(app => {
      const job = jobs.find(item => item.id === app.id);
      if (!job) return "";

      return `
        <div class="application-item">
          <div>
            <strong>${job.title}</strong>
            <p class="company">${job.company} · Added ${app.date}</p>
          </div>
          <select data-status="${job.id}" aria-label="Application status">
            ${["Interested", "Applied", "Interview", "Offer", "Rejected"]
              .map(status => `
                <option ${app.status === status ? "selected" : ""}>
                  ${status}
                </option>
              `).join("")}
          </select>
          <button class="remove-btn" data-remove-app="${job.id}">
            Remove
          </button>
        </div>
      `;
    }).join("")
    : "<p>No applications tracked yet.</p>";
}

function renderAll() {
  displayJobs();
  displaySaved();
  displayApplications();
}

jobList.addEventListener("click", event => {
  const saveId = event.target.dataset.save;
  const trackId = event.target.dataset.track;

  if (saveId) {
    const id = Number(saveId);

    savedJobs = savedJobs.includes(id)
      ? savedJobs.filter(jobId => jobId !== id)
      : [...savedJobs, id];

    saveData();
    renderAll();
  }

  if (trackId) {
    const id = Number(trackId);

    if (!applications.some(app => app.id === id)) {
      applications.push({
        id,
        status: "Interested",
        date: new Date().toLocaleDateString("en-IN")
      });
      saveData();
      renderAll();
    } else {
      document.getElementById("tracker")
        .scrollIntoView({ behavior: "smooth" });
    }
  }
});

savedList.addEventListener("click", event => {
  const id = Number(event.target.dataset.removeSave);

  if (id) {
    savedJobs = savedJobs.filter(jobId => jobId !== id);
    saveData();
    renderAll();
  }
});

applicationList.addEventListener("change", event => {
  const id = Number(event.target.dataset.status);

  if (id) {
    const app = applications.find(item => item.id === id);
    if (app) {
      app.status = event.target.value;
      saveData();
      displayApplications();
    }
  }
});

applicationList.addEventListener("click", event => {
  const id = Number(event.target.dataset.removeApp);

  if (id) {
    applications = applications.filter(app => app.id !== id);
    saveData();
    renderAll();
  }
});

document.getElementById("searchInput")
  .addEventListener("input", displayJobs);

document.getElementById("typeFilter")
  .addEventListener("change", displayJobs);

document.getElementById("modeFilter")
  .addEventListener("change", displayJobs);

renderAll();