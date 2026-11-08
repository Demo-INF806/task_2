
const token = process.env.GITHUB_TOKEN;
const repo = "Demo-INF806/task_2";
const label = "najiboss77";

async function api(path, method, body) {
  const response = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json"
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });

  if (!response.ok) {
    throw new Error(`GitHub API: HTTP ${response.status}`);
  }

  return response.json();
}

async function main() {
  if (!token) throw new Error("GITHUB_TOKEN absent");

  // Vérifier si le label existe déjà
  const existing = await fetch(
    `https://api.github.com/repos/${repo}/labels/${label}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (existing.status === 404) {
    await api(`/repos/${repo}/labels`, "POST", {
      name: label,
      color: "1D76DB",
      description: "Exercice INF806"
    });
    console.log("Label créé");
  } else if (!existing.ok) {
    throw new Error(`Vérification: HTTP ${existing.status}`);
  }

  // Ajouter le label à l'Issue #1
  await api(`/repos/${repo}/issues/1/labels`, "POST", {
    labels: [label]
  });

  console.log("SUCCESS: label ajouté à l'Issue #1");
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
