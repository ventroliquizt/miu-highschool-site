async function loadSection(page, section, elementId) {
  const res = await fetch(
    `http://localhost:3001/content?page=${page}&section=${section}`
  );
  const data = await res.json();

  if (!data) return;

  document.getElementById(elementId).innerHTML = `
    <h2>${data.title}</h2>
    <p>${data.content}</p>
    ${data.image ? `<img src="http://localhost:3001${data.image}" />` : ""}
  `;
}

fetch("http://localhost:3001/articles?page=admissions&section=process")
  .then(res => res.json())
  .then(data => {
    if (!data) return;

    document.getElementById("admissions-process-title").innerText = data.title;
    document.getElementById("admissions-process-content").innerHTML = data.content;
  });
