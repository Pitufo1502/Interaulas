// ===============================
// INTERAULAS 2026 - APP.JS
// ===============================

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ===============================
// EQUIPOS OFICIALES
// ===============================

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

// ===============================
// FECHAS DE LOS PARTIDOS
// IMPORTANTE:
// El partido #9 es Sep 22
// El partido #8 es Sep 23
// ===============================

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

// ===============================
// NOMBRES ANTIGUOS → NUEVOS
// ===============================

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
let editingSanctionId = null;
let editingScorerId = null;

// ===============================
// INICIO
// ===============================

document.addEventListener("DOMContentLoaded", async () => {
  setupButtons();
  await checkSession();
  await refresh();
});

// ===============================
// BOTONES
// ===============================

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

  // Cerrar modales
  document.querySelectorAll(".modal-close").forEach(btn => {
    btn.addEventListener("click", closeModals);
  });
}

// ===============================
// MODALES
// ===============================

function closeModals() {
  document.querySelectorAll(".modal").forEach(modal => {
    modal.classList.remove("show");
    modal.style.display = "none";
  });
}

function openModal(id) {
  const modal = document.getElementById(id);

  if (!modal) return;

  modal.classList.add("show");
  modal.style.display = "flex";
}

// ===============================
// AUTENTICACIÓN
// ===============================

async function checkSession() {
  const { data } = await db.auth.getSession();

  session = data.session;

  updateAuthUI();

  db.auth.onAuthStateChange((_event, newSession) => {
    session = newSession;
    updateAuthUI();
  });
}

function updateAuthUI() {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  document.querySelectorAll(".admin-only").forEach(el => {
    el.style.display = session ? "" : "none";
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

  const { error } = await db.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert("Error al iniciar sesión: " + error.message);
    return;
  }

  await checkSession();
  await refresh();
}

async function logout() {
  await db.auth.signOut();
  session = null;
  updateAuthUI();
  await refresh();
}

// ===============================
// REFRESH GENERAL
// ===============================

async function refresh() {
  await Promise.all([
    renderTables(),
    renderMatches(),
    renderSanctions(),
    renderScorers(),
    renderNext(),
    renderCleanliness()
  ]);
}

// ===============================
// NORMALIZAR EQUIPOS
// ===============================

function normalizeTeam(team) {
  if (!team) return "";

  const name = String(team).trim();

  return ALIASES[name] || name;
}

// ===============================
// ESTADÍSTICAS
// ===============================

function emptyStats() {
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

function getTeamStats(matches, adjustments, teams) {
  const stats = {};

  teams.forEach(team => {
    stats[team] = emptyStats();
  });

  matches.forEach(match => {
    const home = normalizeTeam(match.home_team);
    const away = normalizeTeam(match.away_team);

    if (!stats[home] || !stats[away]) return;

    if (
      match.home_score === null ||
      match.home_score === undefined ||
      match.away_score === null ||
      match.away_score === undefined
    ) {
      return;
    }

    const hs = Number(match.home_score);
    const as = Number(match.away_score);

    stats[home].PJ++;
    stats[away].PJ++;

    stats[home].GF += hs;
    stats[home].GC += as;

    stats[away].GF += as;
    stats[away].GC += hs;

    if (hs > as) {
      stats[home].G++;
      stats[away].P++;

      stats[home].PTS += 3;
    } else if (hs < as) {
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

  Object.keys(stats).forEach(team => {
    stats[team].DG = stats[team].GF - stats[team].GC;
  });

  adjustments.forEach(adj => {
    const team = normalizeTeam(adj.team);

    if (stats[team]) {
      stats[team].PTS += Number(adj.points || 0);
    }
  });

  return stats;
}

// ===============================
// TABLA HTML
// ===============================

function tableHTML(stats, teams) {
  const rows = teams
    .map(team => ({
      team,
      ...stats[team]
    }))
    .sort((a, b) => {
      if (b.PTS !== a.PTS) return b.PTS - a.PTS;
      if (b.DG !== a.DG) return b.DG - a.DG;
      if (b.GF !== a.GF) return b.GF - a.GF;
      return a.team.localeCompare(b.team);
    });

  return rows
    .map((row, index) => `
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
    `)
    .join("");
}

// ===============================
// TABLAS HOMBRES / MUJERES
// ===============================

async function renderTables() {
  const { data: matches, error: matchesError } = await db
    .from("matches")
    .select("*");

  if (matchesError) {
    console.error(matchesError);
    return;
  }

  const { data: adjustments, error: adjustmentError } = await db
    .from("point_adjustments")
    .select("*");

  if (adjustmentError) {
    console.error(adjustmentError);
  }

  const allMatches = matches || [];
  const allAdjustments = adjustments || [];

  const menMatches = allMatches.filter(
    m => String(m.gender || "").toUpperCase() === "M"
  );

  const womenMatches = allMatches.filter(
    m => String(m.gender || "").toUpperCase() === "F"
  );

  const menA = menMatches.filter(m =>
    MEN_A.includes(normalizeTeam(m.home_team)) ||
    MEN_A.includes(normalizeTeam(m.away_team))
  );

  const menB = menMatches.filter(m =>
    MEN_B.includes(normalizeTeam(m.home_team)) ||
    MEN_B.includes(normalizeTeam(m.away_team))
  );

  const menStatsA = getTeamStats(
    menA,
    allAdjustments,
    MEN_A
  );

  const menStatsB = getTeamStats(
    menB,
    allAdjustments,
    MEN_B
  );

  const womenStats = getTeamStats(
    womenMatches,
    allAdjustments,
    WOMEN
  );

  const menATable = document.getElementById("menTableA");
  const menBTable = document.getElementById("menTableB");
  const womenTable = document.getElementById("womenTable");

  if (menATable) {
    menATable.innerHTML = tableHTML(menStatsA, MEN_A);
  }

  if (menBTable) {
    menBTable.innerHTML = tableHTML(menStatsB, MEN_B);
  }

  if (womenTable) {
    womenTable.innerHTML = tableHTML(womenStats, WOMEN);
  }
}

// ===============================
// AJUSTE DE PUNTOS
// ===============================

async function editTeamPoints(team) {
  if (!session) {
    alert("Debes iniciar sesión como organizador.");
    return;
  }

  const value = prompt(
    `¿Cuántos puntos quieres ajustar para ${team}?`
  );

  if (value === null) return;

  const points = Number(value);

  if (Number.isNaN(points)) {
    alert("Ingresa un número válido.");
    return;
  }

  const { error } = await db
    .from("point_adjustments")
    .upsert({
      team,
      points
    });

  if (error) {
    alert("Error: " + error.message);
    return;
  }

  await refresh();
}

// ===============================
// ORDENAR PARTIDOS POR FECHA
// ===============================

function sortMatchesByDate(matches) {
  return [...matches].sort((a, b) => {
    const aDay = Number(a.day);
    const bDay = Number(b.day);

    const aDate =
      MATCH_DATE_VALUES[aDay] ||
      a.date ||
      "9999-12-31";

    const bDate =
      MATCH_DATE_VALUES[bDay] ||
      b.date ||
      "9999-12-31";

    if (aDate !== bDate) {
      return aDate.localeCompare(bDate);
    }

    return aDay - bDay;
  });
}

// ===============================
// FORMATO DE FECHA
// ===============================

function getMatchDate(match) {
  const day = Number(match.day);

  if (MATCH_DATES[day]) {
    return MATCH_DATES[day];
  }

  if (match.date) {
    const date = new Date(match.date);

    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("es-GT", {
        day: "numeric",
        month: "long"
      });
    }
  }

  return "Fecha por confirmar";
}

// ===============================
// RENDER PARTIDOS
// ===============================

async function renderMatches() {
  const container =
    document.getElementById("matchesList") ||
    document.getElementById("matches");

  if (!container) return;

  const { data: matches, error } = await db
    .from("matches")
    .select("*");

  if (error) {
    console.error(error);
    container.innerHTML =
      `<p class="muted">No se pudieron cargar los partidos.</p>`;
    return;
  }

  const sorted = sortMatchesByDate(matches || []);

  if (!sorted.length) {
    container.innerHTML =
      `<p class="muted">No hay partidos registrados.</p>`;
    return;
  }

  let html = "";
  let lastDate = "";

  sorted.forEach(match => {
    const date = getMatchDate(match);

    if (date !== lastDate) {
      html += `
        <div class="match-date-header">
          ${date}
        </div>
      `;

      lastDate = date;
    }

    const gender =
      String(match.gender || "").toUpperCase() === "F"
        ? "MUJERES"
        : "HOMBRES";

    const home = normalizeTeam(match.home_team);
    const away = normalizeTeam(match.away_team);

    const hasScore =
      match.home_score !== null &&
      match.home_score !== undefined &&
      match.away_score !== null &&
      match.away_score !== undefined;

    const score = hasScore
      ? `<div class="score">${match.home_score} - ${match.away_score}</div>`
      : `<div class="score">VS</div>`;

    html += `
      <div class="card match-card">

        <div class="match-info">
          <span>${gender}</span>
          <span>Partido #${match.day}</span>
        </div>

        <div class="match-teams">
          <div class="team home-team">
            <strong>${home}</strong>
          </div>

          ${score}

          <div class="team away-team">
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

// ===============================
// PRÓXIMO PARTIDO
// ===============================

async function renderNext() {
  const container =
    document.getElementById("nextMatch") ||
    document.getElementById("next-match");

  if (!container) return;

  const { data: matches, error } = await db
    .from("matches")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  const sorted = sortMatchesByDate(matches || []);

  const next = sorted.find(match =>
    match.home_score === null ||
    match.home_score === undefined ||
    match.away_score === null ||
    match.away_score === undefined
  );

  if (!next) {
    container.innerHTML = `
      <div class="card">
        <h3>🏆 Todos los partidos jugados</h3>
      </div>
    `;
    return;
  }

  const home = normalizeTeam(next.home_team);
  const away = normalizeTeam(next.away_team);
  const date = getMatchDate(next);

  container.innerHTML = `
    <div class="card next-match-card">
      <div class="match-info">
        <span>PRÓXIMO PARTIDO</span>
        <span>${date}</span>
      </div>

      <div class="match-teams">
        <div class="team">
          <strong>${home}</strong>
        </div>

        <div class="score">VS</div>

        <div class="team">
          <strong>${away}</strong>
        </div>
      </div>
    </div>
  `;
}

// ===============================
// EDITAR PARTIDO
// ===============================

async function editMatch(id) {
  if (!session) {
    alert("Debes iniciar sesión.");
    return;
  }

  editingMatchId = id;

  const { data: match, error } = await db
    .from("matches")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    alert("Error al cargar partido: " + error.message);
    return;
  }

  const title = document.getElementById("editMatchTitle");
  const homeScore = document.getElementById("homeScore");
  const awayScore = document.getElementById("awayScore");

  if (title) {
    title.textContent =
      `${normalizeTeam(match.home_team)} vs ${normalizeTeam(match.away_team)}`;
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

// ===============================
// GUARDAR MARCADOR
// ===============================

async function saveMatch() {
  if (!session || !editingMatchId) return;

  const homeScoreEl = document.getElementById("homeScore");
  const awayScoreEl = document.getElementById("awayScore");

  const homeScore =
    homeScoreEl.value === ""
      ? null
      : Number(homeScoreEl.value);

  const awayScore =
    awayScoreEl.value === ""
      ? null
      : Number(awayScoreEl.value);

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

  const { error } = await db
    .from("matches")
    .update({
      home_score: homeScore,
      away_score: awayScore
    })
    .eq("id", editingMatchId);

  if (error) {
    alert("Error al guardar: " + error.message);
    return;
  }

  closeModals();

  editingMatchId = null;

  await refresh();
}

// ===============================
// GOLEADORES
// ===============================

async function renderScorers() {
  const { data: scorers, error } = await db
    .from("scorers")
    .select("*")
    .order("goals", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const men = (scorers || []).filter(
    s => String(s.gender || "").toUpperCase() === "M"
  );

  const women = (scorers || []).filter(
    s => String(s.gender || "").toUpperCase() === "F"
  );

  const menContainer =
    document.getElementById("menScorers") ||
    document.getElementById("scorersMen");

  const womenContainer =
    document.getElementById("womenScorers") ||
    document.getElementById("scorersWomen");

  if (menContainer) {
    menContainer.innerHTML = scorerRows(men);
  }

  if (womenContainer) {
    womenContainer.innerHTML = scorerRows(women);
  }
}

function scorerRows(scorers) {
  if (!scorers.length) {
    return `<p class="muted">No hay goleadores registrados.</p>`;
  }

  return `
    <div class="scorers-list">
      ${scorers
        .map((scorer, index) => `
          <div class="scorer-row">
            <div>
              <strong>${index + 1}. ${scorer.player}</strong>
              <small>${normalizeTeam(scorer.team)}</small>
            </div>

            <strong>${scorer.goals} ⚽</strong>

            ${
              session
                ? `
                  <div class="scorer-actions">
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
        `)
        .join("")}
    </div>
  `;
}

// ===============================
// AGREGAR GOLEADOR
// ===============================

async function addScorer() {
  if (!session) {
    alert("Debes iniciar sesión.");
    return;
  }

  const player = prompt("Nombre del jugador:");
  if (!player) return;

  const team = prompt("Equipo:");
  if (!team) return;

  const genderInput =
    prompt("Género: M = Hombres / F = Mujeres");

  if (!genderInput) return;

  const gender = genderInput.toUpperCase();

  if (gender !== "M" && gender !== "F") {
    alert("Usa M o F.");
    return;
  }

  const goalsInput = prompt("Cantidad de goles:", "0");
  if (goalsInput === null) return;

  const goals = Number(goalsInput);

  if (Number.isNaN(goals) || goals < 0) {
    alert("Cantidad de goles inválida.");
    return;
  }

  const { error } = await db
    .from("scorers")
    .insert({
      player,
      team: normalizeTeam(team),
      gender,
      goals
    });

  if (error) {
    alert("Error: " + error.message);
    return;
  }

  await refresh();
}

// ===============================
// EDITAR GOLEADOR
// ===============================

async function editScorer(id) {
  if (!session) return;

  const { data: scorer, error } = await db
    .from("scorers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    alert(error.message);
    return;
  }

  const player = prompt(
    "Nombre del jugador:",
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

  if (Number.isNaN(goals) || goals < 0) {
    alert("Cantidad inválida.");
    return;
  }

  const { error: updateError } = await db
    .from("scorers")
    .update({
      player,
      team: normalizeTeam(team),
      goals
    })
    .eq("id", id);

  if (updateError) {
    alert(updateError.message);
    return;
  }

  await refresh();
}

// ===============================
// ELIMINAR GOLEADOR
// ===============================

async function deleteScorer(id) {
  if (!session) return;

  if (!confirm("¿Eliminar este goleador?")) {
    return;
  }

  const { error } = await db
    .from("scorers")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  await refresh();
}

// ===============================
// SANCIONES
// ===============================

async function renderSanctions() {
  const container =
    document.getElementById("sanctionsList") ||
    document.getElementById("sanctions");

  if (!container) return;

  const { data: sanctions, error } = await db
    .from("sanctions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);

    container.innerHTML = `
      <p class="muted">
        No se pudieron cargar las sanciones.
      </p>
    `;

    return;
  }

  if (!sanctions || sanctions.length === 0) {
    container.innerHTML = `
      <div class="card sanction-card">
        <p class="muted">
          No hay sanciones registradas.
        </p>
      </div>
    `;

    return;
  }

  container.innerHTML = sanctions
    .map(sanction => `
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

        ${
          sanction.description
            ? `
              <div class="sanction-description">
                ${sanction.description}
              </div>
            `
            : ""
        }

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
    `)
    .join("");
}

// ===============================
// AGREGAR SANCIÓN
// ===============================

async function addSanction() {
  if (!session) {
    alert("Debes iniciar sesión como organizador.");
    return;
  }

  const player = prompt("Nombre del jugador:");

  if (!player) return;

  const team = prompt("Equipo:");

  if (!team) return;

  const type = prompt(
    "Tipo de sanción:",
    "Tarjeta"
  );

  if (!type) return;

  const description = prompt(
    "Descripción de la sanción:"
  );

  if (description === null) return;

  const { error } = await db
    .from("sanctions")
    .insert({
      player,
      team: normalizeTeam(team),
      type,
      description
    });

  if (error) {
    alert("Error al agregar sanción: " + error.message);
    return;
  }

  await refresh();
}

// ===============================
// EDITAR SANCIÓN
// ===============================

async function editSanction(id) {
  if (!session) {
    alert("Debes iniciar sesión.");
    return;
  }

  const { data: sanction, error } = await db
    .from("sanctions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    alert("Error: " + error.message);
    return;
  }

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

  const { error: updateError } = await db
    .from("sanctions")
    .update({
      player,
      team: normalizeTeam(team),
      type,
      description
    })
    .eq("id", id);

  if (updateError) {
    alert(
      "Error al actualizar sanción: " +
      updateError.message
    );
    return;
  }

  await refresh();
}

// ===============================
// ELIMINAR SANCIÓN
// ===============================

async function deleteSanction(id) {
  if (!session) {
    alert("Debes iniciar sesión.");
    return;
  }

  if (!confirm("¿Seguro que quieres eliminar esta sanción?")) {
    return;
  }

  const { error } = await db
    .from("sanctions")
    .delete()
    .eq("id", id);

  if (error) {
    alert(
      "Error al eliminar sanción: " +
      error.message
    );
    return;
  }

  await refresh();
}

// ===============================
// GRADO
// ===============================

async function renderCleanliness() {
  const container =
    document.getElementById("cleanlinessTable");

  if (!container) return;

  const { data, error } = await db
    .from("cleanliness_scores")
    .select("*")
    .order("points", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  container.innerHTML = (data || [])
    .map((row, index) => `
      <tr>
        <td>${index + 1}</td>
        <td><strong>${row.grade}</strong></td>
        <td>${row.points}</td>
        <td>${row.reason || ""}</td>
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
    `)
    .join("");
}

// ===============================
// EDITAR GRADO
// ===============================

async function editCleanliness(id) {
  if (!session) return;

  const { data: row, error } = await db
    .from("cleanliness_scores")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    alert(error.message);
    return;
  }

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

  const { error: updateError } = await db
    .from("cleanliness_scores")
    .update({
      points,
      reason,
      updated_at: new Date().toISOString()
    })
    .eq("id", id);

  if (updateError) {
    alert(updateError.message);
    return;
  }

  await refresh();
}

// ===============================
// EXPORTAR FUNCIONES
// ===============================

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
