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

const ALL_TEAMS = [...MEN_A, ...MEN_B, ...WOMEN];

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
// CALENDARIO OFICIAL
// ============================================================

const SCHEDULE = [
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
    day: 9,
    date: "2026-09-22",
    gender: "M",
    group: "A",
    home: "Fortnite",
    away: "Chispazos"
  },
  {
    day: 8,
    date: "2026-09-23",
    gender: "F",
    group: "Mujeres",
    home: "Ponys",
    away: "Innombrables"
  },
  {
    day: 10,
    date: "2026-09-24",
    gender: "F",
    group: "Mujeres",
    home: "Jags",
    away: "Troncas"
  },
  {
    day: 11,
    date: "2026-09-25",
    gender: "M",
    group: "B",
    home: "TOROS FC",
    away: "Sin Espinas"
  },
  {
    day: 12,
    date: "2026-09-28",
    gender: "F",
    group: "Mujeres",
    home: "Osas Mañosas",
    away: "Las Cabritas"
  },
  {
    day: 13,
    date: "2026-09-29",
    gender: "M",
    group: "A",
    home: "Chifladitos",
    away: "Papitos"
  },
  {
    day: 14,
    date: "2026-09-30",
    gender: "F",
    group: "Mujeres",
    home: "Ponys",
    away: "Troncas"
  },
  {
    day: 15,
    date: "2026-10-01",
    gender: "M",
    group: "B",
    home: "Motoneta",
    away: "Osos Mañosos"
  },
  {
    day: 16,
    date: "2026-10-02",
    gender: "F",
    group: "Mujeres",
    home: "Jags",
    away: "Osas Mañosas"
  },
  {
    day: 17,
    date: "2026-10-05",
    gender: "M",
    group: "A",
    home: "Trocos",
    away: "Chispazos"
  },
  {
    day: 18,
    date: "2026-10-06",
    gender: "F",
    group: "Mujeres",
    home: "Innombrables",
    away: "Las Cabritas"
  },
  {
    day: 19,
    date: "2026-10-07",
    gender: "M",
    group: "B",
    home: "La Banca",
    away: "TOROS FC"
  },
  {
    day: 20,
    date: "2026-10-08",
    gender: "F",
    group: "Mujeres",
    home: "Ponys",
    away: "Las Cabritas"
  },
  {
    day: 21,
    date: "2026-10-09",
    gender: "M",
    group: "A",
    home: "Fortnite",
    away: "Papitos"
  },
  {
    day: 22,
    date: "2026-10-12",
    gender: "F",
    group: "Mujeres",
    home: "Troncas",
    away: "Osas Mañosas"
  },
  {
    day: 23,
    date: "2026-10-13",
    gender: "M",
    group: "B",
    home: "Motoneta",
    away: "TOROS FC"
  },
  {
    day: 24,
    date: "2026-10-14",
    gender: "F",
    group: "Mujeres",
    home: "Ponys",
    away: "Osas Mañosas"
  },
  {
    day: 25,
    date: "2026-10-15",
    gender: "M",
    group: "A",
    home: "Chifladitos",
    away: "Chispazos"
  },
  {
    day: 26,
    date: "2026-10-16",
    gender: "F",
    group: "Mujeres",
    home: "Innombrables",
    away: "Jags"
  },
  {
    day: 27,
    date: "2026-10-21",
    gender: "M",
    group: "B",
    home: "Sin Espinas",
    away: "Osos Mañosos"
  },
  {
    day: 28,
    date: "2026-10-22",
    gender: "F",
    group: "Mujeres",
    home: "Las Cabritas",
    away: "Jags"
  },
  {
    day: 29,
    date: "2026-10-23",
    gender: "M",
    group: "A",
    home: "Fortnite",
    away: "Trocos"
  },
  {
    day: 30,
    date: "2026-10-26",
    gender: "F",
    group: "Mujeres",
    home: "Troncas",
    away: "Innombrables"
  },
  {
    day: 31,
    date: "2026-10-27",
    gender: "M",
    group: "B",
    home: "Sin Espinas",
    away: "La Banca"
  },
  {
    day: 32,
    date: "2026-10-28",
    gender: "M",
    group: "A",
    home: "Papitos",
    away: "Chispazos"
  },
  {
    day: 33,
    date: "2026-10-30",
    gender: "M",
    group: "B",
    home: "Osos Mañosos",
    away: "TOROS FC"
  },
  {
    day: 34,
    date: "2026-11-02",
    gender: "M",
    group: "A",
    home: "Trocos",
    away: "Chifladitos"
  },
  {
    day: 35,
    date: "2026-11-03",
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
let selectedScorerId = null;
let selectedSanctionId = null;

// ============================================================
// HELPERS
// ============================================================

function $(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  if (value === null || value === undefined) return "";

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(`${dateString}T12:00:00`);

  return date.toLocaleDateString("es-GT", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
}

function formatDateShort(dateString) {
  if (!dateString) return "";

  const date = new Date(`${dateString}T12:00:00`);

  return date.toLocaleDateString("es-GT", {
    day: "2-digit",
    month: "2-digit"
  });
}

function isMen(team) {
  return MEN_A.includes(normalizeTeam(team)) ||
         MEN_B.includes(normalizeTeam(team));
}

function isWomen(team) {
  return WOMEN.includes(normalizeTeam(team));
}

function getGenderLabel(gender) {
  return gender === "M" ? "Hombres" : "Mujeres";
}

function getTeamGroup(team) {
  const normalized = normalizeTeam(team);

  if (MEN_A.includes(normalized)) return "A";
  if (MEN_B.includes(normalized)) return "B";
  return "Mujeres";
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
// AUTH
// ============================================================

async function login() {
  const email = $("email")?.value.trim();
  const password = $("password")?.value;

  const message = $("authMessage");

  if (!email || !password) {
    if (message) message.textContent = "Escribe tu correo y contraseña.";
    return;
  }

  if (message) {
    message.textContent = "Iniciando sesión...";
  }

  const { data, error } = await db.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error("LOGIN ERROR:", error);

    if (message) {
      message.textContent = error.message;
    }

    return;
  }

  currentSession = data.session;

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
  const { data, error } = await db.auth.getSession();

  if (error) {
    console.error("SESSION ERROR:", error);
    currentSession = null;
  } else {
    currentSession = data.session;
  }

  updateAuthUI();
}

function updateAuthUI() {
  const loginBtn = $("loginBtn");
  const addScorerBtn = $("addScorerBtn");
  const addSanctionBtn = $("addSanctionBtn");

  if (currentSession) {
    if (loginBtn) {
      loginBtn.textContent = "Cerrar sesión";
      loginBtn.onclick = logout;
    }

    if (addScorerBtn) {
      addScorerBtn.classList.remove("hidden");
      addScorerBtn.style.display = "";
    }

    if (addSanctionBtn) {
      addSanctionBtn.classList.remove("hidden");
      addSanctionBtn.style.display = "";
    }
  } else {
    if (loginBtn) {
      loginBtn.textContent = "Iniciar sesión";
      loginBtn.onclick = () => openModal("authModal");
    }

    if (addScorerBtn) {
      addScorerBtn.classList.add("hidden");
      addScorerBtn.style.display = "none";
    }

    if (addSanctionBtn) {
      addSanctionBtn.classList.add("hidden");
      addSanctionBtn.style.display = "none";
    }
  }
}

// ============================================================
// CARGAR TODOS LOS DATOS
// ============================================================

async function refreshAll() {
  console.log("INTERAULAS: actualizando datos...");

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

  console.log("INTERAULAS: datos cargados.");
}

// ============================================================
// PARTIDOS
// ============================================================

async function loadMatches() {
  const { data, error } = await db
    .from("matches")
    .select("*");

  if (error) {
    console.error("Error cargando matches:", error);
    matchesData = [];
    return;
  }

  matchesData = data || [];

  // Normalizamos solo para mostrar.
  matchesData = matchesData.map(match => ({
    ...match,
    home_team: normalizeTeam(match.home_team),
    away_team: normalizeTeam(match.away_team)
  }));
}

function getMatchForDay(day) {
  return matchesData.find(match => Number(match.day) === Number(day));
}

function renderNextMatch() {
  const container = $("nextMatch");

  if (!container) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = SCHEDULE
    .filter(game => {
      const d = new Date(`${game.date}T12:00:00`);
      return d >= today;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  if (!upcoming.length) {
    container.innerHTML = `
      <div>
        <div class="eyebrow">INTERAULAS 2026</div>
        <h2>Temporada finalizada</h2>
        <p>Todos los partidos han sido jugados.</p>
      </div>
    `;
    return;
  }

  const next = upcoming[0];
  const saved = getMatchForDay(next.day);

  let scoreText = "VS";

  if (
    saved &&
    saved.home_score !== null &&
    saved.home_score !== undefined &&
    saved.away_score !== null &&
    saved.away_score !== undefined
  ) {
    scoreText = `${saved.home_score} - ${saved.away_score}`;
  }

  container.innerHTML = `
    <div>
      <div class="eyebrow">PRÓXIMO PARTIDO · ${getGenderLabel(next.gender)}</div>
      <h2>${escapeHtml(next.home)} <span>${scoreText}</span> ${escapeHtml(next.away)}</h2>
      <p>${escapeHtml(formatDate(next.date))}</p>
    </div>
  `;
}

function renderMatches() {
  const container = $("matches");

  if (!container) return;

  let html = "";

  for (const game of SCHEDULE) {
    const saved = getMatchForDay(game.day);

    let score = "—";

    if (
      saved &&
      saved.home_score !== null &&
      saved.home_score !== undefined &&
      saved.away_score !== null &&
      saved.away_score !== undefined
    ) {
      score = `${saved.home_score} - ${saved.away_score}`;
    }

    html += `
      <div class="matchday">
        <h3>
          Jornada ${game.day} · ${formatDate(game.date)}
          · ${getGenderLabel(game.gender)}
        </h3>

        <div class="match">
          <div>
            <strong>${formatDateShort(game.date)}</strong>
          </div>

          <div>
            <strong>${escapeHtml(game.home)}</strong>
            vs
            <strong>${escapeHtml(game.away)}</strong>
          </div>

          <div class="score">
            ${score}
          </div>

          <div class="edit">
            ${
              currentSession
                ? `<button class="outline" onclick="editMatch(${game.day})">Editar</button>`
                : ""
            }
          </div>
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

async function editMatch(day) {
  if (!currentSession) {
    alert("Debes iniciar sesión como administrador.");
    return;
  }

  const game = SCHEDULE.find(g => Number(g.day) === Number(day));

  if (!game) return;

  const saved = getMatchForDay(day);

  selectedMatchId = saved?.id || null;

  $("editMatchTitle").textContent =
    `${game.home} vs ${game.away}`;

  $("homeScore").value =
    saved?.home_score ?? "";

  $("awayScore").value =
    saved?.away_score ?? "";

  $("editModal").dataset.day = String(day);

  openModal("editModal");
}

async function saveMatch() {
  if (!currentSession) {
    alert("Debes iniciar sesión como administrador.");
    return;
  }

  const day = Number($("editModal")?.dataset.day);

  const game = SCHEDULE.find(g => Number(g.day) === day);

  if (!game) return;

  const homeScoreRaw = $("homeScore")?.value;
  const awayScoreRaw = $("awayScore")?.value;

  if (homeScoreRaw === "" || awayScoreRaw === "") {
    alert("Ingresa ambos marcadores.");
    return;
  }

  const homeScore = Number(homeScoreRaw);
  const awayScore = Number(awayScoreRaw);

  if (
    !Number.isInteger(homeScore) ||
    !Number.isInteger(awayScore) ||
    homeScore < 0 ||
    awayScore < 0
  ) {
    alert("Los marcadores deben ser números enteros positivos.");
    return;
  }

  let error;

  if (selectedMatchId) {
    const result = await db
      .from("matches")
      .update({
        home_score: homeScore,
        away_score: awayScore
      })
      .eq("id", selectedMatchId);

    error = result.error;
  } else {
    const result = await db
      .from("matches")
      .insert({
        day: game.day,
        date: game.date,
        gender: game.gender,
        group_name: game.group,
        home_team: game.home,
        away_team: game.away,
        home_score: homeScore,
        away_score: awayScore
      });

    error = result.error;
  }

  if (error) {
    console.error("SAVE MATCH ERROR:", error);
    alert("No se pudo guardar el partido:\n\n" + error.message);
    return;
  }

  closeModal("editModal");

  await refreshAll();
}

window.editMatch = editMatch;
window.saveMatch = saveMatch;

// ============================================================
// TABLAS DE POSICIONES
// ============================================================

async function loadPointAdjustments() {
  const { data, error } = await db
    .from("point_adjustments")
    .select("*");

  if (error) {
    console.error("Error cargando point_adjustments:", error);
    pointAdjustments = [];
    return;
  }

  pointAdjustments = data || [];
}

function getManualPoints(team) {
  const normalized = normalizeTeam(team);

  const row = pointAdjustments.find(
    item => normalizeTeam(item.team) === normalized
  );

  return Number(row?.points || 0);
}

function calculateStandings(teams) {
  const table = {};

  for (const team of teams) {
    table[team] = {
      team,
      PJ: 0,
      PG: 0,
      PE: 0,
      PP: 0,
      GF: 0,
      GC: 0,
      DG: 0,
      PTS: 0,
      manual: getManualPoints(team)
    };
  }

  for (const game of SCHEDULE) {
    if (!teams.includes(game.home) || !teams.includes(game.away)) {
      continue;
    }

    const saved = getMatchForDay(game.day);

    if (!saved) continue;

    if (
      saved.home_score === null ||
      saved.home_score === undefined ||
      saved.away_score === null ||
      saved.away_score === undefined
    ) {
      continue;
    }

    const homeScore = Number(saved.home_score);
    const awayScore = Number(saved.away_score);

    const home = table[game.home];
    const away = table[game.away];

    if (!home || !away) continue;

    home.PJ++;
    away.PJ++;

    home.GF += homeScore;
    home.GC += awayScore;

    away.GF += awayScore;
    away.GC += homeScore;

    home.DG = home.GF - home.GC;
    away.DG = away.GF - away.GC;

    if (homeScore > awayScore) {
      home.PG++;
      home.PTS += 3;

      away.PP++;
    } else if (homeScore < awayScore) {
      away.PG++;
      away.PTS += 3;

      home.PP++;
    } else {
      home.PE++;
      away.PE++;

      home.PTS++;
      away.PTS++;
    }
  }

  for (const team of Object.values(table)) {
    team.PTS += team.manual;
  }

  return Object.values(table).sort((a, b) => {
    if (b.PTS !== a.PTS) return b.PTS - a.PTS;
    if (b.DG !== a.DG) return b.DG - a.DG;
    if (b.GF !== a.GF) return b.GF - a.GF;

    return a.team.localeCompare(b.team);
  });
}

function renderStandings() {
  const menContainer = $("menTables");
  const womenContainer = $("womenTable");

  const menA = calculateStandings(MEN_A);
  const menB = calculateStandings(MEN_B);
  const women = calculateStandings(WOMEN);

  if (menContainer) {
    menContainer.innerHTML = `
      <div class="card">
        <h3>Grupo A</h3>
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
                ${currentSession ? "<th>Admin</th>" : ""}
              </tr>
            </thead>
            <tbody>
              ${renderStandingRows(menA)}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <h3>Grupo B</h3>
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
                ${currentSession ? "<th>Admin</th>" : ""}
              </tr>
            </thead>
            <tbody>
              ${renderStandingRows(menB)}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  if (womenContainer) {
    womenContainer.innerHTML = `
      <div class="card">
        <h3>Tabla de Mujeres</h3>

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
                ${currentSession ? "<th>Admin</th>" : ""}
              </tr>
            </thead>

            <tbody>
              ${renderStandingRows(women)}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}

function renderStandingRows(rows) {
  return rows.map((row, index) => `
    <tr>
      <td class="rank">${index + 1}</td>

      <td>
        <strong>${escapeHtml(row.team)}</strong>
        ${
          row.manual !== 0
            ? `<br><small>Manual: ${row.manual > 0 ? "+" : ""}${row.manual}</small>`
            : ""
        }
      </td>

      <td>${row.PJ}</td>
      <td>${row.PG}</td>
      <td>${row.PE}</td>
      <td>${row.PP}</td>
      <td>${row.GF}</td>
      <td>${row.GC}</td>
      <td>${row.DG}</td>
      <td class="pts">${row.PTS}</td>

      ${
        currentSession
          ? `
            <td>
              <button
                class="outline"
                onclick="editTeamPoints('${escapeHtml(row.team)}')"
              >
                Editar
              </button>
            </td>
          `
          : ""
      }
    </tr>
  `).join("");
}

// ============================================================
// EDITAR PUNTOS MANUALES
// ============================================================

async function editTeamPoints(teamName) {
  if (!currentSession) {
    alert("Debes iniciar sesión como administrador.");
    return;
  }

  const team = normalizeTeam(teamName);

  const current = getManualPoints(team);

  const newValue = prompt(
    `Puntos manuales para ${team}.\n\n` +
    `Actualmente: ${current}\n\n` +
    `Escribe el nuevo valor:`,
    String(current)
  );

  if (newValue === null) {
    return;
  }

  const points = Number(newValue);

  if (!Number.isFinite(points) || !Number.isInteger(points)) {
    alert("Los puntos deben ser un número entero.");
    return;
  }

  const reason = prompt(
    `Motivo de los puntos manuales para ${team}:`,
    ""
  );

  if (reason === null) {
    return;
  }

  console.log("Guardando puntos:", {
    team,
    points,
    reason
  });

  // ----------------------------------------------------------
  // IMPORTANTE:
  // NO usamos upsert.
  // Primero buscamos la fila y luego hacemos UPDATE o INSERT.
  // ----------------------------------------------------------

  const { data: existingRows, error: selectError } = await db
    .from("point_adjustments")
    .select("id, team, points, reason, updated_at")
    .eq("team", team)
    .limit(1);

  if (selectError) {
    console.error("POINT SELECT ERROR:", selectError);

    alert(
      "No se pudieron consultar los puntos.\n\n" +
      selectError.message
    );

    return;
  }

  let saveError = null;

  if (existingRows && existingRows.length > 0) {
    const existing = existingRows[0];

    const result = await db
      .from("point_adjustments")
      .update({
        team: team,
        points: points,
        reason: reason,
        updated_at: new Date().toISOString()
      })
      .eq("id", existing.id);

    saveError = result.error;

  } else {
    const result = await db
      .from("point_adjustments")
      .insert({
        team: team,
        points: points,
        reason: reason,
        updated_at: new Date().toISOString()
      });

    saveError = result.error;
  }

  if (saveError) {
    console.error("POINT SAVE ERROR:", saveError);

    alert(
      "No se pudieron guardar los puntos.\n\n" +
      saveError.message +
      "\n\nRevisa también las políticas RLS de point_adjustments en Supabase."
    );

    return;
  }

  alert(`Puntos de ${team} actualizados.`);

  await refreshAll();
}

window.editTeamPoints = editTeamPoints;

// ============================================================
// GOLEADORES
// ============================================================

async function loadScorers() {
  const { data, error } = await db
    .from("scorers")
    .select("*")
    .order("goals", { ascending: false });

  if (error) {
    console.error("Error cargando goleadores:", error);
    scorersData = [];
    return;
  }

  scorersData = data || [];

  scorersData = scorersData.map(player => ({
    ...player,
    team: normalizeTeam(player.team)
  }));
}

function renderScorers() {
  const men = $("menScorers");
  const women = $("womenScorers");

  const menScorers = scorersData
    .filter(player => isMen(player.team))
    .sort((a, b) => Number(b.goals || 0) - Number(a.goals || 0));

  const womenScorers = scorersData
    .filter(player => isWomen(player.team))
    .sort((a, b) => Number(b.goals || 0) - Number(a.goals || 0));

  if (men) {
    men.innerHTML = renderScorerRows(menScorers);
  }

  if (women) {
    women.innerHTML = renderScorerRows(womenScorers);
  }
}

function renderScorerRows(rows) {
  if (!rows.length) {
    return `
      <tr>
        <td colspan="${currentSession ? 4 : 3}">
          No hay goleadores registrados.
        </td>
      </tr>
    `;
  }

  return rows.map((player, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${escapeHtml(player.player || player.name || "")}</td>
      <td>${escapeHtml(player.team || "")}</td>
      <td><strong>${Number(player.goals || 0)}</strong></td>

      ${
        currentSession
          ? `
            <td>
              <button
                class="outline"
                onclick="editScorer('${escapeHtml(player.id)}')"
              >
                Editar
              </button>

              <button
                class="danger"
                onclick="deleteScorer('${escapeHtml(player.id)}')"
              >
                Eliminar
              </button>
            </td>
          `
          : ""
      }
    </tr>
  `).join("");
}

async function addScorer() {
  if (!currentSession) {
    alert("Debes iniciar sesión como administrador.");
    return;
  }

  const player = prompt("Nombre del goleador:");

  if (!player) return;

  const teamInput = prompt(
    "Equipo:\n\n" +
    ALL_TEAMS.join("\n")
  );

  if (!teamInput) return;

  const team = normalizeTeam(teamInput);

  if (!ALL_TEAMS.includes(team)) {
    alert("Ese equipo no existe.");
    return;
  }

  const goalsInput = prompt("Cantidad de goles:", "0");

  if (goalsInput === null) return;

  const goals = Number(goalsInput);

  if (!Number.isInteger(goals) || goals < 0) {
    alert("Los goles deben ser un número entero.");
    return;
  }

  const { error } = await db
    .from("scorers")
    .insert({
      player,
      team,
      goals
    });

  if (error) {
    console.error("ADD SCORER ERROR:", error);
    alert("No se pudo agregar el goleador:\n\n" + error.message);
    return;
  }

  await refreshAll();
}

async function editScorer(id) {
  if (!currentSession) {
    alert("Debes iniciar sesión como administrador.");
    return;
  }

  const playerData = scorersData.find(
    player => String(player.id) === String(id)
  );

  if (!playerData) return;

  const player = prompt(
    "Nombre del goleador:",
    playerData.player || playerData.name || ""
  );

  if (!player) return;

  const teamInput = prompt(
    "Equipo:",
    playerData.team || ""
  );

  if (!teamInput) return;

  const team = normalizeTeam(teamInput);

  if (!ALL_TEAMS.includes(team)) {
    alert("Ese equipo no existe.");
    return;
  }

  const goalsInput = prompt(
    "Cantidad de goles:",
    String(playerData.goals || 0)
  );

  if (goalsInput === null) return;

  const goals = Number(goalsInput);

  if (!Number.isInteger(goals) || goals < 0) {
    alert("Los goles deben ser un número entero.");
    return;
  }

  const { error } = await db
    .from("scorers")
    .update({
      player,
      team,
      goals
    })
    .eq("id", id);

  if (error) {
    console.error("EDIT SCORER ERROR:", error);
    alert("No se pudo editar:\n\n" + error.message);
    return;
  }

  await refreshAll();
}

async function deleteScorer(id) {
  if (!currentSession) {
    alert("Debes iniciar sesión como administrador.");
    return;
  }

  if (!confirm("¿Eliminar este goleador?")) {
    return;
  }

  const { error } = await db
    .from("scorers")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("DELETE SCORER ERROR:", error);
    alert("No se pudo eliminar:\n\n" + error.message);
    return;
  }

  await refreshAll();
}

window.addScorer = addScorer;
window.editScorer = editScorer;
window.deleteScorer = deleteScorer;

// ============================================================
// SANCIONES
// ============================================================

async function loadSanctions() {
  const { data, error } = await db
    .from("sanctions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando sanciones:", error);
    sanctionsData = [];
    return;
  }

  sanctionsData = data || [];

  sanctionsData = sanctionsData.map(item => ({
    ...item,
    team: normalizeTeam(item.team)
  }));
}

function renderSanctions() {
  const container = $("sanctions");

  if (!container) return;

  if (!sanctionsData.length) {
    container.innerHTML = `
      <div class="empty">
        No hay sanciones registradas.
      </div>
    `;

    return;
  }

  container.innerHTML = sanctionsData.map(item => `
    <div class="sanction">

      <div>
        <strong>${escapeHtml(item.player || "")}</strong>
      </div>

      <div>
        ${escapeHtml(item.team || "")}
      </div>

      <div>
        <strong>${escapeHtml(item.type || "")}</strong>
      </div>

      <div>
        ${escapeHtml(item.description || "")}
      </div>

      ${
        currentSession
          ? `
            <div>
              <button
                class="outline"
                onclick="editSanction('${escapeHtml(item.id)}')"
              >
                Editar
              </button>

              <button
                class="danger"
                onclick="deleteSanction('${escapeHtml(item.id)}')"
              >
                Eliminar
              </button>
            </div>
          `
          : ""
      }

    </div>
  `).join("");
}

// ------------------------------------------------------------
// TIPO DE SANCIÓN
// ------------------------------------------------------------

function chooseSanctionType(currentType = "") {
  const choice = prompt(
    "Tipo de sanción:\n\n" +
    "1 = Tarjeta amarilla\n" +
    "2 = Tarjeta roja\n" +
    "3 = Suspensión\n" +
    "4 = Otra\n\n" +
    `Actual: ${currentType || "Ninguna"}\n\n` +
    "Escribe 1, 2, 3 o 4:",
    currentType === "Tarjeta amarilla"
      ? "1"
      : currentType === "Tarjeta roja"
        ? "2"
        : currentType === "Suspensión"
          ? "3"
          : currentType === "Otra"
            ? "4"
            : "1"
  );

  if (choice === null) return null;

  const value = String(choice).trim();

  const types = {
    "1": "Tarjeta amarilla",
    "2": "Tarjeta roja",
    "3": "Suspensión",
    "4": "Otra"
  };

  if (!types[value]) {
    alert("Selecciona 1, 2, 3 o 4.");
    return null;
  }

  return types[value];
}

// ------------------------------------------------------------
// AGREGAR SANCIÓN
// ------------------------------------------------------------

async function addSanction() {
  if (!currentSession) {
    alert("Debes iniciar sesión como administrador.");
    return;
  }

  const player = prompt("Nombre del jugador:");

  if (!player) return;

  const teamInput = prompt(
    "Equipo:\n\n" +
    ALL_TEAMS.join("\n")
  );

  if (!teamInput) return;

  const team = normalizeTeam(teamInput);

  if (!ALL_TEAMS.includes(team)) {
    alert("Ese equipo no existe.");
    return;
  }

  // AQUÍ ESTÁ LA CORRECCIÓN:
  // vuelve a existir el selector de TARJETA.
  const type = chooseSanctionType();

  if (!type) return;

  const description = prompt(
    "Descripción de la sanción:",
    ""
  );

  if (description === null) return;

  const { error } = await db
    .from("sanctions")
    .insert({
      team,
      player,
      type,
      description
    });

  if (error) {
    console.error("ADD SANCTION ERROR:", error);

    alert(
      "No se pudo guardar la sanción.\n\n" +
      error.message
    );

    return;
  }

  await refreshAll();
}

// ------------------------------------------------------------
// EDITAR SANCIÓN
// ------------------------------------------------------------

async function editSanction(id) {
  if (!currentSession) {
    alert("Debes iniciar sesión como administrador.");
    return;
  }

  const sanction = sanctionsData.find(
    item => String(item.id) === String(id)
  );

  if (!sanction) return;

  const player = prompt(
    "Nombre del jugador:",
    sanction.player || ""
  );

  if (!player) return;

  const teamInput = prompt(
    "Equipo:",
    sanction.team || ""
  );

  if (!teamInput) return;

  const team = normalizeTeam(teamInput);

  if (!ALL_TEAMS.includes(team)) {
    alert("Ese equipo no existe.");
    return;
  }

  const type = chooseSanctionType(
    sanction.type || ""
  );

  if (!type) return;

  const description = prompt(
    "Descripción de la sanción:",
    sanction.description || ""
  );

  if (description === null) return;

  const { error } = await db
    .from("sanctions")
    .update({
      team,
      player,
      type,
      description
    })
    .eq("id", id);

  if (error) {
    console.error("EDIT SANCTION ERROR:", error);

    alert(
      "No se pudo editar la sanción.\n\n" +
      error.message
    );

    return;
  }

  await refreshAll();
}

// ------------------------------------------------------------
// ELIMINAR SANCIÓN
// ------------------------------------------------------------

async function deleteSanction(id) {
  if (!currentSession) {
    alert("Debes iniciar sesión como administrador.");
    return;
  }

  if (!confirm("¿Eliminar esta sanción?")) {
    return;
  }

  const { error } = await db
    .from("sanctions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("DELETE SANCTION ERROR:", error);

    alert(
      "No se pudo eliminar la sanción.\n\n" +
      error.message
    );

    return;
  }

  await refreshAll();
}

window.addSanction = addSanction;
window.editSanction = editSanction;
window.deleteSanction = deleteSanction;

// ============================================================
// GRADO
// ============================================================

async function loadCleanliness() {
  const { data, error } = await db
    .from("cleanliness_scores")
    .select("*");

  if (error) {
    console.error("Error cargando grado:", error);
    cleanlinessData = [];
    return;
  }

  cleanlinessData = data || [];
}

function renderCleanliness() {
  const tbody = $("cleanlinessTable");

  if (!tbody) return;

  if (!cleanlinessData.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10">
          No hay datos registrados.
        </td>
      </tr>
    `;

    return;
  }

  tbody.innerHTML = cleanlinessData.map((row, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${escapeHtml(
        row.grade ||
        row.grado ||
        row.team ||
        row.name ||
        ""
      )}</td>
      <td>${escapeHtml(
        row.points ??
        row.score ??
        row.puntos ??
        0
      )}</td>
    </tr>
  `).join("");
}

// ============================================================
// EVENTOS
// ============================================================

function setupEvents() {
  const loginBtn = $("loginBtn");

  if (loginBtn) {
    loginBtn.onclick = () => {
      if (currentSession) {
        logout();
      } else {
        openModal("authModal");
      }
    };
  }

  const addScorerBtn = $("addScorerBtn");

  if (addScorerBtn) {
    addScorerBtn.onclick = addScorer;
  }

  const addSanctionBtn = $("addSanctionBtn");

  if (addSanctionBtn) {
    addSanctionBtn.onclick = addSanction;
  }

  const authModal = $("authModal");

  if (authModal) {
    authModal.addEventListener("click", event => {
      if (event.target === authModal) {
        closeModal("authModal");
      }
    });
  }

  const editModal = $("editModal");

  if (editModal) {
    editModal.addEventListener("click", event => {
      if (event.target === editModal) {
        closeModal("editModal");
      }
    });
  }
}

// ============================================================
// AUTH STATE
// ============================================================

db.auth.onAuthStateChange((_event, session) => {
  currentSession = session;

  setTimeout(() => {
    updateAuthUI();
    renderStandings();
    renderMatches();
    renderScorers();
    renderSanctions();
  }, 0);
});

// ============================================================
// INICIO
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {
  console.log("INTERAULAS: DOM cargado");

  setupEvents();

  await checkSession();

  await refreshAll();
});

// ============================================================
// EXPORTAR FUNCIONES
// ============================================================

window.login = login;
window.logout = logout;
window.refreshAll = refreshAll;

console.log("INTERAULAS: funciones globales cargadas correctamente.");
console.log("refreshAll:", typeof window.refreshAll);
console.log("editTeamPoints:", typeof window.editTeamPoints);
console.log("addSanction:", typeof window.addSanction);
console.log("editSanction:", typeof window.editSanction);
