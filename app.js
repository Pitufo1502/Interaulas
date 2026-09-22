// ======================================================
// INTERAULAS 2026
// APP.JS
// ======================================================


// ======================================================
// SUPABASE
// ======================================================

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
// IMPORTANTE:
// DESDE EL PARTIDO 8 TODO SE MOVIÓ UN DÍA
// ======================================================

const MATCH_DATES = {

  1: "7 de septiembre",
  2: "8 de septiembre",
  3: "9 de septiembre",
  4: "10 de septiembre",

  5: "16 de septiembre",
  6: "17 de septiembre",
  7: "18 de septiembre",

  8: "22 de septiembre",
  9: "23 de septiembre",
  10: "24 de septiembre",
  11: "25 de septiembre",

  12: "28 de septiembre",
  13: "29 de septiembre",
  14: "30 de septiembre",

  15: "1 de octubre",
  16: "5 de octubre",
  17: "6 de octubre",
  18: "7 de octubre",
  19: "8 de octubre",
  20: "9 de octubre",

  21: "12 de octubre",
  22: "13 de octubre",
  23: "14 de octubre",
  24: "15 de octubre",
  25: "16 de octubre",

  26: "21 de octubre",
  27: "22 de octubre",
  28: "23 de octubre",

  29: "26 de octubre",
  30: "27 de octubre",
  31: "28 de octubre",

  32: "30 de octubre",
  33: "2 de noviembre",
  34: "3 de noviembre",
  35: "4 de noviembre"
};


// ======================================================
// ALIASES
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


// ======================================================
// VARIABLES
// ======================================================

let session = null;

let editingMatchId = null;

let editingScorerId = null;


// ======================================================
// INICIO
// ======================================================

document.addEventListener("DOMContentLoaded", async () => {

  setupButtons();

  await checkSession();

  await refresh();

});


// ======================================================
// BOTONES
// ======================================================

function setupButtons() {

  const loginBtn =
    document.getElementById("loginBtn");

  if (loginBtn) {

    loginBtn.addEventListener(
      "click",
      () => {

        if (session) {

          logout();

        } else {

          openModal("authModal");

        }

      }
    );

  }


  const addSanctionBtn =
    document.getElementById("addSanctionBtn");

  if (addSanctionBtn) {

    addSanctionBtn.addEventListener(
      "click",
      addSanction
    );

  }


  const addScorerBtn =
    document.getElementById("addScorerBtn");

  if (addScorerBtn) {

    addScorerBtn.addEventListener(
      "click",
      addScorer
    );

  }

}


// ======================================================
// MODALES
// ======================================================

function openModal(id) {

  const modal =
    document.getElementById(id);

  if (modal) {

    modal.classList.remove("hidden");

  }

}


function closeModal(id) {

  const modal =
    document.getElementById(id);

  if (modal) {

    modal.classList.add("hidden");

  }

}


// ======================================================
// AUTENTICACIÓN
// ======================================================

async function checkSession() {

  const {
    data
  } = await db.auth.getSession();

  session = data.session;

  updateAuthUI();


  db.auth.onAuthStateChange(
    async (_event, newSession) => {

      session = newSession;

      updateAuthUI();

      await refresh();

    }
  );

}


function updateAuthUI() {

  const loginBtn =
    document.getElementById("loginBtn");

  const addSanctionBtn =
    document.getElementById("addSanctionBtn");

  const addScorerBtn =
    document.getElementById("addScorerBtn");


  if (loginBtn) {

    loginBtn.textContent =
      session
        ? "Cerrar sesión"
        : "Iniciar sesión";

  }


  if (addSanctionBtn) {

    addSanctionBtn.classList.toggle(
      "hidden",
      !session
    );

  }


  if (addScorerBtn) {

    addScorerBtn.classList.toggle(
      "hidden",
      !session
    );

    addScorerBtn.style.display =
      session ? "inline-block" : "none";

  }

}


async function login() {

  const email =
    document.getElementById("email").value.trim();

  const password =
    document.getElementById("password").value;


  const message =
    document.getElementById("authMessage");


  if (!email || !password) {

    message.textContent =
      "Escribe tu correo y contraseña.";

    return;

  }


  const {
    data,
    error
  } = await db.auth.signInWithPassword({
    email,
    password
  });


  if (error) {

    message.textContent =
      error.message;

    return;

  }


  session = data.session;

  closeModal("authModal");

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
// REFRESH GENERAL
// ======================================================

async function refresh() {

  if (!db) return;


  await Promise.all([

    renderTables(),

    renderMatches(),

    renderSanctions(),

    renderScorers(),

    renderNext(),

    renderCleanliness()

  ]);

}


// ======================================================
// NORMALIZAR EQUIPO
// ======================================================

function normalizeTeam(team) {

  return ALIASES[team] || team;

}


// ======================================================
// ESTADÍSTICAS
// ======================================================

function stats(
  teams,
  matches,
  adjustments = []
) {

  const data = {};

  teams.forEach(team => {

    data[team] = {

      team,

      played: 0,

      wins: 0,

      draws: 0,

      losses: 0,

      gf: 0,

      ga: 0,

      gd: 0,

      points: 0

    };

  });


  matches.forEach(match => {

    if (
      match.home_score === null ||
      match.away_score === null
    ) {

      return;

    }


    const home =
      normalizeTeam(match.home_team);

    const away =
      normalizeTeam(match.away_team);


    if (!data[home] || !data[away]) {

      return;

    }


    const hs =
      Number(match.home_score);

    const as =
      Number(match.away_score);


    data[home].played++;
    data[away].played++;


    data[home].gf += hs;
    data[home].ga += as;

    data[away].gf += as;
    data[away].ga += hs;


    if (hs > as) {

      data[home].wins++;
      data[away].losses++;

      data[home].points += 3;

    }

    else if (hs < as) {

      data[away].wins++;
      data[home].losses++;

      data[away].points += 3;

    }

    else {

      data[home].draws++;
      data[away].draws++;

      data[home].points++;
      data[away].points++;

    }

  });


  Object.values(data).forEach(team => {

    team.gd =
      team.gf - team.ga;

  });


  // Ajustes manuales de puntos

  adjustments.forEach(adjustment => {

    const team =
      normalizeTeam(adjustment.team);

    if (data[team]) {

      data[team].points +=
        Number(adjustment.points || 0);

    }

  });


  return Object.values(data)
    .sort((a, b) => {

      if (b.points !== a.points) {

        return b.points - a.points;

      }

      if (b.gd !== a.gd) {

        return b.gd - a.gd;

      }

      return b.gf - a.gf;

    });

}


// ======================================================
// TABLA HTML
// ======================================================

function tableHTML(
  title,
  teams,
  matches,
  adjustments
) {

  const rows =
    stats(
      teams,
      matches,
      adjustments
    );


  return `

    <div class="card">

      <h3>
        ${title}
      </h3>

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

              <th>DG</th>

              <th>Pts</th>

              ${session ? "<th></th>" : ""}

            </tr>

          </thead>

          <tbody>

            ${rows.map((row, index) => `

              <tr>

                <td>
                  ${index + 1}
                </td>

                <td>
                  <strong>
                    ${row.team}
                  </strong>
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
                  ${row.gd > 0 ? "+" : ""}
                  ${row.gd}
                </td>

                <td>
                  <strong>
                    ${row.points}
                  </strong>
                </td>

                ${
                  session
                    ? `
                      <td>
                        <button
                          class="outline"
                          onclick="editTeamPoints('${row.team}')"
                        >
                          ✏️
                        </button>
                      </td>
                    `
                    : ""
                }

              </tr>

            `).join("")}

          </tbody>

        </table>

      </div>

    </div>

  `;

}


// ======================================================
// RENDER TABLAS
// ======================================================

async function renderTables() {

  const menContainer =
    document.getElementById("menTables");

  const womenContainer =
    document.getElementById("womenTable");


  if (!menContainer || !womenContainer) {

    return;

  }


  const [
    matchesResponse,
    adjustmentsResponse
  ] = await Promise.all([

    db
      .from("matches")
      .select("*")
      .order("day", {
        ascending: true
      }),

    db
      .from("point_adjustments")
      .select("*")

  ]);


  if (matchesResponse.error) {

    console.error(
      matchesResponse.error
    );

    return;

  }


  const matches =
    matchesResponse.data || [];


  const adjustments =
    adjustmentsResponse.data || [];


  const menMatches =
    matches.filter(
      match =>
        match.gender === "M"
    );


  const womenMatches =
    matches.filter(
      match =>
        match.gender === "F"
    );


  menContainer.innerHTML = `

    ${tableHTML(
      "Grupo A",
      MEN_A,
      menMatches.filter(
        match =>
          match.group_name === "A"
      ),
      adjustments
    )}

    ${tableHTML(
      "Grupo B",
      MEN_B,
      menMatches.filter(
        match =>
          match.group_name === "B"
      ),
      adjustments
    )}

  `;


  womenContainer.innerHTML =
    tableHTML(
      "Grupo único",
      WOMEN,
      womenMatches,
      adjustments
    );

}


// ======================================================
// EDITAR PUNTOS DE EQUIPO
// ======================================================

async function editTeamPoints(team) {

  if (!session) return;


  const {
    data
  } = await db
    .from("point_adjustments")
    .select("*")
    .eq("team", team)
    .maybeSingle();


  const current =
    data
      ? Number(data.points || 0)
      : 0;


  const points =
    prompt(
      `Puntos extra o descuento para ${team}.\n\n` +
      `Usa un número positivo para sumar o negativo para restar.\n\n` +
      `Actual: ${current}`,
      current
    );


  if (points === null) return;


  const value =
    Number(points);


  if (!Number.isInteger(value)) {

    alert(
      "El punteo debe ser un número entero."
    );

    return;

  }


  const reason =
    prompt(
      "Razón del ajuste de puntos:",
      data?.reason || ""
    );


  const {
    error
  } = await db
    .from("point_adjustments")
    .upsert(
      {
        team,
        points: value,
        reason: reason || null,
        updated_at:
          new Date().toISOString()
      },
      {
        onConflict: "team"
      }
    );


  if (error) {

    alert(
      "Error: " + error.message
    );

    return;

  }


  await refresh();

}


// ======================================================
// PARTIDOS
// ======================================================

async function renderMatches() {

  const container =
    document.getElementById("matches");


  if (!container) return;


  const {
    data,
    error
  } = await db
    .from("matches")
    .select("*")
    .order("day", {
      ascending: true
    });


  if (error) {

    container.innerHTML =
      `<p>Error cargando partidos.</p>`;

    console.error(error);

    return;

  }


  if (!data || !data.length) {

    container.innerHTML =
      `<p>No hay partidos.</p>`;

    return;

  }


  container.innerHTML = data
    .map(match => {

      const date =
        MATCH_DATES[match.day]
        || `Partido ${match.day}`;


      const finished =
        match.home_score !== null &&
        match.away_score !== null;


      return `

        <div class="match-card">

          <div class="match-info">

            <span class="match-day">
              Partido ${match.day}
            </span>

            <span class="match-date">
              ${date}
            </span>

            <span class="match-gender">
              ${
                match.gender === "M"
                  ? "Hombres"
                  : "Mujeres"
              }
            </span>

          </div>


          <div class="match-teams">

            <strong>
              ${normalizeTeam(match.home_team)}
            </strong>

            <span class="score">

              ${
                finished
                  ? `${match.home_score} - ${match.away_score}`
                  : "VS"
              }

            </span>

            <strong>
              ${normalizeTeam(match.away_team)}
            </strong>

          </div>


          ${
            session
              ? `
                <button
                  class="outline"
                  onclick="editMatch('${match.id}')"
                >
                  ✏️ Editar
                </button>
              `
              : ""
          }

        </div>

      `;

    })
    .join("");

}


// ======================================================
// PRÓXIMO PARTIDO
// ======================================================

async function renderNext() {

  const container =
    document.getElementById("nextMatch");


  if (!container) return;


  const {
    data,
    error
  } = await db
    .from("matches")
    .select("*")
    .order("day", {
      ascending: true
    });


  if (error || !data) {

    container.innerHTML =
      "No se pudo cargar el próximo partido.";

    return;

  }


  const next =
    data.find(
      match =>
        match.home_score === null ||
        match.away_score === null
    );


  if (!next) {

    container.innerHTML = `

      <p class="eyebrow">
        INTERAULAS 2026
      </p>

      <h3>
        Todos los partidos han terminado
      </h3>

    `;

    return;

  }


  const date =
    MATCH_DATES[next.day]
    || "";


  container.innerHTML = `

    <p class="eyebrow">
      PRÓXIMO PARTIDO
    </p>

    <h3>
      ${date}
    </h3>

    <div class="next-teams">

      <strong>
        ${normalizeTeam(next.home_team)}
      </strong>

      <span>
        VS
      </span>

      <strong>
        ${normalizeTeam(next.away_team)}
      </strong>

    </div>

    <small>
      ${
        next.gender === "M"
          ? "Hombres"
          : "Mujeres"
      }
    </small>

  `;

}


// ======================================================
// EDITAR PARTIDO
// ======================================================

async function editMatch(id) {

  if (!session) return;


  const {
    data,
    error
  } = await db
    .from("matches")
    .select("*")
    .eq("id", id)
    .single();


  if (error) {

    alert(
      "No se pudo cargar el partido."
    );

    return;

  }


  editingMatchId =
    id;


  document.getElementById(
    "editMatchTitle"
  ).textContent =
    `${data.home_team} vs ${data.away_team}`;


  document.getElementById(
    "homeScore"
  ).value =
    data.home_score ?? "";


  document.getElementById(
    "awayScore"
  ).value =
    data.away_score ?? "";


  openModal("editModal");

}


// ======================================================
// GUARDAR PARTIDO
// ======================================================

async function saveMatch() {

  if (!session || !editingMatchId) {

    return;

  }


  const homeScore =
    document.getElementById(
      "homeScore"
    ).value;


  const awayScore =
    document.getElementById(
      "awayScore"
    ).value;


  if (
    homeScore === "" ||
    awayScore === ""
  ) {

    alert(
      "Ingresa ambos resultados."
    );

    return;

  }


  const hs =
    Number(homeScore);

  const as =
    Number(awayScore);


  if (
    !Number.isInteger(hs) ||
    !Number.isInteger(as) ||
    hs < 0 ||
    as < 0
  ) {

    alert(
      "Los resultados deben ser números enteros positivos."
    );

    return;

  }


  const {
    error
  } = await db
    .from("matches")
    .update({
      home_score: hs,
      away_score: as
    })
    .eq("id", editingMatchId);


  if (error) {

    alert(
      "Error: " + error.message
    );

    return;

  }


  closeModal("editModal");

  editingMatchId = null;

  await refresh();

}


// ======================================================
// GOLEADORES
// ======================================================

async function renderScorers() {

  const men =
    document.getElementById(
      "menScorers"
    );

  const women =
    document.getElementById(
      "womenScorers"
    );


  if (!men || !women) return;


  const {
    data,
    error
  } = await db
    .from("scorers")
    .select("*")
    .order("goals", {
      ascending: false
    })
    .order("player", {
      ascending: true
    });


  if (error) {

    console.error(error);

    men.innerHTML =
      `<tr><td colspan="5">Error cargando goleadores.</td></tr>`;

    women.innerHTML =
      `<tr><td colspan="5">Error cargando goleadoras.</td></tr>`;

    return;

  }


  const all =
    data || [];


  const menScorers =
    all.filter(
      scorer =>
        scorer.gender === "M"
    );


  const womenScorers =
    all.filter(
      scorer =>
        scorer.gender === "F"
    );


  men.innerHTML =
    scorerRows(menScorers);


  women.innerHTML =
    scorerRows(womenScorers);

}


// ======================================================
// FILAS GOLEADORES
// ======================================================

function scorerRows(list) {

  if (!list.length) {

    return `
      <tr>
        <td colspan="5">
          No hay goleadores registrados.
        </td>
      </tr>
    `;

  }


  return list.map(
    (scorer, index) => `

      <tr>

        <td>
          ${index + 1}
        </td>

        <td>
          <strong>
            ${scorer.player}
          </strong>
        </td>

        <td>
          ${normalizeTeam(scorer.team)}
        </td>

        <td>
          <strong>
            ${scorer.goals}
          </strong>
        </td>

        <td>

          ${
            session
              ? `
                <button
                  class="outline"
                  onclick="editScorer('${scorer.id}')"
                >
                  ✏️
                </button>

                <button
                  class="outline"
                  onclick="deleteScorer('${scorer.id}')"
                >
                  🗑️
                </button>
              `
              : ""
          }

        </td>

      </tr>

    `
  ).join("");

}


// ======================================================
// AGREGAR GOLEADOR
// ======================================================

async function addScorer() {

  if (!session) return;


  const player =
    prompt(
      "Nombre del jugador:"
    );


  if (!player) return;


  const team =
    prompt(
      "Equipo:"
    );


  if (!team) return;


  const gender =
    prompt(
      "Categoría: escribe M para hombres o F para mujeres."
    );


  if (
    gender !== "M" &&
    gender !== "F"
  ) {

    alert(
      "La categoría debe ser M o F."
    );

    return;

  }


  const goals =
    prompt(
      "Cantidad de goles:",
      "0"
    );


  if (goals === null) return;


  const goalsNumber =
    Number(goals);


  if (
    !Number.isInteger(goalsNumber) ||
    goalsNumber < 0
  ) {

    alert(
      "Los goles deben ser un número entero."
    );

    return;

  }


  const {
    error
  } = await db
    .from("scorers")
    .insert({

      player,

      team: normalizeTeam(team),

      gender,

      goals: goalsNumber

    });


  if (error) {

    alert(
      "Error: " + error.message
    );

    return;

  }


  await renderScorers();

}


// ======================================================
// EDITAR GOLEADOR
// ======================================================

async function editScorer(id) {

  if (!session) return;


  const {
    data,
    error
  } = await db
    .from("scorers")
    .select("*")
    .eq("id", id)
    .single();


  if (error) {

    alert(
      "No se pudo cargar el goleador."
    );

    return;

  }


  const player =
    prompt(
      "Nombre:",
      data.player
    );


  if (player === null) return;


  const team =
    prompt(
      "Equipo:",
      data.team
    );


  if (team === null) return;


  const goals =
    prompt(
      "Goles:",
      data.goals
    );


  if (goals === null) return;


  const goalsNumber =
    Number(goals);


  if (
    !Number.isInteger(goalsNumber) ||
    goalsNumber < 0
  ) {

    alert(
      "Los goles deben ser un número entero."
    );

    return;

  }


  const {
    error: updateError
  } = await db
    .from("scorers")
    .update({

      player,

      team:
        normalizeTeam(team),

      goals:
        goalsNumber

    })
    .eq("id", id);


  if (updateError) {

    alert(
      "Error: " +
      updateError.message
    );

    return;

  }


  await renderScorers();

}


// ======================================================
// ELIMINAR GOLEADOR
// ======================================================

async function deleteScorer(id) {

  if (!session) return;


  const confirmed =
    confirm(
      "¿Eliminar este goleador?"
    );


  if (!confirmed) return;


  const {
    error
  } = await db
    .from("scorers")
    .delete()
    .eq("id", id);


  if (error) {

    alert(
      "Error: " +
      error.message
    );

    return;

  }


  await renderScorers();

}


// ======================================================
// SANCIONES
// ======================================================

async function renderSanctions() {

  const container =
    document.getElementById(
      "sanctions"
    );


  if (!container) return;


  const {
    data,
    error
  } = await db
    .from("sanctions")
    .select("*")
    .order("created_at", {
      ascending: false
    });


  if (error) {

    container.innerHTML =
      `<p>Error cargando sanciones.</p>`;

    console.error(error);

    return;

  }


  if (!data || !data.length) {

    container.innerHTML = `

      <div class="card">

        <p>
          No hay sanciones registradas.
        </p>

      </div>

    `;

    return;

  }


  container.innerHTML =
    data.map(
      sanction => `

        <div class="card sanction-card">

          <h3>
            ${normalizeTeam(sanction.team)}
          </h3>

          ${
            sanction.player
              ? `
                <p>
                  <strong>
                    Jugador:
                  </strong>
                  ${sanction.player}
                </p>
              `
              : ""
          }

          <p>
            <strong>
              Tipo:
            </strong>
            ${sanction.type}
          </p>

          ${
            sanction.description
              ? `
                <p>
                  ${sanction.description}
                </p>
              `
              : ""
          }

          ${
            session
              ? `
                <button
                  class="outline"
                  onclick="deleteSanction('${sanction.id}')"
                >
                  🗑️ Eliminar
                </button>
              `
              : ""
          }

        </div>

      `
    ).join("");

}


// ======================================================
// AGREGAR SANCIÓN
// ======================================================

async function addSanction() {

  if (!session) return;


  const team =
    prompt(
      "Equipo:"
    );


  if (!team) return;


  const player =
    prompt(
      "Jugador (opcional):"
    );


  const type =
    prompt(
      "Tipo de sanción:"
    );


  if (!type) return;


  const description =
    prompt(
      "Descripción:"
    );


  const {
    error
  } = await db
    .from("sanctions")
    .insert({

      team:
        normalizeTeam(team),

      player:
        player || null,

      type,

      description:
        description || null

    });


  if (error) {

    alert(
      "Error: " +
      error.message
    );

    return;

  }


  await renderSanctions();

}


// ======================================================
// ELIMINAR SANCIÓN
// ======================================================

async function deleteSanction(id) {

  if (!session) return;


  if (
    !confirm(
      "¿Eliminar esta sanción?"
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

    alert(
      "Error: " +
      error.message
    );

    return;

  }


  await renderSanctions();

}


// ======================================================
// COLEGIO MÁS LIMPIO
// ======================================================

async function renderCleanliness() {

  const table =
    document.getElementById(
      "cleanlinessTable"
    );


  if (!table) return;


  const {
    data,
    error
  } = await db
    .from("cleanliness_scores")
    .select("*")
    .order("points", {
      ascending: false
    });


  if (error) {

    table.innerHTML = `

      <tr>

        <td colspan="5">
          Error cargando la competencia
          de limpieza.
        </td>

      </tr>

    `;

    console.error(error);

    return;

  }


  const rows =
    data || [];


  table.innerHTML =
    rows.map(
      (grade, index) => `

        <tr>

          <td>
            ${index + 1}
          </td>

          <td>
            <strong>
              ${grade.grade}
            </strong>
          </td>

          <td>
            <strong>
              ${grade.points}
            </strong>
          </td>

          <td>
            ${grade.reason || "—"}
          </td>

          <td>

            ${
              session
                ? `
                  <button
                    class="outline"
                    onclick="editCleanliness('${grade.grade}')"
                  >
                    ✏️
                  </button>
                `
                : ""
            }

          </td>

        </tr>

      `
    ).join("");

}


// ======================================================
// EDITAR PUNTEO DE LIMPIEZA
// ======================================================

async function editCleanliness(grade) {

  if (!session) return;


  const {
    data,
    error
  } = await db
    .from("cleanliness_scores")
    .select("*")
    .eq("grade", grade)
    .single();


  if (error) {

    alert(
      "No se pudo cargar el grado."
    );

    return;

  }


  const points =
    prompt(
      `Punteo para ${grade}:`,
      data.points
    );


  if (points === null) return;


  const pointsNumber =
    Number(points);


  if (
    !Number.isInteger(pointsNumber) ||
    pointsNumber < 0
  ) {

    alert(
      "El punteo debe ser un número entero igual o mayor a 0."
    );

    return;

  }


  const reason =
    prompt(
      "Razón o comentario:",
      data.reason || ""
    );


  const {
    error: saveError
  } = await db
    .from("cleanliness_scores")
    .upsert(

      {
        grade,

        points:
          pointsNumber,

        reason:
          reason || null,

        updated_at:
          new Date().toISOString()

      },

      {
        onConflict:
          "grade"
      }

    );


  if (saveError) {

    alert(
      "Error: " +
      saveError.message
    );

    return;

  }


  await renderCleanliness();

}


// ======================================================
// DATOS DEMO SI SUPABASE FALLA
// ======================================================

function renderDemo() {

  const men =
    document.getElementById(
      "menTables"
    );

  const women =
    document.getElementById(
      "womenTable"
    );


  if (men) {

    men.innerHTML = `

      <div class="card">

        <h3>
          Grupo A
        </h3>

        <p>
          No se pudieron cargar los datos.
        </p>

      </div>

    `;

  }


  if (women) {

    women.innerHTML = `

      <div class="card">

        <h3>
          Grupo único
        </h3>

        <p>
          No se pudieron cargar los datos.
        </p>

      </div>

    `;

  }

}


// ======================================================
// SEGURIDAD BÁSICA
// ======================================================

window.editMatch =
  editMatch;

window.saveMatch =
  saveMatch;

window.editScorer =
  editScorer;

window.deleteScorer =
  deleteScorer;

window.editCleanliness =
  editCleanliness;

window.editTeamPoints =
  editTeamPoints;

window.deleteSanction =
  deleteSanction;

window.login =
  login;

window.logout =
  logout;

window.closeModal =
  closeModal;

