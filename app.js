const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ======================================================
// EQUIPOS
// ======================================================

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

// ======================================================
// FECHAS
// ======================================================

const MATCH_DATES = {
  1: "7 de septiembre",
  2: "8 de septiembre",
  3: "9 de septiembre",
  4: "10 de septiembre",
  5: "16 de septiembre",
  6: "17 de septiembre",
  7: "18 de septiembre",

  9: "22 de septiembre",
  8: "23 de septiembre",
  10: "24 de septiembre",
  11: "25 de septiembre",
  12: "28 de septiembre",
  13: "29 de septiembre",
  14: "30 de septiembre",

  15: "1 de octubre",
  16: "2 de octubre",
  17: "5 de octubre",
  18: "6 de octubre",
  19: "7 de octubre",
  20: "8 de octubre",
  21: "9 de octubre",
  22: "12 de octubre",
  23: "13 de octubre",
  24: "14 de octubre",
  25: "15 de octubre",
  26: "16 de octubre",
  27: "21 de octubre",
  28: "22 de octubre",
  29: "23 de octubre",
  30: "26 de octubre",
  31: "27 de octubre",
  32: "28 de octubre",
  33: "30 de octubre",
  34: "2 de noviembre",
  35: "3 de noviembre"
};

const MATCH_DATE_VALUES = {
  1: "2026-09-07",
  2: "2026-09-08",
  3: "2026-09-09",
  4: "2026-09-10",
  5: "2026-09-16",
  6: "2026-09-17",
  7: "2026-09-18",

  9: "2026-09-22",
  8: "2026-09-23",
  10: "2026-09-24",
  11: "2026-09-25",
  12: "2026-09-28",
  13: "2026-09-29",
  14: "2026-09-30",

  15: "2026-10-01",
  16: "2026-10-02",
  17: "2026-10-05",
  18: "2026-10-06",
  19: "2026-10-07",
  20: "2026-10-08",
  21: "2026-10-09",
  22: "2026-10-12",
  23: "2026-10-13",
  24: "2026-10-14",
  25: "2026-10-15",
  26: "2026-10-16",
  27: "2026-10-21",
  28: "2026-10-22",
  29: "2026-10-23",
  30: "2026-10-26",
  31: "2026-10-27",
  32: "2026-10-28",
  33: "2026-10-30",
  34: "2026-11-02",
  35: "2026-11-03"
};

// ======================================================
// NOMBRES ANTIGUOS
// ======================================================

const ALIASES = {
  "Finqueros": "Chispazos",
  "Chapiadoras.com": "Innombrables",
  "Tan G Neras FC": "Ponys",
  "TNG FC": "Ponys",
  "Razitos": "TOROS FC",
  "Sin Esquinas": "Sin Espinas",
  "Trocas": "Troncas"
};

let session = null;
let editingMatchId = null;

// ======================================================
// INICIO
// ======================================================

document.addEventListener("DOMContentLoaded", function () {
  setupButtons();
  checkSession();
});

// ======================================================
// BOTONES
// ======================================================

function setupButtons() {

  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const addSanctionBtn = document.getElementById("addSanctionBtn");
  const addScorerBtn = document.getElementById("addScorerBtn");

  if (loginBtn) {
    loginBtn.addEventListener("click", login);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  if (addSanctionBtn) {
    addSanctionBtn.addEventListener("click", addSanction);
  }

  if (addScorerBtn) {
    addScorerBtn.addEventListener("click", addScorer);
  }

  document.querySelectorAll(".modal-close").forEach(function (button) {
    button.addEventListener("click", closeModals);
  });
}

// ======================================================
// SESIÓN
// ======================================================

async function checkSession() {

  const result = await db.auth.getSession();

  session = result.data.session;

  updateAuthUI();
  await refresh();

  db.auth.onAuthStateChange(function (_event, newSession) {
    session = newSession;
    updateAuthUI();
  });
}

function updateAuthUI() {

  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  document.querySelectorAll(".admin-only").forEach(function (element) {
    element.style.display = session ? "" : "none";
  });

  if (loginBtn) {
    loginBtn.style.display = session ? "none" : "";
  }

  if (logoutBtn) {
    logoutBtn.style.display = session ? "" : "none";
  }
}

async function login() {

  const email = prompt("Correo del organizador:");

  if (!email) return;

  const password = prompt("Contraseña:");

  if (!password) return;

  const result = await db.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (result.error) {
    alert("Error: " + result.error.message);
    return;
  }

  session = result.data.session;

  updateAuthUI();
  await refresh();
}

async function logout() {

  await db.auth.signOut();

  session = null;

  updateAuthUI();
  await refresh();
}

// ======================================================
// REFRESH
// ======================================================

async function refresh() {

  await renderTables();
  await renderMatches();
  await renderNext();
  await renderSanctions();
  await renderScorers();
  await renderCleanliness();
}

// ======================================================
// NORMALIZAR EQUIPOS
// ======================================================

function normalizeTeam(team) {

  if (!team) return "";

  const name = String(team).trim();

  if (ALIASES[name]) {
    return ALIASES[name];
  }

  return name;
}

// ======================================================
// ESTADÍSTICAS
// ======================================================

function createEmptyStats() {

  return {
    PJ: 0,
    G: 0,
    E: 0,
    P: 0,
    GF: 0,
    GC: 0,
    DG: 0,
    PTS: 0
  };
}

function calculateStats(matches, teams, adjustments) {

  const stats = {};

  teams.forEach(function (team) {
    stats[team] = createEmptyStats();
  });

  matches.forEach(function (match) {

    const home = normalizeTeam(match.home_team);
    const away = normalizeTeam(match.away_team);

    if (!stats[home] || !stats[away]) {
      return;
    }

    if (
      match.home_score === null ||
      match.home_score === undefined ||
      match.away_score === null ||
      match.away_score === undefined
    ) {
      return;
    }

    const homeScore = Number(match.home_score);
    const awayScore = Number(match.away_score);

    stats[home].PJ++;
    stats[away].PJ++;

    stats[home].GF += homeScore;
    stats[home].GC += awayScore;

    stats[away].GF += awayScore;
    stats[away].GC += homeScore;

    if (homeScore > awayScore) {

      stats[home].G++;
      stats[away].P++;

      stats[home].PTS += 3;

    } else if (awayScore > homeScore) {

      stats[away].G++;
      stats[home].P++;

      stats[away].PTS += 3;

    } else {

      stats[home].E++;
      stats[away].E++;

      stats[home].PTS++;
      stats[away].PTS++;
    }
  });

  Object.keys(stats).forEach(function (team) {
    stats[team].DG = stats[team].GF - stats[team].GC;
  });

  (adjustments || []).forEach(function (adjustment) {

    const team = normalizeTeam(adjustment.team);

    if (stats[team]) {
      stats[team].PTS += Number(adjustment.points || 0);
    }
  });

  return stats;
}

// ======================================================
// TABLA
// ======================================================

function tableHTML(stats, teams) {

  const rows = teams.map(function (team) {

    return {
      team: team,
      PJ: stats[team].PJ,
      G: stats[team].G,
      E: stats[team].E,
      P: stats[team].P,
      GF: stats[team].GF,
      GC: stats[team].GC,
      DG: stats[team].DG,
      PTS: stats[team].PTS
    };

  });

  rows.sort(function (a, b) {

    if (b.PTS !== a.PTS) {
      return b.PTS - a.PTS;
    }

    if (b.DG !== a.DG) {
      return b.DG - a.DG;
    }

    return b.GF - a.GF;
  });

  return rows.map(function (row, index) {

    return `
      <tr>
        <td>${index + 1}</td>
        <td><strong>${row.team}</strong></td>
        <td>${row.PJ}</td>
        <td>${row.G}</td>
        <td>${row.E}</td>
        <td>${row.P}</td>
        <td>${row.GF}</td>
        <td>${row.GC}</td>
        <td>${row.DG}</td>
        <td><strong>${row.PTS}</strong></td>
      </tr>
    `;

  }).join("");
}

// ======================================================
// TABLAS
// ======================================================

async function renderTables() {

  const matchesResult = await db
    .from("matches")
    .select("*");

  if (matchesResult.error) {
    console.error(matchesResult.error);
    return;
  }

  const adjustmentsResult = await db
    .from("point_adjustments")
    .select("*");

  const matches = matchesResult.data || [];
  const adjustments = adjustmentsResult.data || [];

  const menMatches = matches.filter(function (match) {
    return String(match.gender || "").toUpperCase() === "M";
  });

  const womenMatches = matches.filter(function (match) {
    return String(match.gender || "").toUpperCase() === "F";
  });

  const menAStats = calculateStats(
    menMatches,
    MEN_A,
    adjustments
  );

  const menBStats = calculateStats(
    menMatches,
    MEN_B,
    adjustments
  );

  const womenStats = calculateStats(
    womenMatches,
    WOMEN,
    adjustments
  );

  const menATable = document.getElementById("menTableA");
  const menBTable = document.getElementById("menTableB");
  const womenTable = document.getElementById("womenTable");

  if (menATable) {
    menATable.innerHTML = tableHTML(
      menAStats,
      MEN_A
    );
  }

  if (menBTable) {
    menBTable.innerHTML = tableHTML(
      menBStats,
      MEN_B
    );
  }

  if (womenTable) {
    womenTable.innerHTML = tableHTML(
      womenStats,
      WOMEN
    );
  }
}

// ======================================================
// ORDEN DE PARTIDOS
// ======================================================

function sortMatchesByDate(matches) {

  return matches.slice().sort(function (a, b) {

    const aDay = Number(a.day);
    const bDay = Number(b.day);

    const aDate =
      MATCH_DATE_VALUES[aDay] || "9999-12-31";

    const bDate =
      MATCH_DATE_VALUES[bDay] || "9999-12-31";

    return aDate.localeCompare(bDate);
  });
}

// ======================================================
// FECHA
// ======================================================

function getMatchDate(match) {

  const day = Number(match.day);

  return MATCH_DATES[day] || "Fecha por confirmar";
}

// ======================================================
// PARTIDOS
// ======================================================

async function renderMatches() {

  const container =
    document.getElementById("matchesList") ||
    document.getElementById("matches");

  if (!container) return;

  const result = await db
    .from("matches")
    .select("*");

  if (result.error) {

    console.error(result.error);

    container.innerHTML =
      "<p>No se pudieron cargar los partidos.</p>";

    return;
  }

  const matches = sortMatchesByDate(
    result.data || []
  );

  if (!matches.length) {

    container.innerHTML =
      "<p>No hay partidos registrados.</p>";

    return;
  }

  let html = "";
  let previousDate = "";

  matches.forEach(function (match) {

    const date = getMatchDate(match);

    if (date !== previousDate) {

      html += `
        <div class="match-date-header">
          ${date}
        </div>
      `;

      previousDate = date;
    }

    const home = normalizeTeam(
      match.home_team
    );

    const away = normalizeTeam(
      match.away_team
    );

    const gender =
      String(match.gender || "").toUpperCase() === "F"
        ? "MUJERES"
        : "HOMBRES";

    const hasScore =
      match.home_score !== null &&
      match.home_score !== undefined &&
      match.away_score !== null &&
      match.away_score !== undefined;

    const score = hasScore
      ? `${match.home_score} - ${match.away_score}`
      : "VS";

    html += `
      <div class="card match-card">

        <div class="match-info">
          <span>${gender}</span>
          <span>Partido #${match.day}</span>
        </div>

        <div class="match-teams">

          <div class="team">
            <strong>${home}</strong>
          </div>

          <div class="score">
            ${score}
          </div>

          <div class="team">
            <strong>${away}</strong>
          </div>

        </div>

        ${
          session
            ? `
              <div class="match-actions">

                <button
                  class="outline"
                  onclick="editMatch(${match.id})"
                >
                  ✏️ Editar marcador
                </button>

              </div>
            `
            : ""
        }

      </div>
    `;
  });

  container.innerHTML = html;
}

// ======================================================
// PRÓXIMO PARTIDO
// ======================================================

async function renderNext() {

  const container =
    document.getElementById("nextMatch") ||
    document.getElementById("next-match");

  if (!container) return;

  const result = await db
    .from("matches")
    .select("*");

  if (result.error) {
    console.error(result.error);
    return;
  }

  const matches = sortMatchesByDate(
    result.data || []
  );

  const next = matches.find(function (match) {

    return (
      match.home_score === null ||
      match.home_score === undefined ||
      match.away_score === null ||
      match.away_score === undefined
    );

  });

  if (!next) {

    container.innerHTML = `
      <div class="card">
        <h3>🏆 Todos los partidos han terminado</h3>
      </div>
    `;

    return;
  }

  const home = normalizeTeam(
    next.home_team
  );

  const away = normalizeTeam(
    next.away_team
  );

  container.innerHTML = `
    <div class="card next-match-card">

      <div class="match-info">
        <span>PRÓXIMO PARTIDO</span>
        <span>${getMatchDate(next)}</span>
      </div>

      <div class="match-teams">

        <div class="team">
          <strong>${home}</strong>
        </div>

        <div class="score">
          VS
        </div>

        <div class="team">
          <strong>${away}</strong>
        </div>

      </div>

    </div>
  `;
}

// ======================================================
// EDITAR PARTIDO
// ======================================================

async function editMatch(id) {

  if (!session) {
    alert("Debes iniciar sesión.");
    return;
  }

  editingMatchId = id;

  const result = await db
    .from("matches")
    .select("*")
    .eq("id", id)
    .single();

  if (result.error) {
    alert(result.error.message);
    return;
  }

  const match = result.data;

  const title =
    document.getElementById("editMatchTitle");

  const homeScore =
    document.getElementById("homeScore");

  const awayScore =
    document.getElementById("awayScore");

  if (title) {
    title.textContent =
      normalizeTeam(match.home_team) +
      " vs " +
      normalizeTeam(match.away_team);
  }

  if (homeScore) {
    homeScore.value =
      match.home_score ?? "";
  }

  if (awayScore) {
    awayScore.value =
      match.away_score ?? "";
  }

  openModal("editMatchModal");
}

// ======================================================
// GUARDAR PARTIDO
// ======================================================

async function saveMatch() {

  if (!session || !editingMatchId) {
    return;
  }

  const homeScoreElement =
    document.getElementById("homeScore");

  const awayScoreElement =
    document.getElementById("awayScore");

  const homeScore =
    homeScoreElement.value === ""
      ? null
      : Number(homeScoreElement.value);

  const awayScore =
    awayScoreElement.value === ""
      ? null
      : Number(awayScoreElement.value);

  if (
    homeScore !== null &&
    (Number.isNaN(homeScore) || homeScore < 0)
  ) {
    alert("Marcador inválido.");
    return;
  }

  if (
    awayScore !== null &&
    (Number.isNaN(awayScore) || awayScore < 0)
  ) {
    alert("Marcador inválido.");
    return;
  }

  const result = await db
    .from("matches")
    .update({
      home_score: homeScore,
      away_score: awayScore
    })
    .eq("id", editingMatchId);

  if (result.error) {
    alert(result.error.message);
    return;
  }

  editingMatchId = null;

  closeModals();

  await refresh();
}

// ======================================================
// MODALES
// ======================================================

function openModal(id) {

  const modal = document.getElementById(id);

  if (!modal) return;

  modal.style.display = "flex";
  modal.classList.add("show");
}

function closeModals() {

  document.querySelectorAll(".modal").forEach(
    function (modal) {
      modal.style.display = "none";
      modal.classList.remove("show");
    }
  );
}

// ======================================================
// SANCIONES
// ======================================================

async function renderSanctions() {

  const container =
    document.getElementById("sanctionsList") ||
    document.getElementById("sanctions");

  if (!container) return;

  const result = await db
    .from("sanctions")
    .select("*")
    .order("created_at", {
      ascending: false
    });

  if (result.error) {

    console.error(result.error);

    container.innerHTML =
      "<p>No se pudieron cargar las sanciones.</p>";

    return;
  }

  const sanctions = result.data || [];

  if (!sanctions.length) {

    container.innerHTML = `
      <div class="card sanction-card">
        <p>No hay sanciones registradas.</p>
      </div>
    `;

    return;
  }

  let html = "";

  sanctions.forEach(function (sanction) {

    html += `
      <div class="card sanction-card">

        <div class="sanction-header">

          <div>
            <strong>
              ${sanction.player || "Jugador"}
            </strong>

            <div class="muted">
              ${normalizeTeam(sanction.team)}
            </div>
          </div>

          <span class="sanction-type">
            ${sanction.type || "Sanción"}
          </span>

        </div>

        <div class="sanction-description">
          ${sanction.description || ""}
        </div>

        ${
          session
            ? `
              <div class="sanction-actions">

                <button
                  class="outline"
                  onclick="editSanction(${sanction.id})"
                >
                  ✏️ Editar
                </button>

                <button
                  class="outline"
                  onclick="deleteSanction(${sanction.id})"
                >
                  🗑️ Eliminar
                </button>

              </div>
            `
            : ""
        }

      </div>
    `;
  });

  container.innerHTML = html;
}

// ======================================================
// AGREGAR SANCIÓN
// ======================================================

async function addSanction() {

  if (!session) {
    alert("Debes iniciar sesión.");
    return;
  }

  const player = prompt(
    "Nombre del jugador:"
  );

  if (!player) return;

  const team = prompt(
    "Equipo:"
  );

  if (!team) return;

  const type = prompt(
    "Tipo de sanción:"
  );

  if (!type) return;

  const description = prompt(
    "Descripción:"
  );

  if (description === null) return;

  const result = await db
    .from("sanctions")
    .insert({
      player: player,
      team: normalizeTeam(team),
      type: type,
      description: description
    });

  if (result.error) {

    alert(
      "Error al agregar sanción: " +
      result.error.message
    );

    return;
  }

  await refresh();
}

// ======================================================
// EDITAR SANCIÓN
// ======================================================

async function editSanction(id) {

  if (!session) {
    alert("Debes iniciar sesión.");
    return;
  }

  const result = await db
    .from("sanctions")
    .select("*")
    .eq("id", id)
    .single();

  if (result.error) {
    alert(result.error.message);
    return;
  }

  const sanction = result.data;

  const player = prompt(
    "Nombre del jugador:",
    sanction.player || ""
  );

  if (player === null) return;

  const team = prompt(
    "Equipo:",
    sanction.team || ""
  );

  if (team === null) return;

  const type = prompt(
    "Tipo de sanción:",
    sanction.type || ""
  );

  if (type === null) return;

  const description = prompt(
    "Descripción:",
    sanction.description || ""
  );

  if (description === null) return;

  const updateResult = await db
    .from("sanctions")
    .update({
      player: player,
      team: normalizeTeam(team),
      type: type,
      description: description
    })
    .eq("id", id);

  if (updateResult.error) {

    alert(
      "Error al editar: " +
      updateResult.error.message
    );

    return;
  }

  await refresh();
}

// ======================================================
// ELIMINAR SANCIÓN
// ======================================================

async function deleteSanction(id) {

  if (!session) {
    alert("Debes iniciar sesión.");
    return;
  }

  const confirmed = confirm(
    "¿Seguro que quieres eliminar esta sanción?"
  );

  if (!confirmed) return;

  const result = await db
    .from("sanctions")
    .delete()
    .eq("id", id);

  if (result.error) {

    alert(
      "Error al eliminar: " +
      result.error.message
    );

    return;
  }

  await refresh();
}

// ======================================================
// GOLEADORES
// ======================================================

async function renderScorers() {

  const result = await db
    .from("scorers")
    .select("*")
    .order("goals", {
      ascending: false
    });

  if (result.error) {
    console.error(result.error);
    return;
  }

  const scorers = result.data || [];

  const men = scorers.filter(function (scorer) {
    return String(scorer.gender || "").toUpperCase() === "M";
  });

  const women = scorers.filter(function (scorer) {
    return String(scorer.gender || "").toUpperCase() === "F";
  });

  const menContainer =
    document.getElementById("menScorers") ||
    document.getElementById("scorersMen");

  const womenContainer =
    document.getElementById("womenScorers") ||
    document.getElementById("scorersWomen");

  if (menContainer) {
    menContainer.innerHTML =
      scorerRows(men);
  }

  if (womenContainer) {
    womenContainer.innerHTML =
      scorerRows(women);
  }
}

function scorerRows(scorers) {

  if (!scorers.length) {
    return "<p>No hay goleadores registrados.</p>";
  }

  return scorers.map(function (scorer, index) {

    return `
      <div class="scorer-row">

        <div>
          <strong>
            ${index + 1}. ${scorer.player}
          </strong>

          <small>
            ${normalizeTeam(scorer.team)}
          </small>
        </div>

        <strong>
          ${scorer.goals} ⚽
        </strong>

        ${
          session
            ? `
              <div>

                <button
                  class="outline"
                  onclick="editScorer(${scorer.id})"
                >
                  ✏️
                </button>

                <button
                  class="outline"
                  onclick="deleteScorer(${scorer.id})"
                >
                  🗑️
                </button>

              </div>
            `
            : ""
        }

      </div>
    `;

  }).join("");
}

// ======================================================
// AGREGAR GOLEADOR
// ======================================================

async function addScorer() {

  if (!session) {
    alert("Debes iniciar sesión.");
    return;
  }

  const player = prompt(
    "Nombre del jugador:"
  );

  if (!player) return;

  const team = prompt(
    "Equipo:"
  );

  if (!team) return;

  const gender = prompt(
    "Escribe M para hombres o F para mujeres:"
  );

  if (!gender) return;

  const finalGender =
    gender.toUpperCase();

  if (
    finalGender !== "M" &&
    finalGender !== "F"
  ) {
    alert("Debes escribir M o F.");
    return;
  }

  const goalsInput = prompt(
    "Cantidad de goles:",
    "0"
  );

  if (goalsInput === null) return;

  const goals = Number(goalsInput);

  if (
    Number.isNaN(goals) ||
    goals < 0
  ) {
    alert("Cantidad inválida.");
    return;
  }

  const result = await db
    .from("scorers")
    .insert({
      player: player,
      team: normalizeTeam(team),
      gender: finalGender,
      goals: goals
    });

  if (result.error) {
    alert(result.error.message);
    return;
  }

  await refresh();
}

// ======================================================
// EDITAR GOLEADOR
// ======================================================

async function editScorer(id) {

  if (!session) return;

  const result = await db
    .from("scorers")
    .select("*")
    .eq("id", id)
    .single();

  if (result.error) {
    alert(result.error.message);
    return;
  }

  const scorer = result.data;

  const player = prompt(
    "Nombre:",
    scorer.player
  );

  if (player === null) return;

  const team = prompt(
    "Equipo:",
    scorer.team
  );

  if (team === null) return;

  const goalsInput = prompt(
    "Goles:",
    scorer.goals
  );

  if (goalsInput === null) return;

  const goals = Number(goalsInput);

  if (
    Number.isNaN(goals) ||
    goals < 0
  ) {
    alert("Cantidad inválida.");
    return;
  }

  const updateResult = await db
    .from("scorers")
    .update({
      player: player,
      team: normalizeTeam(team),
      goals: goals
    })
    .eq("id", id);

  if (updateResult.error) {
    alert(updateResult.error.message);
    return;
  }

  await refresh();
}

// ======================================================
// ELIMINAR GOLEADOR
// ======================================================

async function deleteScorer(id) {

  if (!session) return;

  if (!confirm("¿Eliminar este goleador?")) {
    return;
  }

  const result = await db
    .from("scorers")
    .delete()
    .eq("id", id);

  if (result.error) {
    alert(result.error.message);
    return;
  }

  await refresh();
}

// ======================================================
// GRADO
// ======================================================

async function renderCleanliness() {

  const container =
    document.getElementById(
      "cleanlinessTable"
    );

  if (!container) return;

  const result = await db
    .from("cleanliness_scores")
    .select("*")
    .order("points", {
      ascending: false
    });

  if (result.error) {
    console.error(result.error);
    return;
  }

  const rows = result.data || [];

  container.innerHTML = rows.map(
    function (row, index) {

      return `
        <tr>

          <td>${index + 1}</td>

          <td>
            <strong>${row.grade}</strong>
          </td>

          <td>
            ${row.points}
          </td>

          <td>
            ${row.reason || ""}
          </td>

          ${
            session
              ? `
                <td>
                  <button
                    class="outline"
                    onclick="editCleanliness(${row.id})"
                  >
                    ✏️
                  </button>
                </td>
              `
              : ""
          }

        </tr>
      `;

    }
  ).join("");
}

// ======================================================
// EDITAR GRADO
// ======================================================

async function editCleanliness(id) {

  if (!session) return;

  const result = await db
    .from("cleanliness_scores")
    .select("*")
    .eq("id", id)
    .single();

  if (result.error) {
    alert(result.error.message);
    return;
  }

  const row = result.data;

  const pointsInput = prompt(
    "Puntos:",
    row.points
  );

  if (pointsInput === null) return;

  const points = Number(pointsInput);

  if (Number.isNaN(points)) {
    alert("Puntos inválidos.");
    return;
  }

  const reason = prompt(
    "Razón:",
    row.reason || ""
  );

  if (reason === null) return;

  const updateResult = await db
    .from("cleanliness_scores")
    .update({
      points: points,
      reason: reason,
      updated_at: new Date().toISOString()
    })
    .eq("id", id);

  if (updateResult.error) {
    alert(updateResult.error.message);
    return;
  }

  await refresh();
}

// ======================================================
// EXPORTAR FUNCIONES
// ======================================================

window.refresh = refresh;

window.editMatch = editMatch;
window.saveMatch = saveMatch;

window.addSanction = addSanction;
window.editSanction = editSanction;
window.deleteSanction = deleteSanction;

window.addScorer = addScorer;
window.editScorer = editScorer;
window.deleteScorer = deleteScorer;

window.editTeamPoints = editTeamPoints;
window.editCleanliness = editCleanliness;
