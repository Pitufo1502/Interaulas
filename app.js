// ============================================================
// INTERAULAS 2026
// Colegio Interamericano de Guatemala
// ============================================================

console.log("Interaulas 2026 app.js cargado correctamente.");

// ============================================================
// SUPABASE
// ============================================================

const db = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ============================================================
// EQUIPOS OFICIALES
// ============================================================

const MEN_A = [
  "Fortnite",
  "Papitos",
  "Trocos",
  "Chifladitos",
  "Chispazos"
];

const MEN_B = [
  "Sin Espinas",
  "Osos Mañosos",
  "Motoneta",
  "La Banca",
  "TOROS FC"
];

const WOMEN = [
  "Ponys",
  "Jags",
  "Osas Mañosas",
  "Innombrables",
  "Troncas",
  "Las Cabritas"
];

const ALL_TEAMS = [
  ...MEN_A,
  ...MEN_B,
  ...WOMEN
];

// ============================================================
// ALIAS DE EQUIPOS
// ============================================================

const TEAM_ALIASES = {
  "Finqueros": "Chispazos",
  "Chapiadoras.com": "Innombrables",
  "Chapiadoras": "Innombrables",
  "Tan G Neras FC": "Ponys",
  "TNG FC": "Ponys",
  "Razitos": "TOROS FC",
  "Sin Esquinas": "Sin Espinas",
  "Trocas": "Troncas"
};

function normalizeTeam(team) {
  if (!team) return team;

  const clean = String(team).trim();

  return TEAM_ALIASES[clean] || clean;
}

// ============================================================
// HORARIO OFICIAL
// ============================================================

const SCHEDULE = [

  // SEPTIEMBRE

  {
    day: 1,
    date: "2026-09-07",
    gender: "M",
    group: "A",
    home: "Fortnite",
    away: "Chifladitos"
  },

  {
    day: 2,
    date: "2026-09-08",
    gender: "F",
    group: "Mujeres",
    home: "Ponys",
    away: "Jags"
  },

  {
    day: 3,
    date: "2026-09-09",
    gender: "M",
    group: "B",
    home: "Sin Espinas",
    away: "Motoneta"
  },

  {
    day: 4,
    date: "2026-09-10",
    gender: "F",
    group: "Mujeres",
    home: "Osas Mañosas",
    away: "Innombrables"
  },

  {
    day: 5,
    date: "2026-09-16",
    gender: "M",
    group: "A",
    home: "Papitos",
    away: "Trocos"
  },

  {
    day: 6,
    date: "2026-09-17",
    gender: "F",
    group: "Mujeres",
    home: "Las Cabritas",
    away: "Troncas"
  },

  {
    day: 7,
    date: "2026-09-18",
    gender: "M",
    group: "B",
    home: "Osos Mañosos",
    away: "La Banca"
  },

  {
    day: 8,
    date: "2026-09-22",
    gender: "M",
    group: "A",
    home: "Chifladitos",
    away: "Papitos"
  },

  {
    day: 9,
    date: "2026-09-23",
    gender: "F",
    group: "Mujeres",
    home: "Ponys",
    away: "Innombrables"
  },

  {
    day: 10,
    date: "2026-09-24",
    gender: "M",
    group: "A",
    home: "Chispazos",
    away: "Fortnite"
  },

  {
    day: 11,
    date: "2026-09-25",
    gender: "F",
    group: "Mujeres",
    home: "Jags",
    away: "Troncas"
  },

  {
    day: 12,
    date: "2026-09-28",
    gender: "M",
    group: "B",
    home: "TOROS FC",
    away: "Sin Espinas"
  },

  {
    day: 13,
    date: "2026-09-29",
    gender: "F",
    group: "Mujeres",
    home: "Osas Mañosas",
    away: "Las Cabritas"
  },

  {
    day: 14,
    date: "2026-09-30",
    gender: "M",
    group: "B",
    home: "Motoneta",
    away: "Osos Mañosos"
  },

  // OCTUBRE

  {
    day: 15,
    date: "2026-10-01",
    gender: "F",
    group: "Mujeres",
    home: "Ponys",
    away: "Troncas"
  },

  {
    day: 16,
    date: "2026-10-05",
    gender: "M",
    group: "A",
    home: "Trocos",
    away: "Chispazos"
  },

  {
    day: 17,
    date: "2026-10-06",
    gender: "F",
    group: "Mujeres",
    home: "Jags",
    away: "Osas Mañosas"
  },

  {
    day: 18,
    date: "2026-10-07",
    gender: "M",
    group: "B",
    home: "La Banca",
    away: "TOROS FC"
  },

  {
    day: 19,
    date: "2026-10-08",
    gender: "F",
    group: "Mujeres",
    home: "Innombrables",
    away: "Las Cabritas"
  },

  {
    day: 20,
    date: "2026-10-09",
    gender: "M",
    group: "A",
    home: "Fortnite",
    away: "Papitos"
  },

  {
    day: 21,
    date: "2026-10-12",
    gender: "F",
    group: "Mujeres",
    home: "Ponys",
    away: "Las Cabritas"
  },

  {
    day: 22,
    date: "2026-10-13",
    gender: "M",
    group: "B",
    home: "Motoneta",
    away: "TOROS FC"
  },

  {
    day: 23,
    date: "2026-10-14",
    gender: "F",
    group: "Mujeres",
    home: "Troncas",
    away: "Osas Mañosas"
  },

  {
    day: 24,
    date: "2026-10-15",
    gender: "M",
    group: "A",
    home: "Chifladitos",
    away: "Chispazos"
  },

  {
    day: 25,
    date: "2026-10-16",
    gender: "F",
    group: "Mujeres",
    home: "Ponys",
    away: "Osas Mañosas"
  },

  {
    day: 26,
    date: "2026-10-21",
    gender: "M",
    group: "B",
    home: "Sin Espinas",
    away: "Osos Mañosos"
  },

  {
    day: 27,
    date: "2026-10-22",
    gender: "F",
    group: "Mujeres",
    home: "Innombrables",
    away: "Jags"
  },

  {
    day: 28,
    date: "2026-10-23",
    gender: "M",
    group: "A",
    home: "Fortnite",
    away: "Trocos"
  },

  {
    day: 29,
    date: "2026-10-26",
    gender: "F",
    group: "Mujeres",
    home: "Las Cabritas",
    away: "Jags"
  },

  {
    day: 30,
    date: "2026-10-27",
    gender: "M",
    group: "B",
    home: "Sin Espinas",
    away: "La Banca"
  },

  {
    day: 31,
    date: "2026-10-28",
    gender: "F",
    group: "Mujeres",
    home: "Troncas",
    away: "Innombrables"
  },

  {
    day: 32,
    date: "2026-10-30",
    gender: "M",
    group: "A",
    home: "Papitos",
    away: "Chispazos"
  },

  // NOVIEMBRE

  {
    day: 33,
    date: "2026-11-02",
    gender: "M",
    group: "B",
    home: "Osos Mañosos",
    away: "TOROS FC"
  },

  {
    day: 34,
    date: "2026-11-03",
    gender: "M",
    group: "A",
    home: "Trocos",
    away: "Chifladitos"
  },

  {
    day: 35,
    date: "2026-11-04",
    gender: "M",
    group: "B",
    home: "Motoneta",
    away: "La Banca"
  }
];

// ============================================================
// ESTADO
// ============================================================

let currentSession = null;

let matchesData = [];
let scorersData = [];
let sanctionsData = [];
let cleanlinessData = [];
let pointAdjustments = [];

let selectedMatchId = null;

// ============================================================
// HELPERS
// ============================================================

function $(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(dateString) {

  if (!dateString) return "";

  const date =
    new Date(`${dateString}T12:00:00`);

  return date.toLocaleDateString(
    "es-GT",
    {
      weekday: "long",
      day: "numeric",
      month: "long"
    }
  );
}

function formatDateShort(dateString) {

  if (!dateString) return "";

  const date =
    new Date(`${dateString}T12:00:00`);

  return date.toLocaleDateString(
    "es-GT",
    {
      day: "2-digit",
      month: "2-digit"
    }
  );
}

function isMen(team) {

  const normalized =
    normalizeTeam(team);

  return (
    MEN_A.includes(normalized) ||
    MEN_B.includes(normalized)
  );
}

function isWomen(team) {

  return WOMEN.includes(
    normalizeTeam(team)
  );
}

function getGenderLabel(gender) {

  return gender === "M"
    ? "Hombres"
    : "Mujeres";
}

// ============================================================
// MODALES
// ============================================================

function openModal(id) {

  const modal = $(id);

  if (!modal) return;

  modal.classList.remove("hidden");
  modal.style.display = "flex";
}

function closeModal(id) {

  const modal = $(id);

  if (!modal) return;

  modal.classList.add("hidden");
  modal.style.display = "none";
}

window.openModal = openModal;
window.closeModal = closeModal;

// ============================================================
// LOGIN
// ============================================================

async function login() {

  const email =
    $("email")?.value.trim();

  const password =
    $("password")?.value;

  const message =
    $("authMessage");

  if (!email || !password) {

    if (message) {
      message.textContent =
        "Escribe tu correo y contraseña.";
    }

    return;
  }

  if (message) {
    message.textContent =
      "Iniciando sesión...";
  }

  const {
    data,
    error
  } =
    await db.auth.signInWithPassword({
      email,
      password
    });

  if (error) {

    console.error(
      "LOGIN ERROR:",
      error
    );

    if (message) {
      message.textContent =
        error.message;
    }

    return;
  }

  currentSession =
    data.session;

  if (message) {
    message.textContent = "";
  }

  closeModal("authModal");

  updateAuthUI();

  await refreshAll();
}

async function logout() {

  await db.auth.signOut();

  currentSession = null;

  updateAuthUI();

  await refreshAll();
}

async function checkSession() {

  const {
    data,
    error
  } =
    await db.auth.getSession();

  if (error) {

    console.error(
      "SESSION ERROR:",
      error
    );

    currentSession = null;

  } else {

    currentSession =
      data.session;
  }

  updateAuthUI();
}

function updateAuthUI() {

  const loginBtn =
    $("loginBtn");

  const addScorerBtn =
    $("addScorerBtn");

  const addSanctionBtn =
    $("addSanctionBtn");

  if (currentSession) {

    if (loginBtn) {

      loginBtn.textContent =
        "Cerrar sesión";

      loginBtn.onclick =
        logout;
    }

    if (addScorerBtn) {

      addScorerBtn.classList.remove(
        "hidden"
      );

      addScorerBtn.style.display = "";
    }

    if (addSanctionBtn) {

      addSanctionBtn.classList.remove(
        "hidden"
      );

      addSanctionBtn.style.display = "";
    }

  } else {

    if (loginBtn) {

      loginBtn.textContent =
        "Iniciar sesión";

      loginBtn.onclick =
        () => openModal("authModal");
    }

    if (addScorerBtn) {

      addScorerBtn.classList.add(
        "hidden"
      );

      addScorerBtn.style.display =
        "none";
    }

    if (addSanctionBtn) {

      addSanctionBtn.classList.add(
        "hidden"
      );

      addSanctionBtn.style.display =
        "none";
    }
  }
}

// ============================================================
// REFRESH
// ============================================================

async function refreshAll() {

  await Promise.all([
    loadMatches(),
    loadScorers(),
    loadSanctions(),
    loadCleanliness(),
    loadPointAdjustments()
  ]);

  renderNextMatch();
  renderStandings();
  renderScorers();
  renderSanctions();
  renderCleanliness();
  renderMatches();

  updateAuthUI();
}

// ============================================================
// MATCHES
// ============================================================

async function loadMatches() {

  const {
    data,
    error
  } =
    await db
      .from("matches")
      .select("*");

  if (error) {

    console.error(
      "Error cargando matches:",
      error
    );

    matchesData = [];

    return;
  }

  matchesData =
    data || [];

  matchesData =
    matchesData.map(match => ({
      ...match,

      home_team:
        normalizeTeam(
          match.home_team
        ),

      away_team:
        normalizeTeam(
          match.away_team
        )
    }));
}

function getMatchForDay(day) {

  return matchesData.find(
    match =>
      Number(match.day) ===
      Number(day)
  );
}

// ============================================================
// PRÓXIMO PARTIDO
// ============================================================

function renderNextMatch() {

  const container =
    $("nextMatch");

  if (!container) return;

  const today =
    new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  const upcoming =
    SCHEDULE
      .filter(game => {

        const date =
          new Date(
            `${game.date}T12:00:00`
          );

        return date >= today;
      })
      .sort(
        (a, b) =>
          a.date.localeCompare(
            b.date
          )
      );

  if (!upcoming.length) {

    container.innerHTML = `
      <div>

        <div class="eyebrow">
          INTERAULAS 2026
        </div>

        <h2>
          Temporada finalizada
        </h2>

        <p>
          Todos los partidos han sido jugados.
        </p>

      </div>
    `;

    return;
  }

  const next =
    upcoming[0];

  const saved =
    getMatchForDay(next.day);

  let scoreText =
    "VS";

  if (
    saved &&
    saved.home_score !== null &&
    saved.home_score !== undefined &&
    saved.away_score !== null &&
    saved.away_score !== undefined
  ) {

    scoreText =
      `${saved.home_score} - ${saved.away_score}`;
  }

  container.innerHTML = `
    <div>

      <div class="eyebrow">
        PRÓXIMO PARTIDO ·
        ${getGenderLabel(
          next.gender
        )}
      </div>

      <h2>
        ${escapeHtml(next.home)}

        <span>
          ${scoreText}
        </span>

        ${escapeHtml(next.away)}
      </h2>

      <p>
        ${escapeHtml(
          formatDate(next.date)
        )}
      </p>

    </div>
  `;
}

// ============================================================
// MOSTRAR PARTIDOS
// ============================================================

function renderMatches() {

  const container =
    $("matches");

  if (!container) return;

  let html = "";

  for (const game of SCHEDULE) {

    const saved =
      getMatchForDay(
        game.day
      );

    let score = "—";

    if (
      saved &&
      saved.home_score !== null &&
      saved.home_score !== undefined &&
      saved.away_score !== null &&
      saved.away_score !== undefined
    ) {

      score =
        `${saved.home_score} - ${saved.away_score}`;
    }

    html += `

      <div class="matchday">

        <h3>
          Jornada ${game.day}
          · ${formatDate(game.date)}
          · ${getGenderLabel(game.gender)}
        </h3>

        <div class="match">

          <div>
            <strong>
              ${formatDateShort(game.date)}
            </strong>
          </div>

          <div>

            <strong>
              ${escapeHtml(game.home)}
            </strong>

            vs

            <strong>
              ${escapeHtml(game.away)}
            </strong>

          </div>

          <div class="score">
            ${score}
          </div>

          <div class="edit">

            ${
              currentSession
                ? `
                  <button
                    class="outline"
                    onclick="editMatch(${game.day})"
                  >
                    Editar
                  </button>
                `
                : ""
            }

          </div>

        </div>

      </div>

    `;
  }

  container.innerHTML =
    html ||
    `<div class="empty">
      No hay partidos.
    </div>`;
}

// ============================================================
// EDITAR RESULTADO
// ============================================================

function editMatch(day) {

  if (!currentSession) {

    alert(
      "Debes iniciar sesión."
    );

    return;
  }

  const game =
    SCHEDULE.find(
      item =>
        Number(item.day) ===
        Number(day)
    );

  if (!game) return;

  const saved =
    getMatchForDay(day);

  selectedMatchId =
    saved?.id || null;

  $("editMatchTitle").textContent =
    `${game.home} vs ${game.away}`;

  $("homeScore").value =
    saved?.home_score ??
    "";

  $("awayScore").value =
    saved?.away_score ??
    "";

  openModal("editModal");
}

async function saveMatch() {

  if (!currentSession) {

    alert(
      "Debes iniciar sesión."
    );

    return;
  }

  if (!selectedMatchId) {

    alert(
      "No se encontró el partido."
    );

    return;
  }

  const homeScore =
    Number(
      $("homeScore").value
    );

  const awayScore =
    Number(
      $("awayScore").value
    );

  if (
    !Number.isInteger(homeScore) ||
    homeScore < 0 ||
    !Number.isInteger(awayScore) ||
    awayScore < 0
  ) {

    alert(
      "Los marcadores deben ser números enteros positivos."
    );

    return;
  }

  const {
    error
  } =
    await db
      .from("matches")
      .update({
        home_score:
          homeScore,

        away_score:
          awayScore
      })
      .eq(
        "id",
        selectedMatchId
      );

  if (error) {

    console.error(
      "SAVE MATCH ERROR:",
      error
    );

    alert(
      "No se pudo guardar el resultado:\n\n" +
      error.message
    );

    return;
  }

  closeModal("editModal");

  await refreshAll();
}

// ============================================================
// SCORERS
// ============================================================

async function loadScorers() {

  const {
    data,
    error
  } =
    await db
      .from("scorers")
      .select("*")
      .order(
        "goals",
        {
          ascending: false
        }
      );

  if (error) {

    console.error(
      "Error cargando scorers:",
      error
    );

    scorersData = [];

    return;
  }

  scorersData =
    data || [];

  scorersData =
    scorersData.map(scorer => {

      let gender =
        scorer.gender;

      if (
        gender !== "M" &&
        gender !== "F"
      ) {

        gender =
          isMen(scorer.team)
            ? "M"
            : "F";
      }

      return {
        ...scorer,

        team:
          normalizeTeam(
            scorer.team
          ),

        gender
      };
    });
}

// ============================================================
// AGREGAR GOLEADOR
// ============================================================

async function addScorer() {

  if (!currentSession) {

    alert(
      "Debes iniciar sesión como administrador."
    );

    return;
  }

  const player =
    prompt(
      "Nombre del goleador:"
    );

  if (!player) return;

  const genderChoice =
    prompt(
      "Género del goleador:\n\n" +
      "1 = Hombres\n" +
      "2 = Mujeres\n\n" +
      "Escribe 1 o 2:"
    );

  if (genderChoice === null) {
    return;
  }

  let gender;
  let teamsForGender;

  if (
    String(genderChoice).trim() ===
    "1"
  ) {

    gender = "M";

    teamsForGender =
      [
        ...MEN_A,
        ...MEN_B
      ];

  } else if (
    String(genderChoice).trim() ===
    "2"
  ) {

    gender = "F";

    teamsForGender =
      [...WOMEN];

  } else {

    alert(
      "Selecciona 1 para Hombres o 2 para Mujeres."
    );

    return;
  }

  const teamInput =
    prompt(
      `Equipo (${gender === "M" ? "Hombres" : "Mujeres"}):\n\n` +
      teamsForGender.join("\n")
    );

  if (!teamInput) return;

  const team =
    normalizeTeam(
      teamInput
    );

  if (
    !teamsForGender.includes(
      team
    )
  ) {

    alert(
      "Ese equipo no pertenece al género seleccionado."
    );

    return;
  }

  const goalsInput =
    prompt(
      "Cantidad de goles:",
      "0"
    );

  if (goalsInput === null) {
    return;
  }

  const goals =
    Number(goalsInput);

  if (
    !Number.isInteger(goals) ||
    goals < 0
  ) {

    alert(
      "Los goles deben ser un número entero."
    );

    return;
  }

  const {
    error
  } =
    await db
      .from("scorers")
      .insert({
        player:
          player.trim(),

        team,

        gender,

        goals
      });

  if (error) {

    console.error(
      "ADD SCORER ERROR:",
      error
    );

    alert(
      "No se pudo agregar el goleador:\n\n" +
      error.message
    );

    return;
  }

  alert(
    "Goleador agregado correctamente."
  );

  await refreshAll();
}

// ============================================================
// EDITAR GOLEADOR
// ============================================================

async function editScorer(id) {

  if (!currentSession) {

    alert(
      "Debes iniciar sesión."
    );

    return;
  }

  const scorer =
    scorersData.find(
      item =>
        String(item.id) ===
        String(id)
    );

  if (!scorer) {

    alert(
      "No se encontró el goleador."
    );

    return;
  }

  const player =
    prompt(
      "Nombre del goleador:",
      scorer.player || ""
    );

  if (player === null) {
    return;
  }

  const currentGender =
    scorer.gender === "F"
      ? "2"
      : "1";

  const genderChoice =
    prompt(
      "Género del goleador:\n\n" +
      "1 = Hombres\n" +
      "2 = Mujeres\n\n" +
      "Escribe 1 o 2:",
      currentGender
    );

  if (genderChoice === null) {
    return;
  }

  let gender;
  let teamsForGender;

  if (
    String(genderChoice).trim() ===
    "1"
  ) {

    gender = "M";

    teamsForGender =
      [
        ...MEN_A,
        ...MEN_B
      ];

  } else if (
    String(genderChoice).trim() ===
    "2"
  ) {

    gender = "F";

    teamsForGender =
      [...WOMEN];

  } else {

    alert(
      "Selecciona 1 para Hombres o 2 para Mujeres."
    );

    return;
  }

  const teamInput =
    prompt(
      `Equipo (${gender === "M" ? "Hombres" : "Mujeres"}):\n\n` +
      teamsForGender.join("\n"),
      scorer.team || ""
    );

  if (teamInput === null) {
    return;
  }

  const team =
    normalizeTeam(
      teamInput
    );

  if (
    !teamsForGender.includes(
      team
    )
  ) {

    alert(
      "Ese equipo no pertenece al género seleccionado."
    );

    return;
  }

  const goalsInput =
    prompt(
      "Cantidad de goles:",
      String(
        scorer.goals ?? 0
      )
    );

  if (goalsInput === null) {
    return;
  }

  const goals =
    Number(goalsInput);

  if (
    !Number.isInteger(goals) ||
    goals < 0
  ) {

    alert(
      "Los goles deben ser un número entero."
    );

    return;
  }

  const {
    error
  } =
    await db
      .from("scorers")
      .update({
        player:
          player.trim(),

        team,

        gender,

        goals
      })
      .eq(
        "id",
        id
      );

  if (error) {

    console.error(
      "EDIT SCORER ERROR:",
      error
    );

    alert(
      "No se pudo editar el goleador:\n\n" +
      error.message
    );

    return;
  }

  alert(
    "Goleador actualizado correctamente."
  );

  await refreshAll();
}

// ============================================================
// ELIMINAR GOLEADOR
// ============================================================

async function deleteScorer(id) {

  if (!currentSession) {

    alert(
      "Debes iniciar sesión."
    );

    return;
  }

  const scorer =
    scorersData.find(
      item =>
        String(item.id) ===
        String(id)
    );

  const confirmed =
    confirm(
      `¿Eliminar a ${
        scorer?.player ||
        "este goleador"
      }?`
    );

  if (!confirmed) {
    return;
  }

  const {
    error
  } =
    await db
      .from("scorers")
      .delete()
      .eq(
        "id",
        id
      );

  if (error) {

    console.error(
      "DELETE SCORER ERROR:",
      error
    );

    alert(
      "No se pudo eliminar el goleador:\n\n" +
      error.message
    );

    return;
  }

  await refreshAll();
}

// ============================================================
// RENDER GOLEADORES
// ============================================================

function renderScorers() {

  const menContainer =
    $("menScorers");

  const womenContainer =
    $("womenScorers");

  if (menContainer) {

    const men =
      scorersData
        .filter(
          scorer =>
            scorer.gender === "M"
        )
        .sort(
          (a, b) =>
            Number(b.goals || 0) -
            Number(a.goals || 0)
        );

    menContainer.innerHTML =
      renderScorerRows(
        men
      );
  }

  if (womenContainer) {

    const women =
      scorersData
        .filter(
          scorer =>
            scorer.gender === "F"
        )
        .sort(
          (a, b) =>
            Number(b.goals || 0) -
            Number(a.goals || 0)
        );

    womenContainer.innerHTML =
      renderScorerRows(
        women
      );
  }
}

function renderScorerRows(list) {

  if (!list.length) {

    return `
      <tr>
        <td
          colspan="${
            currentSession ? 5 : 4
          }"
        >
          No hay goleadores registrados.
        </td>
      </tr>
    `;
  }

  return list
    .map(
      (scorer, index) => `
        <tr>

          <td class="rank">
            ${index + 1}
          </td>

          <td>
            ${escapeHtml(
              scorer.player
            )}
          </td>

          <td>
            ${escapeHtml(
              normalizeTeam(
                scorer.team
              )
            )}
          </td>

          <td class="pts">
            ${Number(
              scorer.goals || 0
            )}
          </td>

          ${
            currentSession
              ? `
                <td>

                  <button
                    class="outline"
                    onclick="editScorer('${String(
                      scorer.id
                    ).replaceAll(
                      "'",
                      "\\'"
                    )}')"
                  >
                    Editar
                  </button>

                  <button
                    class="danger"
                    onclick="deleteScorer('${String(
                      scorer.id
                    ).replaceAll(
                      "'",
                      "\\'"
                    )}')"
                  >
                    Eliminar
                  </button>

                </td>
              `
              : ""
          }

        </tr>
      `
    )
    .join("");
}

// ============================================================
// SANCIONES
// ============================================================

async function loadSanctions() {

  const {
    data,
    error
  } =
    await db
      .from("sanctions")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false
        }
      );

  if (error) {

    console.error(
      "Error cargando sanciones:",
      error
    );

    sanctionsData = [];

    return;
  }

  sanctionsData =
    data || [];

  sanctionsData =
    sanctionsData.map(
      sanction => ({
        ...sanction,

        team:
          normalizeTeam(
            sanction.team
          )
      })
    );
}

// ============================================================
// AGREGAR SANCIÓN
// ============================================================

async function addSanction() {

  if (!currentSession) {

    alert(
      "Debes iniciar sesión."
    );

    return;
  }

  const team =
    prompt(
      "Equipo:"
    );

  if (!team) return;

  const normalizedTeam =
    normalizeTeam(team);

  if (
    !ALL_TEAMS.includes(
      normalizedTeam
    )
  ) {

    alert(
      "Ese equipo no existe."
    );

    return;
  }

  const player =
    prompt(
      "Jugador:"
    );

  if (!player) return;

  const type =
    prompt(
      "Tipo de sanción:\n\n" +
      "1 = Tarjeta amarilla\n" +
      "2 = Tarjeta roja\n" +
      "3 = Suspensión\n" +
      "4 = Otra"
    );

  if (type === null) {
    return;
  }

  const sanctionTypes = {
    "1": "Tarjeta amarilla",
    "2": "Tarjeta roja",
    "3": "Suspensión",
    "4": "Otra"
  };

  const sanctionType =
    sanctionTypes[
      String(type).trim()
    ];

  if (!sanctionType) {

    alert(
      "Selecciona un tipo válido."
    );

    return;
  }

  const description =
    prompt(
      "Descripción:"
    );

  if (description === null) {
    return;
  }

  const {
    error
  } =
    await db
      .from("sanctions")
      .insert({
        team:
          normalizedTeam,

        player:
          player.trim(),

        type:
          sanctionType,

        description:
          description.trim()
      });

  if (error) {

    console.error(
      "ADD SANCTION ERROR:",
      error
    );

    alert(
      "No se pudo agregar la sanción:\n\n" +
      error.message
    );

    return;
  }

  await refreshAll();
}

// ============================================================
// EDITAR SANCIÓN
// ============================================================

async function editSanction(id) {

  if (!currentSession) {

    alert(
      "Debes iniciar sesión."
    );

    return;
  }

  const sanction =
    sanctionsData.find(
      item =>
        String(item.id) ===
        String(id)
    );

  if (!sanction) return;

  const team =
    prompt(
      "Equipo:",
      sanction.team || ""
    );

  if (team === null) return;

  const normalizedTeam =
    normalizeTeam(team);

  if (
    !ALL_TEAMS.includes(
      normalizedTeam
    )
  ) {

    alert(
      "Ese equipo no existe."
    );

    return;
  }

  const player =
    prompt(
      "Jugador:",
      sanction.player || ""
    );

  if (player === null) return;

  const type =
    prompt(
      "Tipo de sanción:\n\n" +
      "1 = Tarjeta amarilla\n" +
      "2 = Tarjeta roja\n" +
      "3 = Suspensión\n" +
      "4 = Otra\n\n" +
      "Escribe el número:",
      sanction.type ===
        "Tarjeta amarilla"
        ? "1"
        : sanction.type ===
          "Tarjeta roja"
          ? "2"
          : sanction.type ===
            "Suspensión"
            ? "3"
            : "4"
    );

  if (type === null) return;

  const sanctionTypes = {
    "1": "Tarjeta amarilla",
    "2": "Tarjeta roja",
    "3": "Suspensión",
    "4": "Otra"
  };

  const sanctionType =
    sanctionTypes[
      String(type).trim()
    ];

  if (!sanctionType) {

    alert(
      "Selecciona un tipo válido."
    );

    return;
  }

  const description =
    prompt(
      "Descripción:",
      sanction.description || ""
    );

  if (description === null) {
    return;
  }

  const {
    error
  } =
    await db
      .from("sanctions")
      .update({
        team:
          normalizedTeam,

        player:
          player.trim(),

        type:
          sanctionType,

        description:
          description.trim()
      })
      .eq(
        "id",
        id
      );

  if (error) {

    console.error(
      "EDIT SANCTION ERROR:",
      error
    );

    alert(
      "No se pudo editar la sanción:\n\n" +
      error.message
    );

    return;
  }

  await refreshAll();
}

// ============================================================
// ELIMINAR SANCIÓN
// ============================================================

async function deleteSanction(id) {

  if (!currentSession) {

    alert(
      "Debes iniciar sesión."
    );

    return;
  }

  if (
    !confirm(
      "¿Eliminar esta sanción?"
    )
  ) {
    return;
  }

  const {
    error
  } =
    await db
      .from("sanctions")
      .delete()
      .eq(
        "id",
        id
      );

  if (error) {

    console.error(
      "DELETE SANCTION ERROR:",
      error
    );

    alert(
      "No se pudo eliminar la sanción:\n\n" +
      error.message
    );

    return;
  }

  await refreshAll();
}

// ============================================================
// RENDER SANCIONES
// ============================================================

function renderSanctions() {

  const container =
    $("sanctions");

  if (!container) return;

  if (!sanctionsData.length) {

    container.innerHTML = `
      <div class="empty">
        No hay sanciones registradas.
      </div>
    `;

    return;
  }

  container.innerHTML =
    sanctionsData
      .map(
        sanction => `
          <div class="sanction">

            <div>
              <strong>
                ${escapeHtml(
                  sanction.team
                )}
              </strong>
            </div>

            <div>
              ${escapeHtml(
                sanction.player
              )}
            </div>

            <div>
              ${escapeHtml(
                sanction.type
              )}
            </div>

            <div>
              ${escapeHtml(
                sanction.description ||
                ""
              )}
            </div>

            ${
              currentSession
                ? `
                  <div>

                    <button
                      class="outline"
                      onclick="editSanction('${String(
                        sanction.id
                      ).replaceAll(
                        "'",
                        "\\'"
                      )}')"
                    >
                      Editar
                    </button>

                    <button
                      class="danger"
                      onclick="deleteSanction('${String(
                        sanction.id
                      ).replaceAll(
                        "'",
                        "\\'"
                      )}')"
                    >
                      Eliminar
                    </button>

                  </div>
                `
                : ""
            }

          </div>
        `
      )
      .join("");
}

// ============================================================
// CLEANLINESS / GRADO
// ============================================================

async function loadCleanliness() {

  const {
    data,
    error
  } =
    await db
      .from("cleanliness_scores")
      .select("*");

  if (error) {

    console.error(
      "Error cargando Grado:",
      error
    );

    cleanlinessData = [];

    return;
  }

  cleanlinessData =
    data || [];
}

function getCleanlinessTeam(row) {

  return normalizeTeam(
    row.team ||
    row.name ||
    row.grade ||
    row.grado ||
    ""
  );
}

function getCleanlinessScore(row) {

  const possibleFields = [
    "points",
    "score",
    "puntos"
  ];

  for (
    const field of possibleFields
  ) {

    if (
      row[field] !==
      undefined &&
      row[field] !== null
    ) {

      return Number(
        row[field]
      );
    }
  }

  return 0;
}

function getCleanlinessScoreField(row) {

  const possibleFields = [
    "points",
    "score",
    "puntos"
  ];

  for (
    const field of possibleFields
  ) {

    if (
      row[field] !==
      undefined
    ) {

      return field;
    }
  }

  return "points";
}

function getCleanlinessTeamField(row) {

  const possibleFields = [
    "team",
    "name",
    "grade",
    "grado"
  ];

  for (
    const field of possibleFields
  ) {

    if (
      row[field] !==
      undefined
    ) {

      return field;
    }
  }

  return "team";
}

// ============================================================
// EDITAR GRADO
// ============================================================

async function editCleanliness(id) {

  if (!currentSession) {

    alert(
      "Debes iniciar sesión."
    );

    return;
  }

  const row =
    cleanlinessData.find(
      item =>
        String(item.id) ===
        String(id)
    );

  if (!row) return;

  const score =
    prompt(
      "Puntos de Grado:",
      String(
        getCleanlinessScore(row)
      )
    );

  if (score === null) {
    return;
  }

  const numericScore =
    Number(score);

  if (
    !Number.isFinite(
      numericScore
    )
  ) {

    alert(
      "Escribe un número válido."
    );

    return;
  }

  const scoreField =
    getCleanlinessScoreField(
      row
    );

  const {
    error
  } =
    await db
      .from("cleanliness_scores")
      .update({
        [scoreField]:
          numericScore
      })
      .eq(
        "id",
        id
      );

  if (error) {

    console.error(
      "EDIT CLEANLINESS ERROR:",
      error
    );

    alert(
      "No se pudo actualizar el Grado:\n\n" +
      error.message
    );

    return;
  }

  await refreshAll();
}

// ============================================================
// RENDER GRADO
// ============================================================

function renderCleanliness() {

  const table =
    $("cleanlinessTable");

  if (!table) return;

  const rows =
    [...cleanlinessData]
      .sort(
        (a, b) =>
          getCleanlinessScore(b) -
          getCleanlinessScore(a)
      );

  if (!rows.length) {

    table.innerHTML = `
      <tr>
        <td colspan="3">
          No hay datos de Grado.
        </td>
      </tr>
    `;

    return;
  }

  table.innerHTML =
    rows
      .map(
        (row, index) => {

          const team =
            getCleanlinessTeam(row);

          const score =
            getCleanlinessScore(row);

          return `
            <tr>

              <td class="rank">
                ${index + 1}
              </td>

              <td>
                ${escapeHtml(team)}
              </td>

              <td class="pts">
                ${score}
              </td>

              ${
                currentSession
                  ? `
                    <td>

                      <button
                        class="outline"
                        onclick="editCleanliness('${String(
                          row.id
                        ).replaceAll(
                          "'",
                          "\\'"
                        )}')"
                      >
                        Editar
                      </button>

                    </td>
                  `
                  : ""
              }

            </tr>
          `;
        }
      )
      .join("");
}

// ============================================================
// POINT ADJUSTMENTS
// ============================================================

async function loadPointAdjustments() {

  const {
    data,
    error
  } =
    await db
      .from("point_adjustments")
      .select("*");

  if (error) {

    console.error(
      "Error cargando puntos manuales:",
      error
    );

    pointAdjustments = [];

    return;
  }

  pointAdjustments =
    data || [];

  pointAdjustments =
    pointAdjustments.map(
      row => ({
        ...row,

        team:
          normalizeTeam(
            row.team
          )
      })
    );
}

function getManualPoints(team) {

  const normalized =
    normalizeTeam(team);

  const row =
    pointAdjustments.find(
      item =>
        normalizeTeam(
          item.team
        ) === normalized
    );

  return Number(
    row?.points || 0
  );
}

// ============================================================
// EDITAR PUNTOS MANUALES
// ============================================================

async function editTeamPoints(team) {

  if (!currentSession) {

    alert(
      "Debes iniciar sesión."
    );

    return;
  }

  const normalizedTeam =
    normalizeTeam(team);

  const existing =
    pointAdjustments.find(
      row =>
        normalizeTeam(
          row.team
        ) === normalizedTeam
    );

  const points =
    prompt(
      `Puntos manuales para ${normalizedTeam}:`,
      String(
        existing?.points || 0
      )
    );

  if (points === null) {
    return;
  }

  const numericPoints =
    Number(points);

  if (
    !Number.isFinite(
      numericPoints
    )
  ) {

    alert(
      "Escribe un número válido."
    );

    return;
  }

  const reason =
    prompt(
      "Razón del ajuste:",
      existing?.reason || ""
    );

  if (reason === null) {
    return;
  }

  if (existing?.id) {

    const {
      error
    } =
      await db
        .from("point_adjustments")
        .update({
          points:
            numericPoints,

          reason:
            reason.trim(),

          updated_at:
            new Date().toISOString()
        })
        .eq(
          "id",
          existing.id
        );

    if (error) {

      console.error(
        "UPDATE POINTS ERROR:",
        error
      );

      alert(
        "No se pudieron guardar los puntos:\n\n" +
        error.message
      );

      return;
    }

  } else {

    const {
      error
    } =
      await db
        .from("point_adjustments")
        .insert({
          team:
            normalizedTeam,

          points:
            numericPoints,

          reason:
            reason.trim(),

          updated_at:
            new Date().toISOString()
        });

    if (error) {

      console.error(
        "INSERT POINTS ERROR:",
        error
      );

      alert(
        "No se pudieron guardar los puntos:\n\n" +
        error.message
      );

      return;
    }
  }

  await refreshAll();
}

// ============================================================
// STANDINGS
// ============================================================

function calculateStandings(
  teams
) {

  const standings =
    teams.map(
      team => ({
        team,
        PJ: 0,
        PG: 0,
        PE: 0,
        PP: 0,
        GF: 0,
        GC: 0,
        DG: 0,
        PTS:
          getManualPoints(team)
      })
    );

  for (
    const game of SCHEDULE
  ) {

    const saved =
      getMatchForDay(
        game.day
      );

    if (!saved) {
      continue;
    }

    if (
      saved.home_score === null ||
      saved.home_score === undefined ||
      saved.away_score === null ||
      saved.away_score === undefined
    ) {
      continue;
    }

    const home =
      normalizeTeam(
        game.home
      );

    const away =
      normalizeTeam(
        game.away
      );

    const homeRow =
      standings.find(
        row =>
          row.team === home
      );

    const awayRow =
      standings.find(
        row =>
          row.team === away
      );

    if (!homeRow || !awayRow) {
      continue;
    }

    const homeScore =
      Number(
        saved.home_score
      );

    const awayScore =
      Number(
        saved.away_score
      );

    homeRow.PJ++;
    awayRow.PJ++;

    homeRow.GF +=
      homeScore;

    homeRow.GC +=
      awayScore;

    awayRow.GF +=
      awayScore;

    awayRow.GC +=
      homeScore;

    if (
      homeScore >
      awayScore
    ) {

      homeRow.PG++;

      awayRow.PP++;

      homeRow.PTS += 3;

    } else if (
      homeScore <
      awayScore
    ) {

      awayRow.PG++;

      homeRow.PP++;

      awayRow.PTS += 3;

    } else {

      homeRow.PE++;

      awayRow.PE++;

      homeRow.PTS += 1;
      awayRow.PTS += 1;
    }
  }

  standings.forEach(
    row => {

      row.DG =
        row.GF -
        row.GC;
    }
  );

  standings.sort(
    (a, b) => {

      if (
        b.PTS !==
        a.PTS
      ) {
        return (
          b.PTS -
          a.PTS
        );
      }

      if (
        b.DG !==
        a.DG
      ) {
        return (
          b.DG -
          a.DG
        );
      }

      return (
        b.GF -
        a.GF
      );
    }
  );

  return standings;
}

function renderStandings() {

  const menContainer =
    $("menTables");

  const womenContainer =
    $("womenTable");

  if (menContainer) {

    const groupA =
      calculateStandings(
        MEN_A
      );

    const groupB =
      calculateStandings(
        MEN_B
      );

    menContainer.innerHTML =
      renderStandingsGroup(
        "Grupo A",
        groupA
      ) +
      renderStandingsGroup(
        "Grupo B",
        groupB
      );
  }

  if (womenContainer) {

    const women =
      calculateStandings(
        WOMEN
      );

    womenContainer.innerHTML =
      renderStandingsTable(
        women
      );
  }
}

function renderStandingsGroup(
  title,
  standings
) {

  return `
    <div class="card">

      <h3>
        ${title}
      </h3>

      ${renderStandingsTable(
        standings
      )}

    </div>
  `;
}

function renderStandingsTable(
  standings
) {

  return `
    <div class="table-wrap">

      <table>

        <thead>

          <tr>

            <th>#</th>
            <th>Equipo</th>
            <th>PJ</th>
            <th>PG</th>
            <th>PE</th>
            <th>PP</th>
            <th>GF</th>
            <th>GC</th>
            <th>DG</th>
            <th>PTS</th>

            ${
              currentSession
                ? `
                  <th>Admin</th>
                `
                : ""
            }

          </tr>

        </thead>

        <tbody>

          ${
            standings.length
              ? standings
                  .map(
                    (row, index) => `
                      <tr>

                        <td class="rank">
                          ${index + 1}
                        </td>

                        <td>
                          ${escapeHtml(
                            row.team
                          )}
                        </td>

                        <td>
                          ${row.PJ}
                        </td>

                        <td>
                          ${row.PG}
                        </td>

                        <td>
                          ${row.PE}
                        </td>

                        <td>
                          ${row.PP}
                        </td>

                        <td>
                          ${row.GF}
                        </td>

                        <td>
                          ${row.GC}
                        </td>

                        <td>
                          ${row.DG}
                        </td>

                        <td class="pts">
                          ${row.PTS}
                        </td>

                        ${
                          currentSession
                            ? `
                              <td>

                                <button
                                  class="outline"
                                  onclick="editTeamPoints('${String(
                                    row.team
                                  ).replaceAll(
                                    "'",
                                    "\\'"
                                  )}')"
                                >
                                  Puntos
                                </button>

                              </td>
                            `
                            : ""
                        }

                      </tr>
                    `
                  )
                  .join("")
              : `
                <tr>
                  <td colspan="11">
                    No hay datos.
                  </td>
                </tr>
              `
          }

        </tbody>

      </table>

    </div>
  `;
}

// ============================================================
// EVENTS
// ============================================================

function setupEvents() {

  const loginBtn =
    $("loginBtn");

  if (loginBtn) {

    loginBtn.onclick =
      () => {

        if (currentSession) {
          logout();
        } else {
          openModal("authModal");
        }

      };
  }

  const addScorerBtn =
    $("addScorerBtn");

  if (addScorerBtn) {

    addScorerBtn.onclick =
      addScorer;
  }

  const addSanctionBtn =
    $("addSanctionBtn");

  if (addSanctionBtn) {

    addSanctionBtn.onclick =
      addSanction;
  }

  document
    .querySelectorAll(
      ".modal"
    )
    .forEach(modal => {

      modal.addEventListener(
        "click",
        event => {

          if (
            event.target ===
            modal
          ) {

            modal.classList.add(
              "hidden"
            );

            modal.style.display =
              "none";
          }

        }
      );

    });
}

// ============================================================
// AUTH STATE
// ============================================================

db.auth.onAuthStateChange(
  (
    event,
    session
  ) => {

    currentSession =
      session;

    updateAuthUI();

    setTimeout(
      () => {
        refreshAll();
      },
      0
    );
  }
);

// ============================================================
// GLOBAL FUNCTIONS
// ============================================================

window.login =
  login;

window.logout =
  logout;

window.saveMatch =
  saveMatch;

window.editMatch =
  editMatch;

window.addScorer =
  addScorer;

window.editScorer =
  editScorer;

window.deleteScorer =
  deleteScorer;

window.addSanction =
  addSanction;

window.editSanction =
  editSanction;

window.deleteSanction =
  deleteSanction;

window.editCleanliness =
  editCleanliness;

window.editTeamPoints =
  editTeamPoints;

window.refreshAll =
  refreshAll;

// ============================================================
// START
// ============================================================

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    setupEvents();

    await checkSession();

    await refreshAll();

  }
);
