/* =========================================================
   INTERAULAS 2026
   Colegio Interamericano de Guatemala
   ========================================================= */

console.log("Interaulas 2026 app.js cargado correctamente.");

/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

const db = window.supabaseClient || window.supabase?.createClient
  ? (window.supabaseClient || window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY))
  : null;

if (!db) {
  console.error("No se pudo inicializar Supabase.");
}

/* =========================================================
   EQUIPOS
   ========================================================= */

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

/* =========================================================
   ALIAS
   ========================================================= */

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

function normalizeTeam(name) {
  if (!name) return "";
  return TEAM_ALIASES[name] || name;
}

/* =========================================================
   CALENDARIO OFICIAL
   ========================================================= */

const MATCH_SCHEDULE = {
  1:  { date: "2026-09-07", home: "Fortnite", away: "Chifladitos", gender: "M" },
  2:  { date: "2026-09-08", home: "Ponys", away: "Jags", gender: "F" },
  3:  { date: "2026-09-09", home: "Sin Espinas", away: "Motoneta", gender: "M" },
  4:  { date: "2026-09-10", home: "Osas Mañosas", away: "Innombrables", gender: "F" },
  5:  { date: "2026-09-16", home: "Papitos", away: "Trocos", gender: "M" },
  6:  { date: "2026-09-17", home: "Las Cabritas", away: "Troncas", gender: "F" },
  7:  { date: "2026-09-18", home: "Osos Mañosos", away: "La Banca", gender: "M" },

  9:  { date: "2026-09-22", home: "Fortnite", away: "Chispazos", gender: "M" },
  8:  { date: "2026-09-23", home: "Ponys", away: "Innombrables", gender: "F" },

  10: { date: "2026-09-24", home: "Jags", away: "Troncas", gender: "F" },
  11: { date: "2026-09-25", home: "TOROS FC", away: "Sin Espinas", gender: "M" },
  12: { date: "2026-09-28", home: "Osas Mañosas", away: "Las Cabritas", gender: "F" },
  13: { date: "2026-09-29", home: "Chifladitos", away: "Papitos", gender: "M" },
  14: { date: "2026-09-30", home: "Ponys", away: "Troncas", gender: "F" },
  15: { date: "2026-10-01", home: "Motoneta", away: "Osos Mañosos", gender: "M" },
  16: { date: "2026-10-02", home: "Jags", away: "Osas Mañosas", gender: "F" },
  17: { date: "2026-10-05", home: "Trocos", away: "Chispazos", gender: "M" },
  18: { date: "2026-10-06", home: "Innombrables", away: "Las Cabritas", gender: "F" },
  19: { date: "2026-10-07", home: "La Banca", away: "TOROS FC", gender: "M" },
  20: { date: "2026-10-08", home: "Ponys", away: "Las Cabritas", gender: "F" },
  21: { date: "2026-10-09", home: "Fortnite", away: "Papitos", gender: "M" },
  22: { date: "2026-10-12", home: "Troncas", away: "Osas Mañosas", gender: "F" },
  23: { date: "2026-10-13", home: "Motoneta", away: "TOROS FC", gender: "M" },
  24: { date: "2026-10-14", home: "Ponys", away: "Osas Mañosas", gender: "F" },
  25: { date: "2026-10-15", home: "Chifladitos", away: "Chispazos", gender: "M" },
  26: { date: "2026-10-16", home: "Innombrables", away: "Jags", gender: "F" },
  27: { date: "2026-10-21", home: "Sin Espinas", away: "Osos Mañosos", gender: "M" },
  28: { date: "2026-10-22", home: "Las Cabritas", away: "Jags", gender: "F" },
  29: { date: "2026-10-23", home: "Fortnite", away: "Trocos", gender: "M" },
  30: { date: "2026-10-26", home: "Troncas", away: "Innombrables", gender: "F" },
  31: { date: "2026-10-27", home: "Sin Espinas", away: "La Banca", gender: "M" },
  32: { date: "2026-10-28", home: "Papitos", away: "Chispazos", gender: "M" },
  33: { date: "2026-10-30", home: "Osos Mañosos", away: "TOROS FC", gender: "M" },
  34: { date: "2026-11-02", home: "Trocos", away: "Chifladitos", gender: "M" },
  35: { date: "2026-11-03", home: "Motoneta", away: "La Banca", gender: "M" }
};

/* =========================================================
   ESTADO
   ========================================================= */

let currentSession = null;
let allMatches = [];
let allSanctions = [];
let allScorers = [];
let allCleanliness = [];
let selectedMatch = null;

/* =========================================================
   UTILIDADES
   ========================================================= */

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString + "T12:00:00");

  return date.toLocaleDateString("es-GT", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
}

function getMatchNumber(match) {
  if (match?.day && MATCH_SCHEDULE[match.day]) {
    return Number(match.day);
  }

  const date = String(match?.date || "").slice(0, 10);

  for (const [number, data] of Object.entries(MATCH_SCHEDULE)) {
    if (data.date === date) {
      return Number(number);
    }
  }

  return 999;
}

function getMatchInfo(match) {
  const number = getMatchNumber(match);
  return MATCH_SCHEDULE[number] || null;
}

function getMatchDate(match) {
  const info = getMatchInfo(match);

  if (info) return info.date;

  return String(match?.date || "").slice(0, 10);
}

function getHomeTeam(match) {
  const info = getMatchInfo(match);
  return normalizeTeam(info?.home || match.home_team || match.home || "");
}

function getAwayTeam(match) {
  const info = getMatchInfo(match);
  return normalizeTeam(info?.away || match.away_team || match.away || "");
}

function getGender(match) {
  const info = getMatchInfo(match);
  return info?.gender || match.gender || "M";
}

function isPlayed(match) {
  return (
    match.home_score !== null &&
    match.home_score !== undefined &&
    match.away_score !== null &&
    match.away_score !== undefined
  );
}

/* =========================================================
   INICIALIZACIÓN
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
  console.log("INTERAULAS: DOM cargado");

  setupButtons();

  await checkSession();

  await refreshAll();
});

/* =========================================================
   BOTONES
   ========================================================= */

function setupButtons() {
  const loginBtn = document.getElementById("loginBtn");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      openModal("authModal");
    });
  }

  const authModal = document.getElementById("authModal");

  if (authModal) {
    const buttons = authModal.querySelectorAll("button");

    buttons.forEach(button => {
      const text = button.textContent.trim().toLowerCase();

      if (
        text.includes("iniciar") ||
        text.includes("entrar") ||
        text.includes("login")
      ) {
        button.addEventListener("click", event => {
          event.preventDefault();
          login();
        });
      }
    });
  }

  const addScorerBtn = document.getElementById("addScorerBtn");

  if (addScorerBtn) {
    addScorerBtn.addEventListener("click", () => {
      addScorer();
    });
  }

  const addSanctionBtn = document.getElementById("addSanctionBtn");

  if (addSanctionBtn) {
    addSanctionBtn.addEventListener("click", () => {
      addSanction();
    });
  }
}

/* =========================================================
   SESIÓN
   ========================================================= */

async function checkSession() {
  if (!db) return;

  try {
    const { data, error } = await db.auth.getSession();

    if (error) throw error;

    currentSession = data.session;

    updateAuthUI();
  } catch (error) {
    console.error("Error verificando sesión:", error);
    currentSession = null;
    updateAuthUI();
  }
}

if (db?.auth) {
  db.auth.onAuthStateChange((event, session) => {
    currentSession = session;

    updateAuthUI();

    if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
      setTimeout(() => {
        refreshAll();
      }, 100);
    }
  });
}

function updateAuthUI() {
  const loginBtn = document.getElementById("loginBtn");
  const addScorerBtn = document.getElementById("addScorerBtn");
  const addSanctionBtn = document.getElementById("addSanctionBtn");

  if (currentSession) {
    if (loginBtn) {
      loginBtn.textContent = "Cerrar sesión";
      loginBtn.onclick = logout;
    }

    if (addScorerBtn) {
      addScorerBtn.classList.remove("hidden");
      addScorerBtn.style.display = "inline-block";
    }

    if (addSanctionBtn) {
      addSanctionBtn.classList.remove("hidden");
      addSanctionBtn.style.display = "inline-block";
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

async function login() {
  if (!db) return;

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const message = document.getElementById("authMessage");

  const email = emailInput?.value.trim();
  const password = passwordInput?.value;

  if (!email || !password) {
    if (message) {
      message.textContent = "Ingresa correo y contraseña.";
    }
    return;
  }

  if (message) {
    message.textContent = "Iniciando sesión...";
  }

  try {
    const { data, error } = await db.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    currentSession = data.session;

    updateAuthUI();

    if (message) {
      message.textContent = "";
    }

    closeModal("authModal");

    await refreshAll();

  } catch (error) {
    console.error("Error de login:", error);

    if (message) {
      message.textContent = error.message || "No se pudo iniciar sesión.";
    }
  }
}

async function logout() {
  if (!db) return;

  try {
    await db.auth.signOut();

    currentSession = null;

    updateAuthUI();

    await refreshAll();

  } catch (error) {
    console.error("Error cerrando sesión:", error);
  }
}

/* =========================================================
   MODALES
   ========================================================= */

function openModal(id) {
  const modal = document.getElementById(id);

  if (!modal) return;

  modal.classList.remove("hidden");
  modal.style.display = "flex";
}

function closeModal(id) {
  const modal = document.getElementById(id);

  if (!modal) return;

  modal.classList.add("hidden");
  modal.style.display = "";
}

/* =========================================================
   REFRESH
   ========================================================= */

async function refreshAll() {
  console.log("INTERAULAS: actualizando datos...");

  await Promise.all([
    loadMatches(),
    loadScorers(),
    loadSanctions(),
    loadCleanliness()
  ]);

  renderAll();

  console.log("INTERAULAS: datos cargados.");
}

/* =========================================================
   MATCHES
   ========================================================= */

async function loadMatches() {
  if (!db) return;

  try {
    const { data, error } = await db
      .from("matches")
      .select("*");

    if (error) throw error;

    allMatches = data || [];

  } catch (error) {
    console.error("Error cargando partidos:", error);
    allMatches = [];
  }
}

function renderAll() {
  renderNextMatch();
  renderStandings();
  renderMatches(allMatches);
  renderScorers();
  renderCleanliness();
  renderSanctions();
}

/* =========================================================
   PRÓXIMO PARTIDO
   ========================================================= */

function renderNextMatch() {
  const container = document.getElementById("nextMatch");

  if (!container) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = Object.entries(MATCH_SCHEDULE)
    .map(([number, info]) => ({
      number: Number(number),
      ...info
    }))
    .filter(match => {
      const date = new Date(match.date + "T12:00:00");
      return date >= today;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  if (!upcoming.length) {
    container.innerHTML = `
      <div>
        <div class="eyebrow" style="color:#98a2b3!important;">
          INTERAULAS 2026
        </div>
        <h3 style="font-size:26px;margin:8px 0;">
          No hay próximos partidos
        </h3>
      </div>
    `;
    return;
  }

  const next = upcoming[0];

  container.innerHTML = `
    <div style="width:100%;">
      <div class="eyebrow" style="color:#98a2b3!important;">
        PRÓXIMO PARTIDO
      </div>

      <h3 style="font-size:28px;margin:10px 0;">
        ${escapeHtml(next.home)}
        <span style="opacity:.45;"> vs </span>
        ${escapeHtml(next.away)}
      </h3>

      <p style="margin:0;color:#cbd5e1;">
        ${formatDate(next.date)}
        ·
        ${next.gender === "M" ? "HOMBRES" : "MUJERES"}
      </p>
    </div>
  `;
}

/* =========================================================
   TABLAS
   ========================================================= */

function createEmptyTeam(name) {
  return {
    name,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    points: 0,
    manualPoints: 0
  };
}

function calculateStandings(teamNames, gender) {
  const teams = {};

  teamNames.forEach(team => {
    teams[team] = createEmptyTeam(team);
  });

  const relevantMatches = allMatches.filter(match => {
    return getGender(match) === gender;
  });

  relevantMatches.forEach(match => {
    if (!isPlayed(match)) return;

    const home = getHomeTeam(match);
    const away = getAwayTeam(match);

    if (!teams[home] || !teams[away]) return;

    const hs = Number(match.home_score);
    const as = Number(match.away_score);

    teams[home].played++;
    teams[away].played++;

    teams[home].gf += hs;
    teams[home].ga += as;

    teams[away].gf += as;
    teams[away].ga += hs;

    if (hs > as) {
      teams[home].wins++;
      teams[away].losses++;

      teams[home].points += 3;

    } else if (hs < as) {
      teams[away].wins++;
      teams[home].losses++;

      teams[away].points += 3;

    } else {
      teams[home].draws++;
      teams[away].draws++;

      teams[home].points++;
      teams[away].points++;
    }
  });

  Object.values(teams).forEach(team => {
    team.gd = team.gf - team.ga;
  });

  return Object.values(teams);
}

/* =========================================================
   PUNTOS MANUALES
   ========================================================= */

async function loadManualPoints() {
  if (!db) return {};

  try {
    const { data, error } = await db
      .from("team_manual_points")
      .select("*");

    if (error) {
      console.warn(
        "No se pudieron cargar los puntos manuales:",
        error.message
      );

      return {};
    }

    const result = {};

    (data || []).forEach(row => {
      const team = normalizeTeam(row.team || row.team_name);

      result[team] = Number(row.points || 0);
    });

    return result;

  } catch (error) {
    console.error("Error cargando puntos manuales:", error);
    return {};
  }
}

async function applyManualPoints(standings) {
  const manualPoints = await loadManualPoints();

  standings.forEach(team => {
    team.manualPoints = Number(manualPoints[team.name] || 0);

    /*
      Los puntos manuales se SUMAN a los puntos obtenidos
      normalmente por los partidos.
    */
    team.points += team.manualPoints;
  });

  return standings;
}

/* =========================================================
   RENDER TABLAS
   ========================================================= */

async function renderStandings() {
  const menContainer = document.getElementById("menTables");
  const womenContainer = document.getElementById("womenTable");

  let menA = calculateStandings(MEN_A, "M");
  let menB = calculateStandings(MEN_B, "M");
  let women = calculateStandings(WOMEN, "F");

  menA = await applyManualPoints(menA);
  menB = await applyManualPoints(menB);
  women = await applyManualPoints(women);

  sortStandings(menA);
  sortStandings(menB);
  sortStandings(women);

  if (menContainer) {
    menContainer.innerHTML = `
      ${renderStandingsCard("Grupo A", menA)}
      ${renderStandingsCard("Grupo B", menB)}
    `;
  }

  if (womenContainer) {
    womenContainer.innerHTML = renderStandingsCard(
      "Tabla Femenina",
      women
    );
  }
}

function sortStandings(standings) {
  standings.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }

    if (b.gd !== a.gd) {
      return b.gd - a.gd;
    }

    if (b.gf !== a.gf) {
      return b.gf - a.gf;
    }

    return a.name.localeCompare(b.name);
  });
}

function renderStandingsCard(title, standings) {
  return `
    <div class="card">
      <h3>${escapeHtml(title)}</h3>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Equipo</th>
              <th>PJ</th>
              <th>G</th>
              <th>E</th>
              <th>P</th>
              <th>GF</th>
              <th>GC</th>
              <th>DG</th>
              <th>PTS</th>
              ${currentSession ? "<th>EDITAR</th>" : ""}
            </tr>
          </thead>

          <tbody>
            ${renderStandingRows(standings)}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderStandingRows(standings) {
  return standings.map((team, index) => `
    <tr>
      <td class="rank">${index + 1}</td>

      <td>
        <strong>${escapeHtml(team.name)}</strong>
      </td>

      <td>${team.played}</td>
      <td>${team.wins}</td>
      <td>${team.draws}</td>
      <td>${team.losses}</td>
      <td>${team.gf}</td>
      <td>${team.ga}</td>
      <td>${team.gd}</td>

      <td class="pts">
        ${team.points}
        ${
          team.manualPoints > 0
            ? `<small style="display:block;color:#667085;">
                +${team.manualPoints}
              </small>`
            : ""
        }
      </td>

      ${
        currentSession
          ? `
            <td>
              <button
                class="outline edit"
                onclick="editTeamPoints('${escapeHtml(team.name)}', ${team.manualPoints})"
              >
                ✏️ Editar
              </button>
            </td>
          `
          : ""
      }
    </tr>
  `).join("");
}

/* =========================================================
   EDITAR PUNTOS MANUALES
   ========================================================= */

async function editTeamPoints(teamName, currentManualPoints = 0) {
  if (!currentSession) {
    alert("Debes iniciar sesión como organizador.");
    return;
  }

  const newPoints = prompt(
    `Puntos manuales para ${teamName}:`,
    currentManualPoints
  );

  if (newPoints === null) return;

  const points = Number(newPoints);

  if (!Number.isInteger(points) || points < 0) {
    alert("Ingresa un número entero válido.");
    return;
  }

  try {
    const { error } = await db
      .from("team_manual_points")
      .upsert(
        {
          team: teamName,
          points: points
        },
        {
          onConflict: "team"
        }
      );

    if (error) throw error;

    alert(`Puntos manuales de ${teamName} actualizados.`);

    await refreshAll();

  } catch (error) {
    console.error("Error actualizando puntos:", error);

    alert(
      "No se pudieron actualizar los puntos.\n\n" +
      error.message
    );
  }
}

/* =========================================================
   PARTIDOS
   ========================================================= */

function renderMatches(matches) {
  const container = document.getElementById("matches");

  if (!container) return;

  const sorted = [...matches].sort((a, b) => {
    return getMatchDate(a).localeCompare(getMatchDate(b));
  });

  const grouped = {};

  sorted.forEach(match => {
    const date = getMatchDate(match);

    if (!grouped[date]) {
      grouped[date] = [];
    }

    grouped[date].push(match);
  });

  const scheduleNumbers = Object.keys(MATCH_SCHEDULE)
    .map(Number)
    .sort((a, b) => {
      return MATCH_SCHEDULE[a].date.localeCompare(
        MATCH_SCHEDULE[b].date
      );
    });

  /*
    Renderizamos usando el calendario oficial para garantizar
    que todos los partidos aparezcan aunque todavía no tengan
    una fila completa en Supabase.
  */

  container.innerHTML = scheduleNumbers.map(number => {
    const info = MATCH_SCHEDULE[number];

    const dbMatch = sorted.find(match => {
      return getMatchNumber(match) === number;
    });

    const played = dbMatch && isPlayed(dbMatch);

    return `
      <div class="matchday">

        <h3>
          ${formatDate(info.date)}
        </h3>

        <div class="match">

          <div>
            <strong>PARTIDO ${number}</strong>
            <br>
            <small>
              ${info.gender === "M" ? "HOMBRES" : "MUJERES"}
            </small>
          </div>

          <div>
            <strong>${escapeHtml(info.home)}</strong>
            <span style="margin:0 8px;color:#98a2b3;">vs</span>
            <strong>${escapeHtml(info.away)}</strong>
          </div>

          <div class="score">
            ${
              played
                ? `${dbMatch.home_score} - ${dbMatch.away_score}`
                : "VS"
            }
          </div>

          <div class="edit">
            ${
              currentSession && dbMatch
                ? `
                  <button
                    class="outline"
                    onclick="editMatch('${dbMatch.id}')"
                  >
                    ✏️ Editar
                  </button>
                `
                : ""
            }
          </div>

        </div>
      </div>
    `;
  }).join("");
}

/* =========================================================
   EDITAR RESULTADO
   ========================================================= */

function editMatch(matchId) {
  if (!currentSession) {
    alert("Debes iniciar sesión como organizador.");
    return;
  }

  const match = allMatches.find(
    item => String(item.id) === String(matchId)
  );

  if (!match) {
    alert("No se encontró el partido.");
    return;
  }

  selectedMatch = match;

  const title = document.getElementById("editMatchTitle");
  const homeScore = document.getElementById("homeScore");
  const awayScore = document.getElementById("awayScore");

  const home = getHomeTeam(match);
  const away = getAwayTeam(match);

  if (title) {
    title.textContent = `${home} vs ${away}`;
  }

  if (homeScore) {
    homeScore.value =
      match.home_score !== null &&
      match.home_score !== undefined
        ? match.home_score
        : "";
  }

  if (awayScore) {
    awayScore.value =
      match.away_score !== null &&
      match.away_score !== undefined
        ? match.away_score
        : "";
  }

  openModal("editModal");
}

async function saveMatch() {
  if (!currentSession || !selectedMatch) return;

  const homeInput = document.getElementById("homeScore");
  const awayInput = document.getElementById("awayScore");

  const homeScore = Number(homeInput?.value);
  const awayScore = Number(awayInput?.value);

  if (
    !Number.isInteger(homeScore) ||
    !Number.isInteger(awayScore) ||
    homeScore < 0 ||
    awayScore < 0
  ) {
    alert("Ingresa resultados válidos.");
    return;
  }

  try {
    const { error } = await db
      .from("matches")
      .update({
        home_score: homeScore,
        away_score: awayScore
      })
      .eq("id", selectedMatch.id);

    if (error) throw error;

    closeModal("editModal");

    selectedMatch = null;

    await refreshAll();

  } catch (error) {
    console.error("Error guardando resultado:", error);

    alert(
      "No se pudo guardar el resultado.\n\n" +
      error.message
    );
  }
}

/* =========================================================
   GOLEADORES
   ========================================================= */

async function loadScorers() {
  if (!db) return;

  try {
    const { data, error } = await db
      .from("scorers")
      .select("*")
      .order("goals", { ascending: false });

    if (error) throw error;

    allScorers = data || [];

  } catch (error) {
    console.error("Error cargando goleadores:", error);
    allScorers = [];
  }
}

function renderScorers() {
  const menBody = document.getElementById("menScorers");
  const womenBody = document.getElementById("womenScorers");

  const men = allScorers
    .filter(s => String(s.gender || "").toUpperCase() === "M")
    .sort((a, b) => Number(b.goals || 0) - Number(a.goals || 0));

  const women = allScorers
    .filter(s => String(s.gender || "").toUpperCase() === "F")
    .sort((a, b) => Number(b.goals || 0) - Number(a.goals || 0));

  if (menBody) {
    menBody.innerHTML = renderScorerRows(men);
  }

  if (womenBody) {
    womenBody.innerHTML = renderScorerRows(women);
  }
}

function renderScorerRows(scorers) {
  if (!scorers.length) {
    return `
      <tr>
        <td colspan="5" class="empty">
          No hay goleadores registrados.
        </td>
      </tr>
    `;
  }

  return scorers.map((scorer, index) => `
    <tr>
      <td class="rank">${index + 1}</td>

      <td>
        <strong>${escapeHtml(scorer.player_name || scorer.name || "")}</strong>
      </td>

      <td>
        ${escapeHtml(
          normalizeTeam(scorer.team || scorer.team_name || "")
        )}
      </td>

      <td class="pts">
        ${Number(scorer.goals || 0)}
      </td>

      ${
        currentSession
          ? `
            <td>
              <button
                class="outline edit"
                onclick="editScorer('${scorer.id}')"
              >
                ✏️
              </button>

              <button
                class="danger edit"
                onclick="deleteScorer('${scorer.id}')"
              >
                🗑️
              </button>
            </td>
          `
          : ""
      }
    </tr>
  `).join("");
}

/* =========================================================
   AGREGAR GOLEADOR
   ========================================================= */

async function addScorer() {
  if (!currentSession) return;

  const name = prompt("Nombre del jugador:");
  if (!name) return;

  const team = prompt(
    "Equipo:\n\n" +
    [...MEN_A, ...MEN_B, ...WOMEN].join("\n")
  );

  if (!team) return;

  const normalizedTeam = normalizeTeam(team);

  if (![...MEN_A, ...MEN_B, ...WOMEN].includes(normalizedTeam)) {
    alert("Ese equipo no existe.");
    return;
  }

  const goalsInput = prompt("Número de goles:", "0");
  if (goalsInput === null) return;

  const goals = Number(goalsInput);

  if (!Number.isInteger(goals) || goals < 0) {
    alert("Número de goles inválido.");
    return;
  }

  const gender =
    [...MEN_A, ...MEN_B].includes(normalizedTeam)
      ? "M"
      : "F";

  try {
    const { error } = await db
      .from("scorers")
      .insert({
        player_name: name,
        team: normalizedTeam,
        goals,
        gender
      });

    if (error) throw error;

    await refreshAll();

  } catch (error) {
    console.error("Error agregando goleador:", error);

    alert(error.message);
  }
}

async function editScorer(id) {
  if (!currentSession) return;

  const scorer = allScorers.find(
    item => String(item.id) === String(id)
  );

  if (!scorer) return;

  const name = prompt(
    "Nombre del jugador:",
    scorer.player_name || scorer.name || ""
  );

  if (!name) return;

  const goalsInput = prompt(
    "Número de goles:",
    scorer.goals || 0
  );

  if (goalsInput === null) return;

  const goals = Number(goalsInput);

  if (!Number.isInteger(goals) || goals < 0) {
    alert("Número de goles inválido.");
    return;
  }

  try {
    const { error } = await db
      .from("scorers")
      .update({
        player_name: name,
        goals
      })
      .eq("id", id);

    if (error) throw error;

    await refreshAll();

  } catch (error) {
    console.error("Error editando goleador:", error);
    alert(error.message);
  }
}

async function deleteScorer(id) {
  if (!currentSession) return;

  if (!confirm("¿Eliminar este goleador?")) return;

  try {
    const { error } = await db
      .from("scorers")
      .delete()
      .eq("id", id);

    if (error) throw error;

    await refreshAll();

  } catch (error) {
    console.error("Error eliminando goleador:", error);
    alert(error.message);
  }
}

/* =========================================================
   GRADO
   ========================================================= */

async function loadCleanliness() {
  if (!db) return;

  try {
    const { data, error } = await db
      .from("cleanliness_scores")
      .select("*");

    if (error) throw error;

    allCleanliness = data || [];

  } catch (error) {
    console.error("Error cargando grado:", error);
    allCleanliness = [];
  }
}

function renderCleanliness() {
  const body = document.getElementById("cleanlinessTable");

  if (!body) return;

  if (!allCleanliness.length) {
    body.innerHTML = `
      <tr>
        <td colspan="5" class="empty">
          No hay datos registrados.
        </td>
      </tr>
    `;
    return;
  }

  const sorted = [...allCleanliness].sort((a, b) => {
    return Number(b.points || b.score || 0) -
           Number(a.points || a.score || 0);
  });

  body.innerHTML = sorted.map((row, index) => {
    const grade =
      row.grade ||
      row.grado ||
      row.team ||
      row.name ||
      "";

    const points =
      row.points ??
      row.score ??
      row.cleanliness_score ??
      0;

    return `
      <tr>
        <td class="rank">${index + 1}</td>

        <td>
          <strong>${escapeHtml(grade)}</strong>
        </td>

        <td class="pts">
          ${Number(points)}
        </td>

        <td>
          ${escapeHtml(row.note || row.observation || "")}
        </td>

        ${
          currentSession
            ? `
              <td>
                <button
                  class="outline edit"
                  onclick="editCleanliness('${row.id}')"
                >
                  ✏️
                </button>
              </td>
            `
            : ""
        }
      </tr>
    `;
  }).join("");
}

async function editCleanliness(id) {
  if (!currentSession) return;

  const row = allCleanliness.find(
    item => String(item.id) === String(id)
  );

  if (!row) return;

  const current =
    row.points ??
    row.score ??
    row.cleanliness_score ??
    0;

  const value = prompt(
    "Puntos de grado:",
    current
  );

  if (value === null) return;

  const points = Number(value);

  if (!Number.isFinite(points)) {
    alert("Ingresa un número válido.");
    return;
  }

  let column = "points";

  if (row.points !== undefined) {
    column = "points";
  } else if (row.score !== undefined) {
    column = "score";
  } else if (row.cleanliness_score !== undefined) {
    column = "cleanliness_score";
  }

  try {
    const { error } = await db
      .from("cleanliness_scores")
      .update({
        [column]: points
      })
      .eq("id", id);

    if (error) throw error;

    await refreshAll();

  } catch (error) {
    console.error("Error editando grado:", error);
    alert(error.message);
  }
}

/* =========================================================
   SANCIONES
   ========================================================= */

async function loadSanctions() {
  if (!db) return;

  try {
    const { data, error } = await db
      .from("sanctions")
      .select("*")
      .order("date", { ascending: false });

    if (error) throw error;

    allSanctions = data || [];

  } catch (error) {
    console.error("Error cargando sanciones:", error);
    allSanctions = [];
  }
}

function renderSanctions() {
  const container = document.getElementById("sanctions");

  if (!container) return;

  if (!allSanctions.length) {
    container.innerHTML = `
      <div class="empty">
        No hay sanciones registradas.
      </div>
    `;
    return;
  }

  container.innerHTML = allSanctions.map(sanction => `
    <div class="sanction">

      <div>
        <strong>${escapeHtml(
          sanction.student ||
          sanction.player ||
          sanction.name ||
          ""
        )}</strong>
      </div>

      <div>
        ${escapeHtml(
          normalizeTeam(
            sanction.team ||
            sanction.team_name ||
            ""
          )
        )}
      </div>

      <div>
        ${escapeHtml(sanction.date || "")}
      </div>

      <div>
        ${escapeHtml(
          sanction.reason ||
          sanction.description ||
          ""
        )}
      </div>

      ${
        currentSession
          ? `
            <div>
              <button
                class="outline edit"
                onclick="editSanction('${sanction.id}')"
              >
                ✏️
              </button>

              <button
                class="danger edit"
                onclick="deleteSanction('${sanction.id}')"
              >
                🗑️
              </button>
            </div>
          `
          : ""
      }

    </div>
  `).join("");
}

/* =========================================================
   AGREGAR SANCIÓN
   ========================================================= */

async function addSanction() {
  if (!currentSession) return;

  const student = prompt("Nombre del estudiante:");
  if (!student) return;

  const team = prompt(
    "Equipo:\n\n" +
    [...MEN_A, ...MEN_B, ...WOMEN].join("\n")
  );

  if (!team) return;

  const reason = prompt("Motivo de la sanción:");
  if (!reason) return;

  const date = prompt(
    "Fecha:",
    new Date().toISOString().slice(0, 10)
  );

  if (!date) return;

  try {
    const { error } = await db
      .from("sanctions")
      .insert({
        student,
        team: normalizeTeam(team),
        reason,
        date
      });

    if (error) throw error;

    await refreshAll();

  } catch (error) {
    console.error("Error agregando sanción:", error);
    alert(error.message);
  }
}

async function editSanction(id) {
  if (!currentSession) return;

  const sanction = allSanctions.find(
    item => String(item.id) === String(id)
  );

  if (!sanction) return;

  const student = prompt(
    "Nombre del estudiante:",
    sanction.student || ""
  );

  if (!student) return;

  const team = prompt(
    "Equipo:",
    sanction.team || ""
  );

  if (!team) return;

  const reason = prompt(
    "Motivo:",
    sanction.reason || sanction.description || ""
  );

  if (!reason) return;

  const date = prompt(
    "Fecha:",
    sanction.date || ""
  );

  if (!date) return;

  try {
    const { error } = await db
      .from("sanctions")
      .update({
        student,
        team: normalizeTeam(team),
        reason,
        date
      })
      .eq("id", id);

    if (error) throw error;

    await refreshAll();

  } catch (error) {
    console.error("Error editando sanción:", error);
    alert(error.message);
  }
}

async function deleteSanction(id) {
  if (!currentSession) return;

  if (!confirm("¿Eliminar esta sanción?")) return;

  try {
    const { error } = await db
      .from("sanctions")
      .delete()
      .eq("id", id);

    if (error) throw error;

    await refreshAll();

  } catch (error) {
    console.error("Error eliminando sanción:", error);
    alert(error.message);
  }
}

/* =========================================================
   FUNCIONES GLOBALES
   ========================================================= */

window.openModal = openModal;
window.closeModal = closeModal;

window.login = login;
window.logout = logout;

window.editMatch = editMatch;
window.saveMatch = saveMatch;

window.addScorer = addScorer;
window.editScorer = editScorer;
window.deleteScorer = deleteScorer;

window.addSanction = addSanction;
window.editSanction = editSanction;
window.deleteSanction = deleteSanction;

window.editCleanliness = editCleanliness;

window.editTeamPoints = editTeamPoints;

console.log("INTERAULAS: funciones globales cargadas correctamente.");
