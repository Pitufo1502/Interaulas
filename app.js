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
let editingCleanlinessId = null;


// ============================================================
// INICIO
// ============================================================

document.addEventListener("DOMContentLoaded", async function () {

  await checkSession();

  await refreshAll();

  setupButtons();

});


// ============================================================
// BOTONES
// ============================================================

function setupButtons() {

  const loginButton =
    document.getElementById("login-button");

  if (loginButton) {
    loginButton.addEventListener("click", login);
  }

  const logoutButton =
    document.getElementById("logout-button");

  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }

}


// ============================================================
// SESIÓN
// ============================================================

async function checkSession() {

  try {

    const result = await db.auth.getSession();

    currentSession = result.data.session || null;

    updateAuthUI();

  } catch (error) {

    console.error("Error al comprobar sesión:", error);

  }

}


async function login() {

  const emailInput =
    document.getElementById("login-email");

  const passwordInput =
    document.getElementById("login-password");

  if (!emailInput || !passwordInput) {
    return;
  }

  const email =
    emailInput.value.trim();

  const password =
    passwordInput.value;

  if (!email || !password) {

    alert("Ingresa tu correo y contraseña.");

    return;
  }

  const result =
    await db.auth.signInWithPassword({
      email: email,
      password: password
    });

  if (result.error) {

    alert(result.error.message);

    return;
  }

  currentSession =
    result.data.session;

  updateAuthUI();

  await refreshAll();

}


async function logout() {

  await db.auth.signOut();

  currentSession = null;

  updateAuthUI();

  await refreshAll();

}


function updateAuthUI() {

  const loginArea =
    document.getElementById("login-area");

  const adminArea =
    document.getElementById("admin-area");

  if (currentSession) {

    if (loginArea) {
      loginArea.style.display = "none";
    }

    if (adminArea) {
      adminArea.style.display = "block";
    }

  } else {

    if (loginArea) {
      loginArea.style.display = "block";
    }

    if (adminArea) {
      adminArea.style.display = "none";
    }

  }

}


// ============================================================
// REFRESH
// ============================================================

async function refreshAll() {

  await loadMatches();

  await loadSanctions();

  await loadScorers();

  await loadCleanliness();

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
// PARTIDOS - CARGAR
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
    new Date(dateString + "T12:00:00");

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

  return [...matches].sort(
    function (a, b) {

      const dateA =
        getMatchDate(a);

      const dateB =
        getMatchDate(b);

      return (
        new Date(dateA + "T12:00:00") -
        new Date(dateB + "T12:00:00")
      );

    }
  );

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

  const sorted =
    sortMatchesByDate(matches);

  const menMatches =
    sorted.filter(function (match) {

      return (
        getGender(
          match.home_team,
          match.away_team
        ) === "M"
      );

    });

  const womenMatches =
    sorted.filter(function (match) {

      return (
        getGender(
          match.home_team,
          match.away_team
        ) === "F"
      );

    });


  const menContainer =
    document.getElementById("men-matches") ||
    document.getElementById("matches-men") ||
    document.getElementById("boys-matches");


  const womenContainer =
    document.getElementById("women-matches") ||
    document.getElementById("matches-women") ||
    document.getElementById("girls-matches");


  if (menContainer) {

    menContainer.innerHTML =
      menMatches
        .map(matchCardHTML)
        .join("");

  }


  if (womenContainer) {

    womenContainer.innerHTML =
      womenMatches
        .map(matchCardHTML)
        .join("");

  }

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
      homeScore + " - " + awayScore;

  }


  let adminButton = "";

  if (currentSession) {

    adminButton = `
      <button
        class="admin-button"
        onclick="editMatch(${match.id})">
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
          ${formatDate(date)}
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
    document.getElementById("next-match");

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
      .filter(function (match) {

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
            No hay partidos próximos
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
          ${formatDate(
            getMatchDate(next)
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
    document.getElementById(
      "edit-match-title"
    );


  if (title) {

    title.textContent =
      normalizeTeam(
        match.home_team
      ) +
      " vs " +
      normalizeTeam(
        match.away_team
      );

  }


  const homeInput =
    document.getElementById(
      "edit-home-score"
    );


  const awayInput =
    document.getElementById(
      "edit-away-score"
    );


  if (homeInput) {

    homeInput.value =
      getHomeScore(match) ?? "";

  }


  if (awayInput) {

    awayInput.value =
      getAwayScore(match) ?? "";

  }


  const modal =
    document.getElementById(
      "match-modal"
    );


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
    document.getElementById(
      "edit-home-score"
    );


  const awayInput =
    document.getElementById(
      "edit-away-score"
    );


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
      .eq(
        "id",
        editingMatchId
      );


  if (result.error) {

    alert(result.error.message);

    return;
  }


  editingMatchId =
    null;


  closeModal(
    "match-modal"
  );


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


  const menAContainer =
    document.getElementById(
      "men-table-a"
    ) ||
    document.getElementById(
      "standings-men-a"
    );


  const menBContainer =
    document.getElementById(
      "men-table-b"
    ) ||
    document.getElementById(
      "standings-men-b"
    );


  const womenContainer =
    document.getElementById(
      "women-table"
    ) ||
    document.getElementById(
      "standings-women"
    );


  if (menAContainer) {

    menAContainer.innerHTML =
      standingsHTML(tableA);

  }


  if (menBContainer) {

    menBContainer.innerHTML =
      standingsHTML(tableB);

  }


  if (womenContainer) {

    womenContainer.innerHTML =
      standingsHTML(tableWomen);

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


  teams.forEach(function (team) {

    table[team] = {

      team: team,

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


  matches.forEach(function (match) {

    if (!hasScore(match)) {
      return;
    }


    const home =
      normalizeTeam(
        match.home_team
      );

    const away =
      normalizeTeam(
        match.away_team
      );


    if (
      !table[home] ||
      !table[away]
    ) {

      return;

    }


    const homeScore =
      Number(
        getHomeScore(match)
      );

    const awayScore =
      Number(
        getAwayScore(match)
      );


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

    else if (
      awayScore > homeScore
    ) {

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


  rows.forEach(function (row) {

    row.goalDifference =
      row.goalsFor -
      row.goalsAgainst;

  });


  rows.sort(
    function (a, b) {

      if (
        b.points !==
        a.points
      ) {

        return (
          b.points -
          a.points
        );

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


      return (
        b.goalsFor -
        a.goalsFor
      );

    }
  );


  return rows;

}


// ============================================================
// HTML TABLA
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


      ${rows.map(
        function (row, index) {

          return `
            <div class="standings-row">

              <span>
                ${index + 1}
              </span>

              <span>
                ${escapeHTML(
                  row.team
                )}
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
          `;

        }
      ).join("")}

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


function renderSanctions(
  sanctions
) {

  const container =
    document.getElementById(
      "sanctions-list"
    ) ||
    document.getElementById(
      "sanctions"
    );


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
    sanctions.map(
      function (sanction) {

        let buttons = "";


        if (currentSession) {

          buttons = `
            <div class="admin-actions">

              <button
                class="admin-button"
                onclick="editSanction(${sanction.id})">
                ✏️ Editar
              </button>

              <button
                class="admin-button danger"
                onclick="deleteSanction(${sanction.id})">
                🗑️ Eliminar
              </button>

            </div>
          `;

        }


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
                      String(
                        sanction.date
                      )
                    )}
                  </div>
                `
                : ""
            }

            ${buttons}

          </div>
        `;

      }
    ).join("");

}


// ============================================================
// AGREGAR SANCIÓN
// ============================================================

function openSanctionModal() {

  if (!currentSession) {
    return;
  }


  editingSanctionId =
    null;


  const modal =
    document.getElementById(
      "sanction-modal"
    );


  if (modal) {

    modal.style.display =
      "flex";

  }

}


async function addSanction() {

  if (!currentSession) {
    return;
  }


  const student =
    document.getElementById(
      "sanction-student"
    )?.value.trim();


  const team =
    document.getElementById(
      "sanction-team"
    )?.value.trim();


  const reason =
    document.getElementById(
      "sanction-reason"
    )?.value.trim();


  const date =
    document.getElementById(
      "sanction-date"
    )?.value;


  if (!student || !reason) {

    alert(
      "Completa el nombre y la razón."
    );

    return;
  }


  const result =
    await db
      .from("sanctions")
      .insert([
        {
          student: student,
          team: team || null,
          reason: reason,
          date: date || null
        }
      ]);


  if (result.error) {

    alert(
      result.error.message
    );

    return;
  }


  closeModal(
    "sanction-modal"
  );


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

    alert(
      result.error.message
    );

    return;
  }


  const sanction =
    result.data;


  editingSanctionId =
    id;


  const studentInput =
    document.getElementById(
      "sanction-student"
    );


  const teamInput =
    document.getElementById(
      "sanction-team"
    );


  const reasonInput =
    document.getElementById(
      "sanction-reason"
    );


  const dateInput =
    document.getElementById(
      "sanction-date"
    );


  if (studentInput) {

    studentInput.value =
      sanction.student ||
      sanction.player ||
      sanction.name ||
      "";

  }


  if (teamInput) {

    teamInput.value =
      sanction.team ||
      sanction.grade ||
      "";

  }


  if (reasonInput) {

    reasonInput.value =
      sanction.reason ||
      sanction.description ||
      "";

  }


  if (dateInput) {

    dateInput.value =
      sanction.date ||
      "";

  }


  const modal =
    document.getElementById(
      "sanction-modal"
    );


  if (modal) {

    modal.style.display =
      "flex";

  }

}


// ============================================================
// GUARDAR SANCIÓN
// ============================================================

async function saveSanction() {

  if (
    !currentSession ||
    !editingSanctionId
  ) {

    return;

  }


  const student =
    document.getElementById(
      "sanction-student"
    )?.value.trim();


  const team =
    document.getElementById(
      "sanction-team"
    )?.value.trim();


  const reason =
    document.getElementById(
      "sanction-reason"
    )?.value.trim();


  const date =
    document.getElementById(
      "sanction-date"
    )?.value;


  if (!student || !reason) {

    alert(
      "Completa el nombre y la razón."
    );

    return;
  }


  const result =
    await db
      .from("sanctions")
      .update({
        student: student,
        team: team || null,
        reason: reason,
        date: date || null
      })
      .eq(
        "id",
        editingSanctionId
      );


  if (result.error) {

    alert(
      result.error.message
    );

    return;
  }


  editingSanctionId =
    null;


  closeModal(
    "sanction-modal"
  );


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

    alert(
      result.error.message
    );

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
    document.getElementById(
      "men-scorers"
    ) ||
    document.getElementById(
      "scorers-men"
    );


  const womenContainer =
    document.getElementById(
      "women-scorers"
    ) ||
    document.getElementById(
      "scorers-women"
    );


  const men =
    scorers.filter(
      function (scorer) {

        return (
          scorer.gender === "M" ||
          scorer.gender === "H" ||
          isMenTeam(
            scorer.team
          )
        );

      }
    );


  const women =
    scorers.filter(
      function (scorer) {

        return (
          scorer.gender === "F" ||
          scorer.gender === "W" ||
          isWomenTeam(
            scorer.team
          )
        );

      }
    );


  if (menContainer) {

    menContainer.innerHTML =
      scorerTableHTML(men);

  }


  if (womenContainer) {

    womenContainer.innerHTML =
      scorerTableHTML(women);

  }

}


// ============================================================
// TABLA GOLEADORES
// ============================================================

function scorerTableHTML(scorers) {

  const sorted =
    [...scorers].sort(
      function (a, b) {

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

      }
    );


  if (!sorted.length) {

    return `
      <div class="empty-state">
        No hay goleadores registrados.
      </div>
    `;

  }


  return `
    <div class="scorer-table">

      <div class="scorer-row scorer-header">

        <span>#</span>

        <span>Jugador</span>

        <span>Equipo</span>

        <span>Goles</span>

        ${
          currentSession
            ? "<span>Acciones</span>"
            : ""
        }

      </div>


      ${sorted.map(
        function (scorer, index) {

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


          let actions = "";


          if (currentSession) {

            actions = `
              <span>

                <button
                  class="admin-button"
                  onclick="editScorer(${scorer.id})">
                  ✏️
                </button>

                <button
                  class="admin-button danger"
                  onclick="deleteScorer(${scorer.id})">
                  🗑️
                </button>

              </span>
            `;

          }


          return `
            <div class="scorer-row">

              <span>
                ${index + 1}
              </span>

              <strong>
                ${escapeHTML(player)}
              </strong>

              <span>
                ${escapeHTML(team)}
              </span>

              <strong>
                ${goals}
              </strong>

              ${actions}

            </div>
          `;

        }
      ).join("")}

    </div>
  `;

}


// ============================================================
// AGREGAR GOLEADOR
// ============================================================

function openScorerModal() {

  if (!currentSession) {
    return;
  }


  editingScorerId =
    null;


  const modal =
    document.getElementById(
      "scorer-modal"
    );


  if (modal) {

    modal.style.display =
      "flex";

  }

}


async function addScorer() {

  if (!currentSession) {
    return;
  }


  const player =
    document.getElementById(
      "scorer-player"
    )?.value.trim();


  const team =
    document.getElementById(
      "scorer-team"
    )?.value.trim();


  const gender =
    document.getElementById(
      "scorer-gender"
    )?.value;


  const goals =
    Number(
      document.getElementById(
        "scorer-goals"
      )?.value || 0
    );


  if (!player || !team) {

    alert(
      "Completa el jugador y el equipo."
    );

    return;
  }


  const result =
    await db
      .from("scorers")
      .insert([
        {
          player: player,
          team: normalizeTeam(team),
          gender: gender || null,
          goals: goals
        }
      ]);


  if (result.error) {

    alert(
      result.error.message
    );

    return;
  }


  closeModal(
    "scorer-modal"
  );


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

    alert(
      result.error.message
    );

    return;
  }


  const scorer =
    result.data;


  editingScorerId =
    id;


  const playerInput =
    document.getElementById(
      "scorer-player"
    );


  const teamInput =
    document.getElementById(
      "scorer-team"
    );


  const genderInput =
    document.getElementById(
      "scorer-gender"
    );


  const goalsInput =
    document.getElementById(
      "scorer-goals"
    );


  if (playerInput) {

    playerInput.value =
      scorer.player ||
      scorer.name ||
      "";

  }


  if (teamInput) {

    teamInput.value =
      normalizeTeam(
        scorer.team || ""
      );

  }


  if (genderInput) {

    genderInput.value =
      scorer.gender ||
      "";

  }


  if (goalsInput) {

    goalsInput.value =
      scorer.goals ??
      scorer.goal_count ??
      0;

  }


  const modal =
    document.getElementById(
      "scorer-modal"
    );


  if (modal) {

    modal.style.display =
      "flex";

  }

}


// ============================================================
// GUARDAR GOLEADOR
// ============================================================

async function saveScorer() {

  if (
    !currentSession ||
    !editingScorerId
  ) {

    return;

  }


  const player =
    document.getElementById(
      "scorer-player"
    )?.value.trim();


  const team =
    document.getElementById(
      "scorer-team"
    )?.value.trim();


  const gender =
    document.getElementById(
      "scorer-gender"
    )?.value;


  const goals =
    Number(
      document.getElementById(
        "scorer-goals"
      )?.value || 0
    );


  if (!player || !team) {

    alert(
      "Completa el jugador y el equipo."
    );

    return;
  }


  const result =
    await db
      .from("scorers")
      .update({
        player: player,
        team: normalizeTeam(team),
        gender: gender || null,
        goals: goals
      })
      .eq(
        "id",
        editingScorerId
      );


  if (result.error) {

    alert(
      result.error.message
    );

    return;
  }


  editingScorerId =
    null;


  closeModal(
    "scorer-modal"
  );


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

    alert(
      result.error.message
    );

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
      "cleanliness-list"
    ) ||
    document.getElementById(
      "cleanliness"
    ) ||
    document.getElementById(
      "grado-list"
    );


  if (!container) {
    return;
  }


  if (!rows.length) {

    container.innerHTML = `
      <div class="empty-state">
        No hay datos de grado registrados.
      </div>
    `;

    return;
  }


  const sorted =
    [...rows].sort(
      function (a, b) {

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

      }
    );


  container.innerHTML =
    sorted.map(
      function (row, index) {

        const name =
          row.grade ||
          row.name ||
          row.team ||
          "";


        const score =
          row.score ??
          row.points ??
          0;


        let action = "";


        if (currentSession) {

          action = `
            <button
              class="admin-button"
              onclick="editCleanliness(${row.id})">
              ✏️
            </button>
          `;

        }


        return `
          <div class="cleanliness-row">

            <span>
              ${index + 1}
            </span>

            <strong>
              ${escapeHTML(
                String(name)
              )}
            </strong>

            <span>
              ${score}
            </span>

            ${action}

          </div>
        `;

      }
    ).join("");

}


// ============================================================
// EDITAR GRADO
// ============================================================

async function editCleanliness(id) {

  if (!currentSession) {
    return;
  }


  const result =
    await db
      .from("cleanliness_scores")
      .select("*")
      .eq("id", id)
      .single();


  if (result.error) {

    alert(
      result.error.message
    );

    return;
  }


  const row =
    result.data;


  editingCleanlinessId =
    id;


  const nameInput =
    document.getElementById(
      "cleanliness-name"
    );


  const scoreInput =
    document.getElementById(
      "cleanliness-score"
    );


  if (nameInput) {

    nameInput.value =
      row.grade ||
      row.name ||
      row.team ||
      "";

  }


  if (scoreInput) {

    scoreInput.value =
      row.score ??
      row.points ??
      0;

  }


  const modal =
    document.getElementById(
      "cleanliness-modal"
    );


  if (modal) {

    modal.style.display =
      "flex";

  }

}


// ============================================================
// GUARDAR GRADO
// ============================================================

async function saveCleanliness() {

  if (
    !currentSession ||
    !editingCleanlinessId
  ) {

    return;

  }


  const scoreInput =
    document.getElementById(
      "cleanliness-score"
    );


  if (!scoreInput) {
    return;
  }


  const score =
    Number(
      scoreInput.value
    );


  if (!Number.isFinite(score)) {

    alert(
      "El puntaje no es válido."
    );

    return;
  }


  const result =
    await db
      .from("cleanliness_scores")
      .update({
        score: score
      })
      .eq(
        "id",
        editingCleanlinessId
      );


  if (result.error) {

    alert(
      result.error.message
    );

    return;
  }


  editingCleanlinessId =
    null;


  closeModal(
    "cleanliness-modal"
  );


  await loadCleanliness();

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
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


// ============================================================
// HACER FUNCIONES DISPONIBLES PARA HTML
// ============================================================

window.refreshAll =
  refreshAll;

window.login =
  login;

window.logout =
  logout;

window.editMatch =
  editMatch;

window.saveMatch =
  saveMatch;

window.openSanctionModal =
  openSanctionModal;

window.addSanction =
  addSanction;

window.editSanction =
  editSanction;

window.saveSanction =
  saveSanction;

window.deleteSanction =
  deleteSanction;

window.openScorerModal =
  openScorerModal;

window.addScorer =
  addScorer;

window.editScorer =
  editScorer;

window.saveScorer =
  saveScorer;

window.deleteScorer =
  deleteScorer;

window.editCleanliness =
  editCleanliness;

window.saveCleanliness =
  saveCleanliness;

window.closeModal =
  closeModal;
