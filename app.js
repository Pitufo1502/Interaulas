// ============================================================
// INTERAULAS 2026
// Colegio Interamericano de Guatemala
// ============================================================

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);


// ============================================================
// EQUIPOS
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


// ============================================================
// HORARIO OFICIAL
// ============================================================

const MATCH_DATES = {
  1: "2026-09-07",
  2: "2026-09-08",
  3: "2026-09-09",
  4: "2026-09-10",
  5: "2026-09-16",
  6: "2026-09-17",
  7: "2026-09-18",

  // IMPORTANTE:
  // Partido 9 = 22 de septiembre
  // Partido 8 = 23 de septiembre

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


// ============================================================
// NOMBRES ANTIGUOS → NOMBRES OFICIALES
// ============================================================

const ALIASES = {
  "Finqueros": "Chispazos",
  "Chapiadoras.com": "Innombrables",
  "Chapiadoras": "Innombrables",
  "Tan G Neras FC": "Ponys",
  "TNG FC": "Ponys",
  "Razitos": "TOROS FC",
  "Sin Esquinas": "Sin Espinas",
  "Trocas": "Troncas"
};


// ============================================================
// ESTADO
// ============================================================

let currentSession = null;
let editingMatchId = null;
let editingSanctionId = null;
let editingScorerId = null;


// ============================================================
// INICIO
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {

  console.log("INTERAULAS: DOM cargado");

  await checkSession();

  await refreshAll();

  setupButtons();

});


// ============================================================
// BOTONES
// ============================================================

function setupButtons() {

  // LOGIN
  const loginBtn = document.getElementById("loginBtn");

  if (loginBtn) {

    loginBtn.addEventListener("click", () => {

      if (currentSession) {

        logout();

      } else {

        const modal =
          document.getElementById("authModal");

        if (modal) {
          modal.style.display = "flex";
        }

      }

    });

  }


  // AGREGAR SANCIÓN
  const addSanctionBtn =
    document.getElementById("addSanctionBtn");

  if (addSanctionBtn) {

    addSanctionBtn.addEventListener(
      "click",
      openSanctionModal
    );

  }


  // AGREGAR GOLEADOR
  const addScorerBtn =
    document.getElementById("addScorerBtn");

  if (addScorerBtn) {

    addScorerBtn.addEventListener(
      "click",
      openScorerModal
    );

  }

}


// ============================================================
// SESIÓN
// ============================================================

async function checkSession() {

  try {

    const result =
      await db.auth.getSession();

    currentSession =
      result.data.session || null;

    updateAuthUI();

  } catch (error) {

    console.error(
      "Error al comprobar sesión:",
      error
    );

  }

}


// ============================================================
// LOGIN
// ============================================================

async function login() {

  const emailInput =
    document.getElementById("email");

  const passwordInput =
    document.getElementById("password");

  const message =
    document.getElementById("authMessage");


  if (!emailInput || !passwordInput) {

    console.error(
      "No se encontraron los campos de login."
    );

    return;

  }


  const email =
    emailInput.value.trim();

  const password =
    passwordInput.value;


  if (!email || !password) {

    if (message) {
      message.textContent =
        "Ingresa tu correo y contraseña.";
    }

    return;

  }


  const result =
    await db.auth.signInWithPassword({
      email,
      password
    });


  if (result.error) {

    console.error(
      "Error de login:",
      result.error
    );

    if (message) {
      message.textContent =
        result.error.message;
    }

    return;

  }


  currentSession =
    result.data.session;


  closeModal("authModal");

  emailInput.value = "";
  passwordInput.value = "";

  if (message) {
    message.textContent = "";
  }


  updateAuthUI();

  await refreshAll();

}


// ============================================================
// LOGOUT
// ============================================================

async function logout() {

  await db.auth.signOut();

  currentSession = null;

  updateAuthUI();

  await refreshAll();

}


// ============================================================
// ACTUALIZAR UI DE LOGIN
// ============================================================

function updateAuthUI() {

  const loginBtn =
    document.getElementById("loginBtn");

  const addSanctionBtn =
    document.getElementById("addSanctionBtn");

  const addScorerBtn =
    document.getElementById("addScorerBtn");


  if (loginBtn) {

    loginBtn.textContent =
      currentSession
        ? "Cerrar sesión"
        : "Iniciar sesión";

  }


  if (addSanctionBtn) {

    addSanctionBtn.style.display =
      currentSession
        ? "block"
        : "none";

  }


  if (addScorerBtn) {

    addScorerBtn.style.display =
      currentSession
        ? "block"
        : "none";

  }

}


// ============================================================
// REFRESH GENERAL
// ============================================================

async function refreshAll() {

  console.log("INTERAULAS: actualizando datos...");

  await loadMatches();

  await loadSanctions();

  await loadScorers();

  await loadCleanliness();

  console.log("INTERAULAS: datos cargados.");

}


// ============================================================
// EQUIPOS
// ============================================================

function normalizeTeam(team) {

  if (!team) {
    return "";
  }

  const name =
    String(team).trim();

  return ALIASES[name] || name;

}


function isWomenTeam(team) {

  return WOMEN.includes(
    normalizeTeam(team)
  );

}


function isMenTeam(team) {

  const name =
    normalizeTeam(team);

  return (
    MEN_A.includes(name) ||
    MEN_B.includes(name)
  );

}


function getGender(home, away) {

  if (
    isWomenTeam(home) ||
    isWomenTeam(away)
  ) {

    return "F";

  }

  return "M";

}


// ============================================================
// PARTIDOS
// ============================================================

async function loadMatches() {

  const result =
    await db
      .from("matches")
      .select("*");


  if (result.error) {

    console.error(
      "Error cargando partidos:",
      result.error
    );

    return;

  }


  const matches =
    result.data || [];


  renderMatches(matches);

  renderTables(matches);

  renderNext(matches);

}


// ============================================================
// NÚMERO DE PARTIDO
// ============================================================

function getMatchNumber(match) {

  if (
    match.day !== undefined &&
    match.day !== null
  ) {

    return Number(match.day);

  }


  if (
    match.match_number !== undefined &&
    match.match_number !== null
  ) {

    return Number(match.match_number);

  }


  return 999;

}


// ============================================================
// FECHA
// ============================================================

function getMatchDate(match) {

  const number =
    getMatchNumber(match);


  if (MATCH_DATES[number]) {

    return MATCH_DATES[number];

  }


  if (match.date) {
    return match.date;
  }


  if (match.match_date) {
    return match.match_date;
  }


  return "";

}


function formatDate(dateString) {

  if (!dateString) {
    return "";
  }


  const date =
    new Date(
      dateString + "T12:00:00"
    );


  if (isNaN(date.getTime())) {
    return dateString;
  }


  return date.toLocaleDateString(
    "es-GT",
    {
      weekday: "long",
      day: "numeric",
      month: "long"
    }
  );

}


// ============================================================
// ORDENAR PARTIDOS
// ============================================================

function sortMatchesByDate(matches) {

  return [...matches].sort((a, b) => {

    const dateA =
      getMatchDate(a);

    const dateB =
      getMatchDate(b);


    if (!dateA) return 1;
    if (!dateB) return -1;


    return (
      new Date(dateA + "T12:00:00") -
      new Date(dateB + "T12:00:00")
    );

  });

}


// ============================================================
// MARCADORES
// ============================================================

function getHomeScore(match) {

  if (
    match.home_score !== undefined &&
    match.home_score !== null
  ) {

    return match.home_score;

  }


  if (
    match.home_goals !== undefined &&
    match.home_goals !== null
  ) {

    return match.home_goals;

  }


  return null;

}


function getAwayScore(match) {

  if (
    match.away_score !== undefined &&
    match.away_score !== null
  ) {

    return match.away_score;

  }


  if (
    match.away_goals !== undefined &&
    match.away_goals !== null
  ) {

    return match.away_goals;

  }


  return null;

}


function hasScore(match) {

  return (
    getHomeScore(match) !== null &&
    getAwayScore(match) !== null
  );

}


// ============================================================
// RENDER PARTIDOS
// ============================================================

function renderMatches(matches) {

  const container =
    document.getElementById("matches");


  if (!container) {

    console.error(
      "No existe #matches en index.html"
    );

    return;

  }


  const sorted =
    sortMatchesByDate(matches);


  if (!sorted.length) {

    container.innerHTML = `
      <div class="empty-state">
        No hay partidos registrados.
      </div>
    `;

    return;

  }


  container.innerHTML =
    sorted
      .map(matchCardHTML)
      .join("");

}


// ============================================================
// TARJETA DE PARTIDO
// ============================================================

function matchCardHTML(match) {

  const home =
    normalizeTeam(match.home_team);

  const away =
    normalizeTeam(match.away_team);


  const homeScore =
    getHomeScore(match);

  const awayScore =
    getAwayScore(match);


  const number =
    getMatchNumber(match);

  const date =
    getMatchDate(match);


  let score = "VS";


  if (
    homeScore !== null &&
    awayScore !== null
  ) {

    score =
      `${homeScore} - ${awayScore}`;

  }


  const gender =
    getGender(home, away);


  let adminButton = "";


  if (currentSession) {

    adminButton = `
      <button
        type="button"
        class="admin-button"
        onclick="editMatch(${Number(match.id)})">
        ✏️ Editar
      </button>
    `;

  }


  return `
    <div class="match-card">

      <div class="match-info">

        <span>
          PARTIDO ${number}
        </span>

        <span>
          ${escapeHTML(
            formatDate(date)
          )}
        </span>

        <span>
          ${gender === "M" ? "HOMBRES" : "MUJERES"}
        </span>

      </div>


      <div class="match-teams">

        <div class="team">
          <strong>
            ${escapeHTML(home)}
          </strong>
        </div>


        <div class="score">
          ${score}
        </div>


        <div class="team">
          <strong>
            ${escapeHTML(away)}
          </strong>
        </div>

      </div>


      ${adminButton}

    </div>
  `;

}


// ============================================================
// PRÓXIMO PARTIDO
// ============================================================

function renderNext(matches) {

  const container =
    document.getElementById("nextMatch");


  if (!container) {
    return;
  }


  const today =
    new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );


  const upcoming =
    sortMatchesByDate(matches)
      .filter(match => {

        const dateString =
          getMatchDate(match);


        if (!dateString) {
          return false;
        }


        const date =
          new Date(
            dateString + "T12:00:00"
          );


        return date >= today;

      });


  if (!upcoming.length) {

    container.innerHTML = `
      <div class="card next-match-card">

        <div class="match-info">

          <span>
            PRÓXIMO PARTIDO
          </span>

          <span>
            No hay partidos próximos.
          </span>

        </div>

      </div>
    `;

    return;

  }


  const next =
    upcoming[0];


  const home =
    normalizeTeam(next.home_team);

  const away =
    normalizeTeam(next.away_team);


  container.innerHTML = `
    <div class="card next-match-card">

      <div class="match-info">

        <span>
          PRÓXIMO PARTIDO
        </span>

        <span>
          ${escapeHTML(
            formatDate(
              getMatchDate(next)
            )
          )}
        </span>

      </div>


      <div class="match-teams">

        <div class="team">

          <strong>
            ${escapeHTML(home)}
          </strong>

        </div>


        <div class="score">
          VS
        </div>


        <div class="team">

          <strong>
            ${escapeHTML(away)}
          </strong>

        </div>

      </div>

    </div>
  `;

}


// ============================================================
// EDITAR PARTIDO
// ============================================================

async function editMatch(id) {

  if (!currentSession) {
    return;
  }


  const result =
    await db
      .from("matches")
      .select("*")
      .eq("id", id)
      .single();


  if (result.error) {

    alert(result.error.message);

    return;

  }


  const match =
    result.data;


  editingMatchId =
    id;


  const title =
    document.getElementById("editMatchTitle");

  const homeInput =
    document.getElementById("homeScore");

  const awayInput =
    document.getElementById("awayScore");


  if (title) {

    title.textContent =
      `${normalizeTeam(match.home_team)} vs ${normalizeTeam(match.away_team)}`;

  }


  if (homeInput) {

    homeInput.value =
      getHomeScore(match) ?? "";

  }


  if (awayInput) {

    awayInput.value =
      getAwayScore(match) ?? "";

  }


  const modal =
    document.getElementById("editModal");


  if (modal) {

    modal.style.display =
      "flex";

  }

}


// ============================================================
// GUARDAR PARTIDO
// ============================================================

async function saveMatch() {

  if (
    !currentSession ||
    !editingMatchId
  ) {

    return;

  }


  const homeInput =
    document.getElementById("homeScore");

  const awayInput =
    document.getElementById("awayScore");


  if (!homeInput || !awayInput) {
    return;
  }


  const homeScore =
    homeInput.value === ""
      ? null
      : Number(homeInput.value);


  const awayScore =
    awayInput.value === ""
      ? null
      : Number(awayInput.value);


  if (
    homeScore !== null &&
    (
      !Number.isInteger(homeScore) ||
      homeScore < 0
    )
  ) {

    alert(
      "El marcador local no es válido."
    );

    return;

  }


  if (
    awayScore !== null &&
    (
      !Number.isInteger(awayScore) ||
      awayScore < 0
    )
  ) {

    alert(
      "El marcador visitante no es válido."
    );

    return;

  }


  const result =
    await db
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


  editingMatchId =
    null;


  closeModal("editModal");

  await loadMatches();

}


// ============================================================
// TABLAS
// ============================================================

function renderTables(matches) {

  const tableA =
    createStandings(
      MEN_A,
      matches
    );


  const tableB =
    createStandings(
      MEN_B,
      matches
    );


  const tableWomen =
    createStandings(
      WOMEN,
      matches
    );


  const menContainer =
    document.getElementById("menTables");


  const womenContainer =
    document.getElementById("womenTable");


  if (menContainer) {

    menContainer.innerHTML = `

      <div class="card">

        <h3>Grupo A</h3>

        ${standingsHTML(tableA)}

      </div>


      <div class="card">

        <h3>Grupo B</h3>

        ${standingsHTML(tableB)}

      </div>

    `;

  }


  if (womenContainer) {

    womenContainer.innerHTML = `
      <div class="card">
        ${standingsHTML(tableWomen)}
      </div>
    `;

  }

}


// ============================================================
// CREAR TABLA
// ============================================================

function createStandings(
  teams,
  matches
) {

  const table = {};


  teams.forEach(team => {

    table[team] = {

      team,

      played: 0,

      wins: 0,

      draws: 0,

      losses: 0,

      goalsFor: 0,

      goalsAgainst: 0,

      goalDifference: 0,

      points: 0

    };

  });


  matches.forEach(match => {

    if (!hasScore(match)) {
      return;
    }


    const home =
      normalizeTeam(match.home_team);

    const away =
      normalizeTeam(match.away_team);


    if (
      !table[home] ||
      !table[away]
    ) {

      return;

    }


    const homeScore =
      Number(getHomeScore(match));

    const awayScore =
      Number(getAwayScore(match));


    table[home].played++;
    table[away].played++;


    table[home].goalsFor +=
      homeScore;

    table[home].goalsAgainst +=
      awayScore;


    table[away].goalsFor +=
      awayScore;

    table[away].goalsAgainst +=
      homeScore;


    if (homeScore > awayScore) {

      table[home].wins++;
      table[away].losses++;

      table[home].points += 3;

    }

    else if (awayScore > homeScore) {

      table[away].wins++;
      table[home].losses++;

      table[away].points += 3;

    }

    else {

      table[home].draws++;
      table[away].draws++;

      table[home].points++;
      table[away].points++;

    }

  });


  const rows =
    Object.values(table);


  rows.forEach(row => {

    row.goalDifference =
      row.goalsFor -
      row.goalsAgainst;

  });


  rows.sort((a, b) => {

    if (b.points !== a.points) {

      return b.points - a.points;

    }


    if (
      b.goalDifference !==
      a.goalDifference
    ) {

      return (
        b.goalDifference -
        a.goalDifference
      );

    }


    return b.goalsFor - a.goalsFor;

  });


  return rows;

}


// ============================================================
// HTML TABLA DE POSICIONES
// ============================================================

function standingsHTML(rows) {

  return `
    <div class="standings-table">

      <div class="standings-row standings-header">

        <span>#</span>
        <span>Equipo</span>
        <span>PJ</span>
        <span>G</span>
        <span>E</span>
        <span>P</span>
        <span>GF</span>
        <span>GC</span>
        <span>DG</span>
        <span>PTS</span>

      </div>


      ${rows.map((row, index) => `

        <div class="standings-row">

          <span>
            ${index + 1}
          </span>

          <span>
            ${escapeHTML(row.team)}
          </span>

          <span>
            ${row.played}
          </span>

          <span>
            ${row.wins}
          </span>

          <span>
            ${row.draws}
          </span>

          <span>
            ${row.losses}
          </span>

          <span>
            ${row.goalsFor}
          </span>

          <span>
            ${row.goalsAgainst}
          </span>

          <span>
            ${row.goalDifference}
          </span>

          <strong>
            ${row.points}
          </strong>

        </div>

      `).join("")}

    </div>
  `;

}


// ============================================================
// SANCIONES
// ============================================================

async function loadSanctions() {

  const result =
    await db
      .from("sanctions")
      .select("*");


  if (result.error) {

    console.error(
      "Error cargando sanciones:",
      result.error
    );

    return;

  }


  renderSanctions(
    result.data || []
  );

}


function renderSanctions(sanctions) {

  const container =
    document.getElementById("sanctions");


  if (!container) {
    return;
  }


  if (!sanctions.length) {

    container.innerHTML = `
      <div class="empty-state">
        No hay sanciones registradas.
      </div>
    `;

    return;

  }


  container.innerHTML =
    sanctions
      .map(sanction => {

        const student =
          sanction.student ||
          sanction.player ||
          sanction.name ||
          "";


        const team =
          sanction.team ||
          sanction.grade ||
          "";


        const reason =
          sanction.reason ||
          sanction.description ||
          "";


        const buttons =
          currentSession
            ? `
              <div class="admin-actions">

                <button
                  type="button"
                  class="admin-button"
                  onclick="editSanction(${Number(sanction.id)})">
                  ✏️ Editar
                </button>

                <button
                  type="button"
                  class="admin-button danger"
                  onclick="deleteSanction(${Number(sanction.id)})">
                  🗑️ Eliminar
                </button>

              </div>
            `
            : "";


        return `
          <div class="sanction-card">

            <div class="sanction-title">
              ${escapeHTML(student)}
            </div>

            <div class="sanction-info">
              ${escapeHTML(team)}
            </div>

            <div class="sanction-description">
              ${escapeHTML(reason)}
            </div>

            ${
              sanction.date
                ? `
                  <div class="sanction-date">
                    ${escapeHTML(
                      String(sanction.date)
                    )}
                  </div>
                `
                : ""
            }

            ${buttons}

          </div>
        `;

      })
      .join("");

}


// ============================================================
// AGREGAR SANCIÓN
// ============================================================

function openSanctionModal() {

  if (!currentSession) {
    return;
  }


  const student =
    prompt("Nombre del estudiante:");

  if (student === null) {
    return;
  }


  const team =
    prompt("Grado / equipo:");

  if (team === null) {
    return;
  }


  const reason =
    prompt("Razón de la sanción:");

  if (reason === null) {
    return;
  }


  const date =
    prompt(
      "Fecha (opcional):",
      ""
    );


  addSanction(
    student.trim(),
    team.trim(),
    reason.trim(),
    date ? date.trim() : null
  );

}


async function addSanction(
  student,
  team,
  reason,
  date
) {

  if (!currentSession) {
    return;
  }


  if (!student || !reason) {

    alert(
      "Completa el nombre y la razón."
    );

    return;

  }


  const result =
    await db
      .from("sanctions")
      .insert([{
        student,
        team: team || null,
        reason,
        date: date || null
      }]);


  if (result.error) {

    alert(result.error.message);

    return;

  }


  await loadSanctions();

}


// ============================================================
// EDITAR SANCIÓN
// ============================================================

async function editSanction(id) {

  if (!currentSession) {
    return;
  }


  const result =
    await db
      .from("sanctions")
      .select("*")
      .eq("id", id)
      .single();


  if (result.error) {

    alert(result.error.message);

    return;

  }


  const sanction =
    result.data;


  const student =
    prompt(
      "Nombre del estudiante:",
      sanction.student ||
      sanction.player ||
      sanction.name ||
      ""
    );


  if (student === null) {
    return;
  }


  const team =
    prompt(
      "Grado / equipo:",
      sanction.team ||
      sanction.grade ||
      ""
    );


  if (team === null) {
    return;
  }


  const reason =
    prompt(
      "Razón:",
      sanction.reason ||
      sanction.description ||
      ""
    );


  if (reason === null) {
    return;
  }


  const date =
    prompt(
      "Fecha:",
      sanction.date || ""
    );


  const updateResult =
    await db
      .from("sanctions")
      .update({
        student: student.trim(),
        team: team.trim() || null,
        reason: reason.trim(),
        date: date
          ? date.trim()
          : null
      })
      .eq("id", id);


  if (updateResult.error) {

    alert(
      updateResult.error.message
    );

    return;

  }


  await loadSanctions();

}


// ============================================================
// ELIMINAR SANCIÓN
// ============================================================

async function deleteSanction(id) {

  if (!currentSession) {
    return;
  }


  const confirmed =
    confirm(
      "¿Seguro que quieres eliminar esta sanción?"
    );


  if (!confirmed) {
    return;
  }


  const result =
    await db
      .from("sanctions")
      .delete()
      .eq("id", id);


  if (result.error) {

    alert(result.error.message);

    return;

  }


  await loadSanctions();

}


// ============================================================
// GOLEADORES
// ============================================================

async function loadScorers() {

  const result =
    await db
      .from("scorers")
      .select("*");


  if (result.error) {

    console.error(
      "Error cargando goleadores:",
      result.error
    );

    return;

  }


  renderScorers(
    result.data || []
  );

}


function renderScorers(scorers) {

  const menContainer =
    document.getElementById("menScorers");


  const womenContainer =
    document.getElementById("womenScorers");


  const men =
    scorers.filter(scorer => {

      return (
        scorer.gender === "M" ||
        scorer.gender === "H" ||
        isMenTeam(scorer.team)
      );

    });


  const women =
    scorers.filter(scorer => {

      return (
        scorer.gender === "F" ||
        scorer.gender === "W" ||
        isWomenTeam(scorer.team)
      );

    });


  if (menContainer) {

    menContainer.innerHTML =
      scorerRowsHTML(men);

  }


  if (womenContainer) {

    womenContainer.innerHTML =
      scorerRowsHTML(women);

  }

}


// ============================================================
// FILAS GOLEADORES
// ============================================================

function scorerRowsHTML(scorers) {

  const sorted =
    [...scorers].sort((a, b) => {

      const goalsA =
        Number(
          a.goals ??
          a.goal_count ??
          0
        );


      const goalsB =
        Number(
          b.goals ??
          b.goal_count ??
          0
        );


      return goalsB - goalsA;

    });


  if (!sorted.length) {

    return `
      <tr>
        <td colspan="5">
          No hay goleadores registrados.
        </td>
      </tr>
    `;

  }


  return sorted
    .map((scorer, index) => {

      const player =
        scorer.player ||
        scorer.name ||
        "";


      const team =
        normalizeTeam(
          scorer.team || ""
        );


      const goals =
        scorer.goals ??
        scorer.goal_count ??
        0;


      const actions =
        currentSession
          ? `
            <td>

              <button
                type="button"
                class="admin-button"
                onclick="editScorer(${Number(scorer.id)})">
                ✏️
              </button>

              <button
                type="button"
                class="admin-button danger"
                onclick="deleteScorer(${Number(scorer.id)})">
                🗑️
              </button>

            </td>
          `
          : "<td></td>";


      return `
        <tr>

          <td>
            ${index + 1}
          </td>

          <td>
            ${escapeHTML(player)}
          </td>

          <td>
            ${escapeHTML(team)}
          </td>

          <td>
            ${goals}
          </td>

          ${actions}

        </tr>
      `;

    })
    .join("");

}


// ============================================================
// AGREGAR GOLEADOR
// ============================================================

function openScorerModal() {

  if (!currentSession) {
    return;
  }


  const player =
    prompt("Nombre del jugador:");

  if (player === null) {
    return;
  }


  const team =
    prompt("Equipo:");

  if (team === null) {
    return;
  }


  const gender =
    prompt(
      "Género: escribe M para hombres o F para mujeres",
      "M"
    );


  if (gender === null) {
    return;
  }


  const goals =
    prompt(
      "Cantidad de goles:",
      "0"
    );


  if (goals === null) {
    return;
  }


  addScorer(
    player.trim(),
    normalizeTeam(team.trim()),
    gender.trim().toUpperCase(),
    Number(goals)
  );

}


async function addScorer(
  player,
  team,
  gender,
  goals
) {

  if (!currentSession) {
    return;
  }


  if (!player || !team) {

    alert(
      "Completa el jugador y el equipo."
    );

    return;

  }


  if (
    !Number.isFinite(goals) ||
    goals < 0
  ) {

    alert(
      "La cantidad de goles no es válida."
    );

    return;

  }


  const result =
    await db
      .from("scorers")
      .insert([{
        player,
        team,
        gender,
        goals
      }]);


  if (result.error) {

    alert(result.error.message);

    return;

  }


  await loadScorers();

}


// ============================================================
// EDITAR GOLEADOR
// ============================================================

async function editScorer(id) {

  if (!currentSession) {
    return;
  }


  const result =
    await db
      .from("scorers")
      .select("*")
      .eq("id", id)
      .single();


  if (result.error) {

    alert(result.error.message);

    return;

  }


  const scorer =
    result.data;


  const player =
    prompt(
      "Nombre del jugador:",
      scorer.player ||
      scorer.name ||
      ""
    );


  if (player === null) {
    return;
  }


  const team =
    prompt(
      "Equipo:",
      normalizeTeam(
        scorer.team || ""
      )
    );


  if (team === null) {
    return;
  }


  const gender =
    prompt(
      "Género: M o F",
      scorer.gender || "M"
    );


  if (gender === null) {
    return;
  }


  const goals =
    prompt(
      "Cantidad de goles:",
      String(
        scorer.goals ??
        scorer.goal_count ??
        0
      )
    );


  if (goals === null) {
    return;
  }


  const numericGoals =
    Number(goals);


  if (
    !Number.isFinite(numericGoals) ||
    numericGoals < 0
  ) {

    alert(
      "La cantidad de goles no es válida."
    );

    return;

  }


  const updateResult =
    await db
      .from("scorers")
      .update({
        player: player.trim(),
        team: normalizeTeam(team.trim()),
        gender: gender.trim().toUpperCase(),
        goals: numericGoals
      })
      .eq("id", id);


  if (updateResult.error) {

    alert(
      updateResult.error.message
    );

    return;

  }


  await loadScorers();

}


// ============================================================
// ELIMINAR GOLEADOR
// ============================================================

async function deleteScorer(id) {

  if (!currentSession) {
    return;
  }


  const confirmed =
    confirm(
      "¿Seguro que quieres eliminar este goleador?"
    );


  if (!confirmed) {
    return;
  }


  const result =
    await db
      .from("scorers")
      .delete()
      .eq("id", id);


  if (result.error) {

    alert(result.error.message);

    return;

  }


  await loadScorers();

}


// ============================================================
// GRADO
// ============================================================

async function loadCleanliness() {

  const result =
    await db
      .from("cleanliness_scores")
      .select("*");


  if (result.error) {

    console.error(
      "Error cargando grado:",
      result.error
    );

    return;

  }


  renderCleanliness(
    result.data || []
  );

}


// ============================================================
// RENDER GRADO
// ============================================================

function renderCleanliness(rows) {

  const container =
    document.getElementById(
      "cleanlinessTable"
    );


  if (!container) {

    console.error(
      "No existe #cleanlinessTable."
    );

    return;

  }


  if (!rows.length) {

    container.innerHTML = `
      <tr>
        <td colspan="5">
          No hay datos de grado registrados.
        </td>
      </tr>
    `;

    return;

  }


  const sorted =
    [...rows].sort((a, b) => {

      const scoreA =
        Number(
          a.score ??
          a.points ??
          0
        );


      const scoreB =
        Number(
          b.score ??
          b.points ??
          0
        );


      return scoreB - scoreA;

    });


  container.innerHTML =
    sorted
      .map((row, index) => {

        const name =
          row.grade ||
          row.name ||
          row.team ||
          "";


        const score =
          row.score ??
          row.points ??
          0;


        const reason =
          row.reason ||
          row.description ||
          row.comment ||
          "";


        const action =
          currentSession
            ? `
              <button
                type="button"
                class="admin-button"
                onclick="editTeamPoints(${Number(row.id)})">
                ✏️
              </button>
            `
            : "";


        return `
          <tr>

            <td>
              ${index + 1}
            </td>

            <td>
              ${escapeHTML(
                String(name)
              )}
            </td>

            <td>
              ${escapeHTML(
                String(score)
              )}
            </td>

            <td>
              ${escapeHTML(
                String(reason)
              )}
            </td>

            <td>
              ${action}
            </td>

          </tr>
        `;

      })
      .join("");

}


// ============================================================
// EDITAR PUNTOS DE GRADO
// ============================================================

async function editTeamPoints(id) {

  if (!currentSession) {

    alert(
      "Debes iniciar sesión como organizador."
    );

    return;

  }


  const numericId =
    Number(id);


  if (!Number.isFinite(numericId)) {

    alert(
      "ID de grado no válido."
    );

    return;

  }


  const result =
    await db
      .from("cleanliness_scores")
      .select("*")
      .eq("id", numericId)
      .single();


  if (result.error) {

    console.error(
      "Error obteniendo puntos:",
      result.error
    );

    alert(
      result.error.message
    );

    return;

  }


  const row =
    result.data;


  const currentPoints =
    row.score ??
    row.points ??
    0;


  const newPoints =
    prompt(
      "Ingresa los nuevos puntos:",
      currentPoints
    );


  if (newPoints === null) {
    return;
  }


  const points =
    Number(newPoints);


  if (!Number.isFinite(points)) {

    alert(
      "Los puntos deben ser un número."
    );

    return;

  }


  const updateData = {};


  if (
    Object.prototype.hasOwnProperty.call(
      row,
      "score"
    )
  ) {

    updateData.score =
      points;

  }

  else if (
    Object.prototype.hasOwnProperty.call(
      row,
      "points"
    )
  ) {

    updateData.points =
      points;

  }

  else {

    alert(
      "No se encontró score ni points."
    );

    return;

  }


  const updateResult =
    await db
      .from("cleanliness_scores")
      .update(updateData)
      .eq("id", numericId);


  if (updateResult.error) {

    console.error(
      "Error actualizando puntos:",
      updateResult.error
    );

    alert(
      updateResult.error.message
    );

    return;

  }


  await loadCleanliness();

}


// ============================================================
// COMPATIBILIDAD
// ============================================================

async function editCleanliness(id) {

  return editTeamPoints(id);

}


async function saveCleanliness() {

  return;

}


// ============================================================
// CERRAR MODAL
// ============================================================

function closeModal(id) {

  const modal =
    document.getElementById(id);


  if (modal) {

    modal.style.display =
      "none";

  }

}


// ============================================================
// SEGURIDAD HTML
// ============================================================

function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


// ============================================================
// FUNCIONES DISPONIBLES GLOBALMENTE
// ============================================================

window.closeModal = closeModal;
window.login = login;
window.logout = logout;

window.editMatch = editMatch;
window.saveMatch = saveMatch;

window.editTeamPoints = editTeamPoints;

window.openSanctionModal = openSanctionModal;
window.editSanction = editSanction;
window.deleteSanction = deleteSanction;

window.openScorerModal = openScorerModal;
window.editScorer = editScorer;
window.deleteScorer = deleteScorer;

window.refreshAll = refreshAll;

console.log("INTERAULAS: funciones globales cargadas correctamente.");

// ============================================================
// VERIFICACIÓN
// ============================================================

console.log(
  "Interaulas 2026 app.js cargado correctamente."
);

console.log(
  "refreshAll:",
  typeof window.refreshAll
);

console.log(
  "editTeamPoints:",
  typeof window.editTeamPoints
);
