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
// EQUIPOS ANTIGUOS
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


// ============================================================
// INICIO
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {

  console.log("INTERAULAS: DOM cargado");

  setupButtons();

  await checkSession();

  await refreshAll();

});


// ============================================================
// BOTONES
// ============================================================

function setupButtons() {

  const loginBtn = document.getElementById("loginBtn");

  if (loginBtn) {

    loginBtn.onclick = function () {

      if (currentSession) {

        logout();

      } else {

        const modal =
          document.getElementById("authModal");

        if (modal) {

          modal.classList.remove("hidden");
          modal.style.display = "flex";

        }

      }

    };

  }


  const addSanctionBtn =
    document.getElementById("addSanctionBtn");

  if (addSanctionBtn) {

    addSanctionBtn.onclick =
      openSanctionModal;

  }


  const addScorerBtn =
    document.getElementById("addScorerBtn");

  if (addScorerBtn) {

    addScorerBtn.onclick =
      openScorerModal;

  }

}


// ============================================================
// SESIÓN
// ============================================================

async function checkSession() {

  try {

    const {
      data,
      error
    } = await db.auth.getSession();

    if (error) {

      console.error(
        "Error obteniendo sesión:",
        error
      );

      return;

    }

    currentSession =
      data?.session || null;

    updateAuthUI();

  } catch (error) {

    console.error(
      "Error comprobando sesión:",
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
      "No se encontraron email/password."
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


  if (message) {

    message.textContent =
      "Iniciando sesión...";

  }


  try {

    const {
      data,
      error
    } = await db.auth.signInWithPassword({
      email,
      password
    });


    if (error) {

      console.error(
        "Error de login:",
        error
      );

      if (message) {

        message.textContent =
          "Correo o contraseña incorrectos.";

      }

      return;

    }


    currentSession =
      data.session;


    emailInput.value = "";
    passwordInput.value = "";

    if (message) {
      message.textContent = "";
    }


    closeModal("authModal");

    updateAuthUI();

    await refreshAll();

  } catch (error) {

    console.error(
      "Error inesperado en login:",
      error
    );

    if (message) {

      message.textContent =
        "Ocurrió un error al iniciar sesión.";

    }

  }

}


// ============================================================
// LOGOUT
// ============================================================

async function logout() {

  try {

    await db.auth.signOut();

  } catch (error) {

    console.error(
      "Error cerrando sesión:",
      error
    );

  }

  currentSession = null;

  updateAuthUI();

  await refreshAll();

}


// ============================================================
// UI LOGIN
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
// REFRESH
// ============================================================

async function refreshAll() {

  console.log(
    "INTERAULAS: actualizando datos..."
  );


  try {
    await loadMatches();
  } catch (error) {
    console.error(
      "Error cargando partidos:",
      error
    );
  }


  try {
    await loadSanctions();
  } catch (error) {
    console.error(
      "Error cargando sanciones:",
      error
    );
  }


  try {
    await loadScorers();
  } catch (error) {
    console.error(
      "Error cargando goleadores:",
      error
    );
  }


  try {
    await loadCleanliness();
  } catch (error) {
    console.error(
      "Error cargando grado:",
      error
    );
  }


  console.log(
    "INTERAULAS: datos cargados."
  );

}


// ============================================================
// EQUIPOS
// ============================================================

function normalizeTeam(team) {

  if (!team) return "";

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

  const {
    data,
    error
  } = await db
    .from("matches")
    .select("*");


  if (error) {

    console.error(
      "Error cargando partidos:",
      error
    );

    return;

  }


  const matches =
    data || [];


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


// ============================================================
// FECHA BONITA
// ============================================================

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
// ORDENAR
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
// RENDER HORARIO
// ============================================================

function renderMatches(matches) {

  const container =
    document.getElementById("matches");


  if (!container) {

    console.error(
      "No existe #matches."
    );

    return;

  }


  const sorted =
    sortMatchesByDate(matches);


  if (!sorted.length) {

    container.innerHTML = `
      <div class="empty">
        No hay partidos registrados.
      </div>
    `;

    return;

  }


  // Una tarjeta por día
  container.innerHTML =
    sorted.map(match => {

      const number =
        getMatchNumber(match);

      const date =
        getMatchDate(match);

      const home =
        normalizeTeam(match.home_team);

      const away =
        normalizeTeam(match.away_team);

      const gender =
        getGender(home, away);

      const homeScore =
        getHomeScore(match);

      const awayScore =
        getAwayScore(match);

      const score =
        hasScore(match)
          ? `${homeScore} - ${awayScore}`
          : "VS";


      const editButton =
        currentSession
          ? `
            <button
              type="button"
              class="outline edit"
              onclick="editMatch(${Number(match.id)})">
              ✏️ Editar
            </button>
          `
          : "";


      return `
        <div class="matchday">

          <h3>
            Partido ${number} ·
            ${escapeHTML(
              formatDate(date)
            )}
            ·
            ${gender === "M"
              ? "Hombres"
              : "Mujeres"}
          </h3>

          <div class="match">

            <div class="match-date">
              ${escapeHTML(
                date
              )}
            </div>

            <div class="match-teams">

              <div class="match-team">
                ${escapeHTML(home)}
              </div>

              <div class="match-team">
                ${escapeHTML(away)}
              </div>

            </div>

            <div class="score ${
              hasScore(match)
                ? ""
                : "pending"
            }">
              ${score}
            </div>

            <div class="edit">
              ${editButton}
            </div>

          </div>

        </div>
      `;

    }).join("");

}


// ============================================================
// PRÓXIMO PARTIDO
// ============================================================

function renderNext(matches) {

  const container =
    document.getElementById("nextMatch");


  if (!container) {

    console.error(
      "No existe #nextMatch."
    );

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
      <div>

        <div class="eyebrow">
          PRÓXIMO PARTIDO
        </div>

        <strong>
          No hay partidos próximos.
        </strong>

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

  const gender =
    getGender(home, away);


  container.innerHTML = `

    <div>

      <div class="eyebrow">
        PRÓXIMO PARTIDO
      </div>

      <h2 style="margin:8px 0 5px;">
        ${escapeHTML(
          formatDate(
            getMatchDate(next)
          )
        )}
      </h2>

      <div style="
        font-size:26px;
        font-weight:900;
        margin-top:14px;
      ">
        ${escapeHTML(home)}
        <span style="color:#98a2b3;"> vs </span>
        ${escapeHTML(away)}
      </div>

      <div style="
        margin-top:10px;
        color:#98a2b3;
        font-size:13px;
      ">
        Partido ${getMatchNumber(next)}
        ·
        ${gender === "M"
          ? "Hombres"
          : "Mujeres"}
      </div>

    </div>

  `;

}


// ============================================================
// EDITAR PARTIDO
// ============================================================

async function editMatch(id) {

  if (!currentSession) {

    alert(
      "Debes iniciar sesión como organizador."
    );

    return;

  }


  const {
    data: match,
    error
  } = await db
    .from("matches")
    .select("*")
    .eq("id", id)
    .single();


  if (error) {

    alert(error.message);

    return;

  }


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

    modal.classList.remove("hidden");
    modal.style.display = "flex";

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


  const {
    error
  } = await db
    .from("matches")
    .update({
      home_score: homeScore,
      away_score: awayScore
    })
    .eq("id", editingMatchId);


  if (error) {

    alert(error.message);

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

  const menContainer =
    document.getElementById("menTables");

  const womenContainer =
    document.getElementById("womenTable");


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

        <h3>Clasificación</h3>

        ${standingsHTML(tableWomen)}

      </div>

    `;

  }

}


// ============================================================
// CREAR CLASIFICACIÓN
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


    return (
      b.goalsFor -
      a.goalsFor
    );

  });


  return rows;

}


// ============================================================
// HTML CLASIFICACIÓN
// ============================================================

function standingsHTML(rows) {

  return `

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
          </tr>

        </thead>

        <tbody>

          ${rows.map((row, index) => `

            <tr>

              <td class="rank">
                ${index + 1}
              </td>

              <td class="team-name">
                ${escapeHTML(row.team)}
              </td>

              <td>
                ${row.played}
              </td>

              <td>
                ${row.wins}
              </td>

              <td>
                ${row.draws}
              </td>

              <td>
                ${row.losses}
              </td>

              <td>
                ${row.goalsFor}
              </td>

              <td>
                ${row.goalsAgainst}
              </td>

              <td>
                ${row.goalDifference}
              </td>

              <td class="pts">
                ${row.points}
              </td>

            </tr>

          `).join("")}

        </tbody>

      </table>

    </div>

  `;

}


// ============================================================
// SANCIONES
// ============================================================

async function loadSanctions() {

  const {
    data,
    error
  } = await db
    .from("sanctions")
    .select("*");


  if (error) {

    console.error(
      "Error cargando sanciones:",
      error
    );

    return;

  }


  renderSanctions(
    data || []
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
      <div class="empty">
        No hay sanciones registradas.
      </div>
    `;

    return;

  }


  container.innerHTML =
    sanctions.map(sanction => {

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

      const date =
        sanction.date ||
        "";


      const actions =
        currentSession
          ? `
            <div class="sanction-actions">

              <button
                type="button"
                class="outline"
                onclick="editSanction(${Number(sanction.id)})">
                ✏️ Editar
              </button>

              <button
                type="button"
                class="danger"
                onclick="deleteSanction(${Number(sanction.id)})">
                🗑️ Eliminar
              </button>

            </div>
          `
          : "";


      return `

        <div class="sanction">

          <strong>
            ${escapeHTML(student)}
          </strong>

          <span>
            ${escapeHTML(team)}
          </span>

          <span>
            ${escapeHTML(date)}
          </span>

          <span>
            ${escapeHTML(reason)}
          </span>

          ${actions}

        </div>

      `;

    }).join("");

}


// ============================================================
// AGREGAR SANCIÓN
// ============================================================

async function openSanctionModal() {

  if (!currentSession) {
    return;
  }


  const student =
    prompt(
      "Nombre del estudiante:"
    );


  if (student === null) {
    return;
  }


  const team =
    prompt(
      "Grado / equipo:"
    );


  if (team === null) {
    return;
  }


  const reason =
    prompt(
      "Razón de la sanción:"
    );


  if (reason === null) {
    return;
  }


  const date =
    prompt(
      "Fecha (opcional):",
      ""
    );


  const {
    error
  } = await db
    .from("sanctions")
    .insert([{
      student: student.trim(),
      team: team.trim() || null,
      reason: reason.trim(),
      date: date
        ? date.trim()
        : null
    }]);


  if (error) {

    alert(error.message);

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


  const {
    data: sanction,
    error
  } = await db
    .from("sanctions")
    .select("*")
    .eq("id", id)
    .single();


  if (error) {

    alert(error.message);

    return;

  }


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


  const {
    error: updateError
  } = await db
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


  if (updateError) {

    alert(updateError.message);

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


  if (
    !confirm(
      "¿Seguro que quieres eliminar esta sanción?"
    )
  ) {

    return;

  }


  const {
    error
  } = await db
    .from("sanctions")
    .delete()
    .eq("id", id);


  if (error) {

    alert(error.message);

    return;

  }


  await loadSanctions();

}


// ============================================================
// GOLEADORES
// ============================================================

async function loadScorers() {

  const {
    data,
    error
  } = await db
    .from("scorers")
    .select("*");


  if (error) {

    console.error(
      "Error cargando goleadores:",
      error
    );

    return;

  }


  renderScorers(
    data || []
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


  return sorted.map(
    (scorer, index) => {

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
                class="outline"
                onclick="editScorer(${Number(scorer.id)})">
                ✏️
              </button>

              <button
                type="button"
                class="danger"
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

          <td class="scorer-name">
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

    }
  ).join("");

}


// ============================================================
// AGREGAR GOLEADOR
// ============================================================

async function openScorerModal() {

  if (!currentSession) {
    return;
  }


  const player =
    prompt(
      "Nombre del jugador:"
    );


  if (player === null) {
    return;
  }


  const team =
    prompt(
      "Equipo:"
    );


  if (team === null) {
    return;
  }


  const gender =
    prompt(
      "Escribe M para hombres o F para mujeres:",
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


  const {
    error
  } = await db
    .from("scorers")
    .insert([{
      player: player.trim(),
      team: normalizeTeam(team.trim()),
      gender: gender.trim().toUpperCase(),
      goals: numericGoals
    }]);


  if (error) {

    alert(error.message);

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


  const {
    data: scorer,
    error
  } = await db
    .from("scorers")
    .select("*")
    .eq("id", id)
    .single();


  if (error) {

    alert(error.message);

    return;

  }


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


  const {
    error: updateError
  } = await db
    .from("scorers")
    .update({
      player: player.trim(),
      team: normalizeTeam(team.trim()),
      gender: gender.trim().toUpperCase(),
      goals: numericGoals
    })
    .eq("id", id);


  if (updateError) {

    alert(updateError.message);

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


  if (
    !confirm(
      "¿Seguro que quieres eliminar este goleador?"
    )
  ) {

    return;

  }


  const {
    error
  } = await db
    .from("scorers")
    .delete()
    .eq("id", id);


  if (error) {

    alert(error.message);

    return;

  }


  await loadScorers();

}


// ============================================================
// GRADO
// ============================================================

async function loadCleanliness() {

  const {
    data,
    error
  } = await db
    .from("cleanliness_scores")
    .select("*");


  if (error) {

    console.error(
      "Error cargando grado:",
      error
    );

    return;

  }


  renderCleanliness(
    data || []
  );

}


function renderCleanliness(rows) {

  const container =
    document.getElementById(
      "cleanlinessTable"
    );


  if (!container) {
    return;
  }


  if (!rows.length) {

    container.innerHTML = `
      <tr>
        <td colspan="5">
          No hay datos registrados.
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
    sorted.map((row, index) => {

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
              class="outline"
              onclick="editTeamPoints(${Number(row.id)})">
              ✏️ Editar
            </button>
          `
          : "";


      return `

        <tr>

          <td class="rank">
            ${index + 1}
          </td>

          <td class="team-name">
            ${escapeHTML(
              String(name)
            )}
          </td>

          <td class="pts">
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

    }).join("");

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


  const {
    data: row,
    error
  } = await db
    .from("cleanliness_scores")
    .select("*")
    .eq("id", numericId)
    .single();


  if (error) {

    alert(error.message);

    return;

  }


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

  else {

    updateData.points =
      points;

  }


  const {
    error: updateError
  } = await db
    .from("cleanliness_scores")
    .update(updateData)
    .eq("id", numericId);


  if (updateError) {

    alert(updateError.message);

    return;

  }


  await loadCleanliness();

}


// ============================================================
// CERRAR MODAL
// ============================================================

function closeModal(id) {

  const modal =
    document.getElementById(id);


  if (!modal) {
    return;
  }


  modal.classList.add("hidden");

  modal.style.display =
    "none";

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
// FUNCIONES GLOBALES
// ============================================================

window.closeModal =
  closeModal;

window.login =
  login;

window.logout =
  logout;

window.editMatch =
  editMatch;

window.saveMatch =
  saveMatch;

window.editTeamPoints =
  editTeamPoints;

window.openSanctionModal =
  openSanctionModal;

window.editSanction =
  editSanction;

window.deleteSanction =
  deleteSanction;

window.openScorerModal =
  openScorerModal;

window.editScorer =
  editScorer;

window.deleteScorer =
  deleteScorer;

window.refreshAll =
  refreshAll;


// ============================================================
// SUPABASE CAMBIOS DE SESIÓN
// ============================================================

db.auth.onAuthStateChange(
  (_event, session) => {

    currentSession =
      session || null;

    updateAuthUI();

  }
);


// ============================================================
// DEBUG
// ============================================================

console.log(
  "INTERAULAS 2026 app.js cargado correctamente."
);

console.log(
  "refreshAll:",
  typeof window.refreshAll
);

console.log(
  "editTeamPoints:",
  typeof window.editTeamPoints
);

console.log(
  "login:",
  typeof window.login
);
